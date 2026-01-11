'use client';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Link as LinkIcon, AlertCircle, CheckCircle, Edit2, X, RefreshCw, Bot, Sparkles, Check } from 'lucide-react';
import { useTenant } from '@/lib/hooks/useTenant';

// 1. Updated Types to match DB Schema
type PosMap = {
  mapping_id: string;
  pos_item_name: string;
  pos_item_code: string;
  last_sold_price: number;
  is_verified: boolean;
  inventory_link: {
    inventory_id: string;
    global_product: {
      product_name: string;
      image_url: string;
    };
  } | null;
};

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
};

export default function PosMappingPage() {
  const { tenantId } = useTenant(); // This hook might need checking if it works with our manual tenant logic
  const [mappings, setMappings] = useState<PosMap[]>([]);
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchInv, setSearchInv] = useState('');
  const [pendingCount, setPendingCount] = useState(0);

  // Manual Tenant ID Fetch if hook fails or for robustness (copying from other pages)
  const [manualTenantId, setManualTenantId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from('tenant-user-role')
          .select('tenant-id')
          .eq('user-id', user.id)
          .single();
        if (roleData) setManualTenantId((roleData as any)['tenant-id']);
      }
    }
    init();
  }, []);

  const effectiveTenantId = tenantId || manualTenantId;

  useEffect(() => {
    if (effectiveTenantId) loadData(effectiveTenantId);
  }, [effectiveTenantId]);

  const loadData = async (tid: string) => {
    setLoading(true);
    try {
      const [{ data: mapData }, { data: invData }] = await Promise.all([
        supabase.from('pos-item-mapping')
          .select(`
                mapping-id, pos-item-name, pos-item-code, last-sold-price, is-verified,
                inventory_link:matched-inventory-id ( 
                    inventory-id, 
                    global_product:global-product-id ( product-name, image-url ) 
                )
            `)
          .eq('tenant-id', tid)
          .order('is-verified', { ascending: true })
          .limit(100),

        supabase.from('retail-store-inventory-item')
          .select(`
                inventory-id, 
                selling-price-amount, 
                global:global-product-id ( product-name, upc-ean-code )
            `)
          .eq('tenant-id', tid)
          .eq('is-active', true)
          .limit(100)
      ]);

      if (mapData) {
        const mapped: PosMap[] = mapData.map((m: any) => ({
          mapping_id: m['mapping-id'],
          pos_item_name: m['pos-item-name'],
          pos_item_code: m['pos-item-code'],
          last_sold_price: m['last-sold-price'],
          is_verified: m['is-verified'],
          inventory_link: m.inventory_link ? {
            inventory_id: m.inventory_link['inventory-id'],
            global_product: {
              product_name: m.inventory_link.global_product?.['product-name'],
              image_url: m.inventory_link.global_product?.['image-url']
            }
          } : null
        }));
        setMappings(mapped);
        setPendingCount(mapped.filter(m => !m.is_verified).length);
      }

      if (invData) {
        setInventoryList(invData.map((i: any) => ({
          id: i['inventory-id'],
          name: i.global?.['product-name'] || 'Unknown',
          sku: i.global?.['upc-ean-code'] || '',
          price: i['selling-price-amount'] || 0
        })));
      }
    } catch (e) {
      console.error("Load Error:", e);
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of functions need updates too)

  const handleRemap = async (mapId: string, newInventoryId: string) => {
    const current = mappings.find((m) => m.mapping_id === mapId);

    await supabase
      .from('pos-item-mapping')
      .update({
        'matched-inventory-id': newInventoryId,
        'is-verified': true
      })
      .eq('mapping-id', mapId);

    // Optional: Auto-update price if needed, but let's stick to mapping for now

    setEditingId(null);
    if (effectiveTenantId) loadData(effectiveTenantId);
  };

  const verifyMap = async (id: string) => {
    await supabase
      .from('pos-item-mapping')
      .update({ 'is-verified': true })
      .eq('mapping-id', id);

    setMappings(prev => {
      const next = prev.map(m => m.mapping_id === id ? { ...m, is_verified: true } : m);
      setPendingCount(next.filter((m) => !m.is_verified).length);
      return next;
    });
  };

  const filteredInventory = useMemo(() => inventoryList.filter((i) => (i.name || '').toLowerCase().includes(searchInv.toLowerCase())), [inventoryList, searchInv]);

  const bestSuggestion = useMemo(() => {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    const tokenScore = (a: string, b: string) => {
      const at = new Set(normalize(a).split(' ').filter(Boolean));
      const bt = new Set(normalize(b).split(' ').filter(Boolean));
      const intr = [...at].filter(t => bt.has(t)).length;
      return intr / (at.size + bt.size - intr || 1);
    };
    const map: Record<string, InventoryItem | null> = {};
    mappings.forEach((m) => {
      const ranked = inventoryList.map((inv) => ({ inv, score: tokenScore(m.pos_item_name, inv.name || '') + (inv.sku && m.pos_item_name.includes(inv.sku) ? 0.3 : 0) })).sort((a, b) => b.score - a.score);
      map[m.mapping_id] = ranked[0]?.score > 0.1 ? ranked[0].inv : null;
    });
    return map;
  }, [mappings, inventoryList]);

  if (loading) return <div className="p-12 text-center text-gray-400">Loading POS Map...</div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LinkIcon className="text-blue-600" /> POS Item Mapping
          </h1>
          <p className="text-sm text-gray-500 mt-1">Connect raw POS text to clean inventory items.</p>
        </div>

        {/* STATS */}
        <div className="flex gap-4">
          <div className={`px-4 py-2 rounded-lg border text-sm font-bold flex items-center gap-2 ${pendingCount > 0 ? 'bg-orange-50 border-orange-100 text-orange-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            <AlertCircle size={16} /> Needs Mapping: {pendingCount}
          </div>
          <div className="px-4 py-2 rounded-lg border bg-green-50 border-green-100 text-green-700 text-sm font-bold flex items-center gap-2">
            <CheckCircle size={16} /> Verified: {mappings.length - pendingCount}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-200 flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
            <div>Mapped Items: {mappings.length}</div>
            <button onClick={() => tenantId && loadData(tenantId)} className="flex items-center gap-1 hover:text-blue-600"><RefreshCw size={12} /> Refresh</button>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">POS Name (Raw)</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Linked Inventory Item</th>
                <th className="px-6 py-3 text-right">Status</th>
                <th className="px-6 py-3 w-10"></th>
                <th className="px-6 py-3">AI Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mappings.map((map) => {
                const suggestion = bestSuggestion[map.id];
                return (
                  <tr key={map.id} className={`hover:bg-gray-50 group ${!map.is_verified ? 'bg-orange-50/30' : ''}`}>
                    <td className="px-6 py-3">
                      <div className="font-bold text-gray-900 text-sm">{map.pos_name}</div>
                      <div className="text-xs text-gray-400 font-mono">{map.pos_code || 'No Code'}</div>
                    </td>
                    <td className="px-6 py-3 font-mono text-gray-600">
                      ${map.last_sold_price?.toFixed(2)}
                    </td>

                    {/* EDITABLE MAPPING CELL */}
                    <td className="px-6 py-3">
                      {editingId === map.id ? (
                        <div className="relative w-64">
                          <input autoFocus placeholder="Search inventory..." className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm shadow-sm outline-none" onChange={e => setSearchInv(e.target.value)} />
                          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl rounded-xl mt-1 max-h-48 overflow-y-auto z-50">
                            {filteredInventory.length === 0 && <div className="p-3 text-xs text-gray-400">No matches found.</div>}
                            {filteredInventory.map(inv => (
                              <div key={inv.id} className="p-2 hover:bg-blue-50 cursor-pointer text-xs flex justify-between" onClick={() => handleRemap(map.id, inv.id)}>
                                <span className="font-medium text-gray-800">{inv.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg shrink-0 overflow-hidden border border-gray-200">
                            {map.store_inventory?.global_products?.image_url ? (
                              <img src={map.store_inventory.global_products.image_url} className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <span className="font-medium text-gray-700 text-sm">{map.store_inventory?.global_products?.name || 'Unlinked'}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-3 text-right">
                      {map.is_verified ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"><Check size={10} />Verified</span>
                      ) : (
                        <button onClick={() => verifyMap(map.id)} className="inline-flex items-center gap-1 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors">Verify?</button>
                      )}
                    </td>

                    <td className="px-6 py-3">
                      <button onClick={() => { setEditingId(editingId === map.id ? null : map.id); setSearchInv(''); }} className="text-gray-400 hover:text-blue-600 transition-colors">
                        {editingId === map.id ? <X size={16} /> : <Edit2 size={16} />}
                      </button>
                    </td>

                    <td className="px-6 py-3">
                      {suggestion ? (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleRemap(map.id, suggestion.id)} className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors text-left">
                            <Sparkles size={12} className="shrink-0 text-purple-500" />
                            <div>
                              <div className="leading-none">Match Found</div>
                              <div className="text-[10px] opacity-70 font-normal truncate max-w-[120px]">{suggestion.name}</div>
                            </div>
                          </button>
                        </div>
                      ) : <span className="text-xs text-gray-300 italic">No suggestion</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}