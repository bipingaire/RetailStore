'use client';
import { useState, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowRight, ShoppingBag, Loader2, Lock } from 'lucide-react';
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

        // Validation
        if (!formData.email || !formData.fullName || !formData.password) {
            setError('Please fill in all required fields');
            setLoading(false);
            return;
        }

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
            // Create account with email confirmation
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: formData.phone,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`
                }
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }

            console.log('✅ Registration successful! Confirmation email sent.');
            setEmailSent(true);
            setLoading(false);

        } catch (err: any) {
            setError(err.message || 'Failed to create account');
            setLoading(false);
        }
    }

    // Email Sent Confirmation Screen
    if (emailSent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                            <Mail className="text-green-600" size={40} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                        <p className="text-gray-600">
                            We sent a confirmation link to:
                        </p>
                        <p className="text-emerald-600 font-semibold text-lg mt-2">
                            {formData.email}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    <Mail size={18} />
                                    Next Steps:
                                </h3>
                                <ol className="text-sm text-blue-900 space-y-2 list-decimal list-inside">
                                    <li>Open your email inbox</li>
                                    <li>Find the email from Supabase Auth</li>
                                    <li>Click the "Confirm your email" link</li>
                                    <li>You'll be automatically logged in</li>
                                </ol>
                            </div>

                            <div className="text-center text-xs text-gray-500">
                                <p>Didn't receive the email? Check your spam folder.</p>
                                <button
                                    onClick={() => setEmailSent(false)}
                                    className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors mt-2"
                                >
                                    Try a different email
                                </button>
                            </div>

                            <Link
                                href="/shop"
                                className="block w-full text-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition"
                            >
                                Back to Shop
                            </Link>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-gray-600 text-xs">
                            Already verified?{' '}
                            <Link
                                href={`/shop/login?redirect=${redirectTo}`}
                                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Registration Form
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
                    <div className="space-y-3">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                                Full Name <span className="text-red-500">*</span>
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
                                Email <span className="text-red-500">*</span>
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
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+977 9876543210"
                                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Min. 6 characters"
                                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                placeholder="Re-enter password"
                                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                            />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs text-blue-900">
                                <strong>📧 Email Verification:</strong> We'll send a confirmation link to your email. Click it to activate your account.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleRegister}
                            disabled={loading || !formData.email || !formData.fullName || !formData.password || !formData.confirmPassword}
                            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={16} />
                                </>
                            )}
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
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
            <RegisterPageContent />
        </Suspense>
    );
}
