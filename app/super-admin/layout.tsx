'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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

    useEffect(() => {
        // Bypass for login page
        if (pathname === '/super-admin/login') {
            setLoading(false);
            setAuthorized(true);
            return;
        }

        setLoading(true);

        const checkAuth = () => {
            try {
                const token = localStorage.getItem('accessToken');

                if (!token) {
                    router.push('/super-admin/login');
                    return;
                }

                // Optional: Verify token validity via API or expiration check here
                // For now, presence of token is enough for client-side protection

                setAuthorized(true);
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/super-admin/login');
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [pathname, router]);

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
            <main>{children}</main>
        </div>
    );
}
