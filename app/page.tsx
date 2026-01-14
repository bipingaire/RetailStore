import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getDomainType } from '@/lib/domain-utils';

export default function RootPage({ searchParams }: { searchParams: { domain?: string; subdomain?: string } }) {
  const headersList = headers();
  const host = headersList.get('host') || '';

  // Determine domain type
  const domainType = getDomainType(host, searchParams.domain, searchParams.subdomain);

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
    // Default fallback (localhost without params)
    redirect('/shop');
  }
}