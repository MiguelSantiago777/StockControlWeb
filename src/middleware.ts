import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("sc_refresh");
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // Only guards the "definitely logged out" case (no session cookie at all).
  // Never redirects a public route away based on the cookie: the cookie is
  // set/cleared by the backend but never actually validated by it (refresh
  // reads the token from the request body, not this cookie), so treating its
  // mere presence as "authenticated" here can get out of sync with the real
  // client-side session and bounce /login back to /dashboard forever. Real
  // auth/session recovery is AuthGuard's job on the client.
  if (!hasSession && !isPublic) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)).*)"],
};
