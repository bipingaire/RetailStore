'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Mail, ArrowLeft, CheckCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const supabase = createClientComponentClient();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    async function handleResetPassword() {
        setLoading(true);
        setError('');

        if (!email) {
            setError('Please enter your email address');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/shop/reset-password`,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setEmailSent(true);
            setLoading(false);
        }
    }

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <CheckCircle className="text-blue-600" size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email!</h2>
                        <p className="text-gray-600 mb-4">
                            We've sent a password reset link to:
                        </p>
                        <p className="text-blue-600 font-semibold text-lg mb-6">
                            {email}
                        </p>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm text-blue-900 mb-2">
                                <strong>📧 Next Steps:</strong>
                            </p>
                            <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
                                <li>Open your email inbox</li>
                                <li>Click the password reset link</li>
                                <li>Enter your new password</li>
                                <li>Sign in with new password</li>
                            </ol>
                        </div>

                        <p className="text-xs text-gray-500 mb-4">
                            Link expires in 1 hour. Didn't receive it? Check spam folder.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => setEmailSent(false)}
                                className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-all"
                            >
                                ← Try Another Email
                            </button>
                            <Link
                                href="/shop/login"
                                className="block w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all text-center"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password?</h1>
                    <p className="text-sm text-gray-600">Enter your email to reset your password</p>
                </div>

                {/* Reset Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1.5 text-sm">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleResetPassword}
                            disabled={loading || !email}
                            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Mail size={16} />
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        <Link
                            href="/shop/login"
                            className="flex items-center justify-center gap-2 w-full text-gray-600 hover:text-gray-900 transition-colors text-sm py-2"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-900">
                        💡 <strong>Tip:</strong> Make sure to check your spam folder if you don't see the email within a few minutes.
                    </p>
                </div>
            </div>
        </div>
    );
}
