import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';
import { extractSubdomain, getTenantFromSubdomain } from '@/lib/subdomain';
import { getDomainType } from '@/lib/domain-utils';

const PROTECTED_PREFIXES = ['/admin', '/superadmin', '/super-admin', '/supplier', '/vendors', '/pos-mapping', '/test-parser'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get host and pathname
  const host = req.headers.get('host') || '';
  const { pathname, searchParams } = req.nextUrl;

  // Extract query params for development mode
  const queryDomain = searchParams.get('domain') || undefined;
  const querySubdomain = searchParams.get('subdomain') || undefined;

  // Determine domain type
  const domainType = getDomainType(host, queryDomain, querySubdomain);
  const subdomain = querySubdomain || extractSubdomain(host);

  // Refresh session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  // =========================================
  // RETAILOS DOMAIN - Business & Admin Only
  // =========================================
  if (domainType === 'retailos') {
    // BLOCK all /shop routes on RetailOS domain
    if (pathname.startsWith('/shop')) {
      return NextResponse.redirect(new URL('/business', req.url));
    }

    // Allow access to business page
    if (pathname === '/' || pathname === '/business') {
      return res;
    }

    // Handle superadmin routes
    if (pathname.startsWith('/superadmin') || pathname.startsWith('/super-admin')) {
      if (!session && pathname !== '/super-admin/login') {
        const redirectUrl = new URL('/super-admin/login', req.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return res;
    }

    // Handle admin routes (tenant admins access their panels here)
    if (pathname.startsWith('/admin')) {
      if (!session && pathname !== '/admin/login' && pathname !== '/admin/register') {
        const redirectUrl = new URL('/admin/login', req.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return res;
    }

    return res;
  }

  // =========================================
  // INDUMART PARENT DOMAIN - Geolocation Redirect
  // =========================================
  if (domainType === 'indumart-parent') {
    // Redirect root to find-store page
    if (pathname === '/' || pathname === '') {
      return NextResponse.redirect(new URL('/find-store', req.url));
    }

    // Allow access to find-store page
    if (pathname === '/find-store' || pathname.startsWith('/api/stores')) {
      return res;
    }

    // Redirect any admin attempts to retailOS.com
    if (pathname.startsWith('/admin') || pathname.startsWith('/super-admin')) {
      const retailosUrl = new URL('/admin/login', req.url);
      if (queryDomain) {
        retailosUrl.searchParams.set('domain', 'retailos.com');
      }
      return NextResponse.redirect(retailosUrl);
    }

    return res;
  }

  // =========================================
  // INDUMART TENANT SUBDOMAIN - Ecom Only
  // =========================================
  if (domainType === 'indumart-tenant' && subdomain) {
    // Get tenant for this subdomain
    const tenantId = await getTenantFromSubdomain(subdomain);

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    // Add tenant context to headers
    const response = NextResponse.next();
    response.headers.set('x-tenant-id', tenantId);
    response.headers.set('x-subdomain', subdomain);

    // BLOCK all admin routes on tenant subdomains
    if (pathname.startsWith('/admin') || pathname.startsWith('/super-admin')) {
      return NextResponse.json(
        {
          error: 'Admin access is not available on store sites',
          message: 'Please visit www.retailos.com to access the admin panel'
        },
        { status: 403 }
      );
    }

    // Redirect root to /shop
    if (pathname === '/' || pathname === '') {
      return NextResponse.redirect(new URL('/shop', req.url));
    }

    // Only allow /shop, /api, and auth routes
    if (
      pathname.startsWith('/shop') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/_next')
    ) {
      return response;
    }

    // Block everything else
    return NextResponse.redirect(new URL('/shop', req.url));
  }

  // =========================================
  // UNKNOWN/LOCALHOST - Existing Logic
  // =========================================

  // Handle legacy subdomain routing for localhost
  if (subdomain && !queryDomain) {
    const tenantId = await getTenantFromSubdomain(subdomain);

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    const response = NextResponse.next();
    response.headers.set('x-tenant-id', tenantId);
    response.headers.set('x-subdomain', subdomain);

    if (pathname.startsWith('/admin')) {
      if (!session) {
        const redirectUrl = new URL('/admin/login', req.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    if (pathname === '/' || pathname === '') {
      return NextResponse.redirect(new URL('/shop', req.url));
    }

    return response;
  }

  // Handle superadmin domain
  if (pathname.startsWith('/superadmin') || pathname.startsWith('/super-admin')) {
    if (!session) {
      if (pathname === '/super-admin/login') {
        return res;
      }
      const redirectUrl = new URL('/super-admin/login', req.url);
      redirectUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return res;
  }

  // Standard protected route check
  if (isProtected && !session) {
    if (pathname === '/admin/login' || pathname === '/admin/register') {
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
    '/',
    '/admin/:path*',
    '/superadmin/:path*',
    '/super-admin/:path*',
    '/supplier/:path*',
    '/vendors/:path*',
    '/pos-mapping/:path*',
    '/test-parser/:path*',
    '/shop/:path*',
    '/business/:path*',
    '/find-store/:path*',
  ],
};
