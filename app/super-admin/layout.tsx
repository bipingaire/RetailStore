'use client';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
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
    const pathname = usePathname();

    const isPublicPage = pathname === '/super-admin/login';

    useEffect(() => {
        if (!loading && !isPublicPage && (!isAuthenticated || user?.role !== 'superadmin')) {
            router.push('/super-admin/login');
        }
    }, [loading, isAuthenticated, user, router, pathname, isPublicPage]);

    if (isPublicPage) {
        return <>{children}</>;
    }

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
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <aside className="w-64 bg-slate-900 text-white p-6 fixed h-full z-10 shadow-xl">
                <div className="flex items-center gap-3 mb-10 text-purple-400">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                    </div>
                    <div className="font-black text-lg tracking-tight text-white leading-none">
                        RETAILOS<br />
                        <span className="text-xs font-medium opacity-50 text-purple-300">SUPER ADMIN</span>
                    </div>
                </div>

                <nav className="space-y-1 font-medium">
                    <Link href="/super-admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition group">
                        <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                        Overview
                    </Link>
                    <Link href="/super-admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition group">
                        <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>
                        Global Products
                    </Link>
                    <Link href="/super-admin/stores" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition group">
                        <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" viewBox="0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18" /><path d="M5 21V7l8-4 8 4v14" /><path d="M17 21v-8H7v8" /></svg>
                        Stores
                    </Link>
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-700/50">
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:text-white hover:bg-white/5 transition group"
                    >
                        <svg className="w-5 h-5 opacity-70 group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div >
    );
}
