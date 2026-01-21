'use client';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Facebook, Instagram, Share2, Globe, ArrowRight, Loader2, Save } from 'lucide-react';
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
    imageApiKey: '', // e.g. OpenAI
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
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveKeys() {
    setSavingKeys(true);
    try {
      await apiClient.saveSocialSettings(accounts);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings', error);
      toast.error('Failed to save settings');
    } finally {
      setSavingKeys(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Social & Marketing Intelligence
          </h1>
          <p className="text-gray-500">Manage your digital presence and AI marketing tools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Social Accounts */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Share2 className="text-blue-500" />
            Connected Accounts
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <Facebook size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Facebook Page</h3>
                  <input
                    type="text"
                    placeholder="Page ID / Name"
                    className="text-xs bg-transparent border-none focus:ring-0 p-0 text-gray-500 w-full outline-none"
                    value={accounts.facebook}
                    onChange={(e) => setAccounts({ ...accounts, facebook: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-1 rounded-full text-xs ${accounts.facebook_token ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {accounts.facebook_token ? 'Connected' : 'Not Connected'}
                </span>
                <input
                  type="password"
                  placeholder="Access Token"
                  className="text-xs border rounded px-1 w-24 outline-none"
                  value={accounts.facebook_token}
                  onChange={(e) => setAccounts({ ...accounts, facebook_token: e.target.value })}
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                  <Instagram size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Instagram Business</h3>
                  <input
                    type="text"
                    placeholder="Handle"
                    className="text-xs bg-transparent border-none focus:ring-0 p-0 text-gray-500 w-full outline-none"
                    value={accounts.instagram}
                    onChange={(e) => setAccounts({ ...accounts, instagram: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-1 rounded-full text-xs ${accounts.instagram_token ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {accounts.instagram_token ? 'Connected' : 'Not Connected'}
                </span>
                <input
                  type="password"
                  placeholder="Access Token"
                  className="text-xs border rounded px-1 w-24 outline-none"
                  value={accounts.instagram_token}
                  onChange={(e) => setAccounts({ ...accounts, instagram_token: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Globe className="text-purple-500" />
            API Integrations
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
              <input
                type="url"
                placeholder="https://yourstore.com"
                value={accounts.siteUrl}
                onChange={(e) => setAccounts({ ...accounts, siteUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Key (Image Gen)</label>
              <input
                type="password"
                placeholder="sk-..."
                value={accounts.imageApiKey}
                onChange={(e) => setAccounts({ ...accounts, imageApiKey: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleSaveKeys}
                disabled={savingKeys}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                {savingKeys ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
