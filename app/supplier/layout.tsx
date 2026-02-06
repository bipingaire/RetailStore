'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Settings, 
  LogOut, 
  Factory, 
  Users,
  ArrowLeftRight
} from 'lucide-react';

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/supplier', 
      icon: LayoutDashboard,
      desc: 'Overview'
    },
    { 
      name: 'Live Inventory', 
      href: '/supplier/inventory', 
      icon: Package,
      desc: 'ERP Synced'
    },
    { 
      name: 'Incoming Orders', 
      href: '/supplier/orders', 
      icon: ArrowLeftRight,
      desc: 'Retailer POs',
      badge: '3 New'
    },
    { 
      name: 'Retailer Network', 
      href: '/supplier/retailers', 
      icon: Users,
      desc: 'Connected Stores'
    },
    { 
      name: 'Configuration', 
      href: '/supplier/settings', 
      icon: Settings, 
      desc: 'API & Logistics'
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 font-sans">
      
      {/* SIDEBAR - Dark Theme for Distinction */}
      <aside className="w-64 bg-black text-white flex flex-col fixed h-full inset-y-0 z-50 border-r border-gray-800">
        
        {/* Brand */}
        <div className="p-6 border-b border-gray-800">
          <div className="font-black text-2xl tracking-tight flex items-center gap-2 text-purple-400">
            <Factory className="text-white" />
            SUPPLY<span className="text-white">OS</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Distributor Console</p>
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
                className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={24} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'} />
                <div>
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-[10px] opacity-70 font-normal">{item.desc}</div>
                </div>
                {item.badge && (
                  <span className="ml-auto bg-white text-purple-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 w-full p-3 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition">
            <LogOut size={20} />
            <span className="font-bold text-sm">Sign Out</span>
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </main>
      
    </div>
  );
}