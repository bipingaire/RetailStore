import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const path = url.pathname;

  // --- 1. DOMAIN IDENTIFICATION ---
  // Default to 'indumart.us' logic if localhost for dev ease, or simple toggle
  const isRetailOS = hostname.includes('retailos.cloud');
  const isInduMart = hostname.includes('indumart.us') || hostname.includes('localhost');

  // --- 2. RETAILOS.CLOUD ROUTING ---
  if (isRetailOS) {
    // Superadmin Rewrite
    if (path.startsWith('/superadmin')) {
      return NextResponse.rewrite(new URL(`/super-admin${path.replace('/superadmin', '')}`, req.url));
    }

    // Admin Dashboard (Tenant Admin)
    if (path.startsWith('/admin')) {
      // Allow through, but ensure session exists or redirect to login
      if (!session && path !== '/admin/login') {
        // Redirect to the unified login page
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return res;
    }

    // Root -> Business Landing Page
    if (path === '/') {
      return NextResponse.rewrite(new URL('/business', req.url));
    }
  }

  // --- 3. INDUMART.US ROUTING ---
  if (isInduMart) {
    // Check for subdomain
    const subdomain = hostname.split('.')[0];
    const isRootDomain = subdomain === 'indumart' || subdomain === 'www' || hostname === 'localhost:3010' || hostname === 'localhost:3000'; // Adjust for local dev ports

    // Root Domain -> Locator Page
    if (isRootDomain && path === '/') {
      return NextResponse.rewrite(new URL('/locator', req.url));
    }

    // Subdomain (e.g. greensboro.indumart.us) -> Shop
    // Next.js automatically maps '/' to 'app/page.tsx' which redirects to '/shop'
    // But we can enable explicit rewrite if needed, or just let the default redirect handle it.
    // Default 'app/page.tsx' does: redirect('/shop')

    // Optimization: If on subdomain and hitting root, rewrite directly to /shop to save a client-side redirect?
    // if (!isRootDomain && path === '/') {
    //   return NextResponse.rewrite(new URL('/shop', req.url));
    // }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - auth (Auth routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|auth|.*\\..*).*)',
  ],
};
