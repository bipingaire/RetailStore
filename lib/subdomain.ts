/**
 * Subdomain utilities for multi-tenant routing
 */

import { apiClient } from './api-client';

/**
 * Extract subdomain from hostname
 * Examples:
 *   store1.retailapp.com -> store1
 *   localhost:3000 -> null
 *   retailapp.com -> null
 */
export function extractSubdomain(host: string): string | null {
    if (!host) return null;

    // Remove port if present
    const hostname = host.split(':')[0];

    // Skip localhost and IP addresses
    if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        return null;
    }

    const parts = hostname.split('.');

    // Need at least 3 parts for subdomain (subdomain.domain.tld)
    if (parts.length < 3) {
        return null;
    }

    // First part is the subdomain
    const subdomain = parts[0];

    // Exclude common non-tenant subdomains
    const excludedSubdomains = ['www', 'admin', 'api', 'app', 'superadmin'];
    if (excludedSubdomains.includes(subdomain.toLowerCase())) {
        return null;
    }

    return subdomain;
}

/**
 * Check if hostname is superadmin domain
 */
export function isSuperadminDomain(host: string): boolean {
    if (!host) return false;

    const hostname = host.split(':')[0];

    // In development, superadmin is accessed via main domain
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return false; // Will check path instead
    }

    // Superadmin subdomains
    return hostname.startsWith('superadmin.') || hostname.startsWith('admin.');
}

/**
 * Get tenant ID from subdomain
 */
export async function getTenantFromSubdomain(subdomain: string): Promise<string | null> {
    if (!subdomain) return null;

    try {
        const tenant = await apiClient.get(`/tenants/${subdomain}`);
        return tenant?.['tenant-id'] || tenant?.id || null;
    } catch (error) {
        console.error('Error fetching tenant from subdomain:', error);
        return null;
    }
}

/**
 * Get subdomain from tenant ID
 */
export async function getSubdomainFromTenant(tenantId: string): Promise<string | null> {
    try {
        const tenants = await apiClient.get('/tenants');
        const tenant = tenants.find((t: any) => t['tenant-id'] === tenantId || t.id === tenantId);
        return tenant?.subdomain || null;
    } catch (error) {
        console.error('Error fetching subdomain from tenant:', error);
        return null;
    }
}

/**
 * Extract subdomain from Next.js request
 */
export function getSubdomainFromRequest(request: Request): string | null {
    const host = request.headers.get('host');
    if (!host) return null;

    return extractSubdomain(host);
}

/**
 * Build full URL with subdomain
 */
export function buildSubdomainUrl(subdomain: string, path: string = '/'): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = new URL(baseUrl);

    // In production, prepend subdomain to hostname
    if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
        url.hostname = `${subdomain}.${url.hostname}`;
    } else {
        // In development, use query parameter
        url.searchParams.set('tenant', subdomain);
    }

    url.pathname = path;
    return url.toString();
}

/**
 * Validate subdomain format
 */
export function isValidSubdomain(subdomain: string): boolean {
    // Subdomain rules:
    // - 3-63 characters
    // - alphanumeric and hyphens only
    // - cannot start or end with hyphen
    const pattern = /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/i;
    return pattern.test(subdomain);
}

/**
 * Check if subdomain is available
 */
export async function isSubdomainAvailable(subdomain: string): Promise<boolean> {
    if (!isValidSubdomain(subdomain)) {
        return false;
    }

    try {
        const tenant = await apiClient.get(`/tenants/${subdomain}`);
        return !tenant; // Available if no tenant found
    } catch (error) {
        // If fetch fails (404), subdomain is available
        return true;
    }
}
