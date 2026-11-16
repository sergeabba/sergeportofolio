import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = request.cookies.get("admin_token")?.value;
  const secret = process.env.ADMIN_PASSWORD;

  if (token && secret && (await verifyToken(token, secret))) return NextResponse.next();

  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  if (token) {
    // Clear the invalid/expired cookie so the browser stops sending it
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
