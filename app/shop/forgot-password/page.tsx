'use client';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const response: any = await apiClient.forgotPassword(email);

            // DEMO HACK: Save token to window for the "Check Email" view to use
            if (response.debug_token) {
                (window as any).debugToken = response.debug_token;
            }

            setSent(true);
            toast.success('Reset link sent!');
        } catch (error: any) {
            console.error('Reset error:', error);
            toast.error(error.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-green-600" size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
                <p className="text-gray-500 mb-8">
                    We've sent password reset instructions to <strong>{email}</strong>
                </p>

                {/* DEMO ONLY: Show the link manually since we don't have email */}
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6 text-left">
                    <p className="text-xs font-bold text-yellow-800 mb-1 uppercase">Demo Mode</p>
                    <p className="text-sm text-yellow-700 mb-2">
                        Since we don't have an email server, click the link below to verify:
                    </p>
                    <Link
                        href={`/shop/reset-password?token=${(window as any).debugToken}`}
                        className="text-blue-600 hover:underline break-all text-sm"
                    >
                        Reset Link
                    </Link>
                </div>

                <Link
                    href="/shop/login"
                    className="block w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    );
}

return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                <p className="text-gray-500 mt-2">Enter your email to receive instructions</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Sending...
                        </>
                    ) : (
                        <>
                            Send Reset Link
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>

                <div className="text-center">
                    <Link href="/shop/login" className="text-sm text-gray-500 hover:text-gray-900 font-medium">
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    </div>
);
}
