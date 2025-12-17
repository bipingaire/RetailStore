'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  TrendingUp, Users, Package, AlertCircle, 
  Clock, ArrowRight, DollarSign, Activity, ShoppingBag, 
  UploadCloud, FileBarChart, FileText, Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todaySales: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    expiredCount: 0,
    activePromos: 0,
    posMapped: 0,
    posUnverified: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      // 1. Fetch KPIs
      const { data: inventory } = await supabase
        .from('store_inventory')
        .select('reorder_point, inventory_batches(batch_quantity, expiry_date)')
        .eq('is_active', true);

      const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: activePromos } = await supabase
        .from('promotions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: posMapped } = await supabase
        .from('pos_mappings')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', true);

      const { count: posUnverified } = await supabase
        .from('pos_mappings')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', false);

      // Process Inventory Stats
      let lowStock = 0;
      let expired = 0;
      const today = new Date();

      (inventory || []).forEach((item: any) => {
        const batches = item.inventory_batches || [];
        const totalQty = batches.reduce((sum: number, b: any) => sum + b.batch_quantity, 0);
        
        if (totalQty <= (item.reorder_point || 10)) lowStock++;
        
        // Check expiry
        batches.forEach((b: any) => {
          if (b.expiry_date && new Date(b.expiry_date) < today) expired++;
        });
      });

      // 2. Fetch Recent Activity
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('id, total_amount, created_at, customer_phone')
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: recentInvoices } = await supabase
        .from('invoices')
        .select('id, created_at, status')
        .order('created_at', { ascending: false })
        .limit(2);

      // Combine and sort activity
      const activity = [
        ...(recentOrders || []).map(o => ({
          type: 'order',
          title: `New Order ($${o.total_amount})`,
          desc: `Customer: ${o.customer_phone}`,
          time: o.created_at,
          icon: ShoppingBag,
          color: 'bg-blue-100 text-blue-600'
        })),
        ...(recentInvoices || []).map(i => ({
          type: 'invoice',
          title: 'Invoice Uploaded',
          desc: `Status: ${i.status}`,
          time: i.created_at,
          icon: Package,
          color: 'bg-purple-100 text-purple-600'
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

      setStats({
        todaySales: 1250.00, // Mocked until Sales Sync is fully live
        pendingOrders: pendingOrders || 0,
        lowStockCount: lowStock,
        expiredCount: expired,
        activePromos: activePromos || 0,
        posMapped: posMapped || 0,
        posUnverified: posUnverified || 0
      });
      setRecentActivity(activity);
      setLoading(false);
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Good Morning, Owner</h1>
          <p className="text-gray-500">Here is what's happening in your store today.</p>
        </div>

        {/* PRIMARY ACTIONS - Added per request */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/admin/invoices" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 flex items-center justify-between shadow-lg shadow-blue-200 transition transform hover:scale-[1.01]">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <UploadCloud size={32} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Scan Vendor Invoice</h3>
                <p className="text-blue-100 text-sm">Add arriving stock & set expiry</p>
              </div>
            </div>
            <ArrowRight className="opacity-80" />
          </Link>

          <Link href="/admin/sale" className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-6 flex items-center justify-between shadow-lg shadow-purple-200 transition transform hover:scale-[1.01]">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <FileBarChart size={32} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Sale Campaigns</h3>
                <p className="text-purple-100 text-sm">Create & push flash/ending/festive offers</p>
              </div>
            </div>
            <ArrowRight className="opacity-80" />
          </Link>
        </div>

        {/* 1. KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Revenue Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                <TrendingUp size={12} className="mr-1" /> +12%
              </span>
            </div>
            <div className="text-3xl font-black text-gray-900">${stats.todaySales.toFixed(2)}</div>
            <div className="text-xs text-gray-400 font-medium mt-1">Today's Revenue</div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              {stats.pendingOrders > 0 && (
                <span className="flex items-center text-xs font-bold text-white bg-red-500 px-2 py-1 rounded animate-pulse">
                  {stats.pendingOrders} New
                </span>
              )}
            </div>
            <div className="text-3xl font-black text-gray-900">{stats.pendingOrders}</div>
            <div className="text-xs text-gray-400 font-medium mt-1">Orders to Pack</div>
          </div>

          {/* Low Stock */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 rounded-xl">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900">{stats.lowStockCount}</div>
            <div className="text-xs text-gray-400 font-medium mt-1">Items Low Stock</div>
          </div>

          {/* Expired / Critical */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-gray-900">{stats.expiredCount}</div>
            <div className="text-xs text-gray-400 font-medium mt-1">Expired / Critical</div>
          </div>

          {/* POS Mapping Health */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <LinkIcon className="w-6 h-6 text-purple-600" />
              </div>
              {stats.posUnverified > 0 && (
                <span className="flex items-center text-xs font-bold text-white bg-orange-500 px-2 py-1 rounded">
                  {stats.posUnverified} To verify
                </span>
              )}
            </div>
            <div className="text-3xl font-black text-gray-900">{stats.posMapped}</div>
            <div className="text-xs text-gray-400 font-medium mt-1">POS items mapped</div>
          </div>

        </div>

        {/* 2. MAIN SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Activity className="text-blue-500" size={20} /> 
                Recent Activity
              </h3>
              <button className="text-sm text-blue-600 font-bold hover:underline">View All</button>
            </div>
            
            <div className="space-y-6">
              {recentActivity.length === 0 ? (
                <div className="text-center py-10 text-gray-400 italic">No activity yet. Start by scanning an invoice!</div>
              ) : (
                recentActivity.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Actions / Financials */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-lg mb-6">Financial Health</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 font-medium">Gross Sales</span>
                  <span className="text-green-600 bg-green-100 text-xs px-2 py-0.5 rounded font-bold">+5%</span>
                </div>
                <div className="text-2xl font-black text-gray-900">$12,450.00</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 font-medium">Est. Inventory Value</span>
                </div>
                <div className="text-2xl font-black text-gray-900">$45,200.00</div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Monthly Goal</span>
                  <span>70%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[70%]"></div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}