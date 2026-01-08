import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';
import { extractSubdomain, getTenantFromSubdomain, isSuperadminDomain } from '@/lib/subdomain';

const PROTECTED_PREFIXES = ['/admin', '/superadmin', '/super-admin', '/supplier', '/vendors', '/pos-mapping', '/test-parser'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get subdomain from request
  const host = req.headers.get('host') || '';
  const subdomain = extractSubdomain(host);
  const isSuperadmin = isSuperadminDomain(host);

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  // Handle subdomain routing
  if (subdomain) {
    // Get tenant for this subdomain
    const tenantId = await getTenantFromSubdomain(subdomain);

    if (!tenantId) {
      // Subdomain not found - show 404
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    // Add tenant context to headers for downstream use
    const response = NextResponse.next();
    response.headers.set('x-tenant-id', tenantId);
    response.headers.set('x-subdomain', subdomain);

    // If accessing /admin routes, allow with tenant context
    if (pathname.startsWith('/admin')) {
      if (!session) {
        const redirectUrl = new URL('/admin/login', req.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    // Redirect to admin dashboard for store subdomains accessing root
    if (pathname === '/' || pathname === '') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    return response;
  }

  // Handle superadmin domain
  if (pathname.startsWith('/superadmin') || pathname.startsWith('/super-admin')) {
    // Check for session
    if (!session) {
      // Allow access to the login page itself
      if (pathname === '/super-admin/login') {
        return res;
      }
      const redirectUrl = new URL('/super-admin/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    // Additional superadmin check will be done in the layout
    return res;
  }

  // Standard protected route check for non-subdomain requests
  if (isProtected && !session) {
    // FIXED: Allow access to login page without redirecting to it (prevents infinite loop)
    if (pathname === '/admin/login') {
      return res;
    }
    const redirectUrl = new URL('/admin/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/superadmin/:path*',
    '/super-admin/:path*',
    '/supplier/:path*',
    '/vendors/:path*',
    '/pos-mapping/:path*',
    '/test-parser/:path*',
  ],
};
