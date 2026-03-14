'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { ImageIcon, Save, Plus, Trash2, Loader2 } from 'lucide-react';

type Banner = {
  id: string;
  type: 'main' | 'side';
  tag?: string;
  title: string;
  subtitle: string;
  cta: string;
  bgColor: string;
  imageUrl: string;
  link?: string;
};

const DEFAULT_BANNERS: Banner[] = [
  {
    id: '1',
    type: 'main',
    tag: 'Weekend Deal',
    title: 'Fresh Organic Vegetables',
    subtitle: 'Get 20% off on all seasonal farm produce this week.',
    cta: 'Shop Now',
    bgColor: '#f0f9f4',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/766/766023.png',
    link: '',
  },
  {
    id: '2',
    type: 'side',
    title: 'Premium Honey',
    subtitle: '100% Pure & Raw',
    cta: 'Buy Now',
    bgColor: '#fff8e5',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/8065/8065363.png',
    link: '',
  },
  {
    id: '3',
    type: 'side',
    title: 'Daily Hygiene',
    subtitle: 'Soaps & Sanitizers',
    cta: '15% OFF',
    bgColor: '#eef5ff',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2954/2954888.png',
    link: '',
  },
];

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiClient.get('/settings/shop_banners');
        if (res?.value) {
          const parsed = JSON.parse(res.value);
          if (Array.isArray(parsed) && parsed.length > 0) setBanners(parsed);
        }
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await apiClient.post('/settings', { key: 'shop_banners', value: JSON.stringify(banners) });
      toast.success('Banners saved! Shop page will now show your custom banners.');
    } catch {
      toast.error('Failed to save banners.');
    } finally {
      setSaving(false);
    }
  };

  const update = (id: string, field: keyof Banner, value: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" size={32} /></div>;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="text-blue-600" size={24} /> Shop Banners
            </h1>
            <p className="text-sm text-gray-500 mt-1">Customize the hero banners displayed at the top of your shop page.</p>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save All Banners
          </button>
        </div>

        {/* Banner Cards */}
        {banners.map((banner, idx) => (
          <div key={banner.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{ backgroundColor: banner.bgColor }}
                >
                  <ImageIcon size={18} className="text-gray-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {idx === 0 ? '🟩 Main Banner (Large Left)' : `🟦 Side Banner ${idx} (Right)`}
                  </div>
                  <div className="text-xs text-gray-400">Displayed on the shop homepage hero section</div>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {idx === 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600">Badge / Tag (e.g. "Weekend Deal")</label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                    value={banner.tag || ''}
                    onChange={e => update(banner.id, 'tag', e.target.value)}
                    placeholder="e.g. New Arrival"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Title</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  value={banner.title}
                  onChange={e => update(banner.id, 'title', e.target.value)}
                  placeholder="e.g. Fresh Organic Veggies"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Subtitle / Description</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  value={banner.subtitle}
                  onChange={e => update(banner.id, 'subtitle', e.target.value)}
                  placeholder="e.g. 20% off this week"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Button / CTA Text</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  value={banner.cta}
                  onChange={e => update(banner.id, 'cta', e.target.value)}
                  placeholder="e.g. Shop Now"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Image URL</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 font-mono"
                  value={banner.imageUrl}
                  onChange={e => update(banner.id, 'imageUrl', e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600">Background Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    value={banner.bgColor}
                    onChange={e => update(banner.id, 'bgColor', e.target.value)}
                  />
                  <input
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 font-mono"
                    value={banner.bgColor}
                    onChange={e => update(banner.id, 'bgColor', e.target.value)}
                    placeholder="#f0f9f4"
                  />
                </div>
              </div>
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-semibold text-gray-600">Link URL (optional – where clicking this banner goes)</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                  value={banner.link || ''}
                  onChange={e => update(banner.id, 'link', e.target.value)}
                  placeholder="e.g. /shop?category=vegetables"
                />
              </div>

              {/* Live Preview */}
              {banner.imageUrl && (
                <div className="col-span-2 flex items-center gap-4 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50">
                  <img src={banner.imageUrl} alt="preview" className="w-16 h-16 object-contain rounded-lg" onError={e => (e.currentTarget.style.display = 'none')} />
                  <div style={{ backgroundColor: banner.bgColor }} className="flex-1 rounded-xl p-4">
                    {banner.tag && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{banner.tag}</span>}
                    <div className="font-bold text-gray-900 text-lg mt-1">{banner.title}</div>
                    <div className="text-gray-600 text-sm">{banner.subtitle}</div>
                    <span className="text-xs font-bold text-green-700 mt-1 inline-block">{banner.cta} →</span>
                  </div>
                  <div className="text-xs text-gray-400">Live Preview</div>
                </div>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
