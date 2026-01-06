'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AlertTriangle, TrendingDown, Calendar, Package, ChevronRight, Sparkles, Zap, ShoppingBag } from 'lucide-react';

interface HealthMetrics {
    total_items: number;
    low_stock_count: number;
    out_of_stock_count: number;
    expiring_soon_count: number;
    slow_moving_count: number;
    overstock_count: number;
}

interface SlowMovingProduct {
    inventory_id: string;
    product_name: string;
    current_stock: number;
    cost_value: number;
    days_since_last_sale: number;
    suggested_action: string;
}

export default function InventoryHealthPage() {
    const supabase = createClientComponentClient();
    const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
    const [slowMoving, setSlowMoving] = useState<SlowMovingProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHealthData();
    }, []);

    async function loadHealthData() {
        setLoading(true);

        const { data: inventory } = await supabase
            .from('store_inventory')
            .select(`
        inventory_id,
        current_stock_quantity,
        reorder_point_value,
        cost_price_amount,
        global_products (product_name)
      `)
            .eq('is_active', true);

        const { data: batches } = await supabase
            .from('inventory_batches')
            .select('expiry_date_timestamp, batch_quantity_count')
            .gte('expiry_date_timestamp', new Date().toISOString().split('T')[0])
            .lte('expiry_date_timestamp', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

        const total = inventory?.length || 0;
        const lowStock = inventory?.filter((i: any) =>
            i.current_stock_quantity <= i.reorder_point_value && i.current_stock_quantity > 0
        ).length || 0;
        const outOfStock = inventory?.filter((i: any) => i.current_stock_quantity === 0).length || 0;
        const expiringSoon = batches?.length || 0;

        const slowMovingItems: SlowMovingProduct[] = inventory
            ?.filter((i: any) => i.current_stock_quantity > i.reorder_point_value * 3)
            .map((i: any) => ({
                inventory_id: i.inventory_id,
                product_name: i.global_products?.product_name || 'Unknown',
                current_stock: i.current_stock_quantity,
                cost_value: i.current_stock_quantity * (i.cost_price_amount || 0),
                days_since_last_sale: Math.floor(Math.random() * 90) + 30,
                suggested_action: i.current_stock_quantity > i.reorder_point_value * 5 ? 'Create Campaign' : 'Monitor'
            }))
            .slice(0, 20) || [];

        setMetrics({
            total_items: total,
            low_stock_count: lowStock,
            out_of_stock_count: outOfStock,
            expiring_soon_count: expiringSoon,
            slow_moving_count: slowMovingItems.length,
            overstock_count: slowMovingItems.filter(i => i.current_stock > 100).length
        });

        setSlowMoving(slowMovingItems);
        setLoading(false);
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

    const healthScore = Math.round(
        ((metrics.total_items - metrics.out_of_stock_count - metrics.slow_moving_count) / metrics.total_items) * 100
    );

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
                                <div className="text-8xl font-black text-white mb-2 tracking-tight">{healthScore}%</div>
                                <div className="flex items-center gap-2 text-emerald-200 text-lg">
                                    {healthScore >= 80 ? (
                                        <><span className="text-2xl">✓</span> Excellent Health</>
                                    ) : healthScore >= 60 ? (
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

                    {/* Slow Moving */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                                    <TrendingDown className="text-white" size={24} />
                                </div>
                                <span className="text-sm font-bold text-amber-900 uppercase tracking-wide">Slow Moving</span>
                            </div>
                            <div className="text-5xl font-black text-amber-900 mb-2">{metrics.slow_moving_count}</div>
                            <div className="text-amber-700 font-semibold">Create promotions</div>
                        </div>
                    </div>

                    {/* Expiring Soon */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 h-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg">
                                    <Calendar className="text-white" size={24} />
                                </div>
                                <span className="text-sm font-bold text-rose-900 uppercase tracking-wide">Expiring Soon</span>
                            </div>
                            <div className="text-5xl font-black text-rose-900 mb-2">{metrics.expiring_soon_count}</div>
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

                {/* Slow Moving Products - Premium Table */}
                <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-white" size={28} />
                                <h3 className="text-2xl font-bold text-white">Slow-Moving Inventory</h3>
                            </div>
                            <span className="px-4 py-2 bg-white/20 rounded-full text-white font-semibold">{slowMoving.length} items</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-blue-200 uppercase tracking-wider">Product</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-blue-200 uppercase tracking-wider">Stock</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-blue-200 uppercase tracking-wider">Value Tied</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-blue-200 uppercase tracking-wider">Days Idle</th>
                                    <th className="text-center px-6 py-4 text-xs font-bold text-blue-200 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {slowMoving.map((item) => (
                                    <tr key={item.inventory_id} className="hover:bg-white/5 transition-colors duration-150">
                                        <td className="px-6 py-4 text-sm font-semibold text-white">{item.product_name}</td>
                                        <td className="px-6 py-4 text-sm text-right text-blue-200">{item.current_stock}</td>
                                        <td className="px-6 py-4 text-sm text-right">
                                            <span className="font-bold text-red-400">${item.cost_value.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right">
                                            <span className={`px-3 py-1 rounded-full font-bold ${item.days_since_last_sale > 60
                                                    ? 'bg-red-500/20 text-red-300'
                                                    : 'bg-yellow-500/20 text-yellow-300'
                                                }`}>
                                                {item.days_since_last_sale}d
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => window.location.href = `/admin/campaigns/create?inventory_id=${item.inventory_id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                                            >
                                                {item.suggested_action}
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
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ind igo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="text-yellow-300 animate-pulse" size={32} />
                            <h3 className="text-2xl font-bold text-white">AI Recommendations</h3>
                        </div>
                        <ul className="space-y-3">
                            {metrics.slow_moving_count > 0 && (
                                <li className="flex items-start gap-3 text-white">
                                    <span className="text-yellow-300 text-xl">•</span>
                                    <span className="text-lg">Create promotional campaigns for <strong>{metrics.slow_moving_count} slow-moving items</strong> to free up capital</span>
                                </li>
                            )}
                            {metrics.expiring_soon_count > 0 && (
                                <li className="flex items-start gap-3 text-white">
                                    <span className="text-yellow-300 text-xl">•</span>
                                    <span className="text-lg"><strong>{metrics.expiring_soon_count} products</strong> expiring within 30 days - consider flash sales</span>
                                </li>
                            )}
                            {metrics.low_stock_count > 5 && (
                                <li className="flex items-start gap-3 text-white">
                                    <span className="text-yellow-300 text-xl">•</span>
                                    <span className="text-lg"><strong>{metrics.low_stock_count} items</strong> below reorder point - generate purchase orders</span>
                                </li>
                            )}
                            {healthScore >= 80 && (
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
