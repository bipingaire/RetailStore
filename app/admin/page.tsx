'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Package, TrendingUp, AlertCircle, DollarSign, Users, ShoppingCart, Activity, ScanLine, Megaphone, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [inventory, orders, analytics, campaigns] = await Promise.all([
          apiClient.getInventory({ low_stock: false }) as Promise<any[]>,
          apiClient.getOrders({}) as Promise<any[]>,
          apiClient.getInventoryHealth() as Promise<any>,
          apiClient.getCampaigns() as Promise<any[]>,
        ]);

        const totalRevenue = orders?.reduce((acc: number, order: any) => acc + (parseFloat(order.total_amount) || 0), 0) || 0;
        const pendingOrders = orders?.filter((o: any) => o.order_status === 'pending') || [];

        setRecentOrders(orders?.slice(0, 5) || []);

        setStats({
          revenue: totalRevenue,
          lowStock: inventory?.filter((i: any) => i.quantity_on_hand < 10).length || 0,
          pendingOrdersCount: pendingOrders.length,
          activeCampaigns: campaigns?.length || 0, // Assuming all returned are active for now
        });
      } catch (error: any) {
        console.error('Error loading dashboard:', error);
        toast.error('Failed to load dashboard');
        setStats({
          revenue: 0,
          lowStock: 0,
          pendingOrdersCount: 0,
          activeCampaigns: 0,
        });
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Greensboro Store Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your retail performance.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push('/admin/invoices')} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <ScanLine size={18} />
              Scan Invoice
            </button>
            <button onClick={() => router.push('/admin/campaigns')} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Megaphone size={18} />
              New Campaign
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-medium">Total Revenue</span>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+12.5%</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={28} className="text-gray-900" />
              <span className="text-3xl font-black text-gray-900">{stats?.revenue?.toLocaleString() || '0'}</span>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-medium">Pending Orders</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{stats?.pendingOrdersCount || 0}</h3>
            <p className="text-sm text-gray-500">Orders to fulfill</p>
          </div>

          {/* Low Stock Items */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-orange-500"><AlertCircle size={18} /></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-medium">Low Stock Items</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{stats?.lowStock || 0}</h3>
            <p className="text-sm text-gray-500">Requires attention</p>
          </div>

          {/* Active Campaigns */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-purple-500"><TrendingUp size={18} /></div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-medium">Active Campaigns</span>
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{stats?.activeCampaigns || 0}</h3>
            <p className="text-sm text-gray-500">Live promotions</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <Link href="/admin/orders" className="text-blue-600 text-sm font-semibold hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3">Order #</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <tr key={order.order_id} className="text-sm text-gray-700">
                        <td className="py-4 font-medium text-gray-900">#{order.order_id.substring(0, 8)}...</td>
                        <td className="py-4">{order.customer_id ? 'Customer' : 'Guest'}</td>
                        <td className="py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${order.order_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              order.order_status === 'completed' ? 'bg-green-100 text-green-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 text-right font-bold">${parseFloat(order.total_amount).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">No recent orders</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            {/* Weekly Sales Trend Placeholder */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-[300px]">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Weekly Sales Trend</h2>
              <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-4">
                {/* Mock Bars */}
                {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
                  <div key={i} className="w-full bg-blue-50 rounded-t-sm hover:bg-blue-100 transition-all relative group">
                    <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm opacity-20 group-hover:opacity-100 transition-all"></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-medium px-2">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link href="/admin/inventory" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 group transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <Package size={18} />
                    </div>
                    <span className="font-medium text-gray-700">Inventory</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}