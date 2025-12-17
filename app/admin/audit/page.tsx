'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ClipboardCheck, Search, Save, RefreshCcw } from 'lucide-react';

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

  // 1. Fetch Inventory
  useEffect(() => {
    async function loadInventory() {
      // In real app: Filter by tenant_id
      const { data, error } = await supabase
        .from('store_inventory')
        .select(`
          id, price,
          global_products ( name, image_url, category ),
          inventory_batches ( batch_quantity )
        `)
        .eq('is_active', true);

      if (error) { 
        console.error("Fetch Error:", error); 
        setLoading(false);
        return; 
      }

      // FIX: Guard against null data or missing batches
      const loadedItems = (data || []).map((i: any) => {
        // Safe access to batches (default to empty array if null)
        const batches = i.inventory_batches || [];
        const totalQty = batches.reduce((sum: number, b: any) => sum + (b.batch_quantity || 0), 0);
        
        return {
          id: i.id,
          name: i.global_products?.name || 'Unknown Item',
          image: i.global_products?.image_url || '',
          category: i.global_products?.category || 'Uncategorized',
          price: i.price || 0,
          expected: totalQty,
          actual: totalQty, // Default to system count
        };
      });

      // Extract unique categories safely
      const cats = Array.from(new Set(loadedItems.map((i: any) => i.category || 'Uncategorized'))) as string[];
      
      setCategories(['All', ...cats]);
      setItems(loadedItems);
      setLoading(false);
    }
    loadInventory();
  }, []);

  // 2. Handle Count Change
  const handleCountChange = (id: string, value: string | number) => {
    // FIX: Handle empty input or NaN safely
    const newCount = value === '' ? 0 : parseInt(String(value));
    
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, actual: isNaN(newCount) ? 0 : Math.max(0, newCount) } : item
    ));
  };

  // 3. Submit Audit
  const handleSubmit = async () => {
    setSubmitting(true);
    // ⚠️ Replace with REAL Tenant UUID
    const TENANT_ID = 'PASTE_YOUR_REAL_TENANT_UUID_HERE'; 

    try {
      const res = await fetch('/api/audit/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: TENANT_ID,
          category: selectedCategory,
          items: items // API will filter for discrepancies
        })
      });

      const json = await res.json();
      if (json.success) {
        alert(`Audit Complete! Adjusted ${json.varianceFound} items.`);
        window.location.reload(); 
      } else {
        alert("Error submitting audit: " + (json.error || 'Unknown error'));
      }
    } catch (e) {
      console.error(e);
      alert("Network failed.");
    }
    setSubmitting(false);
  };

  // Filter Logic
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    // FIX: Ensure name is a string before calling toLowerCase
    const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const discrepancies = filteredItems.filter(i => i.actual !== i.expected).length;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
      <RefreshCcw className="animate-spin mb-2" />
      Loading Inventory...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 px-6 py-4 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="text-blue-600" />
            Shelf Audit
          </h1>
          <p className="text-xs text-gray-500">Compare physical counts to system records.</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase text-gray-400">Variances</div>
          <div className={`text-2xl font-black ${discrepancies > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {discrepancies}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 grid gap-4 md:grid-cols-2">
        
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* The List */}
      <div className="max-w-5xl mx-auto px-6 space-y-3">
        {filteredItems.map(item => {
          const diff = item.actual - item.expected;
          
          return (
            <div key={item.id} className={`bg-white rounded-xl p-4 shadow-sm border flex items-center gap-4 transition-all ${diff !== 0 ? 'border-l-4 border-l-orange-500' : 'border-gray-200'}`}>
              
              {/* Image */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 truncate">{item.name}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">{item.category}</span>
                  <span>System: <b>{item.expected}</b></span>
                </div>
              </div>

              {/* The "Counter" Interface */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleCountChange(item.id, item.actual - 1)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 font-bold flex items-center justify-center text-xl transition"
                >
                  -
                </button>
                
                <div className="text-center w-16">
                  <input 
                    type="number" 
                    value={item.actual}
                    onChange={(e) => handleCountChange(item.id, e.target.value)}
                    className={`w-full text-center font-black text-2xl bg-transparent border-b-2 focus:outline-none ${
                      diff < 0 ? 'text-red-600 border-red-200' : 
                      diff > 0 ? 'text-blue-600 border-blue-200' : 
                      'text-gray-800 border-transparent'
                    }`}
                  />
                  {diff !== 0 && (
                    <div className={`text-[10px] font-bold ${diff < 0 ? 'text-red-500' : 'text-blue-500'}`}>
                      {diff > 0 ? '+' : ''}{diff}
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => handleCountChange(item.id, item.actual + 1)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 font-bold flex items-center justify-center text-xl transition"
                >
                  +
                </button>
              </div>

            </div>
          );
        })}

        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-400">
            No items found.
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center">
        <button 
          onClick={handleSubmit}
          disabled={submitting || discrepancies === 0}
          className={`
            shadow-2xl flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95
            ${discrepancies === 0 ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}
          `}
        >
          {submitting ? (
            <RefreshCcw className="animate-spin" />
          ) : (
            <Save />
          )}
          {submitting ? 'Syncing...' : `Submit Audit (${discrepancies} Changes)`}
        </button>
      </div>

    </div>
  );
}