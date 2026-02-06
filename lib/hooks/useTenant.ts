'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useTenant() {
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function getTenant() {
            // TEMP: Auth disabled, return default tenant ID
            setTenantId('f5dcdfde-b185-4b89-b513-f0758c73cc5f');
            setLoading(false);

            /* ORIGINAL CODE - Disabled for now
            try {
                // Get current user session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    router.push('/login');
                    return;
                }

                // Get tenant ID from user role mapping
                const { data, error: roleError } = await supabase
                    .from('tenant-user-role')
                    .select('tenant-id')
                    .eq('user-id', session.user.id)
                    .single();

                if (roleError) {
                    setError('No tenant associated with this user');
                    setLoading(false);
                    return;
                }

                setTenantId(data?.['tenant-id'] || null);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
            */
        }

        getTenant();
    }, []);

    return { tenantId, loading, error };
}
