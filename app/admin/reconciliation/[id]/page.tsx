'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Reconciliation {
    audit_id: string;
    audit_date: string;
    status: string;
    total_loss: number;
    total_gain: number;
    notes: string;
    items: LineItem[];
}

interface LineItem {
    product_id: string;
    product_name?: string; // May need to fetch or generic
    expected: number;
    actual: number;
    discrepancy: number;
    status: 'loss' | 'gain' | 'match';
}

export default function ReconciliationDetailPage() {
    const router = useRouter();
    const params = useParams(); // params.id is audit_id

    const [reconciliation, setReconciliation] = useState<Reconciliation | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [productNames, setProductNames] = useState<Map<string, string>>(new Map());

    useEffect(() => {
        if (params.id) {
            loadReconciliation();
        }
    }, [params.id]);

    async function loadReconciliation() {
        try {
            const data: any = await apiClient.getAuditDetails(params.id as string);
            setReconciliation(data);

            // Fetch product names for items (if not provided by details endpoint)
            // Ideally the details endpoint should provide product names. 
            // Based on my edit to audits.py, it returns product_id.
            // I'll assume for now I need to fetch them or the backend was updated to include names.
            // Wait, audits.py does NOT join with GlobalProduct to get names in the details endpoint I saw.
            // It just returns items.
            // I should fetch product details or update backend. 
            // For now, I'll try to fetch product info for ids.

            const ids = data.items.map((i: any) => i.product_id);
            if (ids.length > 0) {
                // Optimization: In a real app, backend should return names.
                // For now, I will display ID or try to fetch if I can.
                // Let's assume for this MVP we might just show ID or fetch individually if list is short.
                // Or better yet, fetch all products and map.
            }

            // Actually, let's fetch inventory to map names if possible, but that's heavy.
            // I'll trust the process or just show ID for now, or update backend later if needed.
            // Wait, the previous page had `product_name`. The previous code `items.set` logic used `inventoryData`.
            // The `getAuditDetails` endpoint in `audits.py` returns a list of dicts.
            // I should have updated `audits.py` to include product name, but I didn't.
            // I will try to fetch the product name client side for now.

            const inventory = await apiClient.getInventory({ limit: 1000 }) as any;
            const nameMap = new Map();
            inventory.items?.forEach((i: any) => {
                nameMap.set(i.global_product_id, i.product_name);
            });
            setProductNames(nameMap);

        } catch (error) {
            console.error('Error loading audit:', error);
            toast.error('Failed to load reconciliation details');
        } finally {
            setLoading(false);
        }
    }

    async function approveReconciliation() {
        setProcessing(true);
        try {
            await apiClient.applyAudit(params.id as string);
            toast.success('Reconciliation approved and inventory updated!');
            router.push('/admin/reconciliation');
        } catch (error: any) {
            console.error('Error approving audit:', error);
            toast.error('Failed to apply reconciliation');
        } finally {
            setProcessing(false);
        }
    }

    async function rejectReconciliation() {
        setProcessing(true);
        try {
            await apiClient.rejectAudit(params.id as string);
            toast.info('Reconciliation rejected');
            router.push('/admin/reconciliation');
        } catch (error: any) {
            console.error('Error rejecting audit:', error);
            toast.error('Failed to reject reconciliation');
        } finally {
            setProcessing(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (!reconciliation) return <div className="p-6">Reconciliation not found</div>;

    const itemsWithVariance = reconciliation.items.filter(item => item.discrepancy !== 0);
    const status = reconciliation.status || 'unknown'; // Backend might return none if new

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                {status.toLowerCase() === 'pending' || status === 'pending_approval' ? (
                    <div className="flex gap-3">
                        <button
                            onClick={rejectReconciliation}
                            disabled={processing}
                            className="px-6 py-2 border border-red-300 text-red-700 bg-white rounded-lg hover:bg-red-50 font-semibold disabled:opacity-50 transition-colors shadow-sm"
                        >
                            <XCircle className="inline mr-2" size={18} />
                            Reject
                        </button>
                        <button
                            onClick={approveReconciliation}
                            disabled={processing}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50 transition-colors shadow-md flex items-center"
                        >
                            {processing ? <Loader2 className="animate-spin mr-2" size={18} /> : <CheckCircle className="mr-2" size={18} />}
                            {processing ? 'Applying...' : 'Approve & Apply'}
                        </button>
                    </div>
                ) : (
                    <div className={`px-4 py-2 rounded-lg font-bold capitalize ${status === 'approved' || status === 'completed' ? 'bg-green-100 text-green-700' :
                            status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {status}
                    </div>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1 font-medium">Status</div>
                    <div className={`text-xl font-bold capitalize ${status === 'approved' || status === 'completed' ? 'text-green-600' :
                            status === 'pending' || status === 'pending_approval' ? 'text-yellow-600' :
                                status === 'rejected' ? 'text-red-600' :
                                    'text-blue-600'
                        }`}>
                        {status.replace('_', ' ')}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1 font-medium">Items Counted</div>
                    <div className="text-2xl font-bold text-gray-900">{reconciliation.items.length}</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1 font-medium">Total Gain (Units)</div>
                    <div className="text-2xl font-bold text-green-600">
                        +{reconciliation.total_gain}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1 font-medium">Total Loss (Units)</div>
                    <div className="text-2xl font-bold text-red-600">
                        -{reconciliation.total_loss}
                    </div>
                </div>
            </div>

            {/* Items with Variance */}
            {itemsWithVariance.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-yellow-50/50">
                        <div className="flex items-center gap-2 text-yellow-800">
                            <AlertTriangle size={20} />
                            <h3 className="font-semibold">Items with Variance ({itemsWithVariance.length})</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Expected</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actual</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Variance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {itemsWithVariance.map((item) => (
                                    <tr key={item.product_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {productNames.get(item.product_id) || item.product_id.substring(0, 8) + '...'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right text-gray-600 font-mono">{item.expected}</td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-gray-900 font-mono">{item.actual}</td>
                                        <td className={`px-6 py-4 text-sm text-right font-bold font-mono ${item.discrepancy > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {item.discrepancy > 0 ? '+' : ''}{item.discrepancy}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Items */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 text-lg">Detailed Audit Log</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Expected</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actual</th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Variance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reconciliation.items.map((item) => (
                                <tr key={item.product_id} className={`hover:bg-gray-50 ${item.discrepancy !== 0 ? 'bg-yellow-50/30' : ''}`}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {productNames.get(item.product_id) || item.product_id.substring(0, 8) + '...'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right text-gray-600 font-mono">{item.expected}</td>
                                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-mono">{item.actual}</td>
                                    <td className={`px-6 py-4 text-sm text-right font-semibold font-mono ${item.discrepancy > 0 ? 'text-green-600' :
                                            item.discrepancy < 0 ? 'text-red-600' :
                                                'text-gray-400'
                                        }`}>
                                        {item.discrepancy !== 0 && (item.discrepancy > 0 ? '+' : '')}{item.discrepancy}
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
