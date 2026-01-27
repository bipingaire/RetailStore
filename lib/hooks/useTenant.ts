'use client';
import { useEffect, useState } from 'react';
import { getTenantFromSubdomain } from '../subdomain';

export function useTenant() {
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getTenant() {
            try {
                // In the new architecture, tenant is determined by subdomain
                // logic handled by our subdomain utility which now uses apiClient
                if (typeof window !== 'undefined') {
                    const hostname = window.location.hostname;
                    const subdomain = hostname.split('.')[0];

                    // Skip for localhost if not using subdomain param
                    if (hostname.includes('localhost') && subdomain === 'localhost') {
                        setLoading(false);
                        return;
                    }

                    const tid = await getTenantFromSubdomain(subdomain);
                    if (tid) {
                        setTenantId(tid);
                    }
                }
            } catch (err: any) {
                console.error("useTenant error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        getTenant();
    }, []);

    return { tenantId, loading, error };
}
