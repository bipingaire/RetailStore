'use client';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response: any = await apiClient.forgotPassword(email);

            // Save debug token for demo mode
            if (response.debug_token) {
                (window as any).debugToken = response.debug_token;
            }

            setSent(true);
            toast.success('Reset link sent!');
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to send reset email';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Check Your Email</h1>
                    <p className="text-gray-600 mb-6">
                        We've sent a password reset link to <strong>{email}</strong>
                    </p>

                    {/* Demo mode link */}
                    {(window as any).debugToken && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4 text-left">
                            <p className="text-xs font-bold text-yellow-800 mb-1 uppercase">Demo Mode</p>
                            <p className="text-sm text-yellow-700 mb-2">
                                Since we don't have an email server, click below:
                            </p>
                            <Link
                                href={`/auth/reset-password?token=${(window as any).debugToken}`}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Reset Your Password
                            </Link>
                        </div>
                    )}

                    <p className="text-sm text-gray-500 mb-8">
                        Didn't receive the email? Check your spam folder or try again.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-green-600 hover:underline font-bold"
                    >
                        <ArrowLeft size={20} />
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Forgot Password?</h1>
                    <p className="text-gray-600">
                        No worries! Enter your email and we'll send you reset instructions.
                    </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            placeholder="your@email.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Sending...
                            </>
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 font-bold"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </form>

            </div>
        </div>
    );
}
