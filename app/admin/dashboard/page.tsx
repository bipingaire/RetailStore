'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp, Package } from 'lucide-react';
import SalesAnalytics from '@/components/admin-ui/sales-analytics';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await apiClient.get('/reports/profit/dashboard-stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div className="p-10 text-slate-500">Loading Dashboard...</div>;
  if (!stats) return <div className="p-10 text-red-500">Failed to load data.</div>;

  return (
    <div className="space-y-8 p-6 bg-slate-50 min-h-screen">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your retail performance.</p>
      </div>

      {/* ── 4 KPI Cards ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">All-time store revenue</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-slate-500 mt-1">Orders to fulfill</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
            <p className="text-xs text-slate-500 mt-1">Requires attention</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <p className="text-xs text-slate-500 mt-1">Live promotions</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Orders ────────────────────────────────────────────────── */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-slate-400">No recent orders.</p>
            ) : (
              stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{order.customer}</p>
                  </div>
                  <div className="text-sm font-bold text-slate-900">+${order.amount.toFixed(2)}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                    'bg-amber-100 text-amber-700'
                  }`}>{order.status}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Sales Analytics Section ──────────────────────────────────────── */}
      <div className="border-t border-slate-200 pt-6">
        <SalesAnalytics />
      </div>

    </div>
  );
}
