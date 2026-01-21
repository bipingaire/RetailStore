'use client';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SalesUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

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

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-gray-900 mb-8">Upload Sales Report</h1>

            <div className="bg-white p-8 rounded-xl border-2 border-dashed border-gray-300 text-center">
                <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                <h3 className="font-bold text-lg mb-2">Upload Z-Report / Sales CSV</h3>
                <p className="text-gray-500 mb-6">Drag and drop or click to select file</p>

                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                    accept=".csv,.pdf,.xls,.xlsx"
                />
                <label
                    htmlFor="file-upload"
                    className="inline-block bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                >
                    {file ? file.name : 'Select File'}
                </label>
            </div>

            {file && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full mt-6 bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="animate-spin" size={24} />
                            Processing Sales Data...
                        </>
                    ) : (
                        <>
                            <CheckCircle size={24} />
                            Confirm & Sync Sales
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
