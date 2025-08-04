import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Get the role from the token
  const role = token.role as string;
  const { pathname } = req.nextUrl;

  // Role-based redirection logic
  if (role === "user") {
    // Users should be redirected to homepage if trying to access dashboard
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else if (["admin", "editor", "author"].includes(role)) {
    // Admin, editor, author should be redirected to dashboard if trying to access home
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } else {
    // Unknown role, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};