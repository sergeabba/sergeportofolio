import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function verifyToken(token: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
  const data = encoder.encode('admin-session')
  const tokenBytes = new Uint8Array(token.match(/.{2}/g)!.map(b => parseInt(b, 16)))
  return crypto.subtle.verify('HMAC', key, tokenBytes, data)
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value
    const secret = process.env.ADMIN_PASSWORD

    if (!token || !secret) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const valid = await verifyToken(token, secret)
    if (!valid) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
