'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Upload, Send } from 'lucide-react';

export default function CreateCampaignPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClientComponentClient();

    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [generatedPost, setGeneratedPost] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        loadProducts();
        const preselected = searchParams?.get('inventory_id');
        if (preselected) setSelectedProducts([preselected]);
    }, []);

    async function loadProducts() {
        const { data } = await supabase
            .from('store_inventory')
            .select(`
        inventory_id,
        current_stock_quantity,
        selling_price_amount,
        global_products (product_name, image_url)
      `)
            .eq('is_active', true)
            .limit(50);

        setProducts(data || []);
    }

    async function generateCampaignPost() {
        setGenerating(true);

        const selectedItems = products.filter(p => selectedProducts.includes(p.inventory_id));
        const productNames = selectedItems.map(p => p.global_products?.product_name).join(', ');

        // Call OpenAI to generate social media post
        const response = await fetch('/api/generate-campaign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: selectedItems })
        });

        const data = await response.json();
        setGeneratedPost(data.post || '');
        setGenerating(false);
    }

    async function publishCampaign() {
        // TODO: Integrate with Facebook/Instagram API
        alert('Campaign created! (Social media integration coming soon)');
        router.push('/admin/reports/inventory-health');
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Marketing Campaign</h1>
                <p className="text-gray-500 mt-1">Select products and generate AI-powered social media posts</p>
            </div>

            {/* Product Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-lg mb-4">Select Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {products.map((product) => (
                        <label
                            key={product.inventory_id}
                            className={`border-2 rounded-lg p-3 cursor-pointer transition ${selectedProducts.includes(product.inventory_id)
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.inventory_id)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedProducts([...selectedProducts, product.inventory_id]);
                                    } else {
                                        setSelectedProducts(selectedProducts.filter(id => id !== product.inventory_id));
                                    }
                                }}
                                className="mr-3"
                            />
                            <span className="font-semibold">{product.global_products?.product_name || 'Unknown'}</span>
                            <div className="text-sm text-gray-600 mt-1">
                                Stock: {product.current_stock_quantity} | ${product.selling_price_amount}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Generate Post */}
            {selectedProducts.length > 0 && (
                <button
                    onClick={generateCampaignPost}
                    disabled={generating}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <Sparkles size={24} />
                    {generating ? 'Generating AI Post...' : `Generate Campaign Post (${selectedProducts.length} products)`}
                </button>
            )}

            {/* Generated Post Preview */}
            {generatedPost && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <h3 className="font-bold text-lg">Generated Post</h3>
                    <textarea
                        value={generatedPost}
                        onChange={(e) => setGeneratedPost(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-4 min-h-32 focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex gap-3">
                        <button
                            onClick={publishCampaign}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            Publish to Social Media
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
