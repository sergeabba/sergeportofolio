import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client.
 *
 * Uses the service-role key so that writes never depend on permissive RLS
 * policies. The anon key stays read-only (see supabase/schema.sql).
 * NEVER import this file from a Client Component.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
let warned = false;

export function hasServiceRole(): boolean {
  return Boolean(serviceKey);
}

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  const key = serviceKey ?? anonKey;
  if (!url || !key) return null;
  if (!serviceKey && !warned) {
    warned = true;
    console.warn(
      "[supabase] SUPABASE_SERVICE_ROLE_KEY manquante : repli sur la clé anon. " +
        "Les écritures admin échoueront si les règles RLS sont en lecture seule."
    );
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export const STORAGE_BUCKET = "portfolio";
