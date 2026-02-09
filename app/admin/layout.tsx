'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isSuperadmin } from '@/lib/auth/superadmin';
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
  Users,
  Link as LinkIcon,
  Sparkles,
  Megaphone,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [posPending, setPosPending] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Supabase removed - refactor needed

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home, desc: 'Overview' },
    { name: 'Scan Invoices', href: '/admin/invoices', icon: FileInput, desc: 'Receive Goods' },
    { name: 'Daily Sales Sync', href: '/admin/sales', icon: FileBarChart, desc: 'Upload POS Report' },
    { name: 'Sale Campaigns', href: '/admin/sale', icon: Sparkles, desc: 'Flash / Ending / Festive', badge: 'New' },
    { name: 'Daily Shelf Audit', href: '/admin/audit', icon: ClipboardCheck, desc: 'Physical Count & QC' },
    { name: 'Order Fulfillment', href: '/admin/orders', icon: ShoppingBag, desc: 'Customer Orders', badge: 'Live' },
    { name: 'Inventory Pulse', href: '/admin/inventory', icon: LayoutDashboard, desc: 'Stock & Expiry' },
    { name: 'Master Inventory', href: '/admin/inventory/master', icon: LayoutDashboard, desc: 'Vendors / Costs / Prices' },
    { name: 'Social Media', href: '/admin/social', icon: Megaphone, desc: 'Push campaigns to socials' },
    { name: 'Restock', href: '/admin/restock', icon: Truck, desc: 'Vendor POs', badge: 'Action' },
    { name: 'Vendor Relations', href: '/admin/vendors', icon: Users, desc: 'Suppliers & Payments' },
    { name: 'POS Mapping', href: '/admin/pos-mapping', icon: LinkIcon, desc: 'Fix Sales Data' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, desc: 'Store & Vendors' },
  ];

  async function handleSignOut() {
    localStorage.removeItem('access_token');
    document.cookie = 'access_token=; path=/; max-age=0';
    toast.success('Signed out successfully');
    router.push('/admin/login');
  }

  useEffect(() => {
    async function checkAccess() {
      setIsLoading(true);

      // Check if user has access token
      const token = localStorage.getItem('access_token');

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        return;
      }

      // If we have a token, grant access
      setIsAuthenticated(true);
      setIsLoading(false);
    }

    async function checkUserRole(userId: string, tenantId: string | null) {
      // BYPASS FOR LOCALHOST DEV ENVIRONMENT
      // If we are on localhost, and just testing, allow any logged in user
      // This solves the "Stuck on Login" issue if DB doesn't have roles set up yet.
      if (window.location.hostname === 'localhost' && !tenantId) {
        console.log('Dev Mode: Allowing access bypass on localhost');
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      let query = supabase
        .from('tenant-user-role')
        .select('role-type, tenant-id')
        .eq('user-id', userId);

      if (tenantId) {
        query = query.eq('tenant-id', tenantId);
      }

      // If checking globally (localhost), just get any valid role
      // If checking specific tenant, we expect one row
      const { data: roleData, error } = await query.limit(1).maybeSingle();

      if (error || !roleData) {
        console.error('Access verification failed:', error);
        // Only show toast if we are NOT on the login page (to avoid double toast or conflict)
        if (pathname !== '/admin/login') {
          toast.error('Unauthorized: You do not have access to this store.');
        }
        // Do not sign out immediately, might be a valid user just at wrong URL
        // allow middleware/router to handle
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }

    checkAccess();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  // Login page bypass - render request content without admin shell
  if (pathname === '/admin/login') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col fixed h-full inset-y-0 z-50 border-r border-slate-800">

        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 bg-slate-950">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:bg-blue-500 transition-colors">
              <Store className="text-white" size={18} />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white leading-none">RETAIL<span className="text-blue-500">OS</span></div>
              <div className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-1">Manager Console</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
                <span className="flex-1 truncate">{item.name}</span>

                {/* Badges */}
                {(() => {
                  /* Example badge logic */
                  const badge = item.badge;
                  if (badge) {
                    return (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
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

        {/* User / Footer */}
        <div className="p-4 border-t border-white/5 bg-slate-950">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>

    </div>
  );
}
