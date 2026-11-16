import { NextResponse } from "next/server";
import { getProfile } from "@/lib/content";

// Public endpoint — returns only the public profile photo URL (null when none is set)
export async function GET() {
  const profile = await getProfile();
  return NextResponse.json({ photoUrl: profile.photoUrl });
}
