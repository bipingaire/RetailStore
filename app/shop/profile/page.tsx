'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { User, Mail, Phone, MapPin, Edit, LogOut } from 'lucide-react';
import { toast } from 'sonner';

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/shop/login');
    }
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.email}</h2>
              <p className="text-gray-500">Customer Account</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail size={20} />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 text-gray-700">
                <User size={20} />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">Role</p>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
              <Edit size={20} />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold mb-4">Account Settings</h3>
          <div className="space-y-4">
            <a href="/shop/orders" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <h4 className="font-bold text-gray-900">Order History</h4>
              <p className="text-sm text-gray-500">View your past orders</p>
            </a>
            <a href="/shop/reset-password" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <h4 className="font-bold text-gray-900">Change Password</h4>
              <p className="text-sm text-gray-500">Update your password</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}