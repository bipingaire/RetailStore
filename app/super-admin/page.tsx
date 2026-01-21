'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Crown, Package, Building2, Users, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const products = await apiClient.getProducts({});
        setStats({
          totalProducts: products.length,
          totalTenants: 0, // TODO: Add tenant count endpoint
        });
      } catch (error: any) {
        console.error('Error loading stats:', error);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <div className="bg-yellow-400 p-3 rounded-full">
            <Crown size={32} className="text-purple-900" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">SuperAdmin Dashboard</h1>
            <p className="text-purple-200">Global system overview</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white/70 text-sm font-medium">Global Products</h3>
                <p className="text-3xl font-black text-white">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white/70 text-sm font-medium">Active Tenants</h3>
                <p className="text-3xl font-black text-white">{stats.totalTenants}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-500 p-3 rounded-lg">
                <TrendingUp className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white/70 text-sm font-medium">System Health</h3>
                <p className="text-3xl font-black text-green-400">100%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="/super-admin/products" className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition text-center">
              <Package className="mx-auto mb-3 text-blue-600" size={40} />
              <h3 className="font-bold text-blue-900">Manage Products</h3>
              <p className="text-sm text-blue-600 mt-1">Global catalog</p>
            </a>
            <a href="/super-admin/stores" className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition text-center">
              <Building2 className="mx-auto mb-3 text-green-600" size={40} />
              <h3 className="font-bold text-green-900">Manage Stores</h3>
              <p className="text-sm text-green-600 mt-1">Tenant management</p>
            </a>
            <a href="/super-admin/pending-products" className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl hover:shadow-lg transition text-center">
              <Users className="mx-auto mb-3 text-yellow-600" size={40} />
              <h3 className="font-bold text-yellow-900">Pending Products</h3>
              <p className="text-sm text-yellow-600 mt-1">Needs review</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}