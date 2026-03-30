import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    
    if (password === process.env.ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set('admin_token', 'authenticated', {
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
