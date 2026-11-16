import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase-server";

const unauthorized = () => NextResponse.json({ error: "Non autorisé" }, { status: 401 });
const noDb = () => NextResponse.json({ error: "Base de données non configurée" }, { status: 500 });

/** Only these columns can be written by the admin. */
const STRING_FIELDS = ["src", "titre", "desc", "cat", "lien", "lienLabel"] as const;

function pickProjectFields(body: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of STRING_FIELDS) {
    if (f in body) {
      const v = body[f];
      if (v !== null && typeof v !== "string") throw new Error(`Champ invalide : ${f}`);
      out[f] = typeof v === "string" ? v.slice(0, 2000) : null;
    }
  }
  for (const f of ["tags", "gallery"] as const) {
    if (f in body) {
      const v = body[f];
      if (!Array.isArray(v) || !v.every((x) => typeof x === "string")) throw new Error(`Champ invalide : ${f}`);
      out[f] = v.slice(0, 30);
    }
  }
  if ("position" in body) {
    const v = Number(body.position);
    if (!Number.isFinite(v)) throw new Error("Champ invalide : position");
    out.position = v;
  }
  return out;
}

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json([]);
  const { data, error } = await supabase
    .from("projets")
    .select("*")
    .order("position", { ascending: true, nullsFirst: false });
  if (error) {
    const fb = await supabase.from("projets").select("*").order("created_at", { ascending: false });
    return NextResponse.json(fb.data ?? []);
  }
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) return unauthorized();
  const supabase = getSupabase();
  if (!supabase) return noDb();
  try {
    const body = pickProjectFields(await req.json());
    const { data, error } = await supabase.from("projets").insert([body]).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidatePath("/");
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Requête invalide" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminRequest())) return unauthorized();
  const supabase = getSupabase();
  if (!supabase) return noDb();
  try {
    const { id, ...rest } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const body = pickProjectFields(rest);
    const { data, error } = await supabase.from("projets").update(body).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidatePath("/");
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Requête invalide" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminRequest())) return unauthorized();
  const supabase = getSupabase();
  if (!supabase) return noDb();
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const { error } = await supabase.from("projets").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Requête invalide" }, { status: 400 });
  }
}
