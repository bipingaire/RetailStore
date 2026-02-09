'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, BarChart3 } from 'lucide-react';

interface BottomLineMetrics {
    totalRevenue: number;
    totalCOGS: number;
    grossProfit: number;
    grossMargin: number;
    inventoryValue: number;
    potentialRevenue: number;
    deadStockValue: number;
}

export default function BottomLinePage() {
    const [metrics, setMetrics] = useState<BottomLineMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

    useEffect(() => {
        loadMetrics();
    }, [period]);

    async function loadMetrics() {
        try {
            // In production, this would fetch from /api/dashboard/bottom-line
            // For now, calculate from products and sales
            const [productsRes, salesRes] = await Promise.all([
                fetch('http://localhost:3001/api/products', {
                    headers: { 'x-tenant-id': 'retail_store_anuj' },
                }),
                fetch('http://localhost:3001/api/sales', {
                    headers: { 'x-tenant-id': 'retail_store_anuj' },
                }),
            ]);

            if (productsRes.ok && salesRes.ok) {
                const products = await productsRes.json();
                const sales = await salesRes.json();

                // Calculate metrics
                const totalRevenue = sales.reduce((sum: number, sale: any) => sum + Number(sale.total), 0);
                const totalCOGS = sales.reduce((sum: number, sale: any) => {
                    return sum + sale.items.reduce((itemSum: number, item: any) => {
                        const product = products.find((p: any) => p.id === item.productId);
                        return itemSum + (product ? Number(product.costPrice) * item.quantity : 0);
                    }, 0);
                }, 0);

                const grossProfit = totalRevenue - totalCOGS;
                const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

                const inventoryValue = products.reduce((sum: number, p: any) => {
                    return sum + (Number(p.costPrice) * p.stock);
                }, 0);

                const potentialRevenue = products.reduce((sum: number, p: any) => {
                    return sum + (Number(p.price) * p.stock);
                }, 0);

                const deadStockValue = products
                    .filter((p: any) => p.slowMoving && p.stock > 0)
                    .reduce((sum: number, p: any) => sum + (Number(p.costPrice) * p.stock), 0);

                setMetrics({
                    totalRevenue,
                    totalCOGS,
                    grossProfit,
                    grossMargin,
                    inventoryValue,
                    potentialRevenue,
                    deadStockValue,
                });
            }
        } catch (error) {
            console.error('Failed to load metrics:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading profit metrics...</div>
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bottom Line</h1>
                    <p className="text-gray-500 mt-2">Track your store's profitability and inventory value</p>
                </div>
                <div className="flex gap-2">
                    {(['month', 'quarter', 'year'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg transition ${period === p
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <TrendingUp className="w-5 h-5 opacity-75" />
                    </div>
                    <div className="text-sm font-medium opacity-90">Total Revenue</div>
                    <div className="text-3xl font-bold mt-2">{formatCurrency(metrics?.totalRevenue || 0)}</div>
                    <div className="text-xs mt-2 opacity-75">From sales</div>
                </div>

                {/* Gross Profit */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div className="text-sm font-semibold">{metrics?.grossMargin.toFixed(1)}%</div>
                    </div>
                    <div className="text-sm font-medium opacity-90">Gross Profit</div>
                    <div className="text-3xl font-bold mt-2">{formatCurrency(metrics?.grossProfit || 0)}</div>
                    <div className="text-xs mt-2 opacity-75">Revenue - COGS</div>
                </div>

                {/* Inventory Value */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm font-medium opacity-90">Inventory Value</div>
                    <div className="text-3xl font-bold mt-2">{formatCurrency(metrics?.inventoryValue || 0)}</div>
                    <div className="text-xs mt-2 opacity-75">At cost price</div>
                </div>

                {/* Potential Revenue */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-white/20 rounded-lg">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-sm font-medium opacity-90">Potential Revenue</div>
                    <div className="text-3xl font-bold mt-2">{formatCurrency(metrics?.potentialRevenue || 0)}</div>
                    <div className="text-xs mt-2 opacity-75">If all stock sold</div>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Profit Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Profit Breakdown</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Total Revenue</div>
                            <div className="text-sm font-semibold text-gray-900">{formatCurrency(metrics?.totalRevenue || 0)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Cost of Goods Sold (COGS)</div>
                            <div className="text-sm font-semibold text-red-600">-{formatCurrency(metrics?.totalCOGS || 0)}</div>
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold text-gray-900">Gross Profit</div>
                            <div className="text-lg font-bold text-green-600">{formatCurrency(metrics?.grossProfit || 0)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Gross Margin</div>
                            <div className="text-sm font-semibold text-blue-600">{metrics?.grossMargin.toFixed(2)}%</div>
                        </div>
                    </div>
                </div>

                {/* Inventory Health */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Health</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Inventory at Cost</div>
                            <div className="text-sm font-semibold text-gray-900">{formatCurrency(metrics?.inventoryValue || 0)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Potential Revenue</div>
                            <div className="text-sm font-semibold text-green-600">{formatCurrency(metrics?.potentialRevenue || 0)}</div>
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Dead Stock Value</div>
                            <div className="text-sm font-semibold text-red-600">{formatCurrency(metrics?.deadStockValue || 0)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Inventory Turnover</div>
                            <div className="text-sm font-semibold text-blue-600">
                                {metrics?.inventoryValue && metrics.totalCOGS
                                    ? (metrics.totalCOGS / metrics.inventoryValue).toFixed(2) + 'x'
                                    : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 Insights & Recommendations</h2>
                <div className="space-y-3">
                    {metrics && metrics.grossMargin < 30 && (
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                            <div className="text-sm text-gray-700">
                                <span className="font-semibold">Low Margin Alert:</span> Your gross margin is {metrics.grossMargin.toFixed(1)}%.
                                Consider reviewing product pricing or sourcing better deals from vendors.
                            </div>
                        </div>
                    )}
                    {metrics && metrics.deadStockValue > metrics.inventoryValue * 0.2 && (
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                            <div className="text-sm text-gray-700">
                                <span className="font-semibold">Dead Stock Warning:</span> {formatCurrency(metrics.deadStockValue)} tied up in slow-moving inventory.
                                Create clearance campaigns to free up capital.
                            </div>
                        </div>
                    )}
                    {metrics && metrics.grossMargin >= 30 && (
                        <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                            <div className="text-sm text-gray-700">
                                <span className="font-semibold">Healthy Margins:</span> Great job! Your {metrics.grossMargin.toFixed(1)}% gross margin indicates strong profitability.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
