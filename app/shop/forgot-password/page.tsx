'use client';
import { useState } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    async function handleReset() {
        setLoading(true);
        setError('');

        // Mock password reset - backend endpoint would send email
        setTimeout(() => {
            setSent(true);
            setLoading(false);
        }, 1000);
    }

    if (sent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                    <p className="text-gray-600 mb-6">
                        If an account exists for {email}, you will receive password reset instructions.
                    </p>
                    <Link href="/shop/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
                        Back to Login →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                    <Link href="/shop" className="inline-flex items-center gap-2 mb-4 group">
                        <div className="p-2 bg-emerald-600 rounded-lg shadow group-hover:bg-emerald-700 transition-colors">
                            <ShoppingBag className="text-white" size={24} />
                        </div>
                        <span className="text-xl font-bold text-gray-900">InduMart</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Reset Password</h1>
                    <p className="text-sm text-gray-600">Enter your email to receive reset instructions</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1.5 text-sm">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleReset()}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleReset}
                            disabled={loading || !email}
                            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/shop/login" className="text-emerald-600 text-xs font-semibold hover:text-emerald-700">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
