'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, UploadCloud, FileText, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type InvoiceRecord = {
    invoice_id: string;
    supplier: string | null;
    invoice_number: string | null;
    total_amount: number;
    status: string;
    created_at: string;
};

export default function InvoiceUploadPage() {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const [history, setHistory] = useState<InvoiceRecord[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        console.log('[[ VERSION CHECK: v2026-02-04-FINAL ]] - IF YOU SEE THIS, NEW CODE IS RUNNING');
        console.log('[Invoice Page] Fetching invoices...');
        try {
            const res = await fetch(`${API_URL}/api/invoices`);
            const json = await res.json();
            console.log('[Invoice Page] Invoices fetched:', json);

            if (json.invoices) {
                const processed = json.invoices.slice(0, 10);
                console.log('[Invoice Page] Processed invoice list:', processed);
                setHistory(processed);
            }
        } catch (err) {
            console.error('Failed to fetch history', err);
        }
        setLoadingHistory(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('[Invoice Upload] File input changed');
        const file = e.target.files?.[0];
        if (!file) return;

        console.log('[Invoice Upload] File selected:', file.name, file.size, 'bytes');
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            console.log('[Invoice Upload] Starting upload...');
            const response = await fetch(`${API_URL}/api/invoices/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[Invoice Upload] Upload successful:', data);

            toast.success('📄 Invoice uploaded! Opening review...');

            // Open review page in new window (popup)
            const reviewUrl = `/admin/invoices/review?id=${data.invoice_id}`;
            console.log('[Invoice Upload] Opening review window:', reviewUrl);
            console.log('[[ TRIGGERING POPUP NOW ]]');

            window.open(reviewUrl, '_blank', 'width=1400,height=900,scrollbars=yes,resizable=yes');

        } catch (error: any) {
            console.error('[Invoice Upload] Error:', error);
            toast.error(`Upload failed: ${error.message}`);
            setUploading(false);
        }
    };

    const viewInvoice = (invoiceId: string) => {
        router.push(`/admin/invoices/review?id=${invoiceId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FileText className="text-purple-600" size={32} />
                        Invoice Scanner
                    </h1>
                    <p className="text-gray-500 mt-2">Upload invoices to extract and review line items with AI</p>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                    <div
                        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${uploading
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer'
                            }`}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Uploading Invoice...</h3>
                                <p className="text-gray-500">Please wait while we process your document</p>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Invoice</h3>
                                <p className="text-gray-500 mb-4">Drag and drop or click to browse</p>
                                <p className="text-xs text-gray-400">Supports PDF, JPG, PNG (max 10MB)</p>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />

                                <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors">
                                    <UploadCloud size={20} />
                                    Choose File
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Recent Invoices */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <Clock size={18} className="text-gray-500" />
                            Recent Uploads
                        </h2>
                    </div>

                    {loadingHistory ? (
                        <div className="p-12 text-center">
                            <Loader2 className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">Loading history...</p>
                        </div>
                    ) : history.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-3 text-left">Invoice ID</th>
                                    <th className="px-6 py-3 text-left">Vendor</th>
                                    <th className="px-6 py-3 text-left">Invoice #</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                    <th className="px-6 py-3 text-center">Status</th>
                                    <th className="px-6 py-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.map((inv) => (
                                    <tr key={inv.invoice_id} className="hover:bg-gray-50 group">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs text-gray-500">
                                                {inv.invoice_id.slice(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {inv.supplier || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-blue-600">
                                            {inv.invoice_number || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-green-600">
                                            ${inv.total_amount?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {inv.status === 'completed' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                                                    <CheckCircle size={12} />
                                                    Completed
                                                </span>
                                            ) : inv.status === 'processing' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                                    <Loader2 size={12} className="animate-spin" />
                                                    Processing
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                    {inv.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => viewInvoice(inv.invoice_id)}
                                                className="text-blue-600 hover:text-blue-700 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-gray-400">
                            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p className="font-medium">No invoices uploaded yet</p>
                            <p className="text-sm">Upload your first invoice to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
