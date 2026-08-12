'use client';
import { useEffect, useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  TrendingUp, Package, ShoppingCart, Users, Tag, CreditCard,
  BarChart2, Clock,
} from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
);

// ── Types ────────────────────────────────────────────────────────────────────

interface ProductStat {
  id: string; name: string; sku: string; category: string | null;
  unitsSold: number; revenue: number; salesCount: number;
}
interface DayTrend { date: string; revenue: number; orders: number; avgOrder: number }
interface PaymentBreakdown { method: string; count: number; revenue: number }
interface StatusBreakdown { status: string; count: number }
interface CategoryBreakdown { category: string; unitsSold: number; revenue: number }
interface TopCustomer { name: string; orders: number; spent: number }

interface AnalyticsData {
  period: { days: number; since: string };
  summary: {
    totalRevenue: number; totalOrders: number; totalUnits: number;
    avgOrderValue: number; totalDiscount: number; totalTax: number; uniqueCustomers: number;
  };
  topProductsByUnits: ProductStat[];
  topProductsByRevenue: ProductStat[];
  dailyTrend: DayTrend[];
  paymentBreakdown: PaymentBreakdown[];
  statusBreakdown: StatusBreakdown[];
  categoryBreakdown: CategoryBreakdown[];
  hourlySalesHeatmap: number[];
  topCustomers: TopCustomer[];
}

// ── Palette ──────────────────────────────────────────────────────────────────

const PALETTE = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6','#f97316','#84cc16'];

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#10b981', PENDING: '#f59e0b', CANCELLED: '#ef4444',
  PROCESSING: '#3b82f6', CONFIRMED: '#6366f1', DELIVERED: '#14b8a6', READY: '#84cc16',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtK = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;

