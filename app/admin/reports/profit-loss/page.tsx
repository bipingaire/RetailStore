'use client';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { DollarSign, TrendingUp, TrendingDown, Package, Sparkles, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner';

interface ProfitMetrics {
    revenue: number;
    cogs: number;
    grossProfit: number;
    expenses: number;
    netProfit: number;
    grossMargin: number;
    netMargin: number;
}

export default function ProfitLossPage() {
    const [metrics, setMetrics] = useState<ProfitMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30');

    useEffect(() => {
        loadMetrics();
    }, [dateRange]);

    async function loadMetrics() {
        setLoading(true);

        try {
            const data: any = await apiClient.getProfitSummary(parseInt(dateRange));

            // Map API response to UI model
            setMetrics({
                revenue: data.revenue,
                cogs: data.cost_of_goods_sold,
                grossProfit: data.gross_profit,
                expenses: data.total_expenses,
                netProfit: data.net_profit,
                grossMargin: data.gross_margin_percent,
                netMargin: data.net_margin_percent
            });
        } catch (error: any) {
            console.error('Error loading profit metrics:', error);
            toast.error('Failed to load profit data');
        } finally {
            setLoading(false);
        }
    }

    if (loading || !metrics) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-purple-300/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <DollarSign className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400 animate-pulse" size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                                <DollarSign className="text-white" size={36} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white">Profit & Loss</h1>
                                <p className="text-purple-200 mt-1">Financial performance overview</p>
                            </div>
                        </div>

                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <option value="7" className="text-black">Last 7 Days</option>
                            <option value="30" className="text-black">Last 30 Days</option>
                            <option value="90" className="text-black">Last 90 Days</option>
                            <option value="365" className="text-black">Last Year</option>
                        </select>
                    </div>
                </div>

                {/* Key Metrics - Premium Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Revenue */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 h-full">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-blue-900 uppercase tracking-wide">Revenue</span>
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                                    <DollarSign className="text-white" size={20} />
                                </div>
                            </div>
                            <div className="text-4xl font-black text-blue-900 mb-1">
                                ${metrics.revenue.toFixed(2)}
                            </div>
                            <div className="flex items-center gap-1 text-blue-700">
                                <ArrowUpRight size={16} />
                                <span className="text-sm font-semibold">Total Sales</span>
                            </div>
                        </div>
                    </div>

                    {/* COGS */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 h-full">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-orange-900 uppercase tracking-wide">COGS</span>
                                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                                    <Package className="text-white" size={20} />
                                </div>
                            </div>
                            <div className="text-4xl font-black text-orange-900 mb-1">
                                ${metrics.cogs.toFixed(2)}
                            </div>
                            <div className="flex items-center gap-1 text-orange-700">
                                <ArrowDownRight size={16} />
                                <span className="text-sm font-semibold">Cost of Goods</span>
                            </div>
                        </div>
                    </div>

                    {/* Gross Profit */}
                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 h-full">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-bold text-emerald-900 uppercase tracking-wide">Gross Profit</span>
                                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                                    <TrendingUp className="text-white" size={20} />
                                </div>
                            </div>
                            <div className="text-4xl font-black text-emerald-900 mb-1">
                                ${metrics.grossProfit.toFixed(2)}
                            </div>
                            <div className="text-sm font-semibold text-emerald-700">
                                Margin: {metrics.grossMargin.toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    {/* Net Profit */}
                    <div className={`group relative overflow-hidden rounded-2xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${metrics.netProfit >= 0
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                        : 'bg-gradient-to-br from-red-500 to-rose-600'
                        }`}>
                        <div className={`rounded-2xl p-6 h-full ${metrics.netProfit >= 0
                            ? 'bg-gradient-to-br from-purple-50 to-pink-50'
                            : 'bg-gradient-to-br from-red-50 to-rose-50'
                            }`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-sm font-bold uppercase tracking-wide ${metrics.netProfit >= 0 ? 'text-purple-900' : 'text-red-900'
                                    }`}>Net Profit</span>
                                <div className={`p-2 rounded-lg ${metrics.netProfit >= 0
                                    ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                                    : 'bg-gradient-to-br from-red-500 to-rose-600'
                                    }`}>
                                    {metrics.netProfit >= 0 ? (
                                        <TrendingUp className="text-white" size={20} />
                                    ) : (
                                        <TrendingDown className="text-white" size={20} />
                                    )}
                                </div>
                            </div>
                            <div className={`text-4xl font-black mb-1 ${metrics.netProfit >= 0 ? 'text-purple-900' : 'text-red-900'
                                }`}>
                                ${Math.abs(metrics.netProfit).toFixed(2)}
                            </div>
                            <div className={`text-sm font-semibold ${metrics.netProfit >= 0 ? 'text-purple-700' : 'text-red-700'
                                }`}>
                                Margin: {metrics.netMargin.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Income Statement */}
                    <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-white/10">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Zap className="text-yellow-300" size={24} />
                                Income Statement
                            </h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex justify-between py-3 border-b border-white/10">
                                <span className="text-blue-200 font-medium">Revenue</span>
                                <span className="font-bold text-white text-lg">${metrics.revenue.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between py-3 border-b border-white/10">
                                <span className="text-blue-200 font-medium">Cost of Goods Sold (COGS)</span>
                                <span className="font-bold text-red-400 text-lg">-${metrics.cogs.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between py-4 bg-emerald-500/20 rounded-xl px-4 border border-emerald-400/30">
                                <span className="font-bold text-emerald-100">Gross Profit</span>
                                <span className="font-bold text-emerald-300 text-xl">${metrics.grossProfit.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between py-3 border-b border-white/10">
                                <span className="text-blue-200 font-medium">Operating Expenses</span>
                                <span className="font-bold text-red-400 text-lg">-${metrics.expenses.toFixed(2)}</span>
                            </div>

                            <div className={`flex justify-between py-5 rounded-xl px-4 border-2 ${metrics.netProfit >= 0
                                ? 'bg-purple-500/20 border-purple-400/50'
                                : 'bg-red-500/20 border-red-400/50'
                                }`}>
                                <span className="font-bold text-white text-lg">Net Profit</span>
                                <span className={`font-black text-2xl ${metrics.netProfit >= 0 ? 'text-purple-300' : 'text-red-300'
                                    }`}>
                                    ${Math.abs(metrics.netProfit).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Profit Margins with Bars */}
                    <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
                        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 border-b border-white/10">
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Sparkles className="text-yellow-300 animate-pulse" size={24} />
                                Profit Margins
                            </h3>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Gross Margin */}
                            <div>
                                <div className="flex justify-between mb-3">
                                    <span className="text-blue-200 font-semibold">Gross Margin</span>
                                    <span className="text-emerald-300 font-bold text-lg">{metrics.grossMargin.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-emerald-400 to-teal-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                                        style={{ width: `${Math.min(metrics.grossMargin, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Net Margin */}
                            <div>
                                <div className="flex justify-between mb-3">
                                    <span className="text-blue-200 font-semibold">Net Margin</span>
                                    <span className={`font-bold text-lg ${metrics.netMargin >= 0 ? 'text-purple-300' : 'text-red-300'
                                        }`}>
                                        {metrics.netMargin.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                                    <div
                                        className={`h-4 rounded-full transition-all duration-1000 ease-out shadow-lg ${metrics.netMargin >= 0
                                            ? 'bg-gradient-to-r from-purple-400 to-pink-500'
                                            : 'bg-gradient-to-r from-red-400 to-rose-500'
                                            }`}
                                        style={{ width: `${Math.min(Math.abs(metrics.netMargin), 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Expense Ratio */}
                            <div>
                                <div className="flex justify-between mb-3">
                                    <span className="text-blue-200 font-semibold">Expense Ratio</span>
                                    <span className="text-orange-300 font-bold text-lg">
                                        {metrics.revenue > 0 ? ((metrics.expenses / metrics.revenue) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-orange-400 to-red-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                                        style={{ width: `${Math.min((metrics.expenses / metrics.revenue) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Insights */}
                            <div className="mt-8 p-5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-400/30">
                                <h4 className="font-bold text-blue-100 mb-3 flex items-center gap-2">
                                    <Sparkles size={18} className="text-yellow-300" />
                                    Insights
                                </h4>
                                <ul className="text-sm text-blue-100 space-y-2">
                                    {metrics.grossMargin > 30 && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-400">✓</span>
                                            <span>Healthy gross margin above 30%</span>
                                        </li>
                                    )}
                                    {metrics.grossMargin < 20 && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-yellow-400">⚠</span>
                                            <span>Low gross margin - review pricing or COGS</span>
                                        </li>
                                    )}
                                    {metrics.netProfit < 0 && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-red-400">⚠</span>
                                            <span>Negative net profit - reduce expenses</span>
                                        </li>
                                    )}
                                    {(metrics.expenses / metrics.revenue) > 0.4 && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-400">⚠</span>
                                            <span>High expense ratio - optimize operations</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
