'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { CreditCard, Eye, EyeOff, Save, Edit2, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useTenant } from '@/lib/hooks/useTenant';

export default function PaymentSettingsPage() {
    const supabase = createClientComponentClient();
    const { tenantId } = useTenant();

    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [showSecretKey, setShowSecretKey] = useState(false);

    const [config, setConfig] = useState({
        publishableKey: '',
        secretKey: '',
        paymentEnabled: false
    });

    const [formData, setFormData] = useState({
        publishableKey: '',
        secretKey: ''
    });

    useEffect(() => {
        if (tenantId) {
            fetchPaymentConfig();
        }
    }, [tenantId]);

    async function fetchPaymentConfig() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tenant-payment-config')
                .select('*')
                .eq('tenant-id', tenantId)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setConfig({
                    publishableKey: data['stripe-publishable-key'] || '',
                    secretKey: data['stripe-secret-key'] || '',
                    paymentEnabled: data['payment-enabled'] || false
                });
                setFormData({
                    publishableKey: data['stripe-publishable-key'] || '',
                    secretKey: data['stripe-secret-key'] || ''
                });
            }
        } catch (err: any) {
            console.error('Error fetching payment config:', err);
            toast.error('Failed to load payment settings');
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async () => {
        if (!tenantId) return toast.error('Tenant ID not found');

        // Validate keys
        if (!formData.publishableKey.startsWith('pk_')) {
            return toast.error('Invalid publishable key format. Must start with pk_');
        }
        if (!formData.secretKey.startsWith('sk_')) {
            return toast.error('Invalid secret key format. Must start with sk_');
        }

        try {
            const { data: existing } = await supabase
                .from('tenant-payment-config')
                .select('config-id')
                .eq('tenant-id', tenantId)
                .maybeSingle();

            if (existing) {
                // Update
                const { error } = await supabase
                    .from('tenant-payment-config')
                    .update({
                        'stripe-publishable-key': formData.publishableKey,
                        'stripe-secret-key': formData.secretKey,
                        'payment-enabled': true,
                        'updated-at': new Date().toISOString()
                    })
                    .eq('config-id', existing['config-id']);

                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('tenant-payment-config')
                    .insert({
                        'tenant-id': tenantId,
                        'stripe-publishable-key': formData.publishableKey,
                        'stripe-secret-key': formData.secretKey,
                        'payment-enabled': true
                    });

                if (error) throw error;
            }

            toast.success('Payment settings saved successfully!');
            setEditMode(false);
            fetchPaymentConfig();
        } catch (err: any) {
            console.error('Error saving payment config:', err);
            toast.error('Failed to save payment settings');
        }
    };

    const handleCancel = () => {
        setFormData({
            publishableKey: config.publishableKey,
            secretKey: config.secretKey
        });
        setEditMode(false);
        setShowSecretKey(false);
    };

    const maskSecretKey = (key: string) => {
        if (!key) return '';
        return key.slice(0, 7) + '••••••••••••••••' + key.slice(-4);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <CreditCard className="text-blue-600" size={28} />
                            Payment Settings
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Configure Stripe payment integration for your store</p>
                    </div>

                    {!editMode && config.publishableKey && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            <Edit2 size={16} />
                            Edit Keys
                        </button>
                    )}
                </div>

                {/* Status Card */}
                <div className={`p-4 rounded-xl border-2 ${config.paymentEnabled ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className="flex items-center gap-3">
                        {config.paymentEnabled ? (
                            <CheckCircle className="text-green-600" size={24} />
                        ) : (
                            <AlertCircle className="text-yellow-600" size={24} />
                        )}
                        <div>
                            <div className="font-bold text-gray-900">
                                {config.paymentEnabled ? 'Payments Enabled' : 'Payments Not Configured'}
                            </div>
                            <div className="text-sm text-gray-600">
                                {config.paymentEnabled
                                    ? 'Customers can checkout using Stripe'
                                    : 'Configure your Stripe keys to enable payments'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Keys Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Stripe API Keys</h2>

                    <div className="space-y-4">
                        {/* Publishable Key */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">
                                Publishable Key
                                <span className="text-xs text-gray-500 ml-2">(Safe to expose in frontend)</span>
                            </label>
                            {editMode ? (
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="pk_live_..."
                                    value={formData.publishableKey}
                                    onChange={(e) => setFormData({ ...formData, publishableKey: e.target.value })}
                                />
                            ) : (
                                <div className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 font-mono text-sm text-gray-700">
                                    {config.publishableKey || 'Not configured'}
                                </div>
                            )}
                        </div>

                        {/* Secret Key */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">
                                Secret Key
                                <span className="text-xs text-red-500 ml-2">(Keep confidential)</span>
                            </label>
                            <div className="relative">
                                {editMode ? (
                                    <input
                                        type={showSecretKey ? 'text' : 'password'}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="sk_live_..."
                                        value={formData.secretKey}
                                        onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                                    />
                                ) : (
                                    <div className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 bg-gray-50 font-mono text-sm text-gray-700">
                                        {config.secretKey ? (showSecretKey ? config.secretKey : maskSecretKey(config.secretKey)) : 'Not configured'}
                                    </div>
                                )}
                                <button
                                    onClick={() => setShowSecretKey(!showSecretKey)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showSecretKey ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {editMode && (
                        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Save Configuration
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <div className="text-sm font-bold text-blue-900 mb-2">📘 How to get Stripe Keys</div>
                        <div className="text-xs text-blue-700 space-y-1">
                            <p>1. Log in to your Stripe Dashboard</p>
                            <p>2. Go to Developers → API Keys</p>
                            <p>3. Copy Publishable and Secret keys</p>
                            <p>4. Paste them here and save</p>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                        <div className="text-sm font-bold text-green-900 mb-2 flex items-center gap-1">
                            <DollarSign size={16} /> Payment Flow
                        </div>
                        <div className="text-xs text-green-700 space-y-1">
                            <p>✓ Customers checkout on your store</p>
                            <p>✓ Payments processed via Stripe</p>
                            <p>✓ Funds go directly to your account</p>
                            <p>✓ View statements in Stripe Dashboard</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
