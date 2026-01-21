'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { BarChart, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                // Fetch daily sales from backend (assuming endpoint exists or using orders to calculate)
                const orders = await apiClient.getOrders({ status: 'confirmed' });

                const totalSales = orders.reduce((sum: number, o: any) => sum + parseFloat(o.total_amount), 0);
                const orderCount = orders.length;
                const avgOrder = orderCount > 0 ? totalSales / orderCount : 0;

                setStats({
                    totalSales,
                    orderCount,
                    avgOrder,
                    // Mock data for graph
                    daily: [
                        { date: 'Mon', amount: totalSales * 0.1 },
                        { date: 'Tue', amount: totalSales * 0.2 },
                        { date: 'Wed', amount: totalSales * 0.15 },
                        { date: 'Thu', amount: totalSales * 0.25 },
                        { date: 'Fri', amount: totalSales * 0.3 },
                    ]
                });
            } catch (error: any) {
                console.error('Error loading reports:', error);
                toast.error('Failed to load reports');
            } finally {
                setLoading(false);
            }
        }
        loadStats();
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
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900">Reports & Analytics</h1>
                    <p className="text-gray-500 mt-1">Sales performance and insights</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="text-green-600" size={24} />
                            </div>
                            <span className="font-bold text-gray-500 text-sm">Total Revenue</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900">${stats?.totalSales.toFixed(2)}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <TrendingUp className="text-blue-600" size={24} />
                            </div>
                            <span className="font-bold text-gray-500 text-sm">Total Orders</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900">{stats?.orderCount}</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <BarChart className="text-purple-600" size={24} />
                            </div>
                            <span className="font-bold text-gray-500 text-sm">Avg Order Value</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900">${stats?.avgOrder.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Weekly Sales Trend</h2>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-200">Last 7 Days</button>
                            <button className="px-4 py-2 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-500">Last 30 Days</button>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2">
                        {stats?.daily.map((day: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-blue-100 rounded-t-lg group-hover:bg-blue-200 transition-all relative"
                                    style={{ height: `${(day.amount / stats.totalSales) * 100 * 2}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                        ${day.amount.toFixed(0)}
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-gray-500">{day.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
