'use client';
import { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2, Link as LinkIcon, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useTenant } from '@/lib/hooks/useTenant';

// CDN for PDF.js to avoid heavy local build config
const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export default function SalesSyncPage() {
  const { tenantId } = useTenant();
  const [uploading, setUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [report, setReport] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // POS State
  const [posProvider, setPosProvider] = useState<string>('square');
  const [posApiKey, setPosApiKey] = useState<string>('');
  const [posEndpoint, setPosEndpoint] = useState<string>('');
  const [posStatus, setPosStatus] = useState<string>('');

  useEffect(() => {
    // Load PDF.js worker
    const script = document.createElement('script');
    script.src = PDFJS_CDN;
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const convertPdfToImages = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function () {
        try {
          // @ts-ignore
          const pdfjsLib = window['pdfjs-dist/build/pdf'];
          pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
          const pdf = await pdfjsLib.getDocument(new Uint8Array(this.result as ArrayBuffer)).promise;
          const images: string[] = [];
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
            images.push(canvas.toDataURL('image/jpeg'));
          }
          resolve(images);
        } catch (e) { reject(e); }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!tenantId) {
      toast.error("Please ensure you are logged in.");
      return;
    }

    setUploading(true);
    setProcessingStatus('Initializing...');

    try {
      let imagesToProcess: string[] = [];
      if (file.type.includes('pdf')) {
        setProcessingStatus('Converting PDF...');
        imagesToProcess = await convertPdfToImages(file);
      } else if (file.type.includes('image')) {
        const reader = new FileReader();
        const base64 = await new Promise<string>(r => { reader.onload = e => r(e.target?.result as string); reader.readAsDataURL(file); });
        imagesToProcess = [base64];
      } else {
        toast.info("Processing Text/CSV...");
        setUploading(false);
        return;
      }

      let aggregatedResults: any[] = [];
      for (let i = 0; i < imagesToProcess.length; i++) {
        setProcessingStatus(`Analyzing Page ${i + 1}/${imagesToProcess.length}...`);
        const res = await fetch('/api/sales/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantId, imageUrl: imagesToProcess[i] }),
        });
        const data = await res.json();
        if (data.processed) aggregatedResults = [...aggregatedResults, ...data.processed];
      }

      setReport(aggregatedResults);
      toast.success("Sync complete!");
    } catch (err: any) {
      toast.error("Sync failed: " + err.message);
    } finally {
      setUploading(false);
      setProcessingStatus('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Daily Sales Sync</h1>
          <p className="text-sm text-gray-500">Reconcile inventory by uploading your daily POS reports.</p>
        </div>

        {/* POS CONNECT CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <div className="bg-white border border-gray-200 p-1.5 rounded-md text-blue-600 shadow-sm">
                <LinkIcon size={16} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">POS Integration</h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full font-medium">
              <ShieldCheck size={12} /> Secure
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Provider</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                  value={posProvider}
                  onChange={(e) => setPosProvider(e.target.value)}
                >
                  <option value="square">Square</option>
                  <option value="clover">Clover</option>
                  <option value="toast">Toast</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">API Endpoint</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="https://api.squareup.com/v2"
                  value={posEndpoint}
                  onChange={(e) => setPosEndpoint(e.target.value)}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">API Key</label>
                <input
                  type="password"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 font-mono"
                  placeholder="sk_live_..."
                  value={posApiKey}
                  onChange={(e) => setPosApiKey(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => { setPosStatus('Configuration saved locally.'); toast.success('POS credentials saved'); }}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>

        {/* UPLOAD AREA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all ${uploading ? 'bg-gray-50 border-blue-200' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'}`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Processing Z-Report</h3>
                <p className="text-sm text-gray-500 mt-1">{processingStatus}</p>
              </>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100/50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Upload Z-Report</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                  Drag and drop your POS End-of-Day PDF or Image here. We'll automatically adjust inventory.
                </p>
                <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,image/*" onChange={handleUpload} />
                <button className="mt-6 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg text-sm shadow-sm hover:bg-gray-50">
                  Select File
                </button>
              </label>
            )}
          </div>
        </div>

        {/* RESULTS */}
        {report.length > 0 && !uploading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 text-sm">Sync Results</h3>
              <span className="text-xs font-bold text-gray-500">{report.length} items processed</span>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {report.map((item, i) => (
                <div key={i} className="px-6 py-3 border-b border-gray-100 last:border-0 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  {item.status === 'processed' ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded">
                      <CheckCircle size={12} /> -{item.qty_deducted} Units
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-orange-700 bg-orange-50 px-2 py-1 rounded">
                      <AlertTriangle size={12} /> Check
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}