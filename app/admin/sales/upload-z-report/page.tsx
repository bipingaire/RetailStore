'use client';
import { useState } from 'react';
import { Upload, FileText, Check, X, Loader2, ShoppingCart, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '@/lib/api-client';

export default function ZReportUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [parsing, setParsing] = useState(false);
    const [parsedData, setParsedData] = useState<any>(null);
    const [committing, setCommitting] = useState(false);
    const [committed, setCommitted] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setParsedData(null);
        setCommitted(null);

        setParsing(true);
        const loadingToast = toast.loading('📄 AI is scanning Z-Report...');

        try {
            const formData = new FormData();
            formData.append('file', f);
            const result = await apiClient.post('/reports/z-report/parse', formData);
            setParsedData(result);
            setShowModal(true);
            toast.dismiss(loadingToast);
            toast.success('✓ Z-Report parsed! Review and commit below.');
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error(err?.message || 'Failed to parse Z-Report');
        } finally {
            setParsing(false);
        }
    }

    async function handleCommit() {
        if (!parsedData) return;
        setCommitting(true);
        const loadingToast = toast.loading('Committing Z-Report to inventory...');
        try {
            const result = await apiClient.post('/reports/z-report/commit', parsedData);
            setCommitted(result);
            setShowModal(false);
            toast.dismiss(loadingToast);
            toast.success('Inventory updated successfully!');
        } catch (err: any) {
            toast.dismiss(loadingToast);
            toast.error(err?.message || 'Failed to commit Z-Report');
        } finally {
            setCommitting(false);
        }
    }

    function updateItem(idx: number, field: string, value: any) {
        const newItems = [...parsedData.items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        setParsedData({ ...parsedData, items: newItems });
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Upload Z-Report</h1>
                <p className="text-gray-500 mt-1">Daily POS sales report — AI scans and updates inventory automatically</p>
            </div>

            {/* Upload Area */}
            {!committed && (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-blue-400 transition-colors">
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 mb-4 text-sm">Upload your POS Z-Report (PDF, JPG, PNG)</p>

                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="z-report-input"
                        disabled={parsing}
                    />
                    <label
                        htmlFor="z-report-input"
                        className={`cursor-pointer inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors ${parsing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {parsing ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                        {parsing ? 'AI Scanning...' : 'Choose Z-Report File'}
                    </label>

                    {file && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                            <FileText size={16} />
                            <span>{file.name}</span>
                        </div>
                    )}
                </div>
            )}

            {/* ── REVIEW MODAL ── */}
            {showModal && parsedData && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-[98vw] max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Review Z-Report</h2>
                                <p className="text-sm text-gray-500">Verify the scanned items before committing to inventory</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <button
                                    onClick={handleCommit}
                                    disabled={committing}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
                                >
                                    {committing ? (
                                        <><Loader2 size={16} className="animate-spin" /> Committing...</>
                                    ) : (
                                        <><ShoppingCart size={16} /> Commit — Inventory Out</>
                                    )}
                                </button>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Summary Row */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-xs text-gray-500">Report Date</p>
                                    <input
                                        type="date"
                                        value={parsedData.reportDate || ''}
                                        onChange={e => setParsedData({ ...parsedData, reportDate: e.target.value })}
                                        className="text-base font-bold text-gray-900 w-full border-0 focus:outline-none bg-transparent"
                                    />
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-xs text-gray-500">Report #</p>
                                    <input
                                        type="text"
                                        value={parsedData.reportNumber || ''}
                                        onChange={e => setParsedData({ ...parsedData, reportNumber: e.target.value })}
                                        className="text-base font-bold text-gray-900 w-full border-0 focus:outline-none bg-transparent"
                                        placeholder="Auto-generated"
                                    />
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-xs text-gray-500">Total Sales</p>
                                    <p className="text-base font-bold text-green-600">${Number(parsedData.totalSales || 0).toFixed(2)}</p>
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-xs text-gray-500">Items</p>
                                    <p className="text-base font-bold text-gray-900">{parsedData.items?.length || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle size={16} className="text-amber-500" />
                                <span className="text-xs text-amber-700">Items shown will be deducted from your inventory when committed.</span>
                            </div>
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Product</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                                        <th className="px-4 py-3 text-center text-xs font-semibold text-red-700 bg-red-50">Qty Sold</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Unit Price</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(parsedData.items || []).map((item: any, idx: number) => (
                                        <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={e => updateItem(idx, 'description', e.target.value)}
                                                    className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-400 focus:outline-none font-medium text-gray-900"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 text-xs">{item.category}</td>
                                            <td className="px-4 py-3 text-center bg-red-50">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.quantitySold}
                                                    onChange={e => updateItem(idx, 'quantitySold', parseFloat(e.target.value) || 0)}
                                                    className="w-16 text-center font-bold text-red-700 bg-transparent border-b border-transparent hover:border-red-300 focus:border-red-500 focus:outline-none"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-gray-700">
                                                ${Number(item.unitPrice || 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-mono text-gray-900">
                                                ${Number(item.totalAmount || 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-sm">
                                Cancel
                            </button>
                            <button
                                onClick={handleCommit}
                                disabled={committing}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold"
                            >
                                {committing ? (
                                    <><Loader2 size={16} className="animate-spin" /> Committing...</>
                                ) : (
                                    <><ShoppingCart size={16} /> Commit Z-Report</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── COMMITTED RESULT ── */}
            {committed && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <Check className="text-green-600" size={28} />
                        <div>
                            <h3 className="text-lg font-bold text-green-900">Z-Report Committed!</h3>
                            <p className="text-sm text-green-700">{committed.message}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-green-200 text-center">
                            <div className="text-2xl font-bold text-gray-900">{committed.adjustments?.length || 0}</div>
                            <div className="text-xs text-gray-500 mt-1">Items Processed</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-200 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {(committed.adjustments?.filter((a: any) => a.matched) || []).length}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Stock Updated</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-amber-200 text-center">
                            <div className="text-2xl font-bold text-amber-600">{committed.unmatchedCount || 0}</div>
                            <div className="text-xs text-gray-500 mt-1">Not Matched</div>
                        </div>
                    </div>

                    {committed.adjustments && committed.adjustments.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Product</th>
                                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Qty Deducted</th>
                                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {committed.adjustments.map((a: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2 text-gray-900">{a.productName}</td>
                                            <td className="px-4 py-2 text-center font-semibold text-red-600">-{a.qty}</td>
                                            <td className="px-4 py-2 text-center">
                                                {a.matched
                                                    ? <span className="text-green-600 font-medium text-xs">✓ Updated</span>
                                                    : <span className="text-amber-600 font-medium text-xs">⚠ Not Found</span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <button
                        onClick={() => { setFile(null); setParsedData(null); setCommitted(null); }}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                        Upload Another Z-Report
                    </button>
                </div>
            )}
        </div>
    );
}
