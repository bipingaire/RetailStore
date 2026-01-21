'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { User, Mail, Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await apiClient.getCurrentUser();
        setUser(data);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-8">Account Settings</h1>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.full_name || 'Customer'}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={user?.full_name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                defaultValue={user?.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2">
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
