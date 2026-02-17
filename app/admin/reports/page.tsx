'use client';
import { useEffect, useState } from 'react';
import {
    DollarSign, TrendingUp, TrendingDown, Package,
    ShoppingCart, Calendar, Download, BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



export default function FinancialReportsPage() {
    // Supabase removed - refactor needed
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        inventoryValue: 0,
        profitMargin: 0,
    });
    const [salesData, setSalesData] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    async function loadReports() {
        setLoading(true);

        // TODO: Replace with actual Backend API calls
        // Currently mocking data to remove Supabase dependency and fix crash

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // 1. Mock Orders
        const mockOrders = Array.from({ length: 20 }).map((_, i) => ({
            'final-amount': (Math.random() * 200) + 50,
            'created-at': new Date(Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
        }));

        let totalRevenue = 0;
        let totalOrders = 0;
        let salesByDate: Record<string, number> = {};

        if (mockOrders) {
            totalRevenue = mockOrders.reduce((sum, o) => sum + Number(o['final-amount'] || 0), 0);
            totalOrders = mockOrders.length;

            mockOrders.forEach(order => {
                const date = new Date(order['created-at']).toLocaleDateString();
                salesByDate[date] = (salesByDate[date] || 0) + Number(order['final-amount']);
            });

            setSalesData(
                Object.entries(salesByDate).map(([date, amount]) => ({ date, amount }))
            );
        }

        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // 2. Mock Top Products
        const mockProducts = [
            { name: "Premium Widget A", quantity: 15, revenue: 1500 },
            { name: "Super Gadget X", quantity: 10, revenue: 1200 },
            { name: "Eco Bundle", quantity: 8, revenue: 800 },
            { name: "Basic Tool", quantity: 25, revenue: 500 },
            { name: "Accessory Pack", quantity: 40, revenue: 400 }
        ];
        setTopProducts(mockProducts);

        // 3. Mock Inventory Value
        const totalInventoryValue = 25430.50;

        // 4. Final Calculations
        const profitMargin = 22.5; // Mock fixed margin

        setStats({
            totalRevenue,
            totalOrders,
            avgOrderValue,
            inventoryValue: totalInventoryValue,
            profitMargin: profitMargin,
        });

        setLoading(false);
    }

    const exportToPDF = () => {
        try {
            const doc = new jsPDF();

            // Title
            doc.setFontSize(20);
            doc.text('Financial Reports', 14, 20);
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

            // Summary Stats Table
            autoTable(doc, {
                startY: 35,
                head: [['Metric', 'Value']],
                body: [
                    ['Total Revenue', `$${stats.totalRevenue.toFixed(2)}`],
                    ['Total Orders', stats.totalOrders.toString()],
                    ['Avg Order Value', `$${stats.avgOrderValue.toFixed(2)}`],
                    ['Inventory Value', `$${stats.inventoryValue.toFixed(2)}`],
                    ['Profit Margin', `${stats.profitMargin}%`]
                ],
            });

            // Top Products Table
            if (topProducts.length > 0) {
                autoTable(doc, {
                    startY: (doc as any).lastAutoTable.finalY + 10,
                    head: [['Rank', 'Product', 'Units Sold', 'Revenue']],
                    body: topProducts.map((p, idx) => [
                        (idx + 1).toString(),
                        p.name,
                        p.quantity.toString(),
                        `$${p.revenue.toFixed(2)}`
                    ]),
                });
            }

            doc.save(`financial-report-${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('PDF report downloaded!');
        } catch (error: any) {
            toast.error('Failed to generate PDF: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900">Financial Reports</h1>
                        <p className="text-gray-500">Comprehensive business analytics</p>
                    </div>
                    <button
                        onClick={exportToPDF}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                    >
                        <Download size={20} />
                        Export PDF
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                                <TrendingUp size={14} />
                                +12%
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">
                            ${stats.totalRevenue.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Total Revenue</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-blue-600">
                                <TrendingUp size={14} />
                                +8%
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">
                            {stats.totalOrders}
                        </div>
                        <div className="text-sm text-gray-500">Total Orders</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <BarChart3 className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">
                            ${stats.avgOrderValue.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Avg Order Value</div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <Package className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1">
                            ${stats.inventoryValue.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Inventory Value</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                    {/* Sales Trend Chart (Simple Bar Chart) */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <TrendingUp className="text-green-600" />
                            Sales Trend
                        </h2>
                        <div className="space-y-3">
                            {salesData.slice(0, 7).map((item, idx) => {
                                const maxAmount = Math.max(...salesData.map(d => d.amount));
                                const percentage = (item.amount / maxAmount) * 100;

                                return (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{item.date}</span>
                                            <span className="font-bold text-green-700">${item.amount.toFixed(2)}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-green-600 h-full rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {salesData.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                                No sales data available yet  </div>
                        )}
                    </div>

                    {/* Profit Margin */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Profit Analysis</h2>

                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Gross Profit Margin</span>
                                <span className="text-2xl font-black text-green-700">{stats.profitMargin}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-green-600 h-full"
                                    style={{ width: `${stats.profitMargin}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-gray-700">Gross Sales</span>
                                    <span className="font-bold text-green-700">${stats.totalRevenue.toFixed(2)}</span>
                                </div>
                                <div className="text-xs text-gray-500">Revenue from all orders</div>
                            </div>

                            <div className="p-4 bg-orange-50 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-gray-700">Cost of Goods</span>
                                    <span className="font-bold text-orange-700">
                                        ${(stats.totalRevenue * (1 - stats.profitMargin / 100)).toFixed(2)}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500">Based on Inventory Cost at time of sale</div>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-gray-900">Net Profit</span>
                                    <span className="text-xl font-black text-blue-700">
                                        ${(stats.totalRevenue * (stats.profitMargin / 100)).toFixed(2)}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-600">Actual Revenue - COGS</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <BarChart3 className="text-purple-600" />
                        Top Selling Products
                    </h2>

                    {topProducts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Rank</th>
                                        <th className="text-left py-3 px-4 text-sm font-bold text-gray-600">Product</th>
                                        <th className="text-right py-3 px-4 text-sm font-bold text-gray-600">Units Sold</th>
                                        <th className="text-right py-3 px-4 text-sm font-bold text-gray-600">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.map((product, idx) => (
                                        <tr key={idx} className="border-b hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center">
                                                    {idx + 1}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 font-bold text-gray-900">{product.name}</td>
                                            <td className="py-4 px-4 text-right font-bold">{product.quantity}</td>
                                            <td className="py-4 px-4 text-right font-black text-green-700">
                                                ${product.revenue.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            No sales data available yet
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

