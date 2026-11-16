import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase-server";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json(null);
  const { data } = await supabase.from("settings").select("value").eq("key", "skills").maybeSingle();
  return NextResponse.json(data?.value ?? null);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Base de données non configurée" }, { status: 500 });
  try {
    const body = await req.json();
    if (!Array.isArray(body)) return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    const { error } = await supabase
      .from("settings")
      .upsert({ key: "skills", value: body }, { onConflict: "key" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Requête invalide" }, { status: 400 });
  }
}
