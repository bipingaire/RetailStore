'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
      // 1. Check for active Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setLoading(false);
        return; 
      }

      // 2. Fetch the tenant associated with this user
      const { data: tenantData, error } = await supabase
        .from('tenants')
        .select('id, name, type')
        .eq('owner_id', session.user.id)
        .single();

      if (tenantData) {
        setTenant(tenantData as any);
      } else {
        console.warn("User logged in but no tenant found:", error);
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