'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Rocket,
  ArrowRight,
  Link as LinkIcon,
  CircleDot,
  Plus,
  Trash2,
  Save
} from 'lucide-react';

type Segment = {
  id: string;
  slug?: string;
  title: string;
  subtitle?: string;
  badge_label?: string;
  badge_color?: string;
  tagline?: string;
  segment_type?: string;
  sort_order?: number;
  is_active?: boolean;
  start_date?: string | null;
  end_date?: string | null;
  valid_till_stock?: boolean;
  default_discount?: number | null;
  purchase_mode?: 'online' | 'offline' | 'both' | 'store_only' | string;
  segment_products?: { store_inventory_id: string | null }[];
};

type InventoryRow = {
  id: string;
  price: number;
  global_products: {
    name: string;
    image_url?: string;
    category?: string;
    manufacturer?: string;
  };
};

export default function SaleAdmin() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [inventory, setInventory] = useState<InventoryRow[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [draft, setDraft] = useState<Partial<Segment>>({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [{ data: segData }, { data: invData }] = await Promise.all([
        supabase
          .from('product_segments')
          .select('id, slug, title, subtitle, badge_label, badge_color, tagline, segment_type, sort_order, is_active, start_date, end_date, valid_till_stock, default_discount, purchase_mode, segment_products ( store_inventory_id )')
          .order('sort_order', { ascending: true }),
        supabase
          .from('store_inventory')
          .select('id, price, global_products ( name, image_url, category, manufacturer )')
          .eq('is_active', true)
          .limit(120)
      ]);

      const normalizedSegments =
        (segData as any[] | null)?.map((seg) => ({
          ...seg,
          segment_products: seg.segment_products || [],
        })) || [];

      const normalizedInventory =
        (invData as any[] | null)?.map((row) => ({
          ...row,
          price: Number(row.price ?? 0),
        })) || [];

      setSegments(normalizedSegments);
      setInventory(normalizedInventory);

      // Auto select first segment
      const first = normalizedSegments[0];
      if (first) {
        setSelectedSegmentId(first.id);
        setSelectedItems(new Set(first.segment_products?.map((sp: any) => sp.store_inventory_id).filter(Boolean)));
        setDraft(first);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const selectedSegment = useMemo(
    () => segments.find((s) => s.id === selectedSegmentId) || null,
    [segments, selectedSegmentId]
  );

  const marketingLink = useMemo(() => {
    if (!selectedSegment) return '';
    const slug = selectedSegment.slug || selectedSegment.id;
    return `https://indumart.com/offers/${slug}`;
  }, [selectedSegment]);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectSegment = (seg: Segment) => {
    setSelectedSegmentId(seg.id);
    setSelectedItems(new Set(seg.segment_products?.map((sp) => sp.store_inventory_id).filter(Boolean) as string[]));
    setDraft(seg);
    setMessage(null);
  };

  const handleDraftChange = (key: keyof Segment, value: any) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleNewCampaign = async () => {
    setSaving(true);
    const now = Date.now();
    const slug = `campaign-${now}`;
    const { data, error } = await supabase
      .from('product_segments')
      .insert({
        title: 'New Campaign',
        slug,
        badge_label: 'New',
        badge_color: '#a855f7',
        segment_type: 'generic',
        sort_order: segments.length + 1,
        is_active: false,
        purchase_mode: 'both',
      })
      .select()
      .single();

    if (error) {
      setMessage({ type: 'error', text: error.message });
      setSaving(false);
      return;
    }

    const refreshed = [...segments, data as Segment];
    setSegments(refreshed);
    setSelectedSegmentId((data as Segment).id);
    setSelectedItems(new Set());
    setDraft(data as Segment);
    setMessage({ type: 'success', text: 'New campaign created. Edit details and push live.' });
    setSaving(false);
  };

  const handleSaveMeta = async () => {
    if (!selectedSegment) return;
    setSaving(true);
    const payload: Partial<Segment> = {
      title: draft.title,
      subtitle: draft.subtitle,
      badge_label: draft.badge_label,
      badge_color: draft.badge_color,
      tagline: draft.tagline,
      start_date: draft.start_date || null,
      end_date: draft.end_date || null,
      valid_till_stock: draft.valid_till_stock ?? false,
      default_discount: draft.default_discount ?? 0,
      purchase_mode: (draft.purchase_mode as any) || 'both',
    };

    const { error } = await supabase
      .from('product_segments')
      .update(payload)
      .eq('id', selectedSegment.id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setSegments((prev) =>
        prev.map((s) => (s.id === selectedSegment.id ? { ...s, ...payload } : s))
      );
      setMessage({ type: 'success', text: 'Campaign details saved.' });
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selectedSegment) return;
    setSaving(true);
    await supabase.from('segment_products').delete().eq('segment_id', selectedSegment.id);
    const { error } = await supabase.from('product_segments').delete().eq('id', selectedSegment.id);
    if (error) {
      setMessage({ type: 'error', text: error.message });
      setSaving(false);
      return;
    }
    const remaining = segments.filter((s) => s.id !== selectedSegment.id);
    setSegments(remaining);
    setSelectedSegmentId(remaining[0]?.id || null);
    setSelectedItems(new Set(remaining[0]?.segment_products?.map((sp: any) => sp.store_inventory_id).filter(Boolean)));
    setDraft(remaining[0] || {});
    setMessage({ type: 'success', text: 'Campaign removed.' });
    setSaving(false);
  };

  const handleSetActive = async (value: boolean) => {
    if (!selectedSegment) return;
    setSaving(true);
    const { error } = await supabase
      .from('product_segments')
      .update({ is_active: value })
      .eq('id', selectedSegment.id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setSegments((prev) =>
        prev.map((s) => (s.id === selectedSegment.id ? { ...s, is_active: value } : s))
      );
      setMessage({ type: 'success', text: `Campaign ${value ? 'activated' : 'paused'} successfully.` });
    }
    setSaving(false);
  };

  const handlePushLive = async () => {
    if (!selectedSegment) {
      setMessage({ type: 'error', text: 'Select a campaign first.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    // Replace goods for this segment and mark active
    const ids = Array.from(selectedItems);

    const { error: delErr } = await supabase
      .from('segment_products')
      .delete()
      .eq('segment_id', selectedSegment.id);

    if (delErr) {
      setMessage({ type: 'error', text: delErr.message });
      setSaving(false);
      return;
    }

    if (ids.length > 0) {
      const insertPayload = ids.map((id) => ({
        segment_id: selectedSegment.id,
        store_inventory_id: id,
      }));
      const { error: insErr } = await supabase.from('segment_products').upsert(insertPayload);
      if (insErr) {
        setMessage({ type: 'error', text: insErr.message });
        setSaving(false);
        return;
      }
    }

    const { error: actErr } = await supabase
      .from('product_segments')
      .update({ is_active: true })
      .eq('id', selectedSegment.id);

    if (actErr) {
      setMessage({ type: 'error', text: actErr.message });
      setSaving(false);
      return;
    }

    // Refresh segments to reflect latest
    const { data: refreshed } = await supabase
      .from('product_segments')
      .select('id, slug, title, subtitle, badge_label, badge_color, tagline, segment_type, sort_order, is_active, segment_products ( store_inventory_id )')
      .order('sort_order', { ascending: true });

    setSegments((refreshed as any) || []);

    setMessage({ type: 'success', text: 'Pushed live and published to shop.' });
    setSaving(false);
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard?.writeText(link);
      setMessage({ type: 'success', text: 'Marketing link copied.' });
    } catch {
      setMessage({ type: 'error', text: 'Unable to copy. Please copy manually.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto text-gray-500">Loading Sale campaigns…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-purple-600" /> Sale Campaigns
          </h1>
          <p className="text-gray-500">Manage flash sale, ending soon, festive picks, Monday-only offers and push them live to the shop.</p>
        </header>

        {message && (
          <div
            className={`rounded-xl border px-4 py-3 flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaign list */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Campaigns</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Sale / Offers</span>
                <button
                  onClick={handleNewCampaign}
                  disabled={saving}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-2 py-1 rounded"
                >
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>
            {segments.map((seg) => (
              <button
                key={seg.id}
                onClick={() => handleSelectSegment(seg)}
                className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                  seg.id === selectedSegmentId
                    ? 'border-purple-200 bg-purple-50'
                    : 'border-gray-100 hover:border-purple-100 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <CircleDot size={14} className="text-purple-500" /> {seg.title}
                  </div>
                  <div className="text-xs text-gray-500">{seg.subtitle || 'No subtitle'}</div>
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-1 rounded ${
                    seg.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {seg.is_active ? 'Active' : 'Inactive'}
                </span>
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
            {selectedSegment ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500 uppercase font-bold">Selected Campaign</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedSegment.title}</div>
                    {selectedSegment.tagline && <div className="text-sm text-gray-500">{selectedSegment.tagline}</div>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={saving}
                      className="px-3 py-2 rounded-lg border text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 inline-flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                    <button
                      onClick={handleSaveMeta}
                      disabled={saving}
                      className="px-3 py-2 rounded-lg border text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60 inline-flex items-center gap-2"
                    >
                      <Save size={14} /> Save
                    </button>
                    <button
                      onClick={() => handleSetActive(false)}
                      disabled={saving}
                      className="px-3 py-2 rounded-lg border text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                    >
                      Set Inactive
                    </button>
                    <button
                      onClick={() => handleSetActive(true)}
                      disabled={saving}
                      className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-60"
                    >
                      Set Active
                    </button>
                  </div>
                </div>

                <div className="border border-dashed border-gray-200 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Title
                      <input
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={draft.title || ''}
                        onChange={(e) => handleDraftChange('title', e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Subtitle
                      <input
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={draft.subtitle || ''}
                        onChange={(e) => handleDraftChange('subtitle', e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Badge Label
                      <input
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={draft.badge_label || ''}
                        onChange={(e) => handleDraftChange('badge_label', e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Badge Color
                      <input
                        type="color"
                        className="border rounded-lg px-3 py-2 text-sm h-10"
                        value={draft.badge_color || '#10b981'}
                        onChange={(e) => handleDraftChange('badge_color', e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Tagline
                      <input
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={draft.tagline || ''}
                        onChange={(e) => handleDraftChange('tagline', e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Default Discount (% or $)
                      <input
                        type="number"
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={draft.default_discount ?? 0}
                        onChange={(e) => handleDraftChange('default_discount', Number(e.target.value))}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Purchase Mode
                      <select
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={draft.purchase_mode || 'both'}
                        onChange={(e) => handleDraftChange('purchase_mode', e.target.value)}
                      >
                        <option value="both">Online & Store</option>
                        <option value="online">Online only</option>
                        <option value="offline">Store only</option>
                        <option value="store_only">Store only</option>
                      </select>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="validStock"
                        type="checkbox"
                        checked={draft.valid_till_stock ?? false}
                        onChange={(e) => handleDraftChange('valid_till_stock', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="validStock" className="text-sm text-gray-700">
                        Valid till stock available
                      </label>
                    </div>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      Start Date
                      <input
                        type="datetime-local"
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={draft.start_date ? draft.start_date.slice(0,16) : ''}
                        onChange={(e) => handleDraftChange('start_date', e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-700">
                      End Date
                      <input
                        type="datetime-local"
                        className="border rounded-lg px-3 py-2 text-sm"
                        value={draft.end_date ? draft.end_date.slice(0,16) : ''}
                        onChange={(e) => handleDraftChange('end_date', e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Goods to feature</h4>
                    <span className="text-xs text-gray-500">Inventory pulse</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1">
                    {inventory.map((item) => {
                      const checked = selectedItems.has(item.id);
                      return (
                        <label
                          key={item.id}
                          className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition ${
                            checked ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:border-green-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={checked}
                            onChange={() => toggleItem(item.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <img
                                src={item.global_products.image_url || 'https://via.placeholder.com/80?text=Item'}
                                className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100"
                                alt={item.global_products.name}
                              />
                              <div>
                                <div className="text-sm font-semibold text-gray-900 line-clamp-2">
                                  {item.global_products.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.global_products.category || 'Assorted'} · ${item.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handlePushLive}
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-60"
                  >
                    <Rocket size={16} /> Push live to website
                  </button>
                  <button
                    onClick={() => selectedSegment && handleCopyLink(marketingLink)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <LinkIcon size={16} /> Copy campaign link
                  </button>
                  {selectedSegment && (
                    <div className="text-xs text-gray-500">
                      Offer link: <span className="font-semibold text-gray-700">{marketingLink}</span>
                    </div>
                  )}
                </div>

                {selectedSegment && selectedItems.size > 0 && (
                  <div className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                      <ArrowRight size={14} /> Live goods in this campaign
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(selectedItems).map((id) => {
                        const item = inventory.find((inv) => inv.id === id);
                        if (!item) return null;
                        const productLink = `${marketingLink}?product=${id}`;
                        return (
                          <div key={id} className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-xs flex items-center gap-2">
                            <span className="font-semibold text-gray-900 line-clamp-1 max-w-[180px]">{item.global_products.name}</span>
                            <button
                              onClick={() => handleCopyLink(productLink)}
                              className="text-purple-600 hover:text-purple-700 inline-flex items-center gap-1"
                            >
                              <LinkIcon size={12} /> copy link
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500">Select a campaign to manage offers.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
