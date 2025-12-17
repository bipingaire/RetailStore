'use client';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Link as LinkIcon, AlertCircle, CheckCircle, 
  Edit2, X, RefreshCw, Bot, Sparkles
} from 'lucide-react';
import { useTenant } from '@/components/tenant-context';

type PosMap = {
  id: string;
  pos_name: string;
  pos_code: string;
  last_sold_price: number;
  previous_sold_price: number;
  is_verified: boolean;
  store_inventory: {
    id: string;
    global_products: { name: string; image_url: string; };
  };
};

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  price?: number;
};

export default function PosMappingPage() {
  const { tenant } = useTenant();
  const FALLBACK_TENANT_ID = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || 'b719cc04-38d2-4af8-ae52-1001791aff6f';
  const activeTenantId = useMemo(() => tenant?.id || FALLBACK_TENANT_ID, [tenant]);
  const [mappings, setMappings] = useState<PosMap[]>([]);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchInv, setSearchInv] = useState('');
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch Mappings & Inventory
  useEffect(() => {
    if (!activeTenantId) {
      setFetchError('No tenant found. Please log in or configure a default tenant id.');
      setLoading(false);
      return;
    }
    loadData(activeTenantId);
  }, [activeTenantId]);

  const loadData = async (tenantId: string) => {
    setLoading(true);
    setFetchError(null);
    
    // 1. Get Mappings
    try {
      const [{ data: mapData, error: mapErr }, { data: invData, error: invErr }] = await Promise.all([
        supabase
          .from('pos_mappings')
          .select(`
            id, pos_name, pos_code, last_sold_price, previous_sold_price, is_verified,
            store_inventory:store_inventory_id (
              id,
              global_products ( name, image_url )
            )
          `)
          .eq('tenant_id', tenantId)
          .order('is_verified', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(400),
        supabase
          .from('store_inventory')
          .select(`
            id, 
            price,
            global_products ( name, upc_ean )
          `)
          .eq('tenant_id', tenantId)
          .eq('is_active', true)
          .limit(400)
      ]);

      if (mapErr || invErr) {
        setFetchError(mapErr?.message || invErr?.message || 'Failed to load data');
      }

      if (mapData) {
        setMappings(mapData as any);
        setPendingCount((mapData as any[]).filter((m) => !m.is_verified).length);
      }
      if (invData) {
        setInventoryList(
          invData.map((i: any) => ({
            id: i.id,
            name: i.global_products?.name || 'Unknown',
            sku: i.global_products?.upc_ean || '',
            price: Number(i.price ?? 0),
          }))
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemap = async (mapId: string, newInventoryId: string) => {
    const current = mappings.find((m) => m.id === mapId);
    // Update the link
    await supabase
      .from('pos_mappings')
      .update({ 
        store_inventory_id: newInventoryId, 
        is_verified: true 
      })
      .eq('id', mapId);

    // Push POS price into store inventory so shop reflects latest POS price
    if (current?.last_sold_price !== undefined) {
      await supabase
        .from('store_inventory')
        .update({ price: current.last_sold_price, is_active: true })
        .eq('id', newInventoryId);
    }

    // Merge Logic (Optional but recommended):
    // If the old inventory item was a "Stub" (negative stock), move that negative stock to the new "Real" item
    // This part is complex, for MVP we just switch the pointer for FUTURE sales.
    
    setEditingId(null);
    loadData(activeTenantId); // Refresh
  };

  const verifyMap = async (id: string) => {
    await supabase.from('pos_mappings').update({ is_verified: true }).eq('id', id);
    setMappings(prev => {
      const next = prev.map(m => m.id === id ? { ...m, is_verified: true } : m);
      setPendingCount(next.filter((m) => !m.is_verified).length);
      return next;
    });
  };

  const filteredInventory = useMemo(() => {
    const term = searchInv.toLowerCase();
    return inventoryList.filter((i) => (i.name || '').toLowerCase().includes(term));
  }, [inventoryList, searchInv]);

  const bestSuggestion = useMemo(() => {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const tokenScore = (a: string, b: string) => {
      const aTokens = new Set(normalize(a).split(' ').filter(Boolean));
      const bTokens = new Set(normalize(b).split(' ').filter(Boolean));
      const intersection = [...aTokens].filter((t) => bTokens.has(t)).length;
      const union = new Set([...aTokens, ...bTokens]).size || 1;
      return intersection / union;
    };
    const scoreName = (posName: string, inv: InventoryItem) => {
      const base = tokenScore(posName, inv.name || '');
      const skuBoost = inv.sku && posName.toLowerCase().includes(inv.sku.toLowerCase()) ? 0.2 : 0;
      return base + skuBoost;
    };
    const map: Record<string, InventoryItem | null> = {};
    mappings.forEach((m) => {
      const ranked = inventoryList
        .map((inv) => ({ inv, score: scoreName(m.pos_name, inv) }))
        .sort((a, b) => b.score - a.score);
      map[m.id] = ranked[0]?.score ? ranked[0].inv : null;
    });
    return map;
  }, [mappings, inventoryList]);

  if (loading) return <div className="p-10 text-center text-gray-500">Loading POS Data...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans min-h-screen bg-gray-50">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <LinkIcon className="text-blue-600" />
          POS Item Mapping
        </h1>
        <p className="text-gray-500 mt-1">
          Link messy names from your Sales Report to clean Inventory items.
        </p>
        {fetchError && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {fetchError}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-semibold">
            <AlertCircle size={14} /> Needs mapping: {pendingCount}
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
            <CheckCircle size={14} /> Verified: {mappings.length - pendingCount}
          </span>
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <div className="text-sm text-gray-600">Showing {mappings.length} mappings (capped)</div>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b">
            <tr>
              <th className="p-4">POS Name (Raw)</th>
              <th className="p-4">Sales Price</th>
              <th className="p-4">Mapped To System Item</th>
              <th className="p-4 text-right">Status</th>
              <th className="p-4 w-10"></th>
              <th className="p-4">AI Suggestion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mappings.map((map) => {
              const suggestion = bestSuggestion[map.id];
              return (
              <tr key={map.id} className={`hover:bg-gray-50 group ${!map.is_verified ? 'bg-orange-50/30' : ''}`}>
                
                {/* Raw POS Data */}
                <td className="p-4">
                  <div className="font-bold text-gray-900">{map.pos_name}</div>
                  <div className="text-xs text-gray-400 font-mono">{map.pos_code || 'No Code'}</div>
                </td>

                {/* Price History */}
                <td className="p-4">
                  <div className="font-medium text-gray-900">${map.last_sold_price?.toFixed(2)}</div>
                  {map.previous_sold_price && map.previous_sold_price !== map.last_sold_price && (
                    <div className="text-[10px] text-gray-400 line-through">
                      was ${map.previous_sold_price.toFixed(2)}
                    </div>
                  )}
                </td>

                {/* Mapped Item (Editable) */}
                <td className="p-4">
                  {editingId === map.id ? (
                    <div className="relative w-64">
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Search inventory..." 
                        className="w-full border p-2 rounded-lg text-sm mb-2"
                        onChange={(e) => setSearchInv(e.target.value)}
                      />
                      <div className="absolute top-full left-0 right-0 bg-white border shadow-xl rounded-lg max-h-48 overflow-y-auto z-50">
                        {filteredInventory.length === 0 && (
                          <div className="p-3 text-xs text-gray-400">No matches</div>
                        )}
                        {filteredInventory.map(inv => (
                          <div 
                            key={inv.id} 
                            className="p-2 hover:bg-blue-50 cursor-pointer text-xs"
                            onClick={() => handleRemap(map.id, inv.id)}
                          >
                            <div className="font-semibold text-gray-800">{inv.name}</div>
                            {inv.sku && <div className="text-[10px] text-gray-400">{inv.sku}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                         {map.store_inventory?.global_products?.image_url ? (
                           <img src={map.store_inventory.global_products.image_url} className="w-full h-full object-cover"/>
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-[8px]">IMG</div>
                         )}
                       </div>
                       <span className="font-medium text-gray-700">
                         {map.store_inventory?.global_products?.name || 'Unknown Link'}
                       </span>
                    </div>
                  )}
                </td>

                {/* Status Badge */}
                <td className="p-4 text-right">
                  {map.is_verified ? (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                      <CheckCircle size={12}/> Verified
                    </span>
                  ) : (
                    <button 
                      onClick={() => verifyMap(map.id)}
                      className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold hover:bg-green-100 hover:text-green-700 transition"
                    >
                      <AlertCircle size={12}/> Confirm?
                    </button>
                  )}
                </td>

                {/* Edit Action */}
                <td className="p-4">
                  <button 
                    onClick={() => { setEditingId(editingId === map.id ? null : map.id); setSearchInv(''); }}
                    className="text-gray-400 hover:text-blue-600 transition"
                  >
                    {editingId === map.id ? <X size={18}/> : <Edit2 size={18}/>}
                  </button>
                </td>

                {/* AI Suggestion */}
                <td className="p-4">
                  {suggestion ? (
                    <div className="flex flex-col gap-2 text-xs text-gray-700">
                      <div className="flex items-center gap-1 font-semibold text-purple-700">
                        <Bot size={14} /> AI Suggests
                      </div>
                      <div className="text-sm font-bold text-gray-900">{suggestion.name}</div>
                      {suggestion.price !== undefined && (
                        <div className="text-[11px] text-gray-500">Inventory price: ${suggestion.price?.toFixed(2)}</div>
                      )}
                      <button
                        onClick={() => handleRemap(map.id, suggestion.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-purple-600 px-2 py-1 rounded hover:bg-purple-700"
                      >
                        <Sparkles size={12} /> Accept AI Match
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">No suggestion</div>
                  )}
                </td>

              </tr>
            )})}
          </tbody>
        </table>
        
        {mappings.length === 0 && (
            <div className="p-10 text-center text-gray-400">
                No mappings found. Upload a sales report to populate.
            </div>
        )}
      </div>
    </div>
  );
}