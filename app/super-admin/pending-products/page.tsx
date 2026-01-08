'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Clock, Check, X, Link as LinkIcon, Plus, Package } from 'lucide-react';
import { toast } from 'sonner';
import { approvePendingProduct, rejectPendingProduct } from '@/lib/ai/auto-sync';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PendingProductsPage() {
    const [pendingProducts, setPendingProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        loadPendingProducts();
    }, []);

    async function loadPendingProducts() {
        const { data, error } = await supabase
            .from('pending-product-additions')
            .select(`
        *,
        retail-store-tenant (store-name),
        global-product-master-catalog (product-name, image-url)
      `)
            .eq('status', 'pending')
            .order('created-at', { ascending: false });

        if (error) {
            toast.error('Failed to load pending products');
            console.error(error);
        } else {
            setPendingProducts(data || []);
        }
        setLoading(false);
    }

    async function handleApprove(pendingId: string, action: 'add_new' | 'link_existing', existingProductId?: string) {
        setProcessing(pendingId);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const result = await approvePendingProduct(pendingId, user.id, action, existingProductId);

        if (result.success) {
            toast.success(result.message);
            await loadPendingProducts();
        } else {
            toast.error(result.message);
        }

        setProcessing(null);
    }

    async function handleReject(pendingId: string) {
        setProcessing(pendingId);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const result = await rejectPendingProduct(pendingId, user.id);

        if (result.success) {
            toast.success(result.message);
            await loadPendingProducts();
        } else {
            toast.error(result.message);
        }

        setProcessing(null);
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading pending products...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Pending Product Reviews</h1>
                <p className="text-gray-600 mt-1">
                    {pendingProducts.length} product{pendingProducts.length !== 1 ? 's' : ''} awaiting review
                </p>
            </div>

            {/* Pending Products List */}
            <div className="space-y-4">
                {pendingProducts.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No pending products to review</p>
                    </div>
                ) : (
                    pendingProducts.map(pending => (
                        <div
                            key={pending['pending-id']}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-6">
                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {pending['product-name']}
                                            </h3>
                                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                                Pending Review
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Store</p>
                                                <p className="font-medium text-gray-900">
                                                    {pending['retail-store-tenant']?.['store-name'] || 'Unknown'}
                                                </p>
                                            </div>
                                            {pending['upc-ean-code'] && (
                                                <div>
                                                    <p className="text-gray-500">UPC</p>
                                                    <p className="font-medium text-gray-900">{pending['upc-ean-code']}</p>
                                                </div>
                                            )}
                                            {pending['brand-name'] && (
                                                <div>
                                                    <p className="text-gray-500">Brand</p>
                                                    <p className="font-medium text-gray-900">{pending['brand-name']}</p>
                                                </div>
                                            )}
                                            {pending['category-name'] && (
                                                <div>
                                                    <p className="text-gray-500">Category</p>
                                                    <p className="font-medium text-gray-900">{pending['category-name']}</p>
                                                </div>
                                            )}
                                        </div>

                                        {pending['description-text'] && (
                                            <p className="mt-3 text-sm text-gray-600">{pending['description-text']}</p>
                                        )}

                                        {/* AI Analysis */}
                                        {pending['ai-confidence-score'] !== null && (
                                            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                                    <p className="text-sm font-medium text-purple-900">AI Analysis</p>
                                                </div>
                                                <p className="text-sm text-purple-700">
                                                    Confidence Score: {(pending['ai-confidence-score'] * 100).toFixed(0)}%
                                                </p>
                                                {pending['ai-analysis-json']?.reasoning && (
                                                    <p className="text-sm text-purple-600 mt-1">
                                                        {pending['ai-analysis-json'].reasoning}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Suggested Match */}
                                        {pending['suggested-match-product-id'] && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <LinkIcon className="w-4 h-4 text-blue-600" />
                                                    <p className="text-sm font-medium text-blue-900">Suggested Match</p>
                                                </div>
                                                <p className="text-sm text-blue-700">
                                                    {pending['global-product-master-catalog']?.['product-name'] || 'Product'}
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    AI suggests linking to this existing product
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Image */}
                                    {pending['image-url'] && (
                                        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={pending['image-url']}
                                                alt={pending['product-name']}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => handleApprove(pending['pending-id'], 'add_new')}
                                        disabled={processing === pending['pending-id']}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add as New Product
                                    </button>

                                    {pending['suggested-match-product-id'] && (
                                        <button
                                            onClick={() => handleApprove(
                                                pending['pending-id'],
                                                'link_existing',
                                                pending['suggested-match-product-id']
                                            )}
                                            disabled={processing === pending['pending-id']}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                            Link to Existing
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleReject(pending['pending-id'])}
                                        disabled={processing === pending['pending-id']}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                        Reject
                                    </button>

                                    <span className="text-xs text-gray-400 ml-auto">
                                        Added {new Date(pending['created-at']).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
