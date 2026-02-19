'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Phone, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const redirectTo = searchParams?.get('redirect') || '/shop';

    async function handleRegister() {
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        try {
            const res: any = await apiClient.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                name: formData.fullName,
            });

            // Save auth state — register returns same payload as login
            if (res.access_token) {
                localStorage.setItem('retail_token', res.access_token);
                localStorage.setItem('accessToken', res.access_token);
            }
            if (res.user) {
                localStorage.setItem('retail_user', JSON.stringify(res.user));
            }

            setSuccess(true);

            // Redirect directly to destination (no need to go through login)
            setTimeout(() => {
                router.push(redirectTo);
            }, 1500);
        } catch (err: any) {
            const raw = err?.message || 'Registration failed';
            const message = raw.includes('already exists') ? 'An account with this email already exists. Please sign in instead.' : raw.replace('API Error: ', '');
            setError(message);
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                    <p className="text-gray-600 mb-6">
                        Your account has been created. Redirecting to login...
                    </p>
                    <Link href="/shop/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
                        Go to Login →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">

                {/* Logo/Header */}
                <div className="text-center mb-6">
                    <Link href="/shop" className="inline-flex items-center gap-2 mb-4 group">
                        <div className="p-2 bg-emerald-600 rounded-lg shadow group-hover:bg-emerald-700 transition-colors">
                            <ShoppingBag className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold text-gray-900">InduMart</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
                    <p className="text-sm text-gray-600">Join InduMart today</p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">

                    <div className="space-y-3">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="John Doe"
                                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="your@email.com"
                                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                                Phone (Optional)
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="••••••••"
                                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleRegister}
                            disabled={loading || !formData.email || !formData.password || !formData.fullName}
                            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-600 text-xs">
                            Already have an account?{' '}
                            <Link
                                href={`/shop/login?redirect=${redirectTo}`}
                                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to Shop */}
                <div className="text-center mt-4">
                    <Link href="/shop" className="text-gray-500 hover:text-gray-700 transition-colors text-xs">
                        ← Back to Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <RegisterContent />
        </Suspense>
    );
}
