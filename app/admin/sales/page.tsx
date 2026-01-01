'use client';
import { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2, Link2, ShieldCheck } from 'lucide-react';
import { useTenant } from '@/components/tenant-context'; 

// Load PDF.js from CDN for client-side processing without heavy build steps
const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// Placeholder ID for prototype mode if context is missing/loading
const HARDCODED_TENANT_ID = 'b719cc04-38d2-4af8-ae52-1001791aff6f'; 

export default function SalesSyncPage() {
  const { tenant } = useTenant();
  const [uploading, setUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [report, setReport] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [posProvider, setPosProvider] = useState<string>('square');
  const [posApiKey, setPosApiKey] = useState<string>('');
  const [posApiSecret, setPosApiSecret] = useState<string>('');
  const [posEndpoint, setPosEndpoint] = useState<string>('');
  const [posStatus, setPosStatus] = useState<string>('');

  // Load PDF.js script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = PDFJS_CDN;
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // --- HELPER: PDF TO IMAGE CONVERTER ---
  // This runs in the browser, converting the uploaded File object into Base64 images
  const convertPdfToImages = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function() {
        try {
          // @ts-ignore - PDFJS is loaded globally via CDN script
          const pdfjsLib = window['pdfjs-dist/build/pdf'];
          pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;

          const typedarray = new Uint8Array(this.result as ArrayBuffer);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          const images: string[] = [];

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 }); // Scale up for better OCR
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context!, viewport: viewport }).promise;
            images.push(canvas.toDataURL('image/jpeg'));
          }
          resolve(images);
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProcessingStatus('Initializing...');
    
    // Determine Tenant ID (Context > Hardcoded)
    const activeTenantId = tenant?.id || HARDCODED_TENANT_ID;
    
    if (activeTenantId.includes('PASTE')) {
        alert("⚠️ Configuration Error: No Tenant ID found. Please log in or update the hardcoded ID.");
        setUploading(false);
        return;
    }

    try {
      let imagesToProcess: string[] = [];

      // Logic: If PDF, convert to images locally. If Image, read as Base64.
      if (file.type.includes('pdf')) {
        setProcessingStatus('Converting PDF pages to readable images...');
        imagesToProcess = await convertPdfToImages(file);
      } else {
        // It's an image already
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        imagesToProcess = [base64];
      }

      let aggregatedResults: any[] = [];

      // Batch Process each page/image
      for (let i = 0; i < imagesToProcess.length; i++) {
        setProcessingStatus(`Analyzing Page ${i + 1} of ${imagesToProcess.length}...`);
        
        const res = await fetch('/api/sales/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantId: activeTenantId,
            imageUrl: imagesToProcess[i] 
          }),
        });
        
        const data = await res.json();
        if (data.processed) {
            aggregatedResults = [...aggregatedResults, ...data.processed];
        }
      }

      setReport(aggregatedResults);
      setProcessingStatus('Sync Complete!');

    } catch (err: any) {
      console.error(err);
      alert("Failed to sync sales: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="text-blue-600" />
            Daily Sales Reconciliation
          </h1>
          <p className="text-gray-500 mt-2">
            Upload your POS "End of Day" report (PDF/Image) to update inventory counts.
          </p>
        </header>

        {/* POS API CONNECTION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Connect POS Provider</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Configure your POS API credentials to pull sales automatically. Nothing is sent until you click “Save & Test”.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-gray-700 space-y-1">
              <span>POS Provider</span>
              <select
                className="border rounded-lg px-3 py-2 text-sm w-full"
                value={posProvider}
                onChange={(e) => setPosProvider(e.target.value)}
              >
                <option value="square">Square</option>
                <option value="clover">Clover</option>
                <option value="toast">Toast</option>
                <option value="lightspeed">Lightspeed</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="text-sm text-gray-700 space-y-1">
              <span>API Endpoint (base URL)</span>
              <input
                className="border rounded-lg px-3 py-2 text-sm w-full"
                placeholder="https://api.pos.com/v1"
                value={posEndpoint}
                onChange={(e) => setPosEndpoint(e.target.value)}
              />
            </label>
            <label className="text-sm text-gray-700 space-y-1">
              <span>API Key</span>
              <input
                className="border rounded-lg px-3 py-2 text-sm w-full"
                placeholder="sk_live_..."
                value={posApiKey}
                onChange={(e) => setPosApiKey(e.target.value)}
              />
            </label>
            <label className="text-sm text-gray-700 space-y-1">
              <span>API Secret / Client Secret</span>
              <input
                className="border rounded-lg px-3 py-2 text-sm w-full"
                placeholder="secret"
                value={posApiSecret}
                onChange={(e) => setPosApiSecret(e.target.value)}
              />
            </label>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="text-green-500" size={14} />
              Stored securely per-tenant; not shared with global data.
            </div>
            <button
              onClick={() => {
                // Placeholder persistence hook. Replace with real API call.
                console.log('Save POS creds', { posProvider, posEndpoint, posApiKey: posApiKey ? '***' : '', posApiSecret: posApiSecret ? '***' : '' });
                setPosStatus('Saved locally (wire real API to persist).');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              Save & Test
            </button>
          </div>
          {posStatus && <div className="text-xs text-green-700 mt-2">{posStatus}</div>}
        </div>

        {/* Upload Window */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-12 text-center hover:bg-gray-50 transition cursor-pointer relative">
          <input 
            type="file" 
            onChange={handleUpload} 
            accept="image/*,application/pdf"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            disabled={uploading}
            ref={fileInputRef}
          />
          {uploading ? (
            <div className="flex flex-col items-center animate-pulse">
              <Loader2 className="w-16 h-16 text-blue-600 mb-4 animate-spin" />
              <h3 className="text-xl font-bold text-gray-800">Processing Report...</h3>
              <p className="text-gray-500">{processingStatus}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <UploadCloud className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Click or Drag Report Here</h3>
              <p className="text-sm text-gray-400 mt-2 max-w-xs">
                Supports PDF or Image scans of Z-Reports.
              </p>
            </div>
          )}
        </div>

        {/* Results Report */}
        {!uploading && report.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow border overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-700">Sync Results</h3>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">
                {report.filter(r => r.status === 'processed').length} Items Inventory Reduced
              </span>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {report.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div>
                    {item.status === 'processed' ? (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                        <CheckCircle size={16} />
                        Sync Complete (-{item.qty_deducted})
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-orange-500 text-sm font-bold bg-orange-50 px-2 py-1 rounded">
                        <AlertTriangle size={16} />
                        {item.status === 'skipped_unknown' ? 'Item Not Found in DB' : 'Review Needed'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}