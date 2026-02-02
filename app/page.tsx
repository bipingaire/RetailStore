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
    // FALLBACK: EVERYTHING GOES TO /find-store (NO /shop!)
    console.log(`[Root Page] Unknown domain, forcing redirect to /find-store for host: ${host}`);
    redirect('/find-store');
  }
}