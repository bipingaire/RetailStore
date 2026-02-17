'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, TrendingDown, Plus } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { toast } from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ProfitLossPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [expenses, setExpenses] = useState<any[]>([]);
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
    const [loading, setLoading] = useState(true);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [expenseForm, setExpenseForm] = useState({
        category: 'rent',
        amount: 0,
        description: '',
        expenseDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        loadData();
    }, [period]);

    async function loadData() {
        try {
            const [reportsRes, expensesRes] = await Promise.all([
                fetch(`/api/reports/profit?period=${period}`),
                fetch('/api/reports/profit/expenses'),
            ]);

            if (reportsRes.ok) setReports(await reportsRes.json());
            if (expensesRes.ok) setExpenses(await expensesRes.json());
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load profit data');
        } finally {
            setLoading(false);
        }
    }

    async function generateReport() {
        const end = new Date();
        const start = new Date();

        if (period === 'daily') {
            start.setDate(end.getDate() - 1);
        } else if (period === 'weekly') {
            start.setDate(end.getDate() - 7);
        } else {
            start.setMonth(end.getMonth() - 1);
        }

        try {
            const res = await fetch('/api/reports/profit/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startDate: start.toISOString(),
                    endDate: end.toISOString(),
                    period,
                }),
            });

            if (res.ok) {
                toast.success('Report generated!');
                loadData();
            }
        } catch (error) {
            toast.error('Failed to generate report');
        }
    }

    async function addExpense() {
        try {
            const res = await fetch('/api/reports/profit/expense', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expenseForm),
            });

            if (res.ok) {
                toast.success('Expense added!');
                setShowExpenseModal(false);
                setExpenseForm({
                    category: 'rent',
                    amount: 0,
                    description: '',
                    expenseDate: new Date().toISOString().split('T')[0],
                });
                loadData();
            }
        } catch (error) {
            toast.error('Failed to add expense');
        }
    }

    if (loading) return <div className="p-8">Loading profit & loss data...</div>;

    const latestReport = reports[0];
    const chartData = {
        labels: reports.reverse().map((r) => new Date(r.startDate).toLocaleDateString()),
        datasets: [
            {
                label: 'Revenue',
                data: reports.map((r) => Number(r.revenue)),
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
            },
            {
                label: 'Net Profit',
                data: reports.map((r) => Number(r.netProfit)),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
        ],
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profit & Loss</h1>
                    <p className="text-gray-500 mt-1">Bottom line - Track your store's financial performance</p>
                </div>

                <div className="flex gap-3">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as any)}
                        className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>

                    <button
                        onClick={() => setShowExpenseModal(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Expense
                    </button>

                    <button
                        onClick={generateReport}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            {latestReport && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">${Number(latestReport.revenue).toFixed(2)}</p>
                            </div>
                            <DollarSign className="text-green-600" size={32} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">COGS</p>
                                <p className="text-2xl font-bold text-gray-900">${Number(latestReport.cogs).toFixed(2)}</p>
                            </div>
                            <ShoppingBag className="text-orange-600" size={32} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Gross Profit</p>
                                <p className="text-2xl font-bold text-green-600">${Number(latestReport.grossProfit).toFixed(2)}</p>
                                <p className="text-xs text-gray-500 mt-1">{Number(latestReport.grossMargin).toFixed(1)}% margin</p>
                            </div>
                            <TrendingUp className="text-green-600" size={32} />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Net Profit</p>
                                <p className={`text-2xl font-bold ${Number(latestReport.netProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${Number(latestReport.netProfit).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">After expenses: ${Number(latestReport.expenses).toFixed(2)}</p>
                            </div>
                            {Number(latestReport.netProfit) >= 0 ? (
                                <TrendingUp className="text-green-600" size={32} />
                            ) : (
                                <TrendingDown className="text-red-600" size={32} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Profit Trend Chart */}
            {reports.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Profit Trends</h2>
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: { position: 'top' },
                                title: { display: false },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function (value) {
                                            return '$' + value;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Detailed P&L Statement */}
                {latestReport && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Profit & Loss Statement</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b">
                                <span className="font-medium">Revenue</span>
                                <span className="font-mono">${Number(latestReport.revenue).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Cost of Goods Sold</span>
                                <span className="font-mono text-red-600">-${Number(latestReport.cogs).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between py-2 border-b font-semibold">
                                <span>Gross Profit</span>
                                <span className="font-mono text-green-600">${Number(latestReport.grossProfit).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">Operating Expenses</span>
                                <span className="font-mono text-red-600">-${Number(latestReport.expenses).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg">
                                <span>Net Profit</span>
                                <span className={`font-mono ${Number(latestReport.netProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${Number(latestReport.netProfit).toFixed(2)}
                                </span>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mt-4">
                                <div className="text-sm text-gray-600 mb-2">Period</div>
                                <div className="font-medium">
                                    {new Date(latestReport.startDate).toLocaleDateString()} -{' '}
                                    {new Date(latestReport.endDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Expenses */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Recent Expenses</h2>
                    </div>

                    <div className="space-y-2">
                        {expenses.slice(0, 10).map((expense) => (
                            <div key={expense.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                <div>
                                    <div className="font-medium capitalize">{expense.category}</div>
                                    {expense.description && <div className="text-sm text-gray-500">{expense.description}</div>}
                                    <div className="text-xs text-gray-400">{new Date(expense.expenseDate).toLocaleDateString()}</div>
                                </div>
                                <div className="font-mono font-semibold text-red-600">-${Number(expense.amount).toFixed(2)}</div>
                            </div>
                        ))}

                        {expenses.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>No expenses recorded yet.</p>
                                <p className="text-sm">Click "Add Expense" to track operating costs.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Expense Modal */}
            {showExpenseModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6">Add Operating Expense</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    value={expenseForm.category}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                >
                                    <option value="rent">Rent</option>
                                    <option value="salaries">Salaries</option>
                                    <option value="utilities">Utilities</option>
                                    <option value="marketing">Marketing</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={expenseForm.amount}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: parseFloat(e.target.value) })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                                <input
                                    type="text"
                                    value={expenseForm.description}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    placeholder="Brief description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={expenseForm.expenseDate}
                                    onChange={(e) => setExpenseForm({ ...expenseForm, expenseDate: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={addExpense}
                                disabled={expenseForm.amount <= 0}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg"
                            >
                                Add Expense
                            </button>
                            <button
                                onClick={() => setShowExpenseModal(false)}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
