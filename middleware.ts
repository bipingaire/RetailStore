import { NextResponse, type NextRequest } from 'next/server';
import { extractSubdomain, getTenantFromSubdomain, isSuperadminDomain } from '@/lib/subdomain';

const PROTECTED_PREFIXES = ['/admin', '/superadmin', '/super-admin', '/supplier', '/vendors', '/pos-mapping', '/test-parser'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Get subdomain from request
  const host = req.headers.get('host') || '';
  const subdomain = extractSubdomain(host);

  // Check for Local Auth Token (Cookie)
  const sessionToken = req.cookies.get('access_token')?.value;
  const session = !!sessionToken;

  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));

  // Handle subdomain routing
  if (subdomain) {
    // Get tenant for this subdomain
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
        if (pathname.includes('/login')) return response;

        const redirectUrl = new URL('/admin/login', req.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    if (pathname === '/' || pathname === '') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    return response;
  }

  // Handle superadmin domain
  if (pathname.startsWith('/superadmin') || pathname.startsWith('/super-admin')) {
    if (!session) {
      if (pathname.includes('/login')) {
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
    if (pathname.includes('/login')) {
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
