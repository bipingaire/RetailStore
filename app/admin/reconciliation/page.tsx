'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Plus, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Reconciliation {
    id: string;
    reconciliation_date: string;
    status: string;
    total_variance_value: number;
    initiated_by: string;
    created_at: string;
}

export default function ReconciliationPage() {
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [reconciliations, setReconciliations] = useState<Reconciliation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReconciliations();
    }, []);

    async function loadReconciliations() {
        const { data, error } = await supabase
            .from('inventory_reconciliation')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (data) setReconciliations(data);
        setLoading(false);
    }

    function getStatusIcon(status: string) {
        switch (status) {
            case 'in_progress': return <Clock className="text-blue-500" size={20} />;
            case 'pending_approval': return <AlertTriangle className="text-yellow-500" size={20} />;
            case 'approved': return <CheckCircle className="text-green-500" size={20} />;
            case 'rejected': return <XCircle className="text-red-500" size={20} />;
            default: return null;
        }
    }

    function getStatusColor(status: string) {
        switch (status) {
            case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'pending_approval': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'approved': return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700';
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Reconciliation</h1>
                    <p className="text-gray-500 mt-1">Physical count and variance tracking</p>
                </div>
                <button
                    onClick={() => router.push('/admin/reconciliation/new')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    Start New Count
                </button>
            </div>

            {/* Reconciliation List */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading reconciliations...</p>
                </div>
            ) : reconciliations.length === 0 ? (
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                    <AlertTriangle className="mx-auto text-gray-400" size={48} />
                    <h3 className="text-xl font-semibold text-gray-700 mt-4">No Reconciliations Yet</h3>
                    <p className="text-gray-500 mt-2">Start your first physical inventory count</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Variance Value</th>
                                <th className="text-center px-6 py-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reconciliations.map((recon) => (
                                <tr key={recon.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {new Date(recon.reconciliation_date).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(recon.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(recon.status)}`}>
                                            {getStatusIcon(recon.status)}
                                            {recon.status.replace('_', ' ').toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`text-sm font-bold ${recon.total_variance_value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ${Math.abs(recon.total_variance_value || 0).toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => router.push(`/admin/reconciliation/${recon.id}`)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
