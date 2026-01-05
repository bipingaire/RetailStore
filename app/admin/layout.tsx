'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  FileInput,
  ShoppingBag,
  FileBarChart,
  LogOut,
  Store,
  ClipboardCheck,
  Truck,
  Settings,
  Home,
  Receipt,
  Users,
  LinkIcon,
  Sparkles,
  Megaphone,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [posPending, setPosPending] = useState<number | null>(null);

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: Home,
      desc: 'Overview'
    },
    {
      name: 'Scan Invoices',
      href: '/admin/invoices',
      icon: FileInput,
      desc: 'Receive Goods'
    },
    {
      name: 'Daily Sales Sync',
      href: '/admin/sales',
      icon: FileBarChart,
      desc: 'Upload POS Report'
    },
    {
      name: 'Sale Campaigns',
      href: '/admin/sale',
      icon: Sparkles,
      desc: 'Flash / Ending / Festive',
      badge: 'New'
    },
    {
      name: 'Daily Shelf Audit',
      href: '/admin/audit',
      icon: ClipboardCheck,
      desc: 'Physical Count & QC'
    },
    {
      name: 'Order Fulfillment',
      href: '/admin/orders',
      icon: ShoppingBag,
      desc: 'Customer Orders',
      badge: 'Live'
    },
    {
      name: 'Inventory Pulse',
      href: '/admin/inventory',
      icon: LayoutDashboard,
      desc: 'Stock & Expiry'
    },
    {
      name: 'Master Inventory',
      href: '/admin/inventory/master',
      icon: LayoutDashboard,
      desc: 'Vendors / Costs / Prices'
    },
    {
      name: 'Social Media',
      href: '/admin/social',
      icon: Megaphone,
      desc: 'Push campaigns to socials'
    },
    {
      name: 'Restock',
      href: '/admin/restock',
      icon: Truck,
      desc: 'Vendor POs',
      badge: 'Action'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      desc: 'Store & Vendors'
    },

    {
      name: 'Vendor Relations',
      href: '/admin/vendors',
      icon: Users, // from lucide-react
      desc: 'Suppliers & Payments'
    },
    {
      name: 'POS Mapping',
      href: '/admin/pos-mapping',
      icon: LinkIcon, // Import Link as LinkIcon from lucide-react
      desc: 'Fix Sales Data'
    },
  ];

  useEffect(() => {
    async function loadPosPending() {
      const { count } = await supabase
        .from('pos_mappings')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', false);
      setPosPending(count ?? 0);
    }
    loadPosPending();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">

      {/* SIDEBAR */}
      <aside className="w-64 bg-secondary text-secondary-foreground flex flex-col fixed h-full inset-y-0 z-50 border-r border-white/5 shadow-2xl">

        {/* Brand - Now Clickable */}
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="font-black text-2xl tracking-tight flex items-center gap-2 hover:opacity-80 transition cursor-pointer text-white">
            <Store className="text-accent" />
            RETAIL<span className="text-accent">OS</span>
          </Link>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">Manager Console</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${isActive
                    ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/10'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon size={20} className={isActive ? 'text-accent' : 'text-white/60 group-hover:text-accent transition-colors'} />
                <div>
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-[10px] opacity-70 font-normal">{item.desc}</div>
                </div>
                {(() => {
                  const pending = item.name === 'POS Mapping' ? posPending : null;
                  const badge = pending !== null ? pending : item.badge;
                  if (badge && badge !== 0) {
                    return (
                      <span className="ml-auto bg-destructive text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md animate-pulse shadow-md shadow-red-900/20">
                        {badge}
                      </span>
                    );
                  }
                  return null;
                })()}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 w-full p-3 text-white/50 hover:text-destructive-foreground hover:bg-destructive/90 rounded-xl transition">
            <LogOut size={20} />
            <span className="font-bold text-sm">Sign Out</span>
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>

    </div>
  );
}