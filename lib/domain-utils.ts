/**
 * Domain utilities for multi-domain routing
 * Handles detection of retailOS.com vs indumart.us domains
 */

export type DomainType = 'retailos' | 'indumart-parent' | 'indumart-tenant' | 'unknown';

/**
 * Extract domain and subdomain from hostname
 * Examples:
 *   www.retailos.com -> { domain: 'retailos.com', subdomain: null }
 *   www.indumart.us -> { domain: 'indumart.us', subdomain: null }
 *   highpoint.indumart.us -> { domain: 'indumart.us', subdomain: 'highpoint' }
 *   localhost:3000 -> Uses query params or defaults
 */
export function parseHost(host: string): { domain: string | null; subdomain: string | null } {
    if (!host) return { domain: null, subdomain: null };

    // Remove port if present
    const hostname = host.split(':')[0];

    // Handle localhost - check query params in actual request
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return { domain: null, subdomain: null };
    }

    const parts = hostname.split('.');

    // Single domain (e.g., 'retailos')
    if (parts.length === 1) {
        return { domain: null, subdomain: null };
    }

    // Two parts (e.g., 'retailos.com', 'indumart.us')
    if (parts.length === 2) {
        return {
            domain: hostname,
            subdomain: null
        };
    }

    // Three or more parts (e.g., 'www.retailos.com', 'highpoint.indumart.us')
    const subdomain = parts[0];
    const domain = parts.slice(-2).join('.');

    // Treat 'www' as non-subdomain
    if (subdomain === 'www') {
        return { domain, subdomain: null };
    }

    return { domain, subdomain };
}

/**
 * Determine the domain type for routing decisions
 */
export function getDomainType(host: string, queryDomain?: string, querySubdomain?: string): DomainType {
    const retailosDomain = process.env.NEXT_PUBLIC_RETAILOS_DOMAIN || 'retailos.cloud';
    const indumartDomain = process.env.NEXT_PUBLIC_INDUMART_DOMAIN || 'indumart.us';

    // In development with query params
    if (queryDomain) {
        if (queryDomain.includes('retailos')) {
            return 'retailos';
        }
        if (queryDomain.includes('indumart')) {
            return querySubdomain ? 'indumart-tenant' : 'indumart-parent';
        }
    }

    const { domain, subdomain } = parseHost(host);

    if (!domain) return 'unknown';

    // RetailOS domain (supports both .com and .cloud or custom)
    if (domain.includes(retailosDomain.split('.')[0])) {
        return 'retailos';
    }

    // Indumart domain
    if (domain.includes(indumartDomain.split('.')[0])) {
        // Has subdomain = tenant site (e.g., highpoint.indumart.us)
        if (subdomain) {
            return 'indumart-tenant';
        }
        // No subdomain = parent domain (www.indumart.us)
        return 'indumart-parent';
    }

    return 'unknown';
}

/**
 * Check if hostname is RetailOS platform domain
 */
export function isRetailOSDomain(host: string, queryDomain?: string): boolean {
    return getDomainType(host, queryDomain) === 'retailos';
}

/**
 * Check if hostname is Indumart parent domain (www.indumart.us)
 */
export function isIndumartParentDomain(host: string, queryDomain?: string, querySubdomain?: string): boolean {
    return getDomainType(host, queryDomain, querySubdomain) === 'indumart-parent';
}

/**
 * Check if hostname is Indumart tenant subdomain (e.g., highpoint.indumart.us)
 */
export function isIndumartTenantDomain(host: string, queryDomain?: string, querySubdomain?: string): boolean {
    return getDomainType(host, queryDomain, querySubdomain) === 'indumart-tenant';
}

/**
 * Build URL for a specific domain type
 */
export function buildDomainUrl(
    domainType: DomainType,
    path: string = '/',
    subdomain?: string
): string {
    const isProduction = process.env.NODE_ENV === 'production';
    const retailosDomain = process.env.NEXT_PUBLIC_RETAILOS_DOMAIN || 'retailos.com';
    const indumartDomain = process.env.NEXT_PUBLIC_INDUMART_DOMAIN || 'indumart.us';

    if (!isProduction) {
        // Development mode - use query parameters
        const url = new URL(`http://localhost:3000${path}`);

        switch (domainType) {
            case 'retailos':
                url.searchParams.set('domain', retailosDomain);
                break;
            case 'indumart-parent':
                url.searchParams.set('domain', indumartDomain);
                break;
            case 'indumart-tenant':
                if (subdomain) {
                    url.searchParams.set('domain', indumartDomain);
                    url.searchParams.set('subdomain', subdomain);
                }
                break;
        }

        return url.toString();
    }

    // Production mode - use actual domains
    switch (domainType) {
        case 'retailos':
            return `https://www.${retailosDomain}${path}`;
        case 'indumart-parent':
            return `https://www.${indumartDomain}${path}`;
        case 'indumart-tenant':
            if (subdomain) {
                return `https://${subdomain}.${indumartDomain}${path}`;
            }
            return `https://www.${indumartDomain}${path}`;
        default:
            return `http://localhost:3000${path}`;
    }
}

/**
 * Extract query params for domain simulation in development
 */
export function extractDomainParams(searchParams: URLSearchParams): {
    domain?: string;
    subdomain?: string;
} {
    return {
        domain: searchParams.get('domain') || undefined,
        subdomain: searchParams.get('subdomain') || undefined,
    };
}
