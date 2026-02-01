'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Package, Building2, TrendingUp, Users, Activity, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const products = await apiClient.getProducts({}) as any[];
        // Mocking other stats for now as backend endpoints might not exist
        setStats({
          totalProducts: products.length || 0,
          totalTenants: 12, // Mock
          totalRevenue: 154200, // Mock
          activeUsers: 892 // Mock
        });
      } catch (error: any) {
        console.error('Error loading stats:', error);
        toast.error('Failed to load dashboard');
        setStats({
          totalProducts: 0,
          totalTenants: 0,
          totalRevenue: 0,
          activeUsers: 0
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">Platform Overview</h1>
        <p className="text-slate-500 mt-1">Real-time system performance and metrics.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Active Stores</p>
              <h3 className="text-2xl font-black text-slate-900">{stats?.totalTenants || 0}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-600">
            <TrendingUp size={14} />
            <span>+2 this week</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Global Products</p>
              <h3 className="text-2xl font-black text-slate-900">{stats?.totalProducts || 0}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Synced across all tenants</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Total Users</p>
              <h3 className="text-2xl font-black text-slate-900">{stats?.activeUsers || 0}</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-600">
            <TrendingUp size={14} />
            <span>+12% growth</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">System Load</p>
              <h3 className="text-2xl font-black text-slate-900">Healthy</h3>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>All systems operational</span>
          </div>
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Administrative Actions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/super-admin/products" className="group p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition bg-slate-50/50 hover:bg-white text-left">
              <div className="flex items-center justify-between mb-2">
                <Package className="text-blue-600" size={24} />
                <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-500" />
              </div>
              <h3 className="font-bold text-slate-900">Global Product Catalog</h3>
              <p className="text-sm text-slate-500 mt-1">Manage standard products & UPCs</p>
            </Link>

            <Link href="/super-admin/stores" className="group p-4 rounded-xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition bg-slate-50/50 hover:bg-white text-left">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="text-purple-600" size={24} />
                <ExternalLink size={16} className="text-slate-300 group-hover:text-purple-500" />
              </div>
              <h3 className="font-bold text-slate-900">Tenant Management</h3>
              <p className="text-sm text-slate-500 mt-1">Provision and monitor stores</p>
            </Link>
          </div>
        </div>

        {/* System Activity Log (Mock) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent System Activity</h2>
            <button className="text-sm font-bold text-blue-600 hover:underline">View Log</button>
          </div>

          <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
            {[
              { text: 'New tenant "Mumbai Market" provisioned', time: '2 mins ago', type: 'create' },
              { text: 'Global Product Update: "Nestle KitKat"', time: '15 mins ago', type: 'update' },
              { text: 'System backup completed successfully', time: '1 hour ago', type: 'system' },
            ].map((item, i) => (
              <div key={i} className="relative pl-10">
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10 ${item.type === 'create' ? 'bg-green-100 text-green-600' :
                  item.type === 'update' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                  <div className="w-2 h-2 rounded-full bg-current" />
                </div>
                <p className="text-sm font-medium text-slate-900">{item.text}</p>
                <p className="text-xs text-slate-400">{item.time}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}