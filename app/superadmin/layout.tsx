'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { isSuperadmin } from '@/lib/auth/superadmin';
import { Loader2 } from 'lucide-react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SuperadminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/admin/login?redirect=/superadmin');
                return;
            }

            const isAdmin = await isSuperadmin(user.id);

            if (!isAdmin) {
                router.push('/admin');
                return;
            }

            setAuthorized(true);
            setLoading(false);
        }

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
                    <p className="mt-4 text-gray-600">Verifying superadmin access...</p>
                </div>
            </div>
        );
    }

    if (!authorized) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <h1 className="text-xl font-bold text-gray-900">🔧 Superadmin</h1>
                            <div className="flex gap-4">
                                <a href="/superadmin" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                    Dashboard
                                </a>
                                <a href="/superadmin/stores" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                    Stores
                                </a>
                                <a href="/superadmin/products" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                    Master Catalog
                                </a>
                                <a href="/superadmin/pending-products" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                                    Pending Products
                                </a>
                            </div>
                        </div>
                        <a href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
                            ← Back to Admin
                        </a>
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}
