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

  // Explicit check: if host contains indumart.us and no subdomain detected, force redirect to find-store
  const isIndumartParent = host.includes('indumart.us') && !host.match(/^(?!www\.)[\w-]+\.indumart\.us/);

  if (isIndumartParent && domainType === 'unknown') {
    console.log(`[Root Page] Forcing redirect to /find-store for indumart.us parent domain`);
    redirect('/find-store');
  }

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
    // For truly unknown domains (not indumart.us), show an error
    // This prevents accidental redirects to /shop
    console.error(`[Root Page] Unknown domain type for host: ${host}`);
    throw new Error(`Unable to determine domain type for: ${host}. Please check your domain configuration.`);
  }
}