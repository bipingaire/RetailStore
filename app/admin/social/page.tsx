'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, Megaphone, Link2, Image as ImageIcon, Share2, Check, AlertCircle, ShieldCheck } from 'lucide-react';

type Campaign = {
  id: string;
  slug?: string;
  title: string;
  tagline?: string;
  badge_label?: string;
  segment_products: {
    store_inventory: {
      id: string;
      price: number;
      global_products: {
        name: string;
        image_url: string;
      };
    } | null;
  }[];
};

export default function SocialPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [accounts, setAccounts] = useState({
    instagram: '',
    facebook: '',
    tiktok: '',
    canvaApiKey: '',
    imageApiKey: '',
    siteUrl: 'https://yourshop.com',
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function loadCampaigns() {
      const { data, error } = await supabase
        .from('product_segments')
        .select(`
          id, slug, title, tagline, badge_label,
          segment_products (
            store_inventory:store_inventory_id (
              id, price,
              global_products ( name, image_url )
            )
          )
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Campaign load error', error);
      }
      setCampaigns((data as any[]) || []);
      setLoading(false);
    }
    loadCampaigns();
  }, []);

  const handleSaveAccounts = () => {
    setStatus('Connections saved locally (wire to your secrets store).');
  };

  const buildLink = (c: Campaign) => {
    const base = accounts.siteUrl || 'https://yourshop.com';
    const hash = c.slug || c.id;
    return `${base}/shop#segment-${hash}`;
  };

  const handleGenerateImage = (c: Campaign) => {
    const main = c.segment_products?.[0]?.store_inventory?.global_products;
    setStatus(
      `Queued image generation for "${c.title}" using ${main?.name || 'campaign main product'} (mock). Wire to Canva/LLM with provided API keys.`
    );
  };

  const handlePost = (c: Campaign) => {
    setStatus(
      `Posting "${c.title}" to ${['instagram','facebook','tiktok'].filter((k)=> (accounts as any)[k]).join(', ') || 'no accounts'}. (stub — add API integration)`
    );
  };

  const handleProductPost = (campaign: Campaign, product: any) => {
    const prodName = product?.global_products?.name || 'Product';
    setStatus(
      `Posting "${prodName}" from ${campaign.title} to ${['instagram','facebook','tiktok'].filter((k)=> (accounts as any)[k]).join(', ') || 'no accounts'} (stub — add API integration)`
    );
  };

  const handleProductImage = (campaign: Campaign, product: any) => {
    const prodName = product?.global_products?.name || 'Product';
    setStatus(`Queued image generation for "${prodName}" in ${campaign.title} (stub). Wire to Canva/LLM APIs.`);
  };

  const sanitizedCampaigns = useMemo(
    () =>
      campaigns.map((c) => {
        const prod = c.segment_products?.find((sp) => sp.store_inventory)?.store_inventory;
        return { ...c, primary: prod };
      }),
    [campaigns]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-blue-700 font-bold">
            <Megaphone size={20} /> Social Campaigns
          </div>
          <h1 className="text-3xl font-black text-gray-900">Push offers to social + site</h1>
          <p className="text-gray-500">
            Connect social accounts, generate creatives, and push your sale campaigns with deep links to the shop.
          </p>
        </header>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <Link2 className="text-blue-600" /> Connect accounts & creative APIs
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['instagram', 'facebook', 'tiktok'].map((k) => (
              <label key={k} className="text-sm text-gray-700 space-y-1">
                <span className="capitalize">{k} handle / page</span>
                <input
                  className="border rounded-lg px-3 py-2 text-sm w-full"
                  value={(accounts as any)[k]}
                  onChange={(e) => setAccounts((prev) => ({ ...prev, [k]: e.target.value }))}
                  placeholder={`@your-${k}`}
                />
              </label>
            ))}
            <label className="text-sm text-gray-700 space-y-1">
              <span>Storefront base URL</span>
              <input
                className="border rounded-lg px-3 py-2 text-sm w-full"
                value={accounts.siteUrl}
                onChange={(e) => setAccounts((prev) => ({ ...prev, siteUrl: e.target.value }))}
                placeholder="https://yourshop.com"
              />
            </label>
            <label className="text-sm text-gray-700 space-y-1">
              <span>Canva / Creative API key</span>
              <input
                className="border rounded-lg px-3 py-2 text-sm w-full"
                value={accounts.canvaApiKey}
                onChange={(e) => setAccounts((prev) => ({ ...prev, canvaApiKey: e.target.value }))}
                placeholder="canva_xxx"
              />
            </label>
            <label className="text-sm text-gray-700 space-y-1">
              <span>Image Gen LLM API key</span>
              <input
                className="border rounded-lg px-3 py-2 text-sm w-full"
                value={accounts.imageApiKey}
                onChange={(e) => setAccounts((prev) => ({ ...prev, imageApiKey: e.target.value }))}
                placeholder="sk-image-..."
              />
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <ShieldCheck className="text-green-500" size={14} />
              Store per-tenant only. Implement server save to persist.
            </div>
            <button
              onClick={handleSaveAccounts}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              Save connections
            </button>
          </div>
          {status && (
            <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {status}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Active Campaigns</h2>
          </div>

          {loading ? (
            <div className="text-sm text-gray-500">Loading campaigns...</div>
          ) : sanitizedCampaigns.length === 0 ? (
            <div className="text-sm text-gray-500">No active campaigns found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sanitizedCampaigns.map((c) => {
                const primary = (c as any).primary;
                const link = buildLink(c);
                const isExpanded = expanded === c.id;
                return (
                  <div key={c.id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">
                        {c.badge_label || 'Campaign'}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{link}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border flex items-center justify-center">
                        {primary?.global_products?.image_url ? (
                          <img src={primary.global_products.image_url} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{c.title}</div>
                        <div className="text-xs text-gray-500">{c.tagline || primary?.global_products?.name}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleGenerateImage(c)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-white border hover:border-purple-200 hover:text-purple-700"
                      >
                        <ImageIcon size={14} /> Generate Image
                      </button>
                      <button
                        onClick={() => handlePost(c)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Share2 size={14} /> Post to Social
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(link);
                          setStatus('Link copied for ' + c.title);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-white border hover:border-blue-200 hover:text-blue-700"
                      >
                        <Link2 size={14} /> Copy link
                      </button>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : c.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg bg-white border hover:border-gray-200"
                      >
                        {isExpanded ? 'Hide products' : 'View products'}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="space-y-2 pt-2 border-t border-gray-200">
                        {(c.segment_products || [])
                          .filter((sp) => sp.store_inventory)
                          .map((sp, idx) => {
                            const prod = sp.store_inventory;
                            return (
                              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-50 border flex items-center justify-center">
                                    {prod?.global_products?.image_url ? (
                                      <img src={prod.global_products.image_url} className="w-full h-full object-cover" />
                                    ) : (
                                      <ImageIcon className="text-gray-300" />
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">
                                      {prod?.global_products?.name || 'Product'}
                                    </span>
                                    <span className="text-xs text-gray-500">${prod?.price?.toFixed(2) || '0.00'}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleProductImage(c, prod)}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded bg-white border hover:border-purple-200 hover:text-purple-700"
                                  >
                                    <ImageIcon size={12} /> Generate
                                  </button>
                                  <button
                                    onClick={() => handleProductPost(c, prod)}
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                                  >
                                    <Share2 size={12} /> Post
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex gap-2">
          <AlertCircle size={16} />
          Wire the “Save” and “Post” actions to your secure backend and POS/social providers. Current buttons are stubs for UI flow.
        </div>
      </div>
    </div>
  );
}
