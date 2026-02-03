'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Check, AlertTriangle, Save, ArrowLeft, Package, FileText, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type InvoiceItem = {
    product_name: string;
    quantity: number;
    unit_cost: number;
    vendor_code?: string;
    upc?: string;
    expiry?: string;
};

type InvoiceDetails = {
    invoice_id: string;
    status: string;
    vendor_name?: string;
    invoice_number?: string;
    invoice_date?: string;
    total_amount?: number;
    total_pages?: number;
    pages_scanned?: number;
    line_items_json?: InvoiceItem[];
};

export default function InvoiceReviewPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const invoiceId = searchParams.get('id');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [progress, setProgress] = useState({ scanned: 0, total: 0, percent: 0 });

    useEffect(() => {
        if (!invoiceId) {
            router.push('/admin/invoices/scan');
            return;
        }

        // Poll for invoice processing status
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`${API_URL}/api/invoices/${invoiceId}`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                if (data.status === 'completed') {
                    clearInterval(pollInterval);
                    setInvoice(data);
                    setItems(data.line_items_json || []);
                    setLoading(false);
                    toast.success('Invoice processed successfully!');
                } else if (data.status === 'failed') {
                    clearInterval(pollInterval);
                    setLoading(false);
                    toast.error('Invoice processing failed');
                } else {
                    // Still processing
                    const total = data.total_pages || 1;
                    const scanned = data.pages_scanned || 0;
                    setProgress({
                        scanned,
                        total,
                        percent: Math.round((scanned / total) * 100)
                    });
                }
            } catch (error) {
                console.error('Error fetching invoice:', error);
            }
        }, 2000);

        return () => clearInterval(pollInterval);
    }, [invoiceId, router]);

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
        setItems(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const setExpiry = (index: number, days: number) => {
        const date = new Date();
        date.setDate(date.getDate() + days);
        updateItem(index, 'expiry', date.toISOString().split('T')[0]);
    };

    const handleSave = async () => {
        if (!invoice || items.length === 0) {
            toast.error('No items to save');
            return;
        }

        setSaving(true);

        try {
            const payload = {
                supplier_name: invoice.vendor_name || 'Unknown Vendor',
                invoice_number: invoice.invoice_number || `INV-${Date.now()}`,
                invoice_date: invoice.invoice_date || new Date().toISOString(),
                total_amount: invoice.total_amount || 0,
                items: items.map(item => ({
                    product_name: item.product_name,
                    quantity: item.quantity,
                    unit_cost: item.unit_cost,
                    upc_code: item.upc || null
                }))
            };

            const response = await fetch(`${API_URL}/api/invoices/process`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success('✅ Invoice committed to inventory!');
                setTimeout(() => router.push('/admin/invoices/scan'), 1500);
            } else {
                throw new Error('Failed to commit invoice');
            }
        } catch (error: any) {
            toast.error(`Failed to save: ${error.message}`);
        }

        setSaving(false);
    };

    const handleCancel = () => {
        router.push('/admin/invoices/scan');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-12 max-w-md w-full text-center">
                    <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-6" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Invoice...</h2>
                    <p className="text-gray-600 mb-6">AI is extracting line items and metadata</p>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${Math.max(5, progress.percent)}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-500">
                        Page {progress.scanned} of {progress.total || '?'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="text-blue-600" size={28} />
                                Review Invoice
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Verify extracted data before committing to inventory
                            </p>
                        </div>
                    </div>
                </div>

                {/* Invoice Metadata */}
                {invoice && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Vendor</label>
                                <div className="font-semibold text-gray-900">{invoice.vendor_name || 'Unknown'}</div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Invoice #</label>
                                <div className="font-mono text-sm text-blue-600">{invoice.invoice_number || 'N/A'}</div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block flex items-center gap-1">
                                    <Calendar size={12} /> Date
                                </label>
                                <div className="text-gray-900">{invoice.invoice_date || 'N/A'}</div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block flex items-center gap-1">
                                    <DollarSign size={12} /> Total
                                </label>
                                <div className="font-bold text-green-600 text-lg">
                                    ${invoice.total_amount?.toFixed(2) || '0.00'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Line Items Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Package size={18} className="text-gray-500" />
                            <h2 className="font-bold text-gray-900">Extracted Items ({items.length})</h2>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => items.forEach((_, i) => setExpiry(i, 7))} className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">+7 Days All</button>
                            <button onClick={() => items.forEach((_, i) => setExpiry(i, 30))} className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">+30 Days All</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-3 text-left">#</th>
                                    <th className="px-6 py-3 text-left">Product Name</th>
                                    <th className="px-6 py-3 text-left w-32">Vendor Code</th>
                                    <th className="px-6 py-3 text-left w-32">UPC</th>
                                    <th className="px-6 py-3 text-center w-24">Qty</th>
                                    <th className="px-6 py-3 text-right w-32">Unit Cost</th>
                                    <th className="px-6 py-3 text-left w-48">Expiry Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 group">
                                        <td className="px-6 py-4 text-gray-500 font-medium">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={item.product_name}
                                                onChange={(e) => updateItem(idx, 'product_name', e.target.value)}
                                                className="w-full border-none bg-transparent p-0 font-medium text-gray-900 focus:ring-0"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={item.vendor_code || ''}
                                                onChange={(e) => updateItem(idx, 'vendor_code', e.target.value)}
                                                className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded px-2 py-1"
                                                placeholder="SKU"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={item.upc || ''}
                                                onChange={(e) => updateItem(idx, 'upc', e.target.value)}
                                                className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded px-2 py-1"
                                                placeholder="UPC"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                                                className="w-full border border-gray-200 rounded p-1.5 text-center font-semibold"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative">
                                                <span className="absolute left-2 top-1.5 text-gray-400 text-xs">$</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.unit_cost}
                                                    onChange={(e) => updateItem(idx, 'unit_cost', parseFloat(e.target.value))}
                                                    className="w-full border border-gray-200 rounded p-1.5 pl-5 text-right font-mono"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="date"
                                                value={item.expiry || ''}
                                                onChange={(e) => updateItem(idx, 'expiry', e.target.value)}
                                                className={`w-full border rounded p-1.5 text-xs ${!item.expiry ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                            />
                                            <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setExpiry(idx, 7)} className="text-[10px] bg-blue-50 px-1.5 py-0.5 rounded text-blue-600 hover:bg-blue-100">+7d</button>
                                                <button onClick={() => setExpiry(idx, 30)} className="text-[10px] bg-blue-50 px-1.5 py-0.5 rounded text-blue-600 hover:bg-blue-100">+30d</button>
                                                <button onClick={() => setExpiry(idx, 365)} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 hover:bg-gray-200">+1y</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {items.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <AlertTriangle className="mx-auto mb-4" size={48} />
                            <p className="font-medium">No items extracted from invoice</p>
                            <p className="text-sm">The AI couldn't find any line items in the uploaded document.</p>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                            {items.filter(i => !i.expiry).length > 0 && (
                                <span className="flex items-center gap-2 text-yellow-600">
                                    <AlertTriangle size={16} />
                                    {items.filter(i => !i.expiry).length} items missing expiry date
                                </span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || items.length === 0}
                                className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                                Commit to Inventory
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
