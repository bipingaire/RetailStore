'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import {
    ShieldCheck, LayoutDashboard, Users, Store, Settings, LogOut, Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // AUTH CHECK
    useEffect(() => {
        async function checkAuth() {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session && pathname !== '/super-admin/login') {
                setIsAuthenticated(false);
                router.push('/super-admin/login');
            } else {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        }
        checkAuth();
    }, [pathname, router, supabase.auth]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        toast.success('Logged out');
        router.push('/super-admin/login');
    };

    // 1. Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    // 2. Login Page Rewrite (Don't show sidebar on login)
    if (pathname === '/super-admin/login') {
        return <>{children}</>;
    }

    // 3. Unauthenticated (Strict Safety)
    if (!isAuthenticated) return null;

    // 4. Authenticated Layout
    const navItems = [
        { name: 'Overview', href: '/super-admin', icon: LayoutDashboard },
        { name: 'Tenants', href: '/super-admin/tenants', icon: Store },
        { name: 'Users', href: '/super-admin/users', icon: Users },
        { name: 'Settings', href: '/super-admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-900 font-sans flex text-slate-300">

            {/* SIDEBAR */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col fixed inset-y-0 z-50">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 rounded-lg p-1.5 text-white">
                            <ShieldCheck size={20} />
                        </div>
                        <div className="font-bold text-white tracking-tight">SuperAdmin</div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium text-sm ${isActive
                                        ? 'bg-blue-600/10 text-blue-400'
                                        : 'hover:bg-slate-900 hover:text-white'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* CONTENT */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>

        </div>
    );
}
