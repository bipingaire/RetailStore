'use client';
import { useState, Suspense } from 'react';
import { apiClient } from '@/lib/api-client';
import { Lock, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    if (!token) {
        return (
            <div className="text-center py-12">
                <h1 className="text-xl font-bold text-red-600 mb-4">Invalid Link</h1>
                <p className="text-gray-600 mb-6">This password reset link is invalid or expired.</p>
                <Link href="/shop/forgot-password" className="text-green-600 font-bold hover:underline">
                    Request a new link
                </Link>
            </div>
        );
    }

    async function handleReset(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirm) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await apiClient.resetPassword(token!, password);
            toast.success('Password updated successfully');
            router.push('/shop/login');
        } catch (error: any) {
            console.error('Reset error:', error);
            toast.error(error.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <Link href="/shop/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 font-medium mb-8">
                <ArrowLeft size={20} />
                Back to Login
            </Link>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold mb-6">Change Password</h1>

                <form onSubmit={handleReset} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="password"
                                required
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                minLength={6}
                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
