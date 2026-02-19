'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { createClient } from '@supabase/supabase-js'; // Removed
import { ArrowLeft, Save, Image as ImageIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

/*
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
*/

export default function EnrichProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.productId as string;

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [enriching, setEnriching] = useState(false);

    const [formData, setFormData] = useState({
        'product-name': '',
        'brand-name': '',
        'manufacturer-name': '',
        'category-name': '',
        'subcategory-name': '',
        'description-text': '',
        'image-url': '',
        'package-size': '',
        'package-unit': ''
    });

    useEffect(() => {
        if (productId) {
            loadProduct();
        }
    }, [productId]);

    async function loadProduct() {
        try {
            const data = await apiClient.get(`/super-admin/products/${productId}`);
            if (data) {
                setProduct(data);
                setFormData({
                    'product-name': data.productName || '',
                    'brand-name': '', // Backend model might need update to store brand/manufacturer separately if raw JSON not used
                    'manufacturer-name': '',
                    'category-name': data.category || '',
                    'subcategory-name': '',
                    'description-text': data.description || '',
                    'image-url': data.imageUrl || '',
                    'package-size': '',
                    'package-unit': ''
                });
            } else {
                toast.error('Product not found');
                router.push('/super-admin/products');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to load product');
        }
        setLoading(false);
    }

    async function handleAIEnrich() {
        setEnriching(true);
        try {
            const suggestions: any = await apiClient.post(`/super-admin/products/${productId}/ai-suggest`, {});

            if (suggestions.suggestedDescription) {
                setFormData(prev => ({ ...prev, 'description-text': suggestions.suggestedDescription }));
            }
            if (suggestions.suggestedCategory) {
                setFormData(prev => ({ ...prev, 'category-name': suggestions.suggestedCategory }));
            }
            if (suggestions.suggestedBrand) {
                setFormData(prev => ({ ...prev, 'brand-name': suggestions.suggestedBrand }));
            }

            toast.success('AI suggestions applied!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate AI suggestions');
        }
        setEnriching(false);
    }

    async function handleSave() {
        setSaving(true);
        try {
            // Mapping back to Backend Expected DTO (if simple update) or just sending what backend expects
            // Controller expects body.
            // Service updateProduct uses: productName, category, description, imageUrl.
            // We need to map form data to these fields.
            const payload = {
                name: formData['product-name'],
                category: formData['category-name'],
                description: formData['description-text'],
                image_url: formData['image-url']
            };

            await apiClient.post(`/super-admin/products/${productId}`, payload);

            toast.success('Product enriched successfully!');
            router.push('/super-admin/products');
        } catch (error: any) {
            toast.error(error.message || 'Failed to save product');
        }

        setSaving(false);
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading product...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Enrich Product</h1>
                    <p className="text-gray-600 mt-1">Add or update product information for all stores</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                {/* AI Enrich Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleAIEnrich}
                        disabled={enriching}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    >
                        <Sparkles className="w-4 h-4" />
                        {enriching ? 'Enriching...' : 'AI Enrich'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                        <input
                            type="text"
                            value={formData['product-name']}
                            onChange={e => setFormData({ ...formData, 'product-name': e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                        <input
                            type="text"
                            value={formData['brand-name']}
                            onChange={e => setFormData({ ...formData, 'brand-name': e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                        <input
                            type="text"
                            value={formData['manufacturer-name']}
                            onChange={e => setFormData({ ...formData, 'manufacturer-name': e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <input
                            type="text"
                            value={formData['category-name']}
                            onChange={e => setFormData({ ...formData, 'category-name': e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                        <input
                            type="text"
                            value={formData['subcategory-name']}
                            onChange={e => setFormData({ ...formData, 'subcategory-name': e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Package Size</label>
                        <input
                            type="text"
                            value={formData['package-size']}
                            onChange={e => setFormData({ ...formData, 'package-size': e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Package Unit</label>
                        <input
                            type="text"
                            value={formData['package-unit']}
                            onChange={e => setFormData({ ...formData, 'package-unit': e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="g, ml, oz, etc."
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData['description-text']}
                            onChange={e => setFormData({ ...formData, 'description-text': e.target.value })}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={formData['image-url']}
                                onChange={e => setFormData({ ...formData, 'image-url': e.target.value })}
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://..."
                            />
                            {formData['image-url'] && (
                                <img
                                    src={formData['image-url']}
                                    alt="Preview"
                                    className="w-12 h-12 object-cover rounded border border-gray-300"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleSave}
                        disabled={saving || !formData['product-name']}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
