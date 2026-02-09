'use client';
import { useState, useEffect } from 'react';
import { Scan, CheckCircle, AlertTriangle, Save } from 'lucide-react';

interface Reconciliation {
    id: string;
    reconciliationDate: string;
    status: string;
    totalDiscrepancies: number;
    items: ReconciliationItem[];
}

interface ReconciliationItem {
    id: string;
    productId: string;
    systemStock: number;
    physicalCount: number;
    difference: number;
    reason?: string;
    product: {
        id: string;
        name: string;
        sku: string;
    };
}

interface Product {
    id: string;
    name: string;
    sku: string;
    stock: number;
}

export default function ReconciliationPage() {
    const [reconciliations, setReconciliations] = useState<Reconciliation[]>([]);
    const [activeReconciliation, setActiveReconciliation] = useState<Reconciliation | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [physicalCounts, setPhysicalCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        loadReconciliations();
        loadProducts();
    }, []);

    async function loadReconciliations() {
        try {
            const response = await fetch('http://localhost:3001/api/reconciliations', {
                headers: { 'x-tenant-id': 'retail_store_anuj' },
            });
            if (response.ok) {
                const data = await response.json();
                setReconciliations(data);
            }
        } catch (error) {
            console.error('Failed to load reconciliations:', error);
        } finally {
            setLoading(false);
        }
    }

    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:3001/api/products', {
                headers: { 'x-tenant-id': 'retail_store_anuj' },
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    async function startNewReconciliation() {
        try {
            const response = await fetch('http://localhost:3001/api/reconciliations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-tenant-id': 'retail_store_anuj',
                },
                body: JSON.stringify({ createdBy: 'Admin' }),
            });

            if (response.ok) {
                const newReconciliation = await response.json();
                setActiveReconciliation(newReconciliation);
                setReconciliations([newReconciliation, ...reconciliations]);
                setPhysicalCounts({});
            }
        } catch (error) {
            alert('Failed to start reconciliation');
        }
    }

    async function updateProductCount(productId: string, physicalCount: number) {
        if (!activeReconciliation) return;

        try {
            const response = await fetch(`http://localhost:3001/api/reconciliations/${activeReconciliation.id}/items`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-tenant-id': 'retail_store_anuj',
                },
                body: JSON.stringify({
                    productId,
                    physicalCount,
                    reason: 'COUNTING_ERROR', // Could be made selectable
                }),
            });

            if (response.ok) {
                const updatedItem = await response.json();

                // Update local state
                setActiveReconciliation(prev => {
                    if (!prev) return null;
                    const existingItemIndex = prev.items.findIndex(i => i.productId === productId);
                    const newItems = [...prev.items];

                    if (existingItemIndex >= 0) {
                        newItems[existingItemIndex] = updatedItem;
                    } else {
                        newItems.push(updatedItem);
                    }

                    return { ...prev, items: newItems };
                });
            }
        } catch (error) {
            console.error('Failed to update count:', error);
        }
    }

    async function completeReconciliation() {
        if (!activeReconciliation) return;

        const confirm = window.confirm(
            'Complete reconciliation? This will adjust inventory based on physical counts.'
        );
        if (!confirm) return;

        try {
            const response = await fetch(`http://localhost:3001/api/reconciliations/${activeReconciliation.id}/complete`, {
                method: 'POST',
                headers: { 'x-tenant-id': 'retail_store_anuj' },
            });

            if (response.ok) {
                alert('Reconciliation completed! Inventory has been adjusted.');
                setActiveReconciliation(null);
                setPhysicalCounts({});
                loadReconciliations();
                loadProducts();
            }
        } catch (error) {
            alert('Failed to complete reconciliation');
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const discrepancyItems = activeReconciliation?.items.filter(item => item.difference !== 0) || [];
    const totalDiscrepancy = discrepancyItems.reduce((sum, item) => sum + Math.abs(item.difference), 0);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading reconciliations...</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Shelf Check & Reconciliation</h1>
                    <p className="text-gray-500 mt-2">Verify physical inventory and adjust discrepancies</p>
                </div>
                {!activeReconciliation && (
                    <button
                        onClick={startNewReconciliation}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
                    >
                        <Scan className="w-5 h-5" />
                        Start New Reconciliation
                    </button>
                )}
            </div>

            {activeReconciliation && (
                <div className="mb-8">
                    {/* Active Reconciliation Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Active Reconciliation Session</h2>
                                <p className="text-sm text-gray-600 mt-1">Started: {new Date(activeReconciliation.reconciliationDate).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-600">Items Counted</div>
                                <div className="text-3xl font-bold text-blue-600">{activeReconciliation.items.length}</div>
                            </div>
                        </div>
                        {discrepancyItems.length > 0 && (
                            <div className="bg-yellow-100 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 text-yellow-800 font-semibold">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span>{discrepancyItems.length} Discrepancies Found ({totalDiscrepancy} total units)</span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={completeReconciliation}
                            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 font-semibold"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Complete Reconciliation & Adjust Inventory
                        </button>
                    </div>

                    {/* Product Search & Count Entry */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan & Count Products</h3>
                        <input
                            type="text"
                            placeholder="Search by product name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                        />
                        <div className="max-h-96 overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">System Stock</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Physical Count</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difference</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredProducts.map(product => {
                                        const existingItem = activeReconciliation.items.find(i => i.productId === product.id);
                                        const physicalCount = existingItem?.physicalCount ?? physicalCounts[product.id] ?? 0;
                                        const difference = physicalCount - product.stock;

                                        return (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500 font-mono">{product.sku}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900">{product.stock}</td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={physicalCount}
                                                        onChange={(e) => {
                                                            const value = parseInt(e.target.value) || 0;
                                                            setPhysicalCounts(prev => ({ ...prev, [product.id]: value }));
                                                        }}
                                                        onBlur={(e) => {
                                                            const value = parseInt(e.target.value) || 0;
                                                            if (value !== product.stock) {
                                                                updateProductCount(product.id, value);
                                                            }
                                                        }}
                                                        className="w-24 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    {difference !== 0 && (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difference > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                            }`}>
                                                            {difference > 0 ? '+' : ''}{difference}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Discrepancies Summary */}
                    {discrepancyItems.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Discrepancies Summary</h3>
                            <div className="space-y-3">
                                {discrepancyItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <div className="font-medium text-gray-900">{item.product.name}</div>
                                            <div className="text-xs text-gray-500">System: {item.systemStock} | Physical: {item.physicalCount}</div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${item.difference > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {item.difference > 0 ? '+' : ''}{item.difference}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {!activeReconciliation && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Past Reconciliations</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {reconciliations.filter(r => r.status === 'COMPLETED').map(reconciliation => (
                            <div key={reconciliation.id} className="px-6 py-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {new Date(reconciliation.reconciliationDate).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {reconciliation.totalDiscrepancies} discrepancies found
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        Completed
                                    </span>
                                </div>
                            </div>
                        ))}
                        {reconciliations.filter(r => r.status === 'COMPLETED').length === 0 && (
                            <div className="px-6 py-12 text-center text-gray-500">
                                No completed reconciliations yet
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
