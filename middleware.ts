import { NextResponse, type NextRequest } from 'next/server';
import { extractSubdomain, getTenantFromSubdomain, isSuperadminDomain } from '@/lib/subdomain';

const PROTECTED_PREFIXES = ['/admin', '/superadmin', '/super-admin', '/supplier', '/vendors', '/pos-mapping', '/test-parser'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const hostname = req.headers.get('host') || '';
  const { pathname, searchParams } = req.nextUrl;

  // 1. Handle retailos.cloud (Business & Super Admin)
  if (hostname.includes('retailos.cloud')) {
    // Super Admin: we.retailos.cloud/super-admin or just /super-admin on this domain
    if (hostname.startsWith('we.') || pathname.startsWith('/super-admin')) {
      // Allow access to super-admin routes
      // Check auth/session if needed (existing logic)
      const sessionToken = req.cookies.get('access_token')?.value;
      if (pathname.startsWith('/super-admin') && !sessionToken && !pathname.includes('/login')) {
        const redirectUrl = new URL('/super-admin/login', req.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return NextResponse.rewrite(new URL(pathname, req.url)); // Keep path as is
    }

    // Business Page: www.retailos.cloud -> /business
    if (hostname.startsWith('www.') || hostname === 'retailos.cloud') {
      if (pathname === '/') {
        return NextResponse.rewrite(new URL('/business', req.url));
      }
    }
  }

  // 2. Handle indumart.us (Tenant Stores)
  if (hostname.includes('indumart.us')) {
    // Main Landing: www.indumart.us -> Nearest Store
    if (hostname.startsWith('www.') || hostname === 'indumart.us') {
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/find-store', req.url));
      }
      return res;
    }

    // Tenant Subdomains: store.indumart.us
    const subdomain = extractSubdomain(hostname);
    if (subdomain && subdomain !== 'www') {
      // Verify Tenant
      const tenantId = await getTenantFromSubdomain(subdomain);
      if (!tenantId) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 });
      }

      const response = NextResponse.next();
      response.headers.set('x-tenant-id', tenantId);
      response.headers.set('x-subdomain', subdomain);

      // Tenant Admin: store.indumart.us/admin
      if (pathname.startsWith('/admin')) {
        const sessionToken = req.cookies.get('access_token')?.value;
        if (!sessionToken && !pathname.includes('/login')) {
          const redirectUrl = new URL('/admin/login', req.url);
          redirectUrl.searchParams.set('redirect', pathname);
          return NextResponse.redirect(redirectUrl);
        }
        return response;
      }

      // Tenant Shop: store.indumart.us/shop
      // If user goes to /shop, let them. 
      // If user goes to root /, maybe redirect to /shop?
      if (pathname === '/') {
        return NextResponse.rewrite(new URL('/shop', req.url));
      }

      return response;
    }
  }

  // Fallback / Dvelopment (Localhost)
  // Keep existing logic for localhost development
  if (hostname.includes('localhost')) {
    const subdomain = extractSubdomain(hostname);
    if (subdomain) {
      const tenantId = await getTenantFromSubdomain(subdomain);
      if (tenantId) {
        const response = NextResponse.next();
        response.headers.set('x-tenant-id', tenantId);
        response.headers.set('x-subdomain', subdomain);
        return response;
      }
    }
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
