'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { apiClient } from '@/lib/api-client';

function LoginContent() {
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
                await apiClient.get('/auth/profile');
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
            const res: any = await apiClient.post('/auth/login', { email, password });

            // Persist auth state so checkout and other pages can read it
            if (res.access_token) {
                localStorage.setItem('retail_token', res.access_token);
                localStorage.setItem('accessToken', res.access_token);
            }
            if (res.user) {
                localStorage.setItem('retail_user', JSON.stringify(res.user));
            }

            // Check for pending cart item
            const pendingItem = sessionStorage.getItem('pending_cart_item');
            if (pendingItem) {
                const existingCart = localStorage.getItem('retail_cart');
                const cart = existingCart ? JSON.parse(existingCart) : {};
                cart[pendingItem] = (cart[pendingItem] || 0) + 1;
                localStorage.setItem('retail_cart', JSON.stringify(cart));
                sessionStorage.removeItem('pending_cart_item');
                router.push('/shop/cart');
            } else {
                router.push(redirectTo);
            }
        } catch (err: any) {
            const message = err.message?.replace('API Error: ', '') || 'Login failed';
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

                    {/* Google Sign-In */}
                    <button
                        onClick={() =>
                            signIn('google', { callbackUrl: redirectTo })
                        }
                        className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        {/* Google SVG icon */}
                        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                            </g>
                        </svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                        <div className="relative flex justify-center text-xs text-gray-400"><span className="bg-white px-3">or sign in with email</span></div>
                    </div>

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

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
