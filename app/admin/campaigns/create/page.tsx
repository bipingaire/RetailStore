'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Send } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

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

    useEffect(() => {
        loadProducts();
        const preselected = searchParams?.get('inventory_id');
        if (preselected) setSelectedProducts([preselected]);
    }, []);

    async function loadProducts() {
        try {
            const data = await apiClient.get('/products');
            setProducts(data || []);
        } catch (error) {
            console.error('Failed to load products', error);
            toast.error('Failed to load products');
        }
    }

    async function generateCampaignPost() {
        setGenerating(true);
        try {
            const selectedItems = products.filter(p => selectedProducts.includes(p.id));

            const response = await apiClient.post('/campaigns/generate', { products: selectedItems });
            setGeneratedPost(response.post || '');
        } catch (error) {
            toast.error('Failed to generate post');
        } finally {
            setGenerating(false);
        }
    }

    async function publishCampaign() {
        if (!campaignName) {
            toast.error('Please enter a campaign name');
            return;
        }

        try {
            toast.loading('Publishing campaign...');

            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + promotionDays);

            await apiClient.post('/campaigns', {
                name: campaignName,
                type: 'SOCIAL',
                status: 'ACTIVE',
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                budget: 0, // Placeholder
                products: selectedProducts, // Send linked products if backend supports it (not yet, but good to have)
                platforms: selectedPlatforms,
                pushToWebsite,
                discountPercentage,
                content: generatedPost
            });

            toast.dismiss();
            toast.success('Campaign created successfully!');
            router.push('/admin/reports'); // Redirect to a valid page
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
                            key={product.id}
                            className={`border-2 rounded-lg p-3 cursor-pointer transition ${selectedProducts.includes(product.id)
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedProducts.includes(product.id)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedProducts([...selectedProducts, product.id]);
                                    } else {
                                        setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                    }
                                }}
                                className="mr-3"
                            />
                            <span className="font-semibold">{product.name}</span>
                            <div className="text-sm text-gray-600 mt-1">
                                Stock: {product.stock} | ${product.price}
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CreateCampaignContent />
        </Suspense>
    );
}

