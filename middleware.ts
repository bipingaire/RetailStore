import { NextResponse, type NextRequest } from 'next/server';

// Basic gate for privileged areas. Currently disabled for testing.
const PROTECTED_PREFIXES = ['/admin', '/super-admin', '/supplier', '/vendors', '/pos-mapping', '/test-parser'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // TEMP: auth bypass for end-to-end testing. Remove to re-enable gating.
  return NextResponse.next();

  const isProtected =
    PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!isProtected) return NextResponse.next();

  // Supabase sets auth cookies; check for any to gate access.
  const hasSupabaseSession =
    req.cookies.get('sb-access-token') ||
    req.cookies.get('sb-refresh-token') ||
    req.cookies.get('sb:token') ||
    req.cookies.get('supabase-auth-token') ||
    req.cookies.getAll().some((c) => c.name.startsWith('sb-'));

  if (!hasSupabaseSession) {
    const res = NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, req.url));
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/super-admin/:path*',
    '/supplier/:path*',
    '/vendors/:path*',
    '/pos-mapping/:path*',
    '/test-parser/:path*',
  ],
};
