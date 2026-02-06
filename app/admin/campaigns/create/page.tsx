'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Upload, Send } from 'lucide-react';
import { toast } from 'sonner';

import { Suspense } from 'react';

function CreateCampaignContent() {
    const router = useRouter();
    const searchParams = useSearchParams();


    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [generatedPost, setGeneratedPost] = useState('');
    const [generating, setGenerating] = useState(false);

    // Campaign configuration
    const [campaignName, setCampaignName] = useState('');
    const [pushToWebsite, setPushToWebsite] = useState(true);
    const [selectedPlatforms, setSelectedPlatforms] = useState<('facebook' | 'instagram')[]>([]);
    const [discountPercentage, setDiscountPercentage] = useState(20);
    const [promotionDays, setPromotionDays] = useState(7);
    const [productImage, setProductImage] = useState('');

    useEffect(() => {
        loadProducts();
        const preselected = searchParams?.get('inventory_id');
        if (preselected) setSelectedProducts([preselected]);
    }, []);

    async function loadProducts() {
        const { data } = await supabase
            .from('retail-store-inventory-item')
            .select(`
            id:"inventory-id",
            price:"selling-price-amount",
            global_products:"global-product-master-catalog"!"global-product-id" (
              name:"product-name",
              category:"category-name",
              image_url:"image-url"
            )
          `)
            .eq('is-active-flag', true)
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


        // Get tenant ID
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error('Please log in to continue');
            return;
        }

        const { data: userRole } = await supabase
            .from('tenant-user-role')
            .select('tenant-id')
            .eq('user-id', user.id)
            .single();

        if (!userRole) {
            toast.error('No tenant found');
            return;
        }

        const tenantId = (userRole as any)['tenant-id'];

        try {
            toast.loading('Publishing campaign...');

            // 1. Create campaign in database
            const { data: campaign, error: campaignError } = await supabase
                .from('marketing-campaign-master')
                .insert({
                    'tenant-id': tenantId,
                    'campaign-name': campaignName || 'New Campaign',
                    'campaign-slug': campaignName?.toLowerCase().replace(/\s+/g, '-') || 'new-campaign',
                    'campaign-type': 'flash_sale',
                    'start-date-time': new Date().toISOString(),
                    'end-date-time': new Date(Date.now() + promotionDays * 24 * 60 * 60 * 1000).toISOString(),
                    'is-active-flag': true,
                    'is-promoted': pushToWebsite,
                    'promotion-ends-at': pushToWebsite ? new Date(Date.now() + promotionDays * 24 * 60 * 60 * 1000).toISOString() : null,
                    'discount-percentage': discountPercentage,
                    'featured-on-website': pushToWebsite,
                })
                .select()
                .single();

            if (campaignError) throw campaignError;

            // 2. Add products to campaign
            const campaignProducts = selectedProducts.map(productId => ({
                'campaign-id': campaign['campaign-id'],
                'inventory-id': productId,
                'highlight-label': 'Featured',
            }));

            const { error: productsError } = await supabase
                .from('campaign-product-segment-group')
                .insert(campaignProducts);

            if (productsError) throw productsError;

            // 3. Post to social media if selected
            const socialResults: { facebook: string | null; instagram: string | null } = { facebook: null, instagram: null };

            if (selectedPlatforms.includes('facebook')) {
                try {
                    const fbResponse = await fetch('/api/social/facebook', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: generatedPost,
                            imageUrl: productImage,
                            campaignId: campaign['campaign-id'],
                        }),
                    });
                    const fbData = await fbResponse.json();
                    socialResults.facebook = fbData.success ? '✓' : '✗';
                } catch (e) {
                    socialResults.facebook = '✗';
                }
            }

            if (selectedPlatforms.includes('instagram')) {
                try {
                    const igResponse = await fetch('/api/social/instagram', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            message: generatedPost,
                            imageUrl: productImage,
                            campaignId: campaign['campaign-id'],
                        }),
                    });
                    const igData = await igResponse.json();
                    socialResults.instagram = igData.success ? '✓' : '✗';
                } catch (e) {
                    socialResults.instagram = '✗';
                }
            }

            toast.dismiss();

            let message = 'Campaign created successfully!';
            if (pushToWebsite) message += ' Featured on website.';
            if (socialResults.facebook === '✓') message += ' Posted to Facebook.';
            if (socialResults.instagram === '✓') message += ' Posted to Instagram.';

            toast.success(message);
            router.push('/admin/reports/inventory-health');
        } catch (error: any) {
            toast.dismiss();
            toast.error('Failed to publish campaign: ' + error.message);
        }
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

            {/* Campaign Configuration */}
            {selectedProducts.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                    <h3 className="font-bold text-lg">Campaign Settings</h3>

                    {/* Campaign Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign Name</label>
                        <input
                            type="text"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            placeholder="e.g., Weekend Flash Sale"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Discount & Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Discount %</label>
                            <input
                                type="number"
                                value={discountPercentage}
                                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                                min="5"
                                max="90"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (Days)</label>
                            <select
                                value={promotionDays}
                                onChange={(e) => setPromotionDays(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="1">1 Day</option>
                                <option value="3">3 Days</option>
                                <option value="7">7 Days</option>
                                <option value="14">14 Days</option>
                                <option value="30">30 Days</option>
                            </select>
                        </div>
                    </div>

                    {/* Website Push Toggle */}
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div>
                            <h4 className="font-semibold text-gray-900">Push to Website</h4>
                            <p className="text-sm text-gray-600">Feature products in "Deals" section on storefront</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={pushToWebsite}
                                onChange={(e) => setPushToWebsite(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>

                    {/* Social Media Platform Selection */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Post to Social Media</h4>
                        <div className="space-y-2">
                            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedPlatforms.includes('facebook')}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedPlatforms([...selectedPlatforms, 'facebook']);
                                        } else {
                                            setSelectedPlatforms(selectedPlatforms.filter(p => p !== 'facebook'));
                                        }
                                    }}
                                    className="mr-3 w-5 h-5 text-blue-600"
                                />
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">f</div>
                                    <span className="font-medium">Facebook Page</span>
                                </div>
                            </label>
                            <label className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedPlatforms.includes('instagram')}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedPlatforms([...selectedPlatforms, 'instagram']);
                                        } else {
                                            setSelectedPlatforms(selectedPlatforms.filter(p => p !== 'instagram'));
                                        }
                                    }}
                                    className="mr-3 w-5 h-5 text-pink-600"
                                />
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">IG</div>
                                    <span className="font-medium">Instagram Business</span>
                                </div>
                            </label>
                        </div>
                        <p className="text-xs text-gray-500">Note: Connect accounts in Settings → Social Media first</p>
                    </div>
                </div>
            )}

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

export default function CreateCampaignPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        }>
            <CreateCampaignContent />
        </Suspense>
    );
}
