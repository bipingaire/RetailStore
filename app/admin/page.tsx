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
    <div className="min-h-screen p-8 font-sans text-foreground">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Header */}
        <div className="animate-fade-in">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Good Morning, Owner</h1>
          <p className="text-lg text-muted-foreground">Here's your retail command center for today.</p>
        </div>

        {/* PRIMARY ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          <Link href="/admin/invoices" className="group relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-3xl p-8 flex items-center justify-between shadow-2xl shadow-black/20 transition-all hover:scale-[1.01] hover:shadow-primary/30 border border-white/10">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <UploadCloud size={32} className="text-accent drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-bold text-2xl tracking-tight text-white">Scan Invoice</h3>
                <p className="text-white/60 text-base font-medium opacity-90">Restock inventory & track costs</p>
              </div>
            </div>
            <div className="bg-white/10 p-2 rounded-full backdrop-blur-md group-hover:translate-x-1 transition-transform border border-white/10">
              <ArrowRight className="text-accent" size={24} />
            </div>
          </Link>

          <Link href="/admin/sale" className="group relative overflow-hidden bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground rounded-3xl p-8 flex items-center justify-between shadow-2xl shadow-black/20 transition-all hover:scale-[1.01] hover:shadow-secondary/30 border border-white/10">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <FileBarChart size={32} className="text-accent drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-bold text-2xl tracking-tight text-white">Campaigns</h3>
                <p className="text-white/60 text-base font-medium opacity-90">Push flash sales & offers</p>
              </div>
            </div>
            <div className="bg-white/10 p-2 rounded-full backdrop-blur-md group-hover:translate-x-1 transition-transform border border-white/10">
              <ArrowRight className="text-accent" size={24} />
            </div>
          </Link>
        </div>

        {/* 1. KPI GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up-delay">

          {/* Revenue Card */}
          <div className="glass p-6 rounded-3xl hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-100/50 rounded-2xl text-emerald-700">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100/50 px-3 py-1 rounded-full">
                <TrendingUp size={12} className="mr-1" /> +12%
              </span>
            </div>
            <div className="text-4xl font-black text-gray-900 tracking-tight">${stats.todaySales.toFixed(2)}</div>
            <div className="text-sm text-gray-500 font-semibold mt-1">Today's Revenue</div>
          </div>

          {/* Pending Orders */}
          <div className="glass p-6 rounded-3xl hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100/50 rounded-2xl text-blue-700">
                <ShoppingBag className="w-6 h-6" />
              </div>
              {stats.pendingOrders > 0 && (
                <span className="flex items-center text-xs font-bold text-white bg-red-500 shadow-lg shadow-red-200 px-3 py-1 rounded-full animate-pulse">
                  {stats.pendingOrders} New
                </span>
              )}
            </div>
            <div className="text-4xl font-black text-gray-900 tracking-tight">{stats.pendingOrders}</div>
            <div className="text-sm text-gray-500 font-semibold mt-1">Orders to Pack</div>
          </div>

          {/* Low Stock */}
          <div className="glass p-6 rounded-3xl hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-100/50 rounded-2xl text-orange-700">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900 tracking-tight">{stats.lowStockCount}</div>
            <div className="text-sm text-gray-500 font-semibold mt-1">Items Low Stock</div>
          </div>

          {/* Expired / Critical */}
          <div className="glass p-6 rounded-3xl hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-red-100/50 rounded-2xl text-red-700">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
            <div className="text-4xl font-black text-gray-900 tracking-tight">{stats.expiredCount}</div>
            <div className="text-sm text-gray-500 font-semibold mt-1">Expired / Critical</div>
          </div>

        </div>

        {/* 2. MAIN SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up-delay">

          {/* Recent Activity Feed */}
          <div className="lg:col-span-2 glass rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-xl flex items-center gap-2 text-gray-800">
                <Activity className="text-blue-500" size={20} />
                Recent Activity
              </h3>
              <button className="text-sm text-primary font-bold hover:underline">View All</button>
            </div>

            <div className="space-y-6">
              {recentActivity.length === 0 ? (
                <div className="text-center py-12 text-gray-400 italic bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  No activity yet. Start by scanning an invoice!
                </div>
              ) : (
                recentActivity.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-4 items-start group">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${item.color.replace('bg-', 'bg-opacity-20 bg-')}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">{item.title}</h4>
                          <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Actions / Financials */}
          <div className="glass rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-xl mb-6 text-gray-800">Financial Health</h3>

              <div className="space-y-4">
                <div className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-bold">Gross Sales</span>
                    <span className="text-emerald-700 bg-emerald-100 text-xs px-2 py-1 rounded-md font-bold">+5%</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900 tracking-tight">$12,450.00</div>
                </div>

                <div className="p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 font-bold">Est. Inventory Value</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900 tracking-tight">$45,200.00</div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                <span>Monthly Goal</span>
                <span>70%</span>
              </div>
              <div className="w-full bg-gray-100/80 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full w-[70%] rounded-full shadow-lg shadow-blue-200"></div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}