'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Link, RefreshCw, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function POSMappingPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ needsMapping: 0, verified: 0 });
  const [mappings, setMappings] = useState<any[]>([]);

  useEffect(() => {
    // Simulating data fetch for UI match
    // In real app --> await apiClient.getPOSMappings()
    setTimeout(() => {
      setLoading(false);
      setMappings([]); // Start empty to match screenshot
    }, 500);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">POS Item Mapping</h1>
          </div>
          <p className="text-gray-500 text-sm">Connect raw POS text to clean inventory items.</p>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center gap-2 text-sm font-bold text-gray-600">
            <AlertCircle size={16} />
            Needs Mapping: {stats.needsMapping}
          </div>
          <div className="px-4 py-2 bg-green-50 border border-dashed border-green-200 rounded-lg flex items-center gap-2 text-sm font-bold text-green-600">
            <CheckCircle size={16} />
            Verified: {stats.verified}
          </div>
        </div>

        {/* Main Content Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
          {/* Table Toolbar */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              MAPPED ITEMS: {mappings.length}
            </span>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition text-xs font-bold"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-gray-400 font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 w-[25%] text-xs uppercase tracking-wide">POS Name (Raw)</th>
                  <th className="px-6 py-4 w-[10%] text-xs uppercase tracking-wide">Price</th>
                  <th className="px-6 py-4 w-[35%] text-xs uppercase tracking-wide">Linked Inventory Item</th>
                  <th className="px-6 py-4 w-[15%] text-xs uppercase tracking-wide">Status</th>
                  <th className="px-6 py-4 w-[15%] text-xs uppercase tracking-wide">AI Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mappings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center text-gray-400">
                      No mappings found or pending.
                    </td>
                  </tr>
                ) : (
                  mappings.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">{item.rawName}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">${item.price}</td>
                      <td className="px-6 py-4 text-gray-900">{item.linkedItem || '—'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-purple-600 text-xs font-bold">
                          <Sparkles size={14} />
                          High Confidence
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}