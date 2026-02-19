'use client';
import { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function ZReportUploadPage() {
    // Supabase removed - refactor needed
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    async function handleUpload() {
        if (!file) return;

        setUploading(true);
        setError('');
        setResult(null);

        try {
            // 1. Create FormData
            const formData = new FormData();
            formData.append('file', file);

            // 2. Call Backend API
            const response = await apiClient.post('/reports/z-report/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // 3. Set Result
            // Backend returns: { message: string, data: { ...report, lineItems: [] } }
            // We need to match the UI expectations.
            // If backend returns data inside `data` property of response.data:
            if (response.data && response.data.data) {
                setResult(response.data.data);
            } else {
                setResult(response.data);
            }

        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.response?.data?.message || err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Upload Z-Report</h1>
                <p className="text-gray-500 mt-1">Daily sales report from your POS system</p>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />

                <input
                    type="file"
                    accept=".pdf,.txt,.csv"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                />

                <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                    Choose Z-Report File
                </label>

                {file && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                        <FileText size={16} />
                        <span>{file.name}</span>
                    </div>
                )}
            </div>

            {/* Upload Button */}
            {file && !result && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Processing Z-Report...
                        </>
                    ) : (
                        <>
                            <Upload size={20} />
                            Upload & Process
                        </>
                    )}
                </button>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <XCircle className="text-red-600 flex-shrink-0" size={20} />
                    <div>
                        <h3 className="font-semibold text-red-900">Upload Failed</h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Success Result */}
            {result && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="text-green-600" size={24} />
                        <h3 className="font-bold text-green-900 text-lg">Z-Report Processed Successfully!</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                            <div className="text-sm text-gray-600 mb-1">Report Date</div>
                            <div className="text-lg font-bold text-gray-900">
                                {new Date(result.reportDate).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-green-200">
                            <div className="text-sm text-gray-600 mb-1">Total Sales</div>
                            <div className="text-lg font-bold text-green-600">
                                ${typeof result.totalSales === 'number' ? result.totalSales.toFixed(2) : parseFloat(result.totalSales || '0').toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-green-200">
                            <div className="text-sm text-gray-600 mb-1">Transactions</div>
                            <div className="text-lg font-bold text-gray-900">
                                {result.transactionCount || 0}
                            </div>
                        </div>
                    </div>

                    {result.lineItems && result.lineItems.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Parsed Line Items ({result.lineItems.length})</h4>
                            <div className="bg-white rounded-lg border border-green-200 overflow-hidden max-h-64 overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                                        <tr>
                                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">SKU</th>
                                            <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Product</th>
                                            <th className="text-right px-4 py-2 text-xs font-semibold text-gray-600">Qty Sold</th>
                                            <th className="text-right px-4 py-2 text-xs font-semibold text-gray-600">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {result.lineItems.map((item: any, idx: number) => (
                                            <tr key={idx}>
                                                <td className="px-4 py-2 font-mono text-xs">{item.skuCode}</td>
                                                <td className="px-4 py-2">{item.productName}</td>
                                                <td className="px-4 py-2 text-right font-semibold">{item.quantitySold}</td>
                                                <td className="px-4 py-2 text-right">${typeof item.totalAmount === 'number' ? item.totalAmount.toFixed(2) : item.totalAmount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => { setFile(null); setResult(null); }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Upload Another Report
                    </button>
                </div>
            )}
        </div>
    );
}
