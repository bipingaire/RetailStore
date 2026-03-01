'use client';
import { useState, useRef, useEffect } from 'react';
import {
  UploadCloud, FileText, CheckCircle, AlertTriangle,
  Loader2, Link as LinkIcon, ShieldCheck, ShoppingCart, X, Minus, Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function SalesSyncPage() {
  // ── POS settings ──────────────────────────────────────────────
  const [posProvider, setPosProvider] = useState('square');
  const [posApiKey, setPosApiKey] = useState('');
  const [posEndpoint, setPosEndpoint] = useState('');

  // ── Z-Report OCR state ────────────────────────────────────────
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [committed, setCommitted] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load saved POS settings ───────────────────────────────────
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [provider, key, endpoint] = await Promise.all([
          apiClient.get('/settings/pos_provider'),
          apiClient.get('/settings/pos_api_key'),
          apiClient.get('/settings/pos_endpoint'),
        ]);
        if (provider?.value) setPosProvider(provider.value);
        if (key?.value) setPosApiKey(key.value);
        if (endpoint?.value) setPosEndpoint(endpoint.value);
      } catch { /* silent */ }
    };
    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await Promise.all([
        apiClient.post('/settings', { key: 'pos_provider', value: posProvider }),
        apiClient.post('/settings', { key: 'pos_api_key', value: posApiKey }),
        apiClient.post('/settings', { key: 'pos_endpoint', value: posEndpoint }),
      ]);
      toast.success('POS credentials saved');
    } catch {
      toast.error('Failed to save settings');
    }
  };

  // ── Step 1: Upload → OCR parse ────────────────────────────────
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setParsedData(null);
    setCommitted(null);
    const loadingToast = toast.loading('📄 AI is scanning Z-Report...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Call the OCR parse endpoint (not the legacy upload endpoint)
      const result = await apiClient.post('/reports/z-report/parse', formData);

      toast.dismiss(loadingToast);
      toast.success('Z-Report scanned! Review items and commit.');
      setParsedData(result);
      setShowModal(true);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      const msg = err?.message || 'OCR parsing failed';
      toast.error('Z-Report error: ' + msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Step 2: Commit → inventory out ───────────────────────────
  const handleCommit = async () => {
    if (!parsedData) return;
    setCommitting(true);
    const loadingToast = toast.loading('Committing to inventory...');
    try {
      const result = await apiClient.post('/reports/z-report/commit', parsedData);
      setCommitted(result);
      setShowModal(false);
      toast.dismiss(loadingToast);
      toast.success('Inventory updated successfully!');
    } catch (err: any) {
      toast.dismiss(loadingToast);
      toast.error(err?.message || 'Commit failed');
    } finally {
      setCommitting(false);
    }
  };

  const updateItem = (idx: number, field: string, value: any) => {
    const newItems = [...parsedData.items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    setParsedData({ ...parsedData, items: newItems });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Daily Sales Sync</h1>
          <p className="text-sm text-gray-500">Upload your POS Z-Report — AI scans it and deducts sold inventory automatically.</p>
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
                onClick={saveSettings}
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
                <h3 className="text-lg font-bold text-gray-900">AI Scanning Z-Report...</h3>
                <p className="text-sm text-gray-500 mt-1">Extracting items with OpenAI Vision</p>
              </>
            ) : (
              <label className="cursor-pointer w-full h-full flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100/50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Upload Z-Report</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm">
                  Drop your POS End-of-Day PDF or Image here. AI scans it, you review, then commit to deduct stock.
                </p>
                <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,image/*" onChange={handleUpload} />
                <button className="mt-6 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg text-sm shadow-sm hover:bg-gray-50">
                  Select File
                </button>
              </label>
            )}
          </div>
        </div>

        {/* COMMITTED RESULT */}
        {committed && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <h3 className="font-bold text-green-900">Z-Report Committed!</h3>
                <p className="text-sm text-green-700">{committed.message}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 border border-green-200 text-center">
                <div className="text-2xl font-bold">{committed.adjustments?.length || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Items Processed</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-600">{(committed.adjustments?.filter((a: any) => a.matched) || []).length}</div>
                <div className="text-xs text-gray-500 mt-1">Stock Updated</div>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-200 text-center">
                <div className="text-2xl font-bold text-amber-600">{committed.unmatchedCount || 0}</div>
                <div className="text-xs text-gray-500 mt-1">Not Matched</div>
              </div>
            </div>
            {committed.adjustments?.length > 0 && (
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
                            : <span className="text-amber-600 font-medium text-xs">⚠ Not Found</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button onClick={() => setCommitted(null)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Upload Another Z-Report
            </button>
          </div>
        )}

      </div>

      {/* ── REVIEW MODAL ─────────────────────────────────────────── */}
      {showModal && parsedData && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[98vw] max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Review Z-Report</h2>
                <p className="text-sm text-gray-500">Verify scanned items before deducting from inventory</p>
              </div>
              <div className="flex gap-3 items-center">
                <button
                  onClick={handleCommit}
                  disabled={committing}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
                >
                  {committing
                    ? <><Loader2 size={16} className="animate-spin" /> Committing...</>
                    : <><ShoppingCart size={16} /> Commit — Inventory Out</>}
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
                  <p className="text-xs text-gray-500">Items Scanned</p>
                  <p className="text-base font-bold text-gray-900">{parsedData.items?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-amber-500" />
                <span className="text-xs text-amber-700">These quantities will be <strong>deducted from stock</strong> when you commit.</span>
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
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-sm">Cancel</button>
              <button
                onClick={handleCommit}
                disabled={committing}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold"
              >
                {committing
                  ? <><Loader2 size={16} className="animate-spin" /> Committing...</>
                  : <><ShoppingCart size={16} /> Commit Z-Report</>}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}