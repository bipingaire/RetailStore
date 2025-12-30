import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Basic gate: require Supabase auth cookie for privileged areas.
// Adjust the protected paths as needed for your tenants (admin/super-admin/supplier/vendor consoles).
const PROTECTED_PREFIXES = ['/admin', '/super-admin', '/supplier', '/vendors', '/pos-mapping', '/test-parser'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected =
    PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (!isProtected) return NextResponse.next();

  // Supabase sets access tokens in cookies; presence is a minimal auth check.
  const supabase = createMiddlewareClient({ req, res: NextResponse.next() });
  const { data: { session } } = await supabase.auth.getSession();
  const hasSupabaseSession = !!session;

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
