'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { isSuperadmin } from '@/lib/auth/superadmin';
import { Loader2 } from 'lucide-react';

export default function SuperadminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(pathname !== '/super-admin/login');
    const [authorized, setAuthorized] = useState(false);
    const supabase = createClientComponentClient();

    useEffect(() => {
        // Bypass for login page
        if (pathname === '/super-admin/login') {
            setLoading(false);
            return;
        }

        // Reset loading state if we are navigating to a protected page and check hasn't updated yet
        setLoading(true);

        async function checkAuth() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/super-admin/login');
                    return;
                }

                const isAdmin = await isSuperadmin(supabase, user.id);

                if (!isAdmin) {
                    console.error('User is not superadmin');
                    router.push('/super-admin/login?error=unauthorized');
                    return;
                }

                setAuthorized(true);
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/super-admin/login?error=server_error');
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [pathname, router]); // Added pathname

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                    <p className="mt-4 text-gray-400">Verifying superadmin access...</p>
                </div>
            </div>
        );
    }

    // Allow render if authorized OR if on login page
    if (!authorized && pathname !== '/super-admin/login') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            {/* Shared Superadmin Navigation can go here if needed, 
                 but page.tsx has its own header currently. 
                 We will keep this wrapper simple for now to just handle Auth. */}
            <main>{children}</main>
        </div>
    );
}
