'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Reconciliation {
    id: string;
    reconciliation_date: string;
    status: string;
    total_variance_value: number;
    notes: string;
    created_at: string;
}

interface LineItem {
    id: string;
    product_name: string;
    expected_quantity: number;
    counted_quantity: number;
    variance: number;
    unit_cost: number;
    variance_value: number;
}

export default function ReconciliationDetailPage() {
    const router = useRouter();
    const params = useParams();
    const supabase = createClientComponentClient();

    const [reconciliation, setReconciliation] = useState<Reconciliation | null>(null);
    const [lineItems, setLineItems] = useState<LineItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadReconciliation();
    }, [params.id]);

    async function loadReconciliation() {
        const { data: recon } = await supabase
            .from('inventory_reconciliation')
            .select('*')
            .eq('id', params.id)
            .single();

        const { data: items } = await supabase
            .from('reconciliation_line_items')
            .select('*')
            .eq('reconciliation_id', params.id)
            .order('variance_value', { ascending: true });

        if (recon) setReconciliation(recon);
        if (items) setLineItems(items);
        setLoading(false);
    }

    async function approveReconciliation() {
        setProcessing(true);

        // Call the stored procedure to apply reconciliation
        const { error } = await supabase.rpc('apply_reconciliation', {
            p_reconciliation_id: params.id
        });

        if (error) {
            alert('Error applying reconciliation: ' + error.message);
        } else {
            alert('Reconciliation approved and inventory updated!');
            router.push('/admin/reconciliation');
        }

        setProcessing(false);
    }

    async function rejectReconciliation() {
        setProcessing(true);

        await supabase
            .from('inventory_reconciliation')
            .update({ status: 'rejected' })
            .eq('id', params.id);

        alert('Reconciliation rejected');
        router.push('/admin/reconciliation');
        setProcessing(false);
    }

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        );
    }

    if (!reconciliation) return <div className="p-6">Reconciliation not found</div>;

    const totalVariance = lineItems.reduce((sum, item) => sum + (item.variance || 0), 0);
    const totalVarianceValue = lineItems.reduce((sum, item) => sum + (item.variance_value || 0), 0);
    const itemsWithVariance = lineItems.filter(item => item.variance !== 0);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                {reconciliation.status === 'pending_approval' && (
                    <div className="flex gap-3">
                        <button
                            onClick={rejectReconciliation}
                            disabled={processing}
                            className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-semibold disabled:opacity-50"
                        >
                            <XCircle className="inline mr-2" size={18} />
                            Reject
                        </button>
                        <button
                            onClick={approveReconciliation}
                            disabled={processing}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
                        >
                            <CheckCircle className="inline mr-2" size={18} />
                            {processing ? 'Applying...' : 'Approve & Apply'}
                        </button>
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <div className={`text-lg font-bold capitalize ${reconciliation.status === 'approved' ? 'text-green-600' :
                            reconciliation.status === 'pending_approval' ? 'text-yellow-600' :
                                reconciliation.status === 'rejected' ? 'text-red-600' :
                                    'text-blue-600'
                        }`}>
                        {reconciliation.status.replace('_', ' ')}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Items Counted</div>
                    <div className="text-2xl font-bold text-gray-900">{lineItems.length}</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Total Variance (Units)</div>
                    <div className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {totalVariance > 0 ? '+' : ''}{totalVariance}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Variance Value</div>
                    <div className={`text-2xl font-bold ${totalVarianceValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(totalVarianceValue).toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Items with Variance */}
            {itemsWithVariance.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-yellow-50">
                        <div className="flex items-center gap-2 text-yellow-800">
                            <AlertTriangle size={20} />
                            <h3 className="font-semibold">Items with Variance ({itemsWithVariance.length})</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Product</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Expected</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Counted</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Variance</th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Value Impact</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {itemsWithVariance.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.product_name}</td>
                                        <td className="px-4 py-3 text-sm text-right text-gray-600">{item.expected_quantity}</td>
                                        <td className="px-4 py-3 text-sm text-right font-semibold">{item.counted_quantity}</td>
                                        <td className={`px-4 py-3 text-sm text-right font-bold ${item.variance > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {item.variance > 0 ? '+' : ''}{item.variance}
                                        </td>
                                        <td className={`px-4 py-3 text-sm text-right font-bold ${item.variance_value >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            ${Math.abs(item.variance_value).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Items */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">All Counted Items</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Product</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Expected</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Counted</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Variance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {lineItems.map((item) => (
                                <tr key={item.id} className={item.variance !== 0 ? 'bg-yellow-50' : ''}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.product_name}</td>
                                    <td className="px-4 py-3 text-sm text-right text-gray-600">{item.expected_quantity}</td>
                                    <td className="px-4 py-3 text-sm text-right">{item.counted_quantity}</td>
                                    <td className={`px-4 py-3 text-sm text-right font-semibold ${item.variance > 0 ? 'text-green-600' :
                                            item.variance < 0 ? 'text-red-600' :
                                                'text-gray-600'
                                        }`}>
                                        {item.variance !== 0 && (item.variance > 0 ? '+' : '')}{item.variance}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
