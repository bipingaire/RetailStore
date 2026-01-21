'use client';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { AlertTriangle, TrendingDown, Calendar, Package, ChevronRight, Sparkles, Zap, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface HealthMetrics {
    total_items: number;
    low_stock_count: number;
    out_of_stock_count: number;
    expiring_soon_count: number;
    slow_moving_count: number;
    overstocked_count: number;
    health_score: number;
    low_stock: any[];
    overstocked: any[];
    out_of_stock: any[];
}

export default function InventoryHealthPage() {
    const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHealthData();
    }, []);

    async function loadHealthData() {
        setLoading(true);
        try {
            const data: any = await apiClient.getInventoryHealth();
            setMetrics(data);
        } catch (error: any) {
            console.error('Error loading inventory health:', error);
            toast.error('Failed to load inventory health data');
        } finally {
            setLoading(false);
        }
    }

    if (loading || !metrics) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-300/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header with Glassmorphism */}
                <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                                <Package className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white">Inventory Health</h1>
                                <p className="text-blue-200 mt-1">AI-powered analytics & recommendations</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Health Score - Hero Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-1 shadow-2xl">
                    <div className="bg-gradient-to-br from-emerald-900/90 via-teal-900/90 to-cyan-900/90 backdrop-blur-xl rounded-3xl p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Zap className="text-yellow-300 animate-pulse" size={28} />
                                    <span className="text-lg font-semibold text-emerald-100">Overall Health Score</span>
                                </div>
                                <div className="text-8xl font-black text-white mb-2 tracking-tight">{metrics.health_score}%</div>
                                <div className="flex items-center gap-2 text-emerald-200 text-lg">
                                    {metrics.health_score >= 80 ? (
                                        <><span className="text-2xl">✓</span> Excellent Health</>
                                    ) : metrics.health_score >= 60 ? (
                                        <><AlertTriangle size={20} /> Needs Attention</>
                                    ) : (
                                        <><AlertTriangle size={20} /> Critical</>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-emerald-200 text-lg mb-2">Total SKUs</div>
                                <div className="text-6xl font-black text-white">{metrics.total_items}</div>
                                <div className="text-emerald-300 mt-2">Products Tracked</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alert Metrics - Premium Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                    {/* Overstocked */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                                    <TrendingDown className="text-white" size={24} />
                                </div>
                                <span className="text-sm font-bold text-amber-900 uppercase tracking-wide">Overstocked</span>
                            </div>
                            <div className="text-5xl font-black text-amber-900 mb-2">{metrics.overstocked_count}</div>
                            <div className="text-amber-700 font-semibold">Consider promotion</div>
                        </div>
                    </div>

                    {/* Expiring Soon (Placeholder - Backend support pending) */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                                    <Calendar className="text-white" size={24} />
                                </div>
                                <span className="text-sm font-bold text-rose-900 uppercase tracking-wide">Expiring Soon</span>
                            </div>
                            <div className="text-5xl font-black text-rose-900 mb-2">{metrics.expiring_soon_count || 0}</div>
                            <div className="text-rose-700 font-semibold">Within 30 days</div>
                        </div>
                    </div>

                    {/* Low Stock */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-700 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-red-500 to-red-700 rounded-xl shadow-lg animate-pulse">
                                    <AlertTriangle className="text-white" size={24} />
                                </div>
                                <span className="text-sm font-bold text-red-900 uppercase tracking-wide">Low Stock</span>
                            </div>
                            <div className="text-5xl font-black text-red-900 mb-2">{metrics.low_stock_count}</div>
                            <div className="text-red-700 font-semibold">Reorder needed</div>
                        </div>
                    </div>

                    {/* Out of Stock */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl shadow-lg">
                                    <Package className="text-white" size={24} />
                                </div>
                                <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">Out of Stock</span>
                            </div>
                            <div className="text-5xl font-black text-slate-900 mb-2">{metrics.out_of_stock_count}</div>
                            <div className="text-slate-700 font-semibold">Urgent restock</div>
                        </div>
                    </div>
                </div>

                {/* Overstocked Products Table */}
                <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-white" size={28} />
                                <h3 className="text-2xl font-bold text-white">Overstocked Items</h3>
                            </div>
                            <span className="px-4 py-2 bg-white/20 rounded-full text-white font-semibold">{metrics.overstocked.length} items</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-blue-200 uppercase tracking-wider">Product ID</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-blue-200 uppercase tracking-wider">Current Stock</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-blue-200 uppercase tracking-wider">Reorder Level</th>
                                    <th className="text-center px-6 py-4 text-xs font-bold text-blue-200 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {metrics.overstocked.map((item: any) => (
                                    <tr key={item.inventory_id} className="hover:bg-white/5 transition-colors duration-150">
                                        <td className="px-6 py-4 text-sm font-semibold text-white">{item.product_id?.substring(0, 8)}...</td>
                                        <td className="px-6 py-4 text-sm text-right text-blue-200">{item.quantity}</td>
                                        <td className="px-6 py-4 text-sm text-right text-blue-200">{item.reorder_level}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => window.location.href = `/admin/campaigns/create?inventory_id=${item.inventory_id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                Create Promo
                                                <ChevronRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AI Recommendations - Glassmorphism */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="text-yellow-300 animate-pulse" size={32} />
                            <h3 className="text-2xl font-bold text-white">AI Recommendations</h3>
                        </div>
                        <ul className="space-y-3">
                            {metrics.overstocked_count > 0 && (
                                <li className="flex items-start gap-3 text-white">
                                    <span className="text-yellow-300 text-xl">•</span>
                                    <span className="text-lg">Create promotional campaigns for <strong>{metrics.overstocked_count} overstocked items</strong> to free up capital</span>
                                </li>
                            )}
                            {metrics.low_stock_count > 5 && (
                                <li className="flex items-start gap-3 text-white">
                                    <span className="text-yellow-300 text-xl">•</span>
                                    <span className="text-lg"><strong>{metrics.low_stock_count} items</strong> below reorder point - generate purchase orders</span>
                                </li>
                            )}
                            {metrics.health_score >= 80 && (
                                <li className="flex items-start gap-3 text-emerald-200">
                                    <span className="text-emerald-300 text-xl">✓</span>
                                    <span className="text-lg font-semibold">Inventory is well-balanced. Continue monitoring weekly.</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}
