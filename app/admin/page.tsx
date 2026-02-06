'use client';
import { useEffect, useState } from 'react';
import {
  TrendingUp, Users, Package, AlertCircle,
  Clock, ArrowRight, DollarSign, ShoppingBag,
  MoreHorizontal, ArrowUpRight, Search
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    lowStock: 0,
    activeCampaigns: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. KPIs
        // Low Stock
        const { count: lowStock } = await supabase
          .from('retail-store-inventory-item')
          .select('reorder-point-quantity', { count: 'exact', head: true })
          .eq('is-active-flag', true)
          .lt('current-stock-quantity', 10);

        // Pending Orders
        const { count: pendingOrders } = await supabase
          .from('customer-order-header')
          .select('*', { count: 'exact', head: true })
          .eq('order-status-code', 'pending');

        // Active Campaigns (Promos)
        const { count: activeCampaigns } = await supabase
          .from('marketing-campaign-master')
          .select('*', { count: 'exact', head: true })
          .eq('is-active-flag', true);

        // 2. Recent Orders Table
        const { data: orders } = await supabase
          .from('customer-order-header')
          .select('*')
          .order('order-date-time', { ascending: false })
          .limit(5);

        // 3. Mock Revenue (until Sales Sync is full)
        const mockRevenue = 12450.00;

        setStats({
          revenue: mockRevenue,
          orders: pendingOrders || 0,
          lowStock: lowStock || 0,
          activeCampaigns: activeCampaigns || 0
        });

        setRecentOrders(orders || []);
      } catch (err) {
        console.error('Dashboard load error', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Simple CSS Chart Helper
  const chartData = [45, 60, 75, 50, 80, 95, 85]; // Mock data
  const maxVal = Math.max(...chartData);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* 1. HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-sm text-gray-500">Overview of your retail performance.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/invoices"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            >
              Scan Invoice
            </Link>
            <Link
              href="/admin/sale"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
            >
              <ArrowUpRight size={16} />
              New Campaign
            </Link>
          </div>
        </div>

        {/* 2. KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Revenue */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-500">Total Revenue</span>
              <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">+12.5%</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-500">Pending Orders</span>
              {stats.orders > 0 && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.orders}</div>
              <div className="text-xs text-gray-500 mt-1">Orders to fulfill</div>
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-500">Low Stock Items</span>
              <AlertCircle size={16} className={stats.lowStock > 0 ? "text-amber-500" : "text-gray-300"} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.lowStock}</div>
              <div className="text-xs text-gray-500 mt-1">Requires attention</div>
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-500">Active Campaigns</span>
              <span className="text-purple-600 bg-purple-50 p-1 rounded-md"><TrendingUp size={14} /></span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</div>
              <div className="text-xs text-gray-500 mt-1">Live promotions</div>
            </div>
          </div>

        </div>

        {/* 3. MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Recent Orders</h3>
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">Order #</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading orders...</td></tr>
                  ) : recentOrders.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No recent orders found.</td></tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order['order-id']} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          #{order['order-id'].substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {order['customer-phone'] || 'Guest'}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(order['order-date-time']).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-50 text-green-700' :
                            order.status === 'pending' ? 'bg-blue-50 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                          ${order['final-amount']?.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: Sales Chart & Actions */}
          <div className="space-y-6">

            {/* Sales Chart (CSS-only) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-6">Weekly Sales Trend</h3>

              <div className="h-48 flex items-end justify-between gap-2">
                {chartData.map((val, i) => (
                  <div key={i} className="w-full flex flex-col justify-end group relative">
                    <div
                      className="w-full bg-blue-100 rounded-t-sm hover:bg-blue-500 transition-colors duration-300 relative group-hover:shadow-lg"
                      style={{ height: `${(val / maxVal) * 100}%` }}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ${(val * 10).toFixed(0)}
                      </div>
                    </div>
                    <span className="text-xs text-center text-gray-400 mt-2">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/admin/inventory" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-600 transition-colors">
                  <span className="flex items-center gap-2"><Package size={16} /> Inventory</span>
                  <ArrowRight size={14} className="text-gray-400" />
                </Link>
                <Link href="/admin/settings" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-600 transition-colors">
                  <span className="flex items-center gap-2"><MoreHorizontal size={16} /> Settings</span>
                  <ArrowRight size={14} className="text-gray-400" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}