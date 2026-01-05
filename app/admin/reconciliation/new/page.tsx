'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, Search, Camera, AlertCircle } from 'lucide-react';

interface InventoryItem {
    inventory_id: string;
    global_products: {
        product_name: string;
        upc_ean_code: string;
    };
    current_stock_quantity: number;
    cost_price_amount: number;
}

interface CountItem {
    inventory_id: string;
    product_name: string;
    expected_quantity: number;
    counted_quantity: number | null;
    unit_cost: number;
}

export default function NewReconciliationPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();

    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [countItems, setCountItems] = useState<Map<string, CountItem>>(new Map());
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [reconciliationId, setReconciliationId] = useState<string | null>(null);

    useEffect(() => {
        loadInventory();
        createReconciliation();
    }, []);

    async function createReconciliation() {
        const { data: user } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('inventory_reconciliation')
            .insert({
                status: 'in_progress',
                initiated_by: user.user?.id
            })
            .select()
            .single();

        if (data) setReconciliationId(data.id);
    }

    async function loadInventory() {
        const { data } = await supabase
            .from('store_inventory')
            .select(`
        inventory_id,
        current_stock_quantity,
        cost_price_amount,
        global_products (
          product_name,
          upc_ean_code
        )
      `)
            .eq('is_active', true)
            .limit(100);

        if (data) {
            setInventory(data as any);

            // Initialize count items
            const items = new Map<string, CountItem>();
            data.forEach((item: any) => {
                items.set(item.inventory_id, {
                    inventory_id: item.inventory_id,
                    product_name: item.global_products?.product_name || 'Unknown',
                    expected_quantity: item.current_stock_quantity || 0,
                    counted_quantity: null,
                    unit_cost: item.cost_price_amount || 0
                });
            });
            setCountItems(items);
        }

        setLoading(false);
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

    async function saveDraft() {
        setSaving(true);

        // Save all line items
        const lineItems = Array.from(countItems.values())
            .filter(item => item.counted_quantity !== null)
            .map(item => ({
                reconciliation_id: reconciliationId,
                inventory_id: item.inventory_id,
                product_name: item.product_name,
                expected_quantity: item.expected_quantity,
                counted_quantity: item.counted_quantity,
                unit_cost: item.unit_cost
            }));

        await supabase
            .from('reconciliation_line_items')
            .upsert(lineItems);

        setSaving(false);
        alert('Draft saved successfully');
    }

    async function submitForApproval() {
        await saveDraft();

        await supabase
            .from('inventory_reconciliation')
            .update({ status: 'pending_approval' })
            .eq('id', reconciliationId);

        router.push('/admin/reconciliation');
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
                    <div className="flex gap-2">
                        <button
                            onClick={saveDraft}
                            disabled={saving}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                            <Save size={20} />
                        </button>
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
                            className="w-full bg-gray-100 border-none rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Product List */}
            <div className="p-4 space-y-3">
                {filteredItems.map((item) => {
                    const variance = item.counted_quantity !== null
                        ? item.counted_quantity - item.expected_quantity
                        : 0;
                    const hasVariance = Math.abs(variance) > 0;

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
                                    className="flex-1 border-2 border-gray-300 rounded-lg px-4 py-3 text-lg font-bold text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <button
                    onClick={submitForApproval}
                    disabled={countedCount === 0}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
                >
                    <Send size={20} />
                    Submit for Approval ({countedCount} items)
                </button>
            </div>
        </div>
    );
}
