'use client';
import { useState, useEffect } from 'react';
import { TrendingDown, AlertTriangle, Calendar, Zap, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

type HealthMetric = {
    category: string;
    products: any[];
    severity: 'high' | 'medium' | 'low';
};

export default function InventoryHealthPage() {
    const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHealthData();
    }, []);

    async function loadHealthData() {
        try {
            const res = await fetch('/api/products');
            if (res.ok) {
                const allProducts = await res.json();
                setProducts(allProducts);
                analyzeHealth(allProducts);
            }
        } catch (error) {
            console.error('Error loading health data:', error);
        } finally {
            setLoading(false);
        }
    }

    function analyzeHealth(products: any[]) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Slow-moving items (high stock, low sales)
        const slowMoving = products.filter((p) => p.stock > p.reorderLevel * 3);

        // Overstock items
        const overstock = products.filter((p) => p.stock > 100);

        // Near reorder point
        const lowStock = products.filter((p) => p.stock <= p.reorderLevel && p.stock > 0);

        // Out of stock
        const outOfStock = products.filter((p) => p.stock === 0);

        const metrics: HealthMetric[] = [];

        if (slowMoving.length > 0) {
            metrics.push({
                category: 'Slow-Moving Items',
                products: slowMoving,
                severity: 'medium',
            });
        }

        if (overstock.length > 0) {
            metrics.push({
                category: 'Overstock',
                products: overstock,
                severity: 'high',
            });
        }

        if (lowStock.length > 0) {
            metrics.push({
                category: 'Low Stock',
                products: lowStock,
                severity: 'medium',
            });
        }

        if (outOfStock.length > 0) {
            metrics.push({
                category: 'Out of Stock',
                products: outOfStock,
                severity: 'high',
            });
        }

        setHealthMetrics(metrics);
    }

    async function createFlashSale(products: any[]) {
        // TODO: Integrate with campaign service
        toast.success(`Creating flash sale for ${products.length} products...`);

        // Mock campaign creation
        console.log('Flash sale products:', products);
    }

    async function pushToSocial(products: any[]) {
        // TODO: Integrate with social media APIs
        toast.success(`Publishing to social media...`);

        console.log('Social media products:', products);
    }

    if (loading) return <div className="p-8">Analyzing inventory health...</div>;

    const totalAlert = healthMetrics.reduce((sum, m) => sum + m.products.length, 0);

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Inventory Health Dashboard</h1>
                <p className="text-gray-500 mt-1">Monitor inventory metrics and take action on problem areas</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Items</p>
                            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                        </div>
                        <Calendar className="text-blue-600" size={32} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Health Alerts</p>
                            <p className="text-2xl font-bold text-orange-600">{totalAlert}</p>
                        </div>
                        <AlertTriangle className="text-orange-600" size={32} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Value</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ${products.reduce((sum, p) => sum + p.stock * p.costPrice, 0).toFixed(0)}
                            </p>
                        </div>
                        <TrendingDown className="text-green-600" size={32} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Turnover Rate</p>
                            <p className="text-2xl font-bold text-gray-900">~15 days</p>
                        </div>
                        <Zap className="text-purple-600" size={32} />
                    </div>
                </div>
            </div>

            {/* Health Metrics */}
            <div className="space-y-6">
                {healthMetrics.map((metric) => (
                    <div key={metric.category} className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-3 h-3 rounded-full ${metric.severity === 'high'
                                            ? 'bg-red-500'
                                            : metric.severity === 'medium'
                                                ? 'bg-orange-500'
                                                : 'bg-yellow-500'
                                        }`}
                                />
                                <h2 className="text-lg font-semibold">{metric.category}</h2>
                                <span className="text-sm text-gray-500">({metric.products.length} items)</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => createFlashSale(metric.products)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                >
                                    <Zap size={16} />
                                    Flash Sale
                                </button>
                                <button
                                    onClick={() => pushToSocial(metric.products)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                                >
                                    <Share2 size={16} />
                                    Social Posts
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {metric.products.slice(0, 9).map((product) => (
                                    <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                                        {product.imageUrl && (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-32 object-cover rounded-lg mb-3"
                                            />
                                        )}
                                        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                                        <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Stock:</span>
                                            <span className={`font-semibold ${product.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                                {product.stock}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Price:</span>
                                            <span className="font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Value:</span>
                                            <span className="font-semibold text-gray-900">
                                                ${(product.stock * product.costPrice).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {metric.products.length > 9 && (
                                <div className="mt-4 text-center text-sm text-gray-500">
                                    + {metric.products.length - 9} more items
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {healthMetrics.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-green-600 mb-4">
                            <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Inventory is Healthy!</h2>
                        <p className="text-gray-500">No major issues detected with your current inventory levels.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
