import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getDomainType } from '@/lib/domain-utils';

export default function RootPage({ searchParams }: { searchParams: { domain?: string; subdomain?: string } }) {
  const headersList = headers();
  const host = headersList.get('host') || '';

  // Determine domain type
  const domainType = getDomainType(host, searchParams.domain, searchParams.subdomain);

  // Server-side logging for debugging
  console.log(`[Root Page] Host: ${host}, Domain Type: ${domainType}`);

  // Redirect based on domain type
  if (domainType === 'retailos') {
    // RetailOS.com -> Business advertising page
    redirect('/business');
  } else if (domainType === 'indumart-parent') {
    // www.indumart.us -> Geolocation redirect page
    redirect('/find-store');
  } else if (domainType === 'indumart-tenant') {
    // tenant.indumart.us -> Ecommerce site
    redirect('/shop');
  } else {
    // Fallback: if host contains indumart.us (even if detection failed), redirect to find-store
    // This handles edge cases like www.indumart.us or indumart.us
    if (host.includes('indumart.us')) {
      console.log(`[Root Page] Fallback redirect to /find-store for indumart.us host: ${host}`);
      redirect('/find-store');
    }

    // For localhost or truly unknown domains, redirect to shop
    // This maintains backward compatibility for development
    console.log(`[Root Page] Unknown domain, redirecting to /shop for host: ${host}`);
    redirect('/shop');
  }
}