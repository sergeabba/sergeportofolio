import { getSupabase } from "./supabase-server";
import { DEFAULT_SKILLS, FALLBACK_PROJECTS } from "./data";
import type { Projet, PublicProfile, SkillCategory } from "./types";

/* Server-side data access for the public page. Every function degrades
 * gracefully to static content so the site never renders empty. */

export async function getProjects(): Promise<Projet[]> {
  const supabase = getSupabase();
  if (!supabase) return FALLBACK_PROJECTS;
  try {
    let { data, error } = await supabase
      .from("projets")
      .select("*")
      .order("position", { ascending: true, nullsFirst: false });
    if (error) {
      ({ data, error } = await supabase.from("projets").select("*").order("created_at", { ascending: false }));
    }
    if (error || !data || data.length === 0) return FALLBACK_PROJECTS;
    return (data as Projet[]).filter((p) => p.src && p.titre);
  } catch {
    return FALLBACK_PROJECTS;
  }
}

function isSkillCategoryArray(v: unknown): v is SkillCategory[] {
  return (
    Array.isArray(v) &&
    v.every((c) => c && typeof c.title === "string" && Array.isArray(c.tags))
  );
}

export async function getSkills(): Promise<SkillCategory[]> {
  const supabase = getSupabase();
  if (!supabase) return DEFAULT_SKILLS;
  try {
    const { data } = await supabase.from("settings").select("value").eq("key", "skills").maybeSingle();
    const value = data?.value;
    if (!isSkillCategoryArray(value) || value.length === 0) return DEFAULT_SKILLS;
    // Le profil est désormais double : on garantit la présence du volet rédaction
    // même si les compétences enregistrées en base datent d'avant ce changement.
    const hasWriting = value.some((c) => /r[ée]daction|contenu|écriture/i.test(c.title));
    return hasWriting ? value : [DEFAULT_SKILLS[0], ...value];
  } catch {
    return DEFAULT_SKILLS;
  }
}

export async function getProfile(): Promise<PublicProfile> {
  const supabase = getSupabase();
  if (!supabase) return { photoUrl: null };
  try {
    const { data } = await supabase.from("settings").select("value").eq("key", "profile").maybeSingle();
    const url = (data?.value as { photoUrl?: unknown } | undefined)?.photoUrl;
    const valid = typeof url === "string" && url.length > 0 && url !== "/photo.jpg";
    return { photoUrl: valid ? url : null };
  } catch {
    return { photoUrl: null };
  }
}
