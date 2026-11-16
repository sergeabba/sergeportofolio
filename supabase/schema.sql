-- ════════════════════════════════════════════════════════════════════
-- Sécurité Supabase du portfolio — à exécuter dans Supabase > SQL Editor
-- ════════════════════════════════════════════════════════════════════
-- Principe : la clé "anon" (publique, visible dans le navigateur) ne peut
-- plus que LIRE. Toutes les écritures passent par les routes API Next.js,
-- qui vérifient le cookie admin puis utilisent SUPABASE_SERVICE_ROLE_KEY
-- (cette clé contourne RLS et ne doit jamais être exposée au client).

-- ── 1. Tables : lecture publique, aucune écriture anonyme ──────────────
alter table public.projets  enable row level security;
alter table public.settings enable row level security;

-- Supprime toutes les anciennes policies de ces tables (dont d'éventuelles
-- policies d'écriture ouvertes à "anon").
do $$
declare p record;
begin
  for p in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in ('projets', 'settings')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

create policy "Lecture publique des projets"
  on public.projets for select to anon, authenticated using (true);

-- Seules les clés "profile" et "skills" sont lisibles publiquement.
create policy "Lecture publique du profil et des compétences"
  on public.settings for select to anon, authenticated
  using (key in ('profile', 'skills'));

-- ── 2. Storage : bucket public en lecture, écriture réservée au serveur ─
-- Les fichiers sont envoyés par /api/upload avec la clé service-role.
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and (qual ilike '%portfolio%' or with_check ilike '%portfolio%')
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;

update storage.buckets set public = true where id = 'portfolio';

-- ── 3. Limitation de débit partagée entre instances serverless ─────────
create table if not exists public.rate_limits (
  key        text primary key,
  count      integer     not null default 0,
  reset_at   timestamptz not null
);
alter table public.rate_limits enable row level security; -- aucune policy : inaccessible à anon

create or replace function public.check_rate_limit(
  p_key text, p_window_seconds integer, p_max integer
) returns table (allowed boolean, retry_after_ms bigint)
language plpgsql security definer set search_path = public as $$
declare r public.rate_limits;
begin
  insert into public.rate_limits as rl (key, count, reset_at)
  values (p_key, 1, now() + make_interval(secs => p_window_seconds))
  on conflict (key) do update
    set count    = case when rl.reset_at < now() then 1 else rl.count + 1 end,
        reset_at = case when rl.reset_at < now()
                        then now() + make_interval(secs => p_window_seconds)
                        else rl.reset_at end
  returning * into r;

  -- Ménage occasionnel des entrées expirées
  if random() < 0.01 then
    delete from public.rate_limits where reset_at < now() - interval '1 day';
  end if;

  return query select r.count <= p_max,
    greatest(0, (extract(epoch from (r.reset_at - now())) * 1000)::bigint);
end $$;

revoke all on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
