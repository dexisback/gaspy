import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "CHANGE_ME_ADMIN_SECRET";
const COOKIE_NAME = "admin-auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Protect admin page
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const key = searchParams.get("key");
    const cookie = request.cookies.get(COOKIE_NAME);

    // Valid key in query param — set cookie and allow
    if (key === ADMIN_SECRET) {
      const response = NextResponse.next();
      response.cookies.set(COOKIE_NAME, ADMIN_SECRET, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });
      return response;
    }

    // Valid cookie — allow
    if (cookie?.value === ADMIN_SECRET) {
      return NextResponse.next();
    }

    // No valid auth — redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect admin API routes (documents, qa)
  if (
    pathname.startsWith("/api/documents") ||
    pathname.startsWith("/api/qa")
  ) {
    const cookie = request.cookies.get(COOKIE_NAME);

    if (cookie?.value === ADMIN_SECRET) {
      return NextResponse.next();
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/documents/:path*", "/api/qa/:path*"],
};
