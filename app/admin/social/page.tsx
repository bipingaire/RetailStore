'use client';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Save, Link, Share2, Eye, Sparkles, Megaphone, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function SocialPage() {
  const [loading, setLoading] = useState(true);
  const [savingKeys, setSavingKeys] = useState(false);
  const [accounts, setAccounts] = useState({
    instagram: '',
    instagram_token: '',
    facebook: '',
    facebook_token: '',
    tiktok: '',
    tiktok_token: '',
    canvaApiKey: '',
    imageApiKey: '',
    siteUrl: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const data = await apiClient.getSocialAccounts();
      if (data) setAccounts(data);
    } catch (error) {
      console.error('Failed to load social accounts', error);
      // toast.error('Failed to load configurations');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveKeys() {
    setSavingKeys(true);
    try {
      await apiClient.saveSocialSettings(accounts);
      toast.success('Connections saved successfully');
    } catch (error) {
      console.error('Failed to save settings', error);
      toast.error('Failed to save connections');
    } finally {
      setSavingKeys(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="text-blue-600" size={24} />
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Social Campaigns</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">Push offers to social + site</h1>
          <p className="text-gray-500 mt-2">Connect social accounts, generate creatives, and push your sale campaigns with deep links to the shop.</p>
        </div>

        {/* Connections Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-2 mb-6 text-blue-600 font-bold border-b border-blue-50 pb-4 inline-block pr-6">
            <Link size={20} />
            <h2 className="text-lg">Connect accounts & creative APIs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Instagram */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Instagram Page ID / Handle</label>
                <input
                  type="text"
                  placeholder="e.g. 1029384756 (Page ID)"
                  value={accounts.instagram}
                  onChange={(e) => setAccounts({ ...accounts, instagram: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Access Token</label>
                <input
                  type="password"
                  placeholder="EAA..."
                  value={accounts.instagram_token}
                  onChange={(e) => setAccounts({ ...accounts, instagram_token: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition font-mono text-xs"
                />
              </div>
            </div>

            {/* Facebook */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Facebook Page ID / Handle</label>
                <input
                  type="text"
                  placeholder="e.g. 1029384756 (Page ID)"
                  value={accounts.facebook}
                  onChange={(e) => setAccounts({ ...accounts, facebook: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Access Token</label>
                <input
                  type="password"
                  placeholder="EAA..."
                  value={accounts.facebook_token}
                  onChange={(e) => setAccounts({ ...accounts, facebook_token: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition font-mono text-xs"
                />
              </div>
            </div>

            {/* Tiktok */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tiktok Page ID / Handle</label>
                <input
                  type="text"
                  placeholder="e.g. 1029384756 (Page ID)"
                  value={accounts.tiktok}
                  onChange={(e) => setAccounts({ ...accounts, tiktok: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1 uppercase">Access Token</label>
                <input
                  type="password"
                  placeholder="EAA..."
                  value={accounts.tiktok_token}
                  onChange={(e) => setAccounts({ ...accounts, tiktok_token: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition font-mono text-xs"
                />
              </div>
            </div>

            {/* Storefront URL */}
            <div className="space-y-4">
              <div className="invisible">
                {/* Spacer to align with Tiktok inputs visually if needed, or just standard flow */}
                <label className="block text-sm font-bold text-gray-700 mb-1">&nbsp;</label>
                <div className="h-[46px]"></div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Storefront base URL</label>
                <input
                  type="text"
                  placeholder="https://yourshop.com"
                  value={accounts.siteUrl}
                  onChange={(e) => setAccounts({ ...accounts, siteUrl: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                />
              </div>
            </div>

            {/* API Keys */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Canva / Creative API key</label>
                <input
                  type="password"
                  placeholder="canva_xxx"
                  value={accounts.canvaApiKey}
                  onChange={(e) => setAccounts({ ...accounts, canvaApiKey: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Image Gen LLM API key</label>
                <input
                  type="password"
                  placeholder="sk-image-..."
                  value={accounts.imageApiKey}
                  onChange={(e) => setAccounts({ ...accounts, imageApiKey: e.target.value })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition"
                />
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
              <div className="w-4 h-4 rounded-full border border-green-200 flex items-center justify-center bg-green-50">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              Securely encrypted & stored per-tenant.
            </div>
            <button
              onClick={handleSaveKeys}
              disabled={savingKeys}
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-sm hover:bg-blue-700 transition"
            >
              {savingKeys ? 'Saving...' : 'Save connections'}
            </button>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-purple-600" size={24} />
            <h2 className="text-lg font-bold text-gray-900">Active Campaigns</h2>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">New</span>
                <span className="text-xs text-gray-400 truncate">https://yourshop.com/shop#segment-campaign-1768145050806</span>
              </div>

              <div className="flex gap-4">
                <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center shrink-0">
                  <ImageIcon className="text-gray-300" size={24} />
                </div>
                <div className="mt-1">
                  <h3 className="text-lg font-bold text-gray-900">New Campaign</h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2 transition shadow-sm">
                  <ImageIcon size={16} /> Generate Image
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2 transition shadow-sm">
                  <Share2 size={16} /> Post to Social
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2 transition shadow-sm">
                  <Link size={16} /> Copy link
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2 transition shadow-sm">
                  <Eye size={16} /> View products
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
