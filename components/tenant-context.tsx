'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { getTenantFromSubdomain } from '@/lib/subdomain';

type Tenant = {
  id: string;
  name: string;
  type: 'retailer' | 'supplier';
};

type TenantContextType = {
  tenant: Tenant | null;
  loading: boolean;
};

// Create the context with default values
const TenantContext = createContext<TenantContextType>({ tenant: null, loading: true });

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initSession() {
      if (!apiClient.isAuthenticated()) {
        setLoading(false);
        return;
      }

      // Try to determine tenant from subdomain first (easiest migration path)
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const subdomain = hostname.includes('localhost') ? 'demo1' : hostname.split('.')[0];

        const tenantId = await getTenantFromSubdomain(subdomain);

        if (tenantId) {
          // We have an ID, now ideally we fetch details. 
          // For now, mock the details or use what we have to prevent errors
          setTenant({
            id: tenantId,
            name: `${subdomain.toUpperCase()} Store`, // Mock name
            type: 'retailer'
          });
        }
      }

      setLoading(false);
    }

    initSession();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

// Hook for child components to easy access the tenant
export const useTenant = () => useContext(TenantContext);