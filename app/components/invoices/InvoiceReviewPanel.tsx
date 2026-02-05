'use client';
import { useState, useEffect } from 'react';
import { Loader2, Check, AlertTriangle, Package, Calendar, DollarSign, X } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

type InvoiceItem = {
    product_name: string;
    quantity: number;
    unit_cost: number;
    total_price?: number;
    category?: string;
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

interface InvoiceReviewPanelProps {
    invoiceId: string;
    onClose: () => void;
    onCommitSuccess: () => void;
}

export default function InvoiceReviewPanel({ invoiceId, onClose, onCommitSuccess }: InvoiceReviewPanelProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [progress, setProgress] = useState({ scanned: 0, total: 0, percent: 0 });

    useEffect(() => {
        if (!invoiceId) return;

        // Poll for invoice processing status
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`${API_URL}/api/invoices/${invoiceId}`, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) return;

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
    }, [invoiceId]);

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
                    category_name: item.category || 'Uncategorized', # Mapped to backend
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
                onCommitSuccess();
            } else {
                throw new Error('Failed to commit invoice');
            }
        } catch (error: any) {
            toast.error(`Failed to save: ${error.message}`);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8 mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="max-w-md mx-auto">
                    <Loader2 className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Processing Invoice...</h3>
                    <p className="text-sm text-gray-600 mb-4">AI is extracting line items and metadata</p>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${Math.max(5, progress.percent)}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400">Page {progress.scanned} of {progress.total || '?'}</p>
                </div>
            </div>
        );
    }

    if (!invoice) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header */}
            <div className="bg-blue-50/50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Check className="text-green-600" size={20} />
                        Review Extracted Data
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">Please verify items before committing to inventory</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="p-6">
                {/* Invoice Metadata */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Vendor</label>
                            <div className="font-semibold text-gray-900">{invoice.vendor_name || 'Unknown'}</div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Invoice #</label>
                            <div className="font-mono text-sm text-blue-600">{invoice.invoice_number || 'N/A'}</div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block flex items-center gap-1">
                                <Calendar size={10} /> Date
                            </label>
                            <div className="text-gray-900">{invoice.invoice_date || 'N/A'}</div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block flex items-center gap-1">
                                <DollarSign size={10} /> Total
                            </label>
                            <div className="font-bold text-green-600 text-lg">
                                ${invoice.total_amount?.toFixed(2) || '0.00'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Package size={14} className="text-gray-500" />
                            <span className="text-xs font-bold text-gray-600">Items ({items.length})</span>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => items.forEach((_, i) => setExpiry(i, 7))} className="px-2 py-0.5 text-[10px] bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-colors">+7d</button>
                            <button onClick={() => items.forEach((_, i) => setExpiry(i, 30))} className="px-2 py-0.5 text-[10px] bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-colors">+30d</button>
                        </div>
                    </div>

                    <div className="overflow-x-auto max-h-[400px]">
                        <table className="w-full">
                            <thead className="bg-white border-b border-gray-100 text-gray-400 text-[10px] uppercase font-bold sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-2 text-left bg-gray-50/80 backdrop-blur">Product</th>
                                    <th className="px-4 py-2 text-left w-24 bg-gray-50/80 backdrop-blur">Code</th>
                                    <th className="px-4 py-2 text-left w-32 bg-gray-50/80 backdrop-blur">Category</th>
                                    <th className="px-4 py-2 text-center w-20 bg-gray-50/80 backdrop-blur">Qty</th>
                                    <th className="px-4 py-2 text-right w-24 bg-gray-50/80 backdrop-blur">Cost</th>
                                    <th className="px-4 py-2 text-left w-32 bg-gray-50/80 backdrop-blur">Expiry</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-blue-50/30 group text-sm">
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={item.product_name}
                                                onChange={(e) => updateItem(idx, 'product_name', e.target.value)}
                                                className="w-full border-none bg-transparent p-0 font-medium text-gray-900 focus:ring-0 placeholder-gray-300"
                                                placeholder="Product Name"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={item.vendor_code || ''}
                                                onChange={(e) => updateItem(idx, 'vendor_code', e.target.value)}
                                                className="w-full text-xs font-mono bg-transparent border-none p-0 focus:ring-0 text-gray-600"
                                                placeholder="SKU"
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="text"
                                                value={item.category || ''}
                                                onChange={(e) => updateItem(idx, 'category', e.target.value)}
                                                className="w-full text-xs bg-transparent border-none p-0 focus:ring-0 text-gray-600 truncate"
                                                placeholder="Uncategorized"
                                                list="categories"
                                            />
                                            <datalist id="categories">
                                                <option value="Food" />
                                                <option value="Beverage" />
                                                <option value="Household" />
                                                <option value="Tobacco" />
                                                <option value="Personal Care" />
                                                <option value="Automotive" />
                                            </datalist>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                                                className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-center font-semibold text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="relative">
                                                <span className="absolute left-1.5 top-1.5 text-gray-400 text-xs">$</span>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.unit_cost}
                                                    onChange={(e) => updateItem(idx, 'unit_cost', parseFloat(e.target.value))}
                                                    className="w-full bg-white border border-gray-200 rounded px-2 py-1 pl-4 text-right font-mono text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="date"
                                                value={item.expiry || ''}
                                                onChange={(e) => updateItem(idx, 'expiry', e.target.value)}
                                                className={`w-full border rounded px-2 py-1 text-xs ${!item.expiry ? 'border-orange-200 bg-orange-50 text-orange-800' : 'border-gray-200 bg-white'}`}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || items.length === 0}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                        Commit to Inventory
                    </button>
                </div>
            </div>
        </div>
    );
}
