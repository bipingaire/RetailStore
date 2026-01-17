'use client';
import { useState, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Phone, ArrowRight, ShoppingBag, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function RegisterPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClientComponentClient();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const redirectTo = searchParams?.get('redirect') || '/shop';

    async function handleRegister() {
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        try {
            // Resolve Tenant ID (Mock or Real)
            let tenantId = '11111111-1111-1111-1111-111111111111'; // Default to InduMart Demo

            // Sign up
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: formData.phone,
                        tenant_id: tenantId
                    }
                }
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                // If session exists, user is logged in
                if (data.session) {
                    router.push(redirectTo);
                    return;
                }

                // If no session (maybe implicit flow), try signing in
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password
                });

                if (signInError) {
                    // Fallback to login page if immediate login fails
                    router.push(`/shop/login?email=${encodeURIComponent(formData.email)}&message=Account created. Please login.`);
                    return;
                }

                // Success - redirect
                router.refresh();
                router.push(redirectTo);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">

                {/* Header */}
                <div className="text-center mb-6">
                    <Link href="/shop" className="inline-flex items-center gap-2 mb-4 group">
                        <div className="p-2 bg-emerald-600 rounded-lg shadow group-hover:bg-emerald-700 transition-colors">
                            <ShoppingBag className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold text-gray-900">InduMart</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
                    <p className="text-sm text-gray-600">Join us and start shopping</p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">

                    {/* Registration Form */}
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
                                Phone Number
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
                            {loading ? 'Sending confirmation email...' : 'Create Account'}
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    {/* Divider */}


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
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
            <RegisterPageContent />
        </Suspense>
    );
}
