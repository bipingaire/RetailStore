'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useTenant() {
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClientComponentClient();
    const router = useRouter();

    useEffect(() => {
        async function getTenant() {
            try {
                // Get current user session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    // console.warn("useTenant: No session found");
                    setLoading(false);
                    return;
                }

                // Get tenant ID from user role mapping
                const { data, error: roleError } = await supabase
                    .from('tenant-user-role')
                    .select('tenant-id')
                    .eq('user-id', session.user.id)
                    .maybeSingle();

                if (roleError) {
                    console.error('Error fetching tenant:', roleError);
                    setError('Error fetching tenant');
                } else if (data) {
                    setTenantId(data['tenant-id']);
                } else {
                    // Fallback for subdomain if needed, but role is safer
                    console.warn("No tenant role found for user");
                }
            } catch (err: any) {
                console.error("useTenant crash:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        getTenant();
    }, []);

    return { tenantId, loading, error };
}
