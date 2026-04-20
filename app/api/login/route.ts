import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'
import { generateToken, ADMIN_COOKIE_MAX_AGE } from '@/lib/auth'

const loginLimiter = rateLimit({ windowMs: 60_000, maxRequests: 5 })

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { allowed, retryAfterMs } = loginLimiter(ip);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Trop de tentatives. Réessayez dans quelques instants.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }

    const { password } = await request.json()
    
    if (password === process.env.ADMIN_PASSWORD) {
      const secret = process.env.ADMIN_PASSWORD!;
      const token = await generateToken(secret);

      const cookieStore = await cookies();
      cookieStore.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
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
