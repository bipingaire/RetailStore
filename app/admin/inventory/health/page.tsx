'use client';
import { useState, useEffect } from 'react';
import { AlertCircle, TrendingDown, TrendingUp, Package, Calendar, Zap } from 'lucide-react';

interface HealthMetrics {
    totalProducts: number;
    lowStock: number;
    outOfStock: number;
    slowMoving: number;
    fastMoving: number;
    nearExpiry: number;
    lowStockProducts: Array<{
        id: string;
        name: string;
        sku: string;
        stock: number;
        reorderLevel: number;
    }>;
    nearExpiryProducts: Array<{
        id: string;
        name: string;
        daysToExpiry: number;
        expiryDate: string;
    }>;
}

export default function InventoryHealthPage() {
    const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'lowStock' | 'nearExpiry' | 'slowMoving'>('lowStock');

    useEffect(() => {
        loadHealthMetrics();
    }, []);

    async function loadHealthMetrics() {
        try {
            const response = await fetch('http://localhost:3001/api/inventory/health', {
                headers: {
                    'x-tenant-id': 'retail_store_anuj',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setMetrics(data);
            }
        } catch (error) {
            console.error('Failed to load health metrics:', error);
        } finally {
            setLoading(false);
        }
    }

    async function createCampaignFromSelection(type: string, productIds: string[]) {
        const campaignData = {
            name: type === 'lowStock' ? 'Clearance - Low Stock' : type === 'nearExpiry' ? 'Urgent Sale - Expiring Soon' : 'Flash Sale',
            description: `Auto-generated campaign for ${type} products`,
            type: type === 'nearExpiry' ? 'EXPIRY_CLEARANCE' : 'OVERSTOCK',
            discount: type === 'nearExpiry' ? 30 : 20,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            productIds,
            socialPlatforms: ['facebook', 'instagram'],
        };

        try {
            const response = await fetch('http://localhost:3001/api/campaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-tenant-id': 'retail_store_anuj',
                },
                body: JSON.stringify(campaignData),
            });

            if (response.ok) {
                alert('Campaign created successfully!');
            }
        } catch (error) {
            console.error('Failed to create campaign:', error);
            alert('Failed to create campaign');
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading inventory health...</div>
            </div>
        );
    }

    const healthScore = metrics
        ? Math.round(100 - (metrics.lowStock / metrics.totalProducts) * 30 - (metrics.outOfStock / metrics.totalProducts) * 40 - (metrics.nearExpiry / metrics.totalProducts) * 20)
        : 0;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Inventory Health</h1>
                <p className="text-gray-500 mt-2">Monitor stock levels, expiry dates, and identify improvement opportunities</p>
            </div>

            {/* Health Score Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-medium opacity-90">Overall Health Score</div>
                        <div className="text-6xl font-bold mt-2">{healthScore}%</div>
                        <div className="text-sm mt-2 opacity-80">
                            {healthScore >= 80 ? '✨ Excellent' : healthScore >= 60 ? '👍 Good' : healthScore >= 40 ? '⚠️ Needs Attention' : '🚨 Critical'}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm opacity-90">Total Products</div>
                        <div className="text-3xl font-semibold">{metrics?.totalProducts || 0}</div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-red-100 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <button
                            onClick={() => setActiveTab('lowStock')}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            View Details →
                        </button>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metrics?.lowStock || 0}</div>
                    <div className="text-sm text-gray-500">Low Stock Items</div>
                    <div className="mt-2 text-xs text-gray-400">Below reorder level</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                        <button
                            onClick={() => setActiveTab('nearExpiry')}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            View Details →
                        </button>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metrics?.nearExpiry || 0}</div>
                    <div className="text-sm text-gray-500">Near Expiry</div>
                    <div className="mt-2 text-xs text-gray-400">{'< 15 days remaining'}</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <TrendingDown className="w-6 h-6 text-gray-600" />
                        </div>
                        <button
                            onClick={() => setActiveTab('slowMoving')}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            View Details →
                        </button>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{metrics?.slowMoving || 0}</div>
                    <div className="text-sm text-gray-500">Slow Moving</div>
                    <div className="mt-2 text-xs text-gray-400">{'>= 30 days without sale'}</div>
                </div>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {activeTab === 'lowStock' ? 'Low Stock Products' : activeTab === 'nearExpiry' ? 'Near Expiry Products' : 'Slow Moving Products'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {activeTab === 'lowStock' && 'Products below reorder point'}
                            {activeTab === 'nearExpiry' && 'Products expiring within 15 days'}
                            {activeTab === 'slowMoving' && 'Products with low sales velocity'}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            const productIds = activeTab === 'lowStock'
                                ? metrics?.lowStockProducts.map(p => p.id) || []
                                : activeTab === 'nearExpiry'
                                    ? metrics?.nearExpiryProducts.map(p => p.id) || []
                                    : [];

                            if (productIds.length > 0) {
                                createCampaignFromSelection(activeTab, productIds);
                            }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
                    >
                        <Zap className="w-4 h-4" />
                        Create Campaign
                    </button>
                </div>

                {activeTab === 'lowStock' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reorder Level</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {metrics?.lowStockProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{product.sku}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`font-semibold ${product.stock === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{product.reorderLevel}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!metrics?.lowStockProducts || metrics.lowStockProducts.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No low stock products found 🎉
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'nearExpiry' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days to Expiry</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgency</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {metrics?.nearExpiryProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`font-semibold ${product.daysToExpiry <= 7 ? 'text-red-600' : 'text-orange-600'}`}>
                                                {product.daysToExpiry} days
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(product.expiryDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${product.daysToExpiry <= 7 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {product.daysToExpiry <= 7 ? 'Urgent' : 'Soon'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!metrics?.nearExpiryProducts || metrics.nearExpiryProducts.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            No near-expiry products found 🎉
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'slowMoving' && (
                    <div className="px-6 py-12 text-center text-gray-500">
                        Slow moving products tracking coming soon...
                    </div>
                )}
            </div>
        </div>
    );
}
