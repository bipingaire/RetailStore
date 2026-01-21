'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, Save, Send, Search, Camera, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface InventoryItem {
    inventory_id: string;
    product_name: string;
    sku: string;
    quantity: number;
    price: number;
}

interface CountItem {
    inventory_id: string;
    product_name: string;
    expected_quantity: number;
    counted_quantity: number | null;
    unit_cost: number;
    global_product_id: string; // Needed for backend
}

export default function NewReconciliationPage() {
    const router = useRouter();

    const [countItems, setCountItems] = useState<Map<string, CountItem>>(new Map());
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [reconciliationId, setReconciliationId] = useState<string | null>(null);

    useEffect(() => {
        initializeAudit();
    }, []);

    async function initializeAudit() {
        try {
            // 1. Start audit session
            const auditRes = await apiClient.startAudit() as { audit_id: string };
            setReconciliationId(auditRes.audit_id);

            // 2. Fetch Inventory
            // We use getInventory with a large limit to get all items for counting
            const inventoryData = await apiClient.getInventory({ limit: 1000 }) as { items: any[] };
            const items = new Map<string, CountItem>();

            (inventoryData.items || []).forEach((item: any) => {
                items.set(item.inventory_id, {
                    inventory_id: item.inventory_id,
                    product_name: item.product_name || 'Unknown',
                    expected_quantity: item.quantity || 0,
                    counted_quantity: null,
                    unit_cost: item.cost_price || 0,
                    global_product_id: item.global_product_id // Ensure backend returns this or we map it
                });
            });
            setCountItems(items);
        } catch (error: any) {
            console.error('Failed to initialize audit:', error);
            toast.error('Failed to start audit session');
        } finally {
            setLoading(false);
        }
    }

    function updateCount(inventoryId: string, count: number | null) {
        const items = new Map(countItems);
        const item = items.get(inventoryId);
        if (item) {
            item.counted_quantity = count;
            items.set(inventoryId, item);
            setCountItems(items);
        }
    }

    async function submitForApproval() {
        if (!reconciliationId) return;
        setSubmitting(true);

        try {
            // Prepare items for backend
            // Backend expects: product_id (global_product_id), actual_quantity
            const itemsToSubmit = Array.from(countItems.values())
                .filter(item => item.counted_quantity !== null)
                .map(item => ({
                    product_id: item.global_product_id, // Important: backend expects global_product_id
                    actual_quantity: item.counted_quantity || 0
                }));

            await apiClient.completeAudit(reconciliationId, itemsToSubmit);

            toast.success('Audit submitted successfully');
            router.push('/admin/reconciliation');
        } catch (error: any) {
            console.error('Audit submission failed:', error);
            toast.error('Failed to submit audit');
        } finally {
            setSubmitting(false);
        }
    }

    const filteredItems = Array.from(countItems.values()).filter(item =>
        item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const countedCount = Array.from(countItems.values()).filter(i => i.counted_quantity !== null).length;
    const totalCount = countItems.size;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="p-4 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="text-center">
                        <h1 className="text-xl font-bold text-gray-900">Physical Count</h1>
                        <p className="text-xs text-gray-500">
                            {countedCount} / {totalCount} items counted
                        </p>
                    </div>
                    <div className="flex gap-2 w-8">
                        {/* Spacer to center title */}
                    </div>
                </div>

                {/* Search */}
                <div className="px-4 pb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-100 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Product List */}
            {loading ? (
                <div className="p-20 text-center text-gray-400 flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin" size={32} />
                    <p>Starting Audit Session...</p>
                </div>
            ) : (
                <div className="p-4 space-y-3">
                    {filteredItems.map((item) => {
                        const variance = item.counted_quantity !== null
                            ? item.counted_quantity - item.expected_quantity
                            : 0;
                        const hasVariance = item.counted_quantity !== null && Math.abs(variance) > 0;

                        return (
                            <div
                                key={item.inventory_id}
                                className={`bg-white rounded-lg p-4 border-2 ${item.counted_quantity !== null
                                    ? hasVariance
                                        ? 'border-yellow-300 bg-yellow-50'
                                        : 'border-green-300 bg-green-50'
                                    : 'border-gray-200'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                                            {item.product_name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Expected: {item.expected_quantity} units
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        placeholder="Count..."
                                        value={item.counted_quantity === null ? '' : item.counted_quantity}
                                        onChange={(e) => {
                                            const val = e.target.value === '' ? null : parseInt(e.target.value);
                                            updateCount(item.inventory_id, val);
                                        }}
                                        className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />

                                    {item.counted_quantity !== null && hasVariance && (
                                        <div className={`px-3 py-2 rounded-lg text-sm font-bold ${variance > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {variance > 0 ? '+' : ''}{variance}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <button
                    onClick={submitForApproval}
                    disabled={countedCount === 0 || submitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="animate-spin" size={24} />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={20} />
                            Submit Audit ({countedCount})
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
