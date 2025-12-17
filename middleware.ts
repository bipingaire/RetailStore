import { NextResponse, type NextRequest } from 'next/server';

// Basic gate: require Supabase auth cookie for privileged areas.
// Adjust the protected paths as needed for your tenants (admin/super-admin/supplier/vendor consoles).
const PROTECTED_PREFIXES = [
  '/admin',
  '/super-admin',
  '/supplier',
  '/vendors',
  '/pos-mapping',
  '/test-parser',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) return NextResponse.next();

  // Supabase sets access tokens in cookies; presence is a minimal auth check.
  const hasSupabaseSession =
    req.cookies.get('sb-access-token') ||
    req.cookies.get('sb:token') ||
    req.cookies.get('supabase-auth-token');

  if (!hasSupabaseSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
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
