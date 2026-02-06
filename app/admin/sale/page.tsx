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
  Save,
  Megaphone,
  Calendar,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';

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
  const [draft, setDraft] = useState<Partial<Segment>>({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [{ data: segData }, { data: invData }] = await Promise.all([
        supabase
          .from('marketing-campaign-master')
          .select(`
            id:"campaign-id",
          slug:"campaign-slug",
          title:"title-text",
          subtitle:"subtitle-text",
          badge_label:"badge-label",
          badge_color:"badge-color",
          tagline:"tagline-text",
          segment_type:"campaign-type",
          sort_order:"sort-order",
          is_active:"is-active-flag",
          start_date:"start-date-time",
          end_date:"end-date-time",
          segment_products:"campaign-product-segment-group"!"campaign-id" (
             store_inventory_id:"inventory-id"
          )
        `)
          .order('sort-order', { ascending: true }),
        supabase
          .from('retail-store-inventory-item')
          .select(`
            id:"inventory-id",
        price:"selling-price-amount",
        global_products:"global-product-master-catalog"!"global-product-id" (
           name:"product-name",
           image_url:"image-url",
           category:"category-name"
        ),
        inventory_batches:"inventory-batch-tracking-record"!"inventory-id"(batch_quantity:"batch-quantity-count")


          `)
          .eq('is-active-flag', true)
          .limit(120)
      ]);

      const normalizedSegments =
        (segData as any[] | null)?.map((seg) => ({
          ...seg,
          segment_products: seg.segment_products || [],
          // Mock missing columns for UI compatibility
          valid_till_stock: false,
          default_discount: 0,
          purchase_mode: 'both'
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
  };

  const handleDraftChange = (key: keyof Segment, value: any) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleNewCampaign = async () => {
    setSaving(true);
    const now = Date.now();
    const slug = `campaign-${now}`;
    // Mapped inserts
    const { data: rawData, error } = await supabase
      .from('marketing-campaign-master')
      .insert({
        'title-text': 'New Campaign',
        'campaign-name': 'New Campaign', // required in DB
        'campaign-slug': slug,
        'badge-label': 'New',
        'badge-color': '#a855f7',
        'campaign-type': 'flash_sale', // valid enum value
        'sort-order': segments.length + 1,
        'is-active-flag': false,
        'start-date-time': new Date().toISOString(),
        'end-date-time': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 days
      })
      .select(`
        id:"campaign-id",
        slug:"campaign-slug",
        title:"title-text",
        subtitle:"subtitle-text",
        badge_label:"badge-label",
        badge_color:"badge-color",
        tagline:"tagline-text",
        segment_type:"campaign-type",
        sort_order:"sort-order",
        is_active:"is-active-flag",
        start_date:"start-date-time",
        end_date:"end-date-time"
      `)
      .single();

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    // Cast rawData to Segment compatible type manually or just assert
    const data = rawData as unknown as Segment;

    // Add empty array for join
    data.segment_products = [];

    const refreshed = [...segments, data];
    setSegments(refreshed);
    setSelectedSegmentId(data.id);
    setSelectedItems(new Set());
    setDraft(data);
    toast.success('New campaign created.');
    setSaving(false);
  };

  const handleSaveMeta = async () => {
    if (!selectedSegment) return;
    setSaving(true);

    // Map draft fields to DB columns
    const payload: any = {
      'title-text': draft.title,
      'subtitle-text': draft.subtitle,
      'badge-label': draft.badge_label,
      'badge-color': draft.badge_color,
      'tagline-text': draft.tagline,
      'start-date-time': draft.start_date || null,
      'end-date-time': draft.end_date || null,
      // Removed non-existent columns: stock, discount, purchase_mode
    };

    const { error } = await supabase
      .from('marketing-campaign-master')
      .update(payload)
      .eq('campaign-id', selectedSegment.id);

    if (error) {
      toast.error(error.message);
    } else {
      setSegments((prev) =>
        prev.map((s) => (s.id === selectedSegment.id ? { ...s, ...draft } : s))
      );
      toast.success('Campaign details saved.');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selectedSegment) return;
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    setSaving(true);
    // segment_products has cascade delete usually, but we check
    await supabase.from('campaign-product-segment-group').delete().eq('campaign-id', selectedSegment.id);
    const { error } = await supabase.from('marketing-campaign-master').delete().eq('campaign-id', selectedSegment.id);
    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }
    const remaining = segments.filter((s) => s.id !== selectedSegment.id);
    setSegments(remaining);
    setSelectedSegmentId(remaining[0]?.id || null);
    setSelectedItems(new Set(remaining[0]?.segment_products?.map((sp: any) => sp.store_inventory_id).filter(Boolean)));
    setDraft(remaining[0] || {});
    toast.success('Campaign removed.');
    setSaving(false);
  };

  const handleSetActive = async (value: boolean) => {
    if (!selectedSegment) return;
    setSaving(true);
    const { error } = await supabase
      .from('marketing-campaign-master')
      .update({ 'is-active-flag': value })
      .eq('campaign-id', selectedSegment.id);

    if (error) {
      toast.error(error.message);
    } else {
      setSegments((prev) =>
        prev.map((s) => (s.id === selectedSegment.id ? { ...s, is_active: value } : s))
      );
      toast.success(`Campaign ${value ? 'activated' : 'paused'}.`);
    }
    setSaving(false);
  };

  const handlePushLive = async () => {
    if (!selectedSegment) {
      toast.error('Select a campaign first.');
      return;
    }

    setSaving(true);

    // Replace goods for this segment and mark active
    const ids = Array.from(selectedItems);

    const { error: delErr } = await supabase
      .from('campaign-product-segment-group')
      .delete()
      .eq('campaign-id', selectedSegment.id);

    if (delErr) {
      toast.error(delErr.message);
      setSaving(false);
      return;
    }

    if (ids.length > 0) {
      const insertPayload = ids.map((id) => ({
        'campaign-id': selectedSegment.id,
        'inventory-id': id,
      }));
      const { error: insErr } = await supabase.from('campaign-product-segment-group').upsert(insertPayload);
      if (insErr) {
        toast.error(insErr.message);
        setSaving(false);
        return;
      }
    }

    const { error: actErr } = await supabase
      .from('marketing-campaign-master')
      .update({ 'is-active-flag': true })
      .eq('campaign-id', selectedSegment.id);

    if (actErr) {
      toast.error(actErr.message);
      setSaving(false);
      return;
    }

    // Refresh segments to reflect latest
    // (Simplified refresh for now, purely updating local state for speed)
    setSegments((prev) =>
      prev.map((s) => (s.id === selectedSegment.id ? { ...s, is_active: true } : s))
    );

    toast.success('Pushed live and published to shop.');
    setSaving(false);
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard?.writeText(link);
      toast.success('Link copied to clipboard.');
    } catch {
      toast.error('Unable to copy.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <div className="text-gray-500 text-sm">Loading campaigns...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Campaigns</h1>
            <p className="text-sm text-gray-500">Manage flash sales, seasonal offers, and promotions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT: Campaign List */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-12rem)] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-gray-900 text-sm">All Campaigns</h3>
              <button
                onClick={handleNewCampaign}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Plus size={14} /> New
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1">
              {segments.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm italic">No campaigns yet.</div>
              ) : (
                segments.map((seg) => (
                  <button
                    key={seg.id}
                    onClick={() => handleSelectSegment(seg)}
                    className={`w-full text-left p-3 rounded-lg border transition-all group ${seg.id === selectedSegmentId
                      ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200'
                      : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-semibold truncate ${seg.id === selectedSegmentId ? 'text-blue-900' : 'text-gray-900'}`}>{seg.title}</span>
                      {seg.is_active ? (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                          Live
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <div className={`text-xs truncate ${seg.id === selectedSegmentId ? 'text-blue-700' : 'text-gray-500'}`}>
                      {seg.subtitle || 'No subtitle'}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* RIGHT: Editor */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[calc(100vh-12rem)] overflow-hidden">
            {selectedSegment ? (
              <>
                {/* Editor Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-blue-600">
                      <Megaphone size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{selectedSegment.title}</div>
                      <div className="text-xs text-gray-500">{selectedSegment.is_active ? 'Currently Active' : 'Draft Mode'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDelete}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="h-4 w-px bg-gray-200 mx-1"></div>
                    <button
                      onClick={handleSaveMeta}
                      disabled={saving}
                      className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50"
                    >
                      Save Changes
                    </button>
                    {selectedSegment.is_active ? (
                      <button
                        onClick={() => handleSetActive(false)}
                        className="px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold rounded-lg hover:bg-yellow-100"
                      >
                        Pause Campaign
                      </button>
                    ) : (
                      <button
                        onClick={handlePushLive}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 shadow-sm flex items-center gap-1.5"
                      >
                        <Rocket size={12} /> Publish Live
                      </button>
                    )}
                  </div>
                </div>

                {/* Editor Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                  {/* Section 1: Details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Tag size={14} /> Campaign Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">Campaign Title</label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          value={draft.title || ''}
                          onChange={(e) => handleDraftChange('title', e.target.value)}
                          placeholder="e.g. Summer Flash Sale"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">Subtitle</label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          value={draft.subtitle || ''}
                          onChange={(e) => handleDraftChange('subtitle', e.target.value)}
                          placeholder="e.g. Up to 50% off"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">Tagline (Optional)</label>
                        <input
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          value={draft.tagline || ''}
                          onChange={(e) => handleDraftChange('tagline', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Badge Label</label>
                          <input
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                            value={draft.badge_label || ''}
                            onChange={(e) => handleDraftChange('badge_label', e.target.value)}
                            placeholder="NEW"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-700">Badge Color</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              className="h-9 w-12 rounded border border-gray-200 p-0.5 cursor-pointer"
                              value={draft.badge_color || '#10b981'}
                              onChange={(e) => handleDraftChange('badge_color', e.target.value)}
                            />
                            <div className="flex-1 border border-gray-200 rounded-lg px-2 flex items-center text-xs text-gray-500 bg-gray-50 select-all">
                              {draft.badge_color}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">Start Date</label>
                        <input
                          type="datetime-local"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                          value={draft.start_date ? draft.start_date.slice(0, 16) : ''}
                          onChange={(e) => handleDraftChange('start_date', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">End Date</label>
                        <input
                          type="datetime-local"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                          value={draft.end_date ? draft.end_date.slice(0, 16) : ''}
                          onChange={(e) => handleDraftChange('end_date', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 w-full"></div>

                  {/* Section 2: Products */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles size={14} /> Selected Products ({selectedItems.size})
                      </h4>
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto bg-gray-50/30">
                      {inventory.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">No inventory loaded.</div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {inventory.map((item) => {
                            const checked = selectedItems.has(item.id);
                            return (
                              <div
                                key={item.id}
                                onClick={() => toggleItem(item.id)}
                                className={`p-3 flex items-center gap-3 cursor-pointer transition-colors ${checked ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                                  {checked && <Plus size={10} className="text-white rotate-45 transform" />}
                                </div>
                                <div className="h-10 w-10 bg-white border border-gray-200 rounded-lg overflow-hidden shrink-0">
                                  <img src={item.global_products.image_url || '/placeholder.png'} className="w-full h-full object-cover" alt="img" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">{item.global_products.name}</div>
                                  <div className="text-xs text-gray-500 flex items-center gap-2">
                                    <span>{item.global_products.manufacturer || 'Generic'}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>${item.price.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section 3: Links */}
                  {selectedSegment.is_active && (
                    <div className="bg-green-50 rounded-lg border border-green-100 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-green-100 text-green-600">
                          <LinkIcon size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-green-800">Campaign is Live</div>
                          <div className="text-xs text-green-700 font-mono mt-0.5">{marketingLink}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopyLink(marketingLink)}
                        className="text-xs bg-white border border-green-200 text-green-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-green-100"
                      >
                        Copy Link
                      </button>
                    </div>
                  )}

                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                <Sparkles size={48} className="text-gray-200 mb-4" />
                <p className="font-medium text-gray-900">No Campaign Selected</p>
                <p className="text-sm max-w-xs mx-auto mt-2">Select a campaign from the left to edit details, or create a new one to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
