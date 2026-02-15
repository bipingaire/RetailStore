'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export default function SuperadminLogin() {
    const [email, setEmail] = useState('superadmin@retailstore.com');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await apiClient.post('/auth/super-admin/login', {
                email,
                password,
            });

            if (data.access_token) {
                localStorage.setItem('accessToken', data.access_token);
                // Also store user info if needed
                localStorage.setItem('user', JSON.stringify(data.user));

                toast.success('Welcome back, Superadmin.');
                router.push('/super-admin');
                router.refresh();
            } else {
                throw new Error('Login failed: No access token received');
            }

        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.message || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-500 mb-6 border border-blue-600/30 shadow-lg shadow-blue-900/20">
                        <Database size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Master Console</h1>
                    <p className="text-gray-400">Restricted Access • Superadmin Only</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Superadmin ID</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="admin@retailos.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Security Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                            {loading ? 'Verifying Credentials...' : 'Access Console'}
                            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-gray-600">
                        <p>Unauthorized access attempts are logged.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

