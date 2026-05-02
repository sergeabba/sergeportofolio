import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const isAdminRoute =
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login');

  if (!isAdminRoute) return NextResponse.next();

  const token = request.cookies.get('admin_token')?.value;
  const secret = process.env.ADMIN_PASSWORD;

  if (!token || !secret) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const valid = await verifyToken(token, secret);
  if (!valid) {
    // Clear the invalid/expired cookie so the browser doesn't keep sending it
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}
