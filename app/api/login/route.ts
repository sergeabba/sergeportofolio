import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { rateLimit } from '@/lib/rate-limit'

const loginLimiter = rateLimit({ windowMs: 60_000, maxRequests: 5 })

async function generateToken(secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const data = encoder.encode('admin-session')
  const signature = await crypto.subtle.sign('HMAC', key, data)
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('')
}

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
        path: '/'
      });
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: "Mot de passe incorrect" }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
