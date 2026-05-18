import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Public endpoint — returns only the public profile photo URL (no auth required)
export async function GET() {
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "profile")
    .single();

  const photoUrl: string = (data?.value as { photoUrl?: string })?.photoUrl ?? "/photo.jpg";
  return NextResponse.json({ photoUrl });
}
