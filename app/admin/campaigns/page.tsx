'use client';
import { useState, useEffect } from 'react';
import { Plus, Calendar, Target, Zap, Share2, CheckCircle } from 'lucide-react';

interface Campaign {
    id: string;
    name: string;
    description?: string;
    type: string;
    status: string;
    discount: number;
    startDate: string;
    endDate: string;
    productIds: string[];
    pushedToWebsite: boolean;
    pushedToSocial: boolean;
    socialPlatforms: string[];
    generatedContent?: string;
    products?: Array<{
        id: string;
        name: string;
        price: number;
        stock: number;
        imageUrl?: string;
    }>;
}

interface CampaignSuggestion {
    type: string;
    name: string;
    description: string;
    suggestedDiscount: number;
    productIds: string[];
    products: any[];
}

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [suggestions, setSuggestions] = useState<CampaignSuggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState<CampaignSuggestion | null>(null);

    useEffect(() => {
        loadCampaigns();
        loadSuggestions();
    }, []);

    async function loadCampaigns() {
        try {
            const response = await fetch('http://localhost:3001/api/campaigns', {
                headers: { 'x-tenant-id': 'retail_store_anuj' },
            });
            if (response.ok) {
                const data = await response.json();
                setCampaigns(data);
            }
        } catch (error) {
            console.error('Failed to load campaigns:', error);
        } finally {
            setLoading(false);
        }
    }

    async function loadSuggestions() {
        try {
            const response = await fetch('http://localhost:3001/api/campaigns/suggestions', {
                headers: { 'x-tenant-id': 'retail_store_anuj' },
            });
            if (response.ok) {
                const data = await response.json();
                setSuggestions(data);
            }
        } catch (error) {
            console.error('Failed to load suggestions:', error);
        }
    }

    async function createCampaignFromSuggestion(suggestion: CampaignSuggestion) {
        const campaignData = {
            name: suggestion.name,
            description: suggestion.description,
            type: suggestion.type,
            discount: suggestion.suggestedDiscount,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            productIds: suggestion.productIds,
            socialPlatforms: ['facebook', 'instagram'],
        };

        try {
            const response = await fetch('http://localhost:3001/api/campaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-tenant-id': 'retail_store_anuj',
                },
                body: JSON.stringify(campaignData),
            });

            if (response.ok) {
                alert('Campaign created successfully!');
                loadCampaigns();
                setSuggestions(prev => prev.filter(s => s !== suggestion));
            }
        } catch (error) {
            alert('Failed to create campaign');
        }
    }

    async function pushToWebsite(campaignId: string) {
        try {
            const response = await fetch(`http://localhost:3001/api/campaigns/${campaignId}/push-website`, {
                method: 'POST',
                headers: { 'x-tenant-id': 'retail_store_anuj' },
            });

            if (response.ok) {
                alert('Campaign pushed to website! Discounts applied to products.');
                loadCampaigns();
            }
        } catch (error) {
            alert('Failed to push to website');
        }
    }

    async function pushToSocial(campaignId: string) {
        try {
            const response = await fetch(`http://localhost:3001/api/campaigns/${campaignId}/push-social`, {
                method: 'POST',
                headers: { 'x-tenant-id': 'retail_store_anuj' },
            });

            if (response.ok) {
                const data = await response.json();
                alert('Social media content generated!\n\n' + data.generatedContent);
                loadCampaigns();
            }
        } catch (error) {
            alert('Failed to generate social content');
        }
    }

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            FLASH_SALE: 'bg-yellow-100 text-yellow-700',
            EXPIRY_CLEARANCE: 'bg-red-100 text-red-700',
            OVERSTOCK: 'bg-blue-100 text-blue-700',
            FESTIVE: 'bg-purple-100 text-purple-700',
        };
        return colors[type] || 'bg-gray-100 text-gray-700';
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            DRAFT: 'bg-gray-100 text-gray-700',
            ACTIVE: 'bg-green-100 text-green-700',
            COMPLETED: 'bg-blue-100 text-blue-700',
            CANCELLED: 'bg-red-100 text-red-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading campaigns...</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Sale Campaigns</h1>
                    <p className="text-gray-500 mt-2">Create and manage marketing campaigns to boost sales</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New Campaign
                </button>
            </div>

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <h2 className="text-xl font-semibold text-gray-900">AI-Powered Suggestions</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{suggestion.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                        AI Suggested
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-2xl font-bold text-orange-600">{suggestion.suggestedDiscount}% OFF</div>
                                        <div className="text-xs text-gray-500 mt-1">{suggestion.products.length} products</div>
                                    </div>
                                    <button
                                        onClick={() => createCampaignFromSuggestion(suggestion)}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition text-sm font-semibold"
                                    >
                                        Create Campaign
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Campaigns List */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">All Campaigns</h2>
                <div className="grid grid-cols-1 gap-6">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">{campaign.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                                            {campaign.status}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(campaign.type)}`}>
                                            {campaign.type.replace('_', ' ')}
                                        </span>
                                    </div>
                                    {campaign.description && <p className="text-sm text-gray-600">{campaign.description}</p>}
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-purple-600">{Number(campaign.discount)}% OFF</div>
                                    <div className="text-xs text-gray-500 mt-1">{campaign.productIds.length} products</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {!campaign.pushedToWebsite && (
                                    <button
                                        onClick={() => pushToWebsite(campaign.id)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold flex items-center gap-2"
                                    >
                                        <Target className="w-4 h-4" />
                                        Push to Website
                                    </button>
                                )}
                                {campaign.pushedToWebsite && (
                                    <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Live on Website
                                    </div>
                                )}

                                {!campaign.pushedToSocial && (
                                    <button
                                        onClick={() => pushToSocial(campaign.id)}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-semibold flex items-center gap-2"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Generate Social Post
                                    </button>
                                )}
                                {campaign.pushedToSocial && (
                                    <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Social Content Ready
                                    </div>
                                )}
                            </div>

                            {campaign.generatedContent && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="text-xs font-semibold text-gray-500 mb-2">Generated Social Media Post:</div>
                                    <div className="text-sm text-gray-700 whitespace-pre-line">{campaign.generatedContent}</div>
                                </div>
                            )}
                        </div>
                    ))}

                    {campaigns.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No campaigns yet. Create one to get started!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
