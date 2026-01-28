'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ScanLine,
    RefreshCw,
    Megaphone,
    ClipboardCheck,
    Truck,
    Activity,
    Database,
    Share2,
    RotateCw,
    Users,
    MapPin,
    CreditCard,
    Store,
    LogOut
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await apiClient.logout();
        router.push('/admin/login');
    };

    const menuItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/invoices', label: 'Scan Invoices', icon: ScanLine },
        { href: '/admin/sales/sync', label: 'Daily Sales Sync', icon: RefreshCw },
        { href: '/admin/campaigns', label: 'Sale Campaigns', icon: Megaphone, badge: 'NEW' },
        { href: '/admin/audit', label: 'Daily Shelf Audit', icon: ClipboardCheck },
        { href: '/admin/orders', label: 'Order Fulfillment', icon: Truck, badge: 'LIVE' },
        { href: '/admin/inventory', label: 'Inventory Pulse', icon: Activity },
        { href: '/admin/inventory/master', label: 'Master Inventory', icon: Database },
        { href: '/admin/social', label: 'Social Media', icon: Share2 },
        { href: '/admin/restock', label: 'Restock', icon: RotateCw, badge: 'ACTION' },
        { href: '/admin/vendors', label: 'Vendor Relations', icon: Users },
        { href: '/admin/pos-mapping', label: 'POS Mapping', icon: MapPin },
        { href: '/admin/settings/payment', label: 'Payment Settings', icon: CreditCard, badge: 'NEW' },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Store size={20} />
                    </div>
                    <span className="font-bold text-lg">RetailOS</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={20} />
                                <span className="font-medium text-sm">{item.label}</span>
                            </div>
                            {/* @ts-ignore */}
                            {item.badge && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                    {/* @ts-ignore */}
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
