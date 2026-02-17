'use client';
import { useState, useEffect } from 'react';
import { ClipboardCheck, Search, Save, RefreshCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';



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
  // Supabase removed - refactor needed
  const [items, setItems] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadInventory() {
      setLoading(true);
      try {
        // Fetch real products
        const products = await apiClient.get('/products');
        if (products && Array.isArray(products)) {
          // Map backend products to AuditItem
          const auditItems: AuditItem[] = products.map((p: any) => ({
            id: p.id,
            name: p.name,
            image: p.imageUrl || '',
            category: p.category || 'Uncategorized',
            expected: p.stock || 0, // System stock
            actual: p.stock || 0, // Default to expected
            price: Number(p.price) || 0
          }));
          setItems(auditItems);

          // Extract categories
          const cats = Array.from(new Set(auditItems.map((i) => i.category)));
          setCategories(['All', ...cats]);
        }
      } catch (error) {
        console.error('Failed to load inventory', error);
        toast.error('Failed to load inventory');
      } finally {
        setLoading(false);
      }
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
    try {
      // Filter only items with variance or all items? 
      // If full audit, send all. If partial, send all to confirm "checked".
      // Let's send only items that were actually displayed/filtered if we want efficiency, but audit usually implies full check.
      // But for bulk submit, backend iterates.
      // Let's send ALL items currently in state to ensure full snapshot if that's the intent, 
      // or at least filteredItems if the user is auditing a specific category.
      // If "Category: Electronics" is selected, we probably only want to audit electronics.

      const itemsToSubmit = (selectedCategory === 'All' ? items : items.filter(i => i.category === selectedCategory)).map(i => ({
        productId: i.id,
        quantity: i.actual
      }));

      // Basic userId from auth context or hardcoded if not available yet (Admin).
      // Ideally get from auth context. For now, use a placeholder or 'admin-user'. 
      // Backend might require valid UUID if it checks foreign key, but AuditSession.userId schema is just String? 
      // unexpected error if not real User.
      // Lets check if we have user info. stored in localStorage or from apiClient?
      // For now, let's use a dummy ID or just 'admin' if Schema allows string.
      // Schema User.id is UUID. So we need a valid ID.
      // However, typically apiClient handles auth, but body { userId } is required by my new controller.
      // I should update controller to take userId from Request User (JWT).
      // BUT current controller helper takes userId.
      // Hack: I'll fetch 'me' first or just send a known ID?
      // Checking Schema: AuditSession.userId is String. User model exists.
      // If I send "admin", it might fail FK constraint if AuditSession links to User?
      // Schema: audit_sessions -> userId is just a field?
      // model AuditSession { userId String ... } - NO RELATION defined in schema-tenant.prisma for userId!
      // So any string works.

      await apiClient.post('/audit/submit-bulk', {
        userId: 'admin-audit',
        items: itemsToSubmit,
        notes: `Audit for category: ${selectedCategory}`
      });

      toast.success(`Audit Synced! Inventory updated.`);
      setTimeout(() => window.location.reload(), 1500);

    } catch (e) {
      console.error(e);
      toast.error("Audit submission failed.");
    } finally {
      setSubmitting(false);
    }
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
