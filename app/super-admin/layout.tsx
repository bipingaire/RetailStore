'use client';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!isAuthenticated || user?.role !== 'superadmin')) {
            router.push('/super-admin/login');
        }
    }, [loading, isAuthenticated, user, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-purple-900">
                <Loader2 className="animate-spin text-white" size={32} />
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== 'superadmin') {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-purple-900 text-white p-6 fixed h-full">
                <div className="text-xl font-black mb-8">SUPER ACCESS</div>
                <nav className="space-y-4 font-medium">
                    <Link href="/super-admin" className="block opacity-80 hover:opacity-100">Overview</Link>
                    <Link href="/super-admin/products" className="block opacity-80 hover:opacity-100">Global Products</Link>
                    <Link href="/super-admin/stores" className="block opacity-80 hover:opacity-100">Stores</Link>
                    <Link href="/super-admin/pending-products" className="block opacity-80 hover:opacity-100">Pending Review</Link>
                </nav>
            </aside>
            <main className="flex-1 ml-64">
                {children}
            </main>
        </div>
    );
}
