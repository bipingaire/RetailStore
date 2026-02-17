'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const redirectTo = searchParams?.get('redirect') || '/shop';

    // Check if already logged in
    useEffect(() => {
        async function checkAuth() {
            try {
                // Try to get current user - if successful, redirect
                await apiClient.get('/auth/me');
                router.replace(redirectTo);
            } catch (err) {
                // Not logged in, stay on page
            }
        }
        checkAuth();
    }, []);

    async function handleLogin() {
        setLoading(true);
        setError('');

        try {
            // Login via backend API
            await apiClient.post('/auth/login', {
                email,
                password,
            });

            // Check for pending cart item
            const pendingItem = sessionStorage.getItem('pending_cart_item');

            if (pendingItem) {
                // Add item to cart
                const existingCart = localStorage.getItem('retail_cart');
                const cart = existingCart ? JSON.parse(existingCart) : {};
                cart[pendingItem] = (cart[pendingItem] || 0) + 1;
                localStorage.setItem('retail_cart', JSON.stringify(cart));

                // Clear pending item
                sessionStorage.removeItem('pending_cart_item');

                // Redirect to cart
                console.log('✅ Login successful! Pending cart item added, redirecting to cart');
                router.push('/shop/cart');
            } else {
                console.log('✅ Login successful! Redirecting to:', redirectTo);
                router.push(redirectTo);
            }
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Login failed';
            setError(message);
            setLoading(false);
        }
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h1>
                    <p className="text-sm text-gray-600">Sign in to your account</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">

                    {/* Email/Password Form */}
                    <div className="space-y-3">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-gray-700 font-medium text-sm">
                                    Password
                                </label>
                                <Link
                                    href="/shop/forgot-password"
                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                                >
                                    Forgot?
                                </Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleLogin}
                            disabled={loading || !email || !password}
                            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-600 text-xs">
                            Don't have an account?{' '}
                            <Link
                                href={`/shop/register?redirect=${redirectTo}`}
                                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                            >
                                Sign up
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
