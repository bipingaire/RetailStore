'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Store, Package, TrendingUp, ShoppingBag, Users, Clock } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DashboardStats {
    totalStores: number;
    activeStores: number;
    totalProducts: number;
    pendingProducts: number;
    totalOrders: number;
    recentActivity: any[];
}

export default function SuperadminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalStores: 0,
        activeStores: 0,
        totalProducts: 0,
        pendingProducts: 0,
        totalOrders: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        try {
            // Fetch stores
            const { data: stores } = await supabase
                .from('retail-store-tenant')
                .select('*');

            // Fetch products
            const { data: products } = await supabase
                .from('global-product-master-catalog')
                .select('product-id');

            // Fetch pending products
            const { data: pending } = await supabase
                .from('pending-product-additions')
                .select('pending-id')
                .eq('status', 'pending');

            // Fetch recent orders across all stores
            const { data: orders } = await supabase
                .from('customer-order-header')
                .select('order-id');

            // Fetch recent activity (product enrichments)
            const { data: activity } = await supabase
                .from('product-enrichment-history')
                .select(`
          enrichment-id,
          enrichment-type,
          created-at,
          product-id,
          global-product-master-catalog (product-name)
        `)
                .order('created-at', { ascending: false })
                .limit(10);

            setStats({
                totalStores: stores?.length || 0,
                activeStores: stores?.filter(s => s['is-active'])?.length || 0,
                totalProducts: products?.length || 0,
                pendingProducts: pending?.length || 0,
                totalOrders: orders?.length || 0,
                recentActivity: activity || []
            });

            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-500">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Superadmin Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage all retail stores and master catalog</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Stores"
                    value={stats.totalStores}
                    subtitle={`${stats.activeStores} active`}
                    icon={<Store className="w-6 h-6" />}
                    color="bg-blue-500"
                    href="/superadmin/stores"
                />

                <StatCard
                    title="Master Catalog"
                    value={stats.totalProducts}
                    subtitle="products"
                    icon={<Package className="w-6 h-6" />}
                    color="bg-green-500"
                    href="/superadmin/products"
                />

                <StatCard
                    title="Pending Review"
                    value={stats.pendingProducts}
                    subtitle="new products"
                    icon={<Clock className="w-6 h-6" />}
                    color="bg-amber-500"
                    href="/superadmin/pending-products"
                />

                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    subtitle="across all stores"
                    icon={<ShoppingBag className="w-6 h-6" />}
                    color="bg-purple-500"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/superadmin/stores?action=new"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
                    >
                        <Store className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="font-medium text-gray-900">Add New Store</p>
                        <p className="text-xs text-gray-500 mt-1">Create a new retail store</p>
                    </Link>

                    <Link
                        href="/superadmin/products?action=new"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center"
                    >
                        <Package className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="font-medium text-gray-900">Add Product</p>
                        <p className="text-xs text-gray-500 mt-1">Add to master catalog</p>
                    </Link>

                    <Link
                        href="/superadmin/pending-products"
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all text-center relative"
                    >
                        <Clock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="font-medium text-gray-900">Review Queue</p>
                        <p className="text-xs text-gray-500 mt-1">Approve pending products</p>
                        {stats.pendingProducts > 0 && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {stats.pendingProducts}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                    {stats.recentActivity.length === 0 ? (
                        <p className="text-center text-gray-400 py-8">No recent activity</p>
                    ) : (
                        stats.recentActivity.map((activity: any) => (
                            <div
                                key={activity['enrichment-id']}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${activity['enrichment-type'] === 'superadmin' ? 'bg-blue-100 text-blue-600' :
                                            activity['enrichment-type'] === 'ai-generated' ? 'bg-purple-100 text-purple-600' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        <Package className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity['enrichment-type'] === 'superadmin' ? 'Enriched by superadmin' :
                                                activity['enrichment-type'] === 'ai-generated' ? 'AI auto-sync' :
                                                    'Store admin override'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {activity['global-product-master-catalog']?.['product-name'] || 'Product'}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(activity['created-at']).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle, icon, color, href }: any) {
    const content = (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                </div>
                <div className={`${color} p-3 rounded-lg text-white`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}
