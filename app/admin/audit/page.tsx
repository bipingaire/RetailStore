'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ClipboardCheck, Search, Save, RefreshCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AuditItem = {
  id: string;
  name: string;
  image: string;
  category: string;
  expected: number;
  actual: number;
  price: number;
};

export default function AuditPage() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadInventory() {
      const { data, error } = await supabase
        .from('store_inventory')
        .select(`
          id, price,
          global_products ( name, image_url, category ),
          inventory_batches ( batch_quantity )
        `)
        .eq('is_active', true);

      if (error) {
        setLoading(false);
        return;
      }

      const loadedItems = (data || []).map((i: any) => {
        const batches = i.inventory_batches || [];
        const totalQty = batches.reduce((sum: number, b: any) => sum + (b.batch_quantity || 0), 0);
        return {
          id: i.id,
          name: i.global_products?.name || 'Unknown Item',
          image: i.global_products?.image_url || '',
          category: i.global_products?.category || 'Uncategorized',
          price: i.price || 0,
          expected: totalQty,
          actual: totalQty,
        };
      });

      const cats = Array.from(new Set(loadedItems.map((i: any) => i.category || 'Uncategorized'))) as string[];
      setCategories(['All', ...cats]);
      setItems(loadedItems);
      setLoading(false);
    }
    loadInventory();
  }, []);

  const handleCountChange = (id: string, value: string | number) => {
    const newCount = value === '' ? 0 : parseInt(String(value));
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, actual: isNaN(newCount) ? 0 : Math.max(0, newCount) } : item
    ));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const TENANT_ID = 'b719cc04-38d2-4af8-ae52-1001791aff6f'; // Replace with useTenant hook in prod
    try {
      const res = await fetch('/api/audit/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: TENANT_ID, category: selectedCategory, items: items })
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Audit Complete! Adjusted ${json.varianceFound} items.`);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error("Error: " + (json.error || 'Unknown error'));
      }
    } catch (e) { toast.error("Network failed."); }
    setSubmitting(false);
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const discrepancies = filteredItems.filter(i => i.actual !== i.expected).length;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-400 text-sm">
      <RefreshCcw className="animate-spin mb-2" size={24} />
      Loading Inventory Data...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32 font-sans relative">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="text-blue-600" />
            Shelf Audit
          </h1>
          <p className="text-sm text-gray-500">Physical count verification.</p>
        </div>
        <div className="flex items-center gap-4">
          {discrepancies > 0 ? (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
              <AlertTriangle size={16} /> {discrepancies} Variance{discrepancies !== 1 ? 's' : ''} Found
            </div>
          ) : (
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
              <CheckCircle2 size={16} /> All Matches
            </div>
          )}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="max-w-4xl mx-auto px-6 pt-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="max-w-4xl mx-auto px-6 py-4 space-y-3">
        {filteredItems.map(item => {
          const diff = item.actual - item.expected;
          return (
            <div key={item.id} className={`bg-white rounded-xl p-4 shadow-sm border flex items-center gap-4 transition-all ${diff !== 0 ? 'border-l-4 border-l-orange-500' : 'border-gray-200 border-l-4 border-l-transparent'}`}>

              <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="text-[9px] text-gray-400">IMG</div>}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 truncate text-sm">{item.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Expected: <span className="font-mono font-medium">{item.expected}</span>
                </div>
              </div>

              {/* Counter */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCountChange(item.id, item.actual - 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <div className="text-center w-12">
                  <input
                    type="number"
                    value={item.actual}
                    onChange={(e) => handleCountChange(item.id, e.target.value)}
                    className={`w-full text-center font-bold text-lg bg-transparent border-none focus:ring-0 p-0 ${diff !== 0 ? 'text-orange-600' : 'text-gray-900'}`}
                  />
                </div>
                <button
                  onClick={() => handleCountChange(item.id, item.actual + 1)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
        {filteredItems.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No items found matching filter.</div>}
      </div>

      {/* FOOTER ACTIONS */}
      {discrepancies > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center z-40">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-full p-2 pl-6 flex items-center gap-4 animate-in slide-in-from-bottom-6">
            <div className="text-sm font-semibold text-gray-700">
              <span className="text-orange-600 font-bold">{discrepancies}</span> variance(s) recorded
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-md hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              {submitting ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
              {submitting ? 'Syncing...' : 'Submit Audit'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}