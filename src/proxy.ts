import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/token";

/**
 * Optimistic gate only (cookie signature check, no DB hit): bounces anonymous visitors away from
 * /admin early. The real authorisation happens in the data-access layer (requireUser), which
 * re-checks the user in the database on every page, action and API call.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);

  if (!session && !isLogin) {
    const url = new URL("/admin/login", req.url);
    if (pathname !== "/admin") url.searchParams.set("next", pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
  if (session && isLogin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
