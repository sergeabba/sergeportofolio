import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  return verifyToken(token, process.env.ADMIN_PASSWORD ?? "");
}

async function readSettings(): Promise<Record<string, unknown>> {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeSettings(data: Record<string, unknown>): Promise<void> {
  await fs.mkdir(path.dirname(SETTINGS_PATH), { recursive: true });
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await readSettings();
  return NextResponse.json(data.profile ?? {});
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const existing = await readSettings();
    await writeSettings({ ...existing, profile: body });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
