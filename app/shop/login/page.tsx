'use client';
import { useState, useEffect, Suspense } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClientComponentClient();

    const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const redirectTo = searchParams?.get('redirect') || '/shop';

    // Auto-redirect if already logged in
    useEffect(() => {
        async function checkSession() {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                // Verify they are NOT an admin
                const { data: superAdmin } = await supabase
                    .from('superadmin-users')
                    .select('superadmin-id')
                    .eq('user-id', session.user.id)
                    .single();

                if (superAdmin) {
                    await supabase.auth.signOut();
                    setError('Access Denied: Superadmins must use the Superadmin Dashboard.');
                } else {
                    const { data: tenantRole } = await supabase
                        .from('tenant-user-role')
                        .select('role-type')
                        .eq('user-id', session.user.id)
                        .in('role-type', ['owner', 'manager'])
                        .single();

                    if (tenantRole) {
                        await supabase.auth.signOut();
                        setError('Access Denied: Store Admins/Managers must use the Store Dashboard.');
                    } else {
                        // Valid Customer - Auto Redirect
                        console.log('✅ Already logged in, redirecting to:', redirectTo);
                        router.replace(redirectTo);
                    }
                }
            }
            setLoading(false);
        }
        checkSession();
    }, []);

    async function handlePasswordLogin() {
        setLoading(true);
        setError('');

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        if (authData.user) {
            await validateAndRedirect(authData.user);
        }
    }

    async function handleSendOTP() {
        setLoading(true);
        setError('');

        if (!email) {
            setError('Please enter your email');
            setLoading(false);
            return;
        }

        try {
            const { error: otpError } = await supabase.auth.signInWithOtp({
                email,
            });

            if (otpError) {
                setError(otpError.message);
                setLoading(false);
                return;
            }

            console.log('✅ OTP sent to:', email);
            setStep('otp');
            setLoading(false);

        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
            setLoading(false);
        }
    }

    async function handleVerifyOTP() {
        setLoading(true);
        setError('');

        if (!otpCode || otpCode.length !== 6) {
            setError('Please enter a valid 6-digit code');
            setLoading(false);
            return;
        }

        try {
            const { data, error: verifyError } = await supabase.auth.verifyOtp({
                email,
                token: otpCode,
                type: 'email'
            });

            if (verifyError) {
                setError(verifyError.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                await validateAndRedirect(data.user);
            }

        } catch (err: any) {
            setError(err.message || 'Invalid OTP code');
            setLoading(false);
        }
    }

    async function validateAndRedirect(user: any) {
        // Check if user is Superadmin
        const { data: superAdmin } = await supabase
            .from('superadmin-users')
            .select('superadmin-id')
            .eq('user-id', user.id)
            .single();

        if (superAdmin) {
            await supabase.auth.signOut();
            setError('Access Denied: Superadmins must use the Superadmin Dashboard.');
            setLoading(false);
            return;
        }

        // Check if user is Tenant Admin
        const { data: tenantRole } = await supabase
            .from('tenant-user-role')
            .select('role-type')
            .eq('user-id', user.id)
            .in('role-type', ['owner', 'manager'])
            .single();

        if (tenantRole) {
            await supabase.auth.signOut();
            setError('Access Denied: Store Admins/Managers must use the Store Dashboard.');
            setLoading(false);
            return;
        }

        // Valid Customer - Proceed
        const pendingItem = sessionStorage.getItem('pending_cart_item');

        if (pendingItem) {
            const existingCart = localStorage.getItem('retail_cart');
            const cart = existingCart ? JSON.parse(existingCart) : {};
            cart[pendingItem] = (cart[pendingItem] || 0) + 1;
            localStorage.setItem('retail_cart', JSON.stringify(cart));
            sessionStorage.removeItem('pending_cart_item');
            console.log('✅ Login successful! Pending cart item added, redirecting to cart');
            router.push('/shop/cart');
        } else {
            console.log('✅ Login successful! Redirecting to:', redirectTo);
            router.push(redirectTo);
        }
    }

    async function handleGoogleLogin() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    // OTP Verification Screen
    if (loginMethod === 'otp' && step === 'otp') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                            <Mail className="text-emerald-600" size={32} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Check Your Email</h1>
                        <p className="text-sm text-gray-600">
                            We sent a code to:
                        </p>
                        <p className="text-emerald-600 font-semibold mt-2">
                            {email}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm">
                                    Enter 6-Digit Code
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="000000"
                                    className="w-full bg-white border border-gray-300 text-gray-900 text-center text-2xl tracking-widest font-bold rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && otpCode.length === 6 && handleVerifyOTP()}
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleVerifyOTP}
                                disabled={loading || otpCode.length !== 6}
                                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify & Sign In
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <button
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    className="text-emerald-600 text-sm font-semibold hover:text-emerald-700 transition-colors disabled:opacity-50"
                                >
                                    Resend Code
                                </button>
                            </div>

                            <button
                                onClick={() => { setStep('email'); setLoginMethod('password'); }}
                                className="w-full text-gray-600 text-sm hover:text-gray-800 transition-colors"
                            >
                                ← Back to Login
                            </button>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <Link href="/shop" className="text-gray-500 hover:text-gray-700 transition-colors text-xs">
                            ← Back to Shop
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Main Login Screen
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
                    {loginMethod === 'password' ? (
                        <>
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
                                        onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
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
                                        onKeyDown={(e) => e.key === 'Enter' && handlePasswordLogin()}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handlePasswordLogin}
                                    disabled={loading || !email || !password}
                                    className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                    <ArrowRight size={16} />
                                </button>

                                {/* Login with OTP Link */}
                                <div className="text-center">
                                    <button
                                        onClick={() => { setLoginMethod('otp'); setPassword(''); setError(''); }}
                                        className="text-emerald-600 text-sm font-semibold hover:text-emerald-700 transition-colors"
                                    >
                                        Login with Email Code
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* OTP Email Input */}
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
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                                    />
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-xs text-blue-900">
                                        We'll send a 6-digit code to your email
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleSendOTP}
                                    disabled={loading || !email}
                                    className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Code
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>

                                {/* Back to Password Login */}
                                <div className="text-center">
                                    <button
                                        onClick={() => { setLoginMethod('password'); setError(''); }}
                                        className="text-emerald-600 text-sm font-semibold hover:text-emerald-700 transition-colors"
                                    >
                                        Login with Password
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Divider */}
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-2 bg-white text-gray-500">OR</span>
                        </div>
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

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
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>}>
            <LoginPageContent />
        </Suspense>
    );
}
