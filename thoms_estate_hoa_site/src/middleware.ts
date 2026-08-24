import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "thoms_treasurer";
const PROTECTED = ["/budget/monthly", "/treasurer", "/reports", "/statements"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Board Budget is readable without login so chairs can confirm Save landed.
  // Forecast writes still require the treasurer cookie via the API.
  if (pathname === "/budget/full" || pathname.startsWith("/budget/full/")) {
    return NextResponse.next();
  }

  const needsAuth = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  if (!needsAuth) return NextResponse.next();

  const token = request.cookies.get(COOKIE)?.value;
  // Presence gate only — cryptographic validation happens in API routes
  // (Node runtime). Keeps middleware Edge-compatible.
  if (token && token.includes(".")) return NextResponse.next();

  const login = new URL("/login", request.url);
  login.searchParams.set("next", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: [
    "/budget/full",
    "/budget/monthly/:path*",
    "/treasurer/:path*",
    "/reports/:path*",
    "/statements/:path*",
  ],
};
