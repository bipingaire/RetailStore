'use client';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Upload, FileText, CheckCircle, Loader2, Link as LinkIcon, ShieldCheck, CloudUpload } from 'lucide-react';
import { toast } from 'sonner';

export default function SalesSyncPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [config, setConfig] = useState({
        provider: 'Square',
        endpoint: '',
        apiKey: ''
    });

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);

        try {
            // Upload file first
            const uploadRes = await apiClient.uploadFile(file, 'z_report');

            // Trigger sync
            await apiClient.syncSales({
                report_url: uploadRes.url,
                date: new Date().toISOString()
            });

            toast.success('Sales synced successfully!');
            setFile(null);
        } catch (error) {
            toast.error('Failed to sync sales');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveConfig = () => {
        toast.success('POS Configuration Saved');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900">Daily Sales Sync</h1>
                    <p className="text-gray-500 mt-1">Reconcile inventory by uploading your daily POS reports.</p>
                </div>

                <div className="space-y-6">
                    {/* POS Integration Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                                <LinkIcon size={20} className="text-blue-600" />
                                <h3>POS Integration</h3>
                            </div>
                            <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
                                <ShieldCheck size={14} />
                                Secure
                            </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Provider</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    value={config.provider}
                                    onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                                >
                                    <option>Square</option>
                                    <option>Clover</option>
                                    <option>Toast</option>
                                    <option>Shopify POS</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">API Endpoint</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    placeholder="https://api.squareup.com/v2"
                                    value={config.endpoint}
                                    onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mb-6 space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">API Key</label>
                            <input
                                type="password"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition font-mono"
                                placeholder="sk_live_..."
                                value={config.apiKey}
                                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveConfig}
                                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-black transition-colors"
                            >
                                Save Configuration
                            </button>
                        </div>
                    </div>

                    {/* Upload Z-Report Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors group">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                                <CloudUpload className="text-blue-600" size={32} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900 mb-2">Upload Z-Report</h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                Drag and drop your POS End-of-Day PDF or Image here. We'll automatically adjust inventory.
                            </p>

                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="hidden"
                                id="file-upload"
                                accept=".csv,.pdf,.xls,.xlsx,.jpg,.png"
                            />

                            {file ? (
                                <div className="max-w-xs mx-auto">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-green-800 text-sm font-medium">
                                        <FileText size={16} />
                                        {file.name}
                                    </div>
                                    <button
                                        onClick={handleUpload}
                                        disabled={uploading}
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Syncing...
                                            </>
                                        ) : (
                                            'Sync Now'
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <label
                                    htmlFor="file-upload"
                                    className="inline-block bg-white border border-gray-300 text-gray-700 font-bold px-8 py-3 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
                                >
                                    Select File
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
