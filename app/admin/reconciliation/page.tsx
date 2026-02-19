'use client';

import { useEffect, useState } from 'react';
import { Plus, CheckCircle, AlertCircle, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { format } from 'date-fns';

interface AuditSession {
    id: string;
    startedAt: string;
    completedAt?: string;
    status: string;
    counts: any[];
    adjustments: any[];
}

export default function ReconciliationListPage() {
    const [sessions, setSessions] = useState<AuditSession[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSessions();
    }, []);

    async function loadSessions() {
        try {
            const { data } = await apiClient.get('/audit/sessions');
            setSessions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Reconciliation</h1>
                    <p className="text-gray-500">Audit history and stock adjustments</p>
                </div>
                <Link
                    href="/admin/reconciliation/new"
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                >
                    <Plus size={20} />
                    New Audit
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Items Counted</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Variances</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sessions.length === 0 && !loading && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No audit sessions found. Start a new one!
                                </td>
                            </tr>
                        )}
                        {sessions.map((session) => (
                            <tr key={session.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">
                                        {format(new Date(session.startedAt), 'PPP')}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {format(new Date(session.startedAt), 'p')}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${session.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                            session.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        }`}>
                                        {session.status === 'completed' && <CheckCircle size={12} />}
                                        {session.status === 'rejected' && <XCircle size={12} />}
                                        {session.status === 'in-progress' && <AlertCircle size={12} />}
                                        <span className="capitalize">{session.status}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {session.counts?.length || 0} items
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {session.counts?.filter((c: any) => c.variance !== 0).length || 0} adjustments
                                </td>
                                <td className="text-right px-6 py-4">
                                    <Link
                                        href={`/admin/reconciliation/${session.id}`}
                                        className="text-blue-600 hover:text-blue-900 text-sm font-semibold inline-flex items-center gap-1"
                                    >
                                        View <ArrowRight size={16} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
