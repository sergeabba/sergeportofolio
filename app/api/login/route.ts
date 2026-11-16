import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'
import { generateToken, getClientIp, ADMIN_COOKIE_MAX_AGE } from '@/lib/auth'

const loginLimiter = rateLimit({ name: 'login', windowMs: 15 * 60_000, maxRequests: 5 })

export async function POST(request: Request) {
  try {
    const { allowed, retryAfterMs } = await loginLimiter(getClientIp(request));
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Trop de tentatives. Réessayez dans quelques instants.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    const body = await request.json();
    const password: unknown = body?.password;

    if (typeof password !== "string" || password.length === 0) {
      return NextResponse.json({ success: false, error: "Mot de passe requis" }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
    }

    const enc = new TextEncoder();
    const a = enc.encode(password.padEnd(64));
    const b = enc.encode(adminPassword.padEnd(64));
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    const match = diff === 0 && password.length === adminPassword.length;

    if (match) {
      const token = await generateToken(adminPassword);

      const cookieStore = await cookies();
      cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: ADMIN_COOKIE_MAX_AGE,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Mot de passe incorrect" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
