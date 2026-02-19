import { NextResponse, type NextRequest } from 'next/server';
import { extractSubdomain } from '@/lib/subdomain';

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const { pathname } = req.nextUrl;

  // ─── 1. retailos.cloud ────────────────────────────────────────────────
  if (hostname.includes('retailos.cloud')) {
    // Super Admin section — require auth token
    if (pathname.startsWith('/super-admin')) {
      const sessionToken = req.cookies.get('access_token')?.value;
      if (!sessionToken && !pathname.includes('/login')) {
        const redirectUrl = new URL('/super-admin/login', req.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return NextResponse.next();
    }

    // Root → business landing page
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/business', req.url));
    }

    return NextResponse.next();
  }

  // ─── 2. indumart.us root domain ────────────────────────────────────────
  if (hostname === 'indumart.us' || hostname === 'www.indumart.us') {
    // Always rewrite root to find-store geolocation page
    return NextResponse.rewrite(new URL('/find-store', req.url));
  }

  // ─── 3. *.indumart.us tenant subdomains ────────────────────────────────
  if (hostname.endsWith('.indumart.us')) {
    const subdomain = extractSubdomain(hostname);

    if (!subdomain || subdomain === 'www') {
      return NextResponse.redirect(new URL('https://indumart.us'));
    }

    // Inject tenant headers
    const response = NextResponse.next();
    response.headers.set('x-subdomain', subdomain);
    response.headers.set('x-tenant', subdomain);

    // Tenant Admin: subdomain.indumart.us/admin → auth gate
    if (pathname.startsWith('/admin')) {
      const sessionToken = req.cookies.get('access_token')?.value;
      if (!sessionToken && !pathname.includes('/login')) {
        const redirectUrl = new URL('/admin/login', req.url);
        redirectUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    // Root → /shop storefront
    if (pathname === '/') {
      return NextResponse.rewrite(new URL('/shop', req.url));
    }

    return response;
  }

  // ─── 4. Localhost development ──────────────────────────────────────────
  if (hostname.includes('localhost')) {
    const subdomain = extractSubdomain(hostname);
    if (subdomain) {
      const response = NextResponse.next();
      response.headers.set('x-subdomain', subdomain);
      response.headers.set('x-tenant', subdomain);
      return response;
    }
  }

  return NextResponse.next();
}

// Match ALL paths except Next.js internals
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