function KpiCard({ label, value, icon: Icon, color, sub }: { label: string; value: string; icon: any; color: string; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SalesAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const [productTab, setProductTab] = useState<'units' | 'revenue'>('units');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get(`/sales/analytics?days=${days}`);
      setData(res);
    } catch (e: any) {
      setError(e.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="w-full py-16 flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading sales analytics…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full py-12 flex flex-col items-center gap-2">
        <BarChart2 size={32} className="text-slate-300" />
        <p className="text-sm text-slate-400">{error || 'No data available'}</p>
        <button onClick={load} className="mt-2 px-4 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Retry</button>
      </div>
    );
  }

  const { summary, topProductsByUnits, topProductsByRevenue, dailyTrend,
    paymentBreakdown, statusBreakdown, categoryBreakdown, hourlySalesHeatmap, topCustomers } = data;

  const topProducts = productTab === 'units' ? topProductsByUnits : topProductsByRevenue;
  const maxProduct = topProducts.length > 0
    ? (productTab === 'units' ? topProducts[0].unitsSold : topProducts[0].revenue)
    : 1;

  // ── Chart configs ────────────────────────────────────────────────────────

  const trendLabels = dailyTrend.map(d => {
    const date = new Date(d.date);
    return days <= 7
      ? date.toLocaleDateString('en-US', { weekday: 'short' })
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const trendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Revenue',
        data: dailyTrend.map(d => d.revenue),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.08)',
        borderWidth: 2.5, fill: true, tension: 0.4,
        pointRadius: days <= 14 ? 4 : 2,
        pointBackgroundColor: '#6366f1',
      },
      {
        label: 'Orders',
        data: dailyTrend.map(d => d.orders),
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderWidth: 2, fill: false, tension: 0.4,
        pointRadius: days <= 14 ? 3 : 1.5,
        pointBackgroundColor: '#10b981',
        yAxisID: 'y2',
      },
    ],
  };

  const trendOptions: any = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, pointStyleWidth: 8, font: { size: 11 } } },
      tooltip: { callbacks: { label: (ctx: any) => ctx.datasetIndex === 0 ? ` ${fmt(ctx.raw)}` : ` ${ctx.raw} orders` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { position: 'left', grid: { color: '#f1f5f9' }, ticks: { callback: (v: any) => fmtK(v), font: { size: 11 } } },
      y2: { position: 'right', grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  const categoryChartData = {
    labels: categoryBreakdown.slice(0, 8).map(c => c.category),
    datasets: [{ data: categoryBreakdown.slice(0, 8).map(c => c.revenue), backgroundColor: PALETTE.slice(0, 8), borderRadius: 6 }],
  };
  const categoryOptions: any = {
    indexAxis: 'y', responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => ` ${fmt(ctx.raw)}` } } },
    scales: {
      x: { grid: { color: '#f1f5f9' }, ticks: { callback: (v: any) => fmtK(v), font: { size: 11 } } },
      y: { grid: { display: false }, ticks: { font: { size: 11 } } },
    },
  };

  const paymentChartData = {
    labels: paymentBreakdown.map(p => p.method),
    datasets: [{ data: paymentBreakdown.map(p => p.revenue), backgroundColor: PALETTE, borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }],
  };
  const paymentOptions: any = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, pointStyleWidth: 8, font: { size: 11 }, padding: 14 } },
      tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${fmt(ctx.raw)}` } },
    },
    cutout: '65%',
  };

  const heatmapMax = Math.max(...hourlySalesHeatmap, 1);

  return (
    <div className="space-y-6">

      {/* Header + period selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart2 size={22} className="text-indigo-600" />
            Sales Analytics
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {summary.totalOrders} orders &middot; {summary.totalUnits} units sold &middot; last {days} days
          </p>
        </div>
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          {([7, 30, 90] as const).map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                days === d ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'
              }`}
            >{d}d</button>
          ))}
        </div>
      </div>

      {/* 7-metric KPI bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiCard label="Revenue" value={fmtK(summary.totalRevenue)} icon={TrendingUp} color="#6366f1" />
        <KpiCard label="Orders" value={summary.totalOrders.toLocaleString()} icon={ShoppingCart} color="#10b981" />
        <KpiCard label="Units Sold" value={summary.totalUnits.toLocaleString()} icon={Package} color="#3b82f6" />
        <KpiCard label="Avg Order" value={fmtK(summary.avgOrderValue)} icon={BarChart2} color="#f59e0b" />
        <KpiCard label="Discounts" value={fmtK(summary.totalDiscount)} icon={Tag} color="#ec4899" />
        <KpiCard label="Tax Collected" value={fmtK(summary.totalTax)} icon={CreditCard} color="#8b5cf6" />
        <KpiCard label="Customers" value={summary.uniqueCustomers.toLocaleString()} icon={Users} color="#14b8a6" />
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <SectionHeader title="Revenue & Order Trend" subtitle={`Daily breakdown for the last ${days} days`} />
        <div style={{ height: 260 }}>
          <Line data={trendChartData} options={trendOptions} />
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <SectionHeader title="Top Products" subtitle="Ranked by units sold or revenue" />
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setProductTab('units')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                productTab === 'units' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'
              }`}
            >By Units</button>
            <button
              onClick={() => setProductTab('revenue')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                productTab === 'revenue' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500'
              }`}
            >By Revenue</button>
          </div>
        </div>
        {topProducts.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No product sales in this period</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p, i) => {
              const val = productTab === 'units' ? p.unitsSold : p.revenue;
              const pct = Math.round((val / maxProduct) * 100);
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <span className={`w-6 text-center text-xs font-bold shrink-0 ${
                    i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-400' : 'text-slate-300'
                  }`}>
                    {i === 0 ? '\uD83E\uDD47' : i === 1 ? '\uD83E\uDD48' : i === 2 ? '\uD83E\uDD49' : `#${i + 1}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-800 truncate">{p.name}</span>
                      <span className="text-sm font-bold text-slate-900 ml-2 shrink-0">
                        {productTab === 'units' ? `${p.unitsSold} units` : fmt(p.revenue)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: PALETTE[i % PALETTE.length] }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 w-8 text-right shrink-0">{pct}%</span>
                    </div>
                    <div className="flex gap-3 mt-0.5">
                      <span className="text-[10px] text-slate-400">{p.category || 'No category'}</span>
                      <span className="text-[10px] text-slate-400">{p.salesCount} sale{p.salesCount !== 1 ? 's' : ''}</span>
                      {productTab === 'units' && <span className="text-[10px] text-slate-400">{fmt(p.revenue)} revenue</span>}
                      {productTab === 'revenue' && <span className="text-[10px] text-slate-400">{p.unitsSold} units</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category + Payment charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <SectionHeader title="Revenue by Category" subtitle="Top 8 categories" />
          {categoryBreakdown.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No category data</div>
          ) : (
            <div style={{ height: 260 }}><Bar data={categoryChartData} options={categoryOptions} /></div>
          )}
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <SectionHeader title="Payment Methods" subtitle="Revenue split by payment type" />
          {paymentBreakdown.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No payment data</div>
          ) : (
            <div style={{ height: 260 }}><Doughnut data={paymentChartData} options={paymentOptions} /></div>
          )}
        </div>
      </div>

      {/* Status + Hourly Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <SectionHeader title="Order Status Distribution" subtitle="Breakdown by status" />
          {statusBreakdown.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-slate-400 text-sm">No data</div>
          ) : (
            <div className="space-y-3 mt-2">
              {statusBreakdown.sort((a, b) => b.count - a.count).map(s => {
                const total = statusBreakdown.reduce((acc, x) => acc + x.count, 0);
                const pct = Math.round((s.count / total) * 100);
                const color = STATUS_COLORS[s.status] || '#94a3b8';
                return (
                  <div key={s.status} className="flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide w-24 shrink-0" style={{ color }}>{s.status}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="text-xs text-slate-600 font-bold w-8 text-right">{s.count}</span>
                    <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <SectionHeader title="Hourly Sales Heatmap" subtitle="Best-selling hours of the day" />
          <div className="grid grid-cols-12 gap-1 mt-2">
            {hourlySalesHeatmap.map((val, h) => {
              const opacity = 0.07 + ((val / heatmapMax) * 0.93);
              return (
                <div key={h} className="flex flex-col items-center gap-1" title={`${h}:00 \u2014 ${fmt(val)}`}>
                  <div
                    className="w-full rounded-md cursor-default hover:scale-110 transition-transform"
                    style={{ height: 36, background: `rgba(99,102,241,${opacity})` }}
                  />
                  <span className="text-[9px] text-slate-400">{h}</span>
                </div>
              );
            })}
          </div>
          {heatmapMax > 0 && (() => {
            const bestHour = hourlySalesHeatmap.indexOf(heatmapMax);
            return (
              <div className="mt-3 bg-indigo-50 rounded-xl px-4 py-2.5 flex items-center gap-2">
                <Clock size={14} className="text-indigo-600" />
                <span className="text-xs text-indigo-700 font-medium">
                  Peak: <strong>{bestHour}:00&ndash;{bestHour + 1}:00</strong> with {fmt(heatmapMax)} revenue
                </span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Top Customers */}
      {topCustomers.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <SectionHeader title="Top Customers" subtitle={`By spend \u00b7 last ${days} days`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide w-8">#</th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Customer</th>
                  <th className="text-right py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Orders</th>
                  <th className="text-right py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <tr key={`${c.name}-${i}`} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 pr-4 text-slate-400 font-medium">{i + 1}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {c.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-right text-slate-600">{c.orders}</td>
                    <td className="py-2.5 text-right font-bold text-slate-900">{fmt(c.spent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
