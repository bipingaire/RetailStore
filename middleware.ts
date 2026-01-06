import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

// Basic gate for privileged areas.
const PROTECTED_PREFIXES = ['/admin', '/super-admin', '/supplier', '/vendors', '/pos-mapping', '/test-parser'];

export async function middleware(req: NextRequest) {
  // TEMP: Completely disabled for debugging
  return NextResponse.next();

  /* ORIGINAL CODE - Disabled
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  // If user is NOT signed in and trying to access a protected route, redirect to login
  if (isProtected && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
  */
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
