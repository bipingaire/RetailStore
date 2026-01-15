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
    instagram_token: '',
    facebook: '',
    facebook_token: '',
    tiktok: '',
    tiktok_token: '',
    canvaApiKey: '',
    imageApiKey: '',
    siteUrl: 'https://yourshop.com',
  });

  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      // Load Campaigns
      const { data: cData } = await supabase
        .from('marketing-campaign-master')
        .select(`
            id: campaign-id,
            slug: campaign-slug,
            title: title-text,
            tagline: tagline-text,
            badge_label: badge-label,
            segment_products: campaign-product-segment-group (
              store_inventory: retail-store-inventory-item!inventory-id (
                id: inventory-id,
                price: selling-price-amount,
                global_products: global-product-master-catalog!global-product-id ( name: product-name, image_url: image-url )
              )
            )
        `)
        .eq('is-active-flag', true)
        .order('sort-order', { ascending: true });

      setCampaigns((cData as any[]) || []);

      // Load Accounts
      const { data: aData } = await supabase
        .from('social-media-accounts')
        .select('*');

      if (aData) {
        const mapped: any = { ...accounts };
        aData.forEach((row: any) => {
          const p = row.platform;
          if (p === 'openai') {
            mapped.imageApiKey = row['access-token'];
          } else if (p === 'canva') {
            mapped.canvaApiKey = row['access-token'];
          } else {
            mapped[p] = row['page-id'];
            mapped[`${p}_token`] = row['access-token'];
          }
        });
        setAccounts(mapped);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  const handleSaveAccounts = async () => {
    setStatus('Saving connections...');

    // 1. Save Social Accounts to DB
    const res = await fetch('/api/social/save-settings', {
      method: 'POST',
      body: JSON.stringify({ accounts }),
    });

    if (res.ok) {
      setStatus('✅ Connections saved securely.');
    } else {
      setStatus('❌ Failed to save connections.');
    }
  };

  const handlePost = async (c: Campaign) => {
    setStatus(`Posting "${c.title}" to connected accounts...`);
    const res = await fetch('/api/social/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignId: c.id,
        platforms: ['facebook', 'instagram'].filter(p => (accounts as any)[`${p}_token`]) // Only post where we have tokens
      })
    });

    const result = await res.json();
    if (res.ok) {
      setStatus(`✅ Published: ${result.message}`);
    } else {
      setStatus(`❌ Error: ${result.error}`);
    }
  };

  const buildLink = (c: Campaign) => {
    const base = accounts.siteUrl || 'https://yourshop.com';
    const hash = c.slug || c.id;
    return `${base}/shop#segment-${hash}`;
  };

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerateImage = async (c: Campaign) => {
    const mainProd = c.segment_products?.[0]?.store_inventory?.global_products?.name || 'Retail Products';
    setStatus(`🎨 Generating AI image for "${c.title}"... please wait (15-20s)`);

    try {
      const res = await fetch('/api/social/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Professional high-end retail advertisement for "${c.title} - ${c.tagline}". Key product: ${mainProd}. luxury style, photorealistic, 4k.`,
          apiKey: accounts.imageApiKey
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatus('✅ Image Generated!');
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }

    } catch (err: any) {
      setStatus('❌ Image Gen Failed: ' + err.message);
    }
  };

  // ... (rest of handles)

  // Placeholder for product-specific posting
  const handleProductPost = async (c: Campaign, product: any) => {
    setStatus(`Posting distinct product "${product?.global_products?.name}" feature... (Coming Soon)`);
    // Future: Call specific API endpoint
    setTimeout(() => setStatus(''), 2000);
  };

  const handleProductImage = async (campaign: Campaign, product: any) => {
    const prodName = product?.global_products?.name || 'Product';
    setStatus(`🎨 Generating product shot for "${prodName}"...`);

    try {
      const res = await fetch('/api/social/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Professional studio marketing shot of ${prodName}. clean lighting, retail catalog style.`,
          apiKey: accounts.imageApiKey
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStatus('✅ Product Image Ready!');
      if (data.imageUrl) setGeneratedImage(data.imageUrl);

    } catch (err: any) {
      setStatus('❌ Gen Failed: ' + err.message);
    }
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
    <div className="min-h-screen bg-gray-50 p-8 font-sans relative">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ... (existing UI) ... */}
        {/* We need to re-render the existing UI here, or just wrap the return carefully. 
            Since I am replacing a block, I will just ensure the modal is at the end.
        */}
        <header className="flex flex-col gap-2">
          {/* Header Content ... */}
          <div className="flex items-center gap-2 text-blue-700 font-bold">
            <Megaphone size={20} /> Social Campaigns
          </div>
          <h1 className="text-3xl font-black text-gray-900">Push offers to social + site</h1>
          <p className="text-gray-500">
            Connect social accounts, generate creatives, and push your sale campaigns with deep links to the shop.
          </p>
        </header>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          {/* Connection Form Content ... simplified for replacement match */}
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <Link2 className="text-blue-600" /> Connect accounts & creative APIs
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['instagram', 'facebook', 'tiktok'].map((k) => (
              <div key={k} className="space-y-2 border p-3 rounded-lg bg-gray-50">
                <label className="text-sm text-gray-700 space-y-1 block">
                  <span className="capitalize font-bold flex items-center gap-2">
                    {k} Page ID / Handle
                  </span>
                  <input
                    className="border rounded-lg px-3 py-2 text-sm w-full"
                    value={(accounts as any)[k]}
                    onChange={(e) => setAccounts((prev) => ({ ...prev, [k]: e.target.value }))}
                    placeholder={`e.g. 1029384756 (Page ID)`}
                  />
                </label>
                <label className="text-sm text-gray-700 space-y-1 block">
                  <span className="capitalize text-xs text-gray-500">Access Token</span>
                  <input
                    type="password"
                    className="border rounded-lg px-3 py-2 text-sm w-full bg-white"
                    value={(accounts as any)[`${k}_token`] || ''}
                    onChange={(e) => setAccounts((prev) => ({ ...prev, [`${k}_token`]: e.target.value }))}
                    placeholder="EAA..."
                  />
                </label>
              </div>
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
              <ShieldCheck className="text-green-600" size={14} />
              Securely encrypted & stored per-tenant.
            </div>
            <button
              onClick={handleSaveAccounts}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              Save connections
            </button>
          </div>
          {status && (
            <div className={`text-xs border rounded-lg px-3 py-2 ${status.includes('❌') ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              {status}
            </div>
          )}
        </div>

        {/* Existing Grid ... */}
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

      </div>

      {generatedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">AI Generated Creative</h3>
              <button onClick={() => setGeneratedImage(null)} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>
            <div className="p-6 bg-gray-100 flex justify-center">
              <img src={generatedImage} alt="Generated" className="rounded-lg shadow-lg max-h-[60vh] object-contain" />
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setGeneratedImage(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => window.open(generatedImage, '_blank')}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Download High-Res
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
