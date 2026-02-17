'use client';
import { useState, useEffect } from 'react';
import { ShoppingCart, Send, Package, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';

type Product = {
    id: string;
    name: string;
    sku: string;
    stock: number;
    reorderLevel: number;
    costPrice: number;
};

type POItem = {
    product: Product;
    quantity: number;
};

export default function RestockPage() {
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [vendors, setVendors] = useState<any[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
    const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
    const [selectedVendor, setSelectedVendor] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [productsData, vendorsData, posData] = await Promise.all([
                apiClient.get('/products'),
                apiClient.get('/vendors'),
                apiClient.get('/purchase-orders'),
            ]);

            if (productsData) {
                const allProducts = Array.isArray(productsData) ? productsData : [];
                // Filter low stock items. Backend Product entity has 'stock' and 'reorderLevel' (check ProductService)
                // Note: Frontend type expects 'stock', backend returns 'stock' (mapped from quantity?)
                // Actually ProductService returns 'total_qty' for list, but let's check exact shape.
                // ProductService.findAll returns { id, name, sku, items... total_qty } 
                // We need to match that.

                const lowStock = allProducts.filter((p: any) => (p.total_qty || 0) <= (p.reorderLevel || 10)); // Default reorder level if missing

                setLowStockProducts(lowStock.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    sku: p.sku,
                    stock: p.total_qty || 0,
                    reorderLevel: p.reorderLevel || 10,
                    costPrice: p.costPrice || p.price * 0.6 || 0 // Fallback cost price
                })));
            }

            if (vendorsData) setVendors(Array.isArray(vendorsData) ? vendorsData : []);
            if (posData) setPurchaseOrders(Array.isArray(posData) ? posData : []);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    }

    function toggleProduct(product: Product) {
        const newSelected = new Map(selectedItems);
        if (newSelected.has(product.id)) {
            newSelected.delete(product.id);
        } else {
            // Suggest reorder quantity (3x reorder level or 50, whichever is higher)
            const suggestedQty = Math.max(product.reorderLevel * 3, 50);
            newSelected.set(product.id, suggestedQty);
        }
        setSelectedItems(newSelected);
    }

    function updateQuantity(productId: string, qty: number) {
        const newSelected = new Map(selectedItems);
        newSelected.set(productId, qty);
        setSelectedItems(newSelected);
    }

    async function createPurchaseOrder() {
        if (!selectedVendor || selectedItems.size === 0) {
            toast.error('Please select vendor and items');
            return;
        }

        const items = lowStockProducts
            .filter((p) => selectedItems.has(p.id))
            .map((p) => ({
                productId: p.id,
                quantity: selectedItems.get(p.id)!,
                unitCost: p.costPrice,
            }));

        try {
            const po = await apiClient.post('/purchase-orders', {
                vendorId: selectedVendor,
                items,
                notes: 'Restock order for low inventory items',
            });

            toast.success(`Purchase Order ${po.orderNumber} created!`);
            setSelectedItems(new Map());
            loadData();
        } catch (error) {
            toast.error('Failed to create purchase order');
        }
    }

    async function sendPO(poId: string) {
        try {
            await apiClient.post(`/purchase-orders/${poId}/send`, {});
            toast.success('Purchase order sent to vendor!');
            loadData();
        } catch (error) {
            toast.error('Failed to send PO');
        }
    }

    async function receivePO(poId: string) {
        if (!confirm('Mark this PO as received? This will update inventory.')) return;

        try {
            await apiClient.post(`/purchase-orders/${poId}/receive`, {});
            toast.success('Purchase order received! Inventory updated.');
            loadData();
        } catch (error) {
            toast.error('Failed to receive PO');
        }
    }

    if (loading) return <div className="p-8">Loading restock data...</div>;

    const totalSelected = Array.from(selectedItems.values()).reduce((sum, qty) => sum + qty, 0);
    const totalCost = lowStockProducts
        .filter((p) => selectedItems.has(p.id))
        .reduce((sum, p) => sum + p.costPrice * selectedItems.get(p.id)!, 0);

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Restock Management</h1>
                <p className="text-gray-500 mt-1">Generate purchase orders for low stock items</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Low Stock Items */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Low Stock Items ({lowStockProducts.length})</h2>
                        <div className="text-sm text-gray-500">
                            {selectedItems.size} selected | {totalSelected} units | ${totalCost.toFixed(2)}
                        </div>
                    </div>

                    <div className="p-6 space-y-3">
                        {lowStockProducts.map((product) => {
                            const isSelected = selectedItems.has(product.id);
                            const quantity = selectedItems.get(product.id) || 0;

                            return (
                                <div
                                    key={product.id}
                                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => toggleProduct(product)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => { }}
                                        className="w-5 h-5"
                                    />

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-xs text-gray-500">Current</div>
                                        <div className="font-mono font-bold text-red-600">{product.stock}</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="text-xs text-gray-500">Reorder Level</div>
                                        <div className="font-mono">{product.reorderLevel}</div>
                                    </div>

                                    {isSelected && (
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 0)}
                                                className="w-24 border border-gray-300 rounded-lg px-3 py-2 font-mono"
                                                placeholder="Qty"
                                            />
                                        </div>
                                    )}

                                    <div className="text-right">
                                        <div className="text-xs text-gray-500">Unit Cost</div>
                                        <div className="font-mono font-semibold">${product.costPrice.toFixed(2)}</div>
                                    </div>
                                </div>
                            );
                        })}

                        {lowStockProducts.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>All items are adequately stocked!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Create Purchase Order */}
                <div>
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Create Purchase Order</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
                                <select
                                    value={selectedVendor}
                                    onChange={(e) => setSelectedVendor(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                >
                                    <option value="">Select Vendor</option>
                                    {vendors.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Items:</span>
                                    <span className="font-semibold">{selectedItems.size}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Total Units:</span>
                                    <span className="font-semibold">{totalSelected}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total Cost:</span>
                                    <span>${totalCost.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={createPurchaseOrder}
                                disabled={!selectedVendor || selectedItems.size === 0}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 flex rounded-lg flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={20} />
                                Create Purchase Order
                            </button>
                        </div>
                    </div>

                    {/* Recent Purchase Orders */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Recent Purchase Orders</h2>
                        <div className="space-y-3">
                            {purchaseOrders.slice(0, 5).map((po) => (
                                <div key={po.id} className="border border-gray-200 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-semibold">{po.orderNumber}</div>
                                            <div className="text-sm text-gray-500">{po.vendor?.name}</div>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${po.status === 'received'
                                                ? 'bg-green-100 text-green-800'
                                                : po.status === 'sent'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {po.status}
                                        </span>
                                    </div>

                                    <div className="text-sm font-mono font-semibold mb-2">${po.totalAmount.toFixed(2)}</div>

                                    {po.status === 'draft' && (
                                        <button
                                            onClick={() => sendPO(po.id)}
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                            <Send size={14} />
                                            Send to Vendor
                                        </button>
                                    )}

                                    {po.status === 'sent' && (
                                        <button
                                            onClick={() => receivePO(po.id)}
                                            className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
                                        >
                                            <CheckCircle size={14} />
                                            Mark as Received
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
