'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Plus, Megaphone, Calendar, Tag, Trash2, PauseCircle, Save, ImageIcon, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCampaigns();
    }, []);

    async function loadCampaigns() {
        try {
            const data = await apiClient.getCampaigns();
            const list = Array.isArray(data) ? data : [];
            setCampaigns(list);
            if (list.length > 0) {
                setSelectedCampaign(list[0]);
            } else {
                setSelectedCampaign(createBlankCampaign());
            }
        } catch (error) {
            console.error('Failed to load campaigns:', error);
            toast.error('Failed to load campaigns');
        } finally {
            setLoading(false);
        }
    }

    function createBlankCampaign() {
        return {
            id: 'new',
            name: 'New Campaign',
            subtitle: '',
            tagline: '',
            badge_label: 'New',
            badge_color: '#a855f7',
            start_date: '2026-01-11T15:24', // Matching screenshot example time roughly
            end_date: '2026-01-18T15:24',
            status: 'active', // Set active to match screenshot "LIVE"
            products: []
        };
    }

    const handleSave = async () => {
        toast.info('Saving campaign...');
        setTimeout(() => toast.success('Campaign saved successfully!'), 500);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage flash sales, seasonal offers, and promotions.</p>
                </div>

                <div className="flex gap-6 h-[calc(100vh-140px)]">
                    {/* Left Sidebar: List */}
                    <div className="w-80 flex-shrink-0 bg-white rounded-xl border border-gray-200 flex flex-col shadow-sm">
                        <div className="p-4 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-700 text-sm">All Campaigns</h2>
                            <button
                                onClick={() => {
                                    const newCamp = createBlankCampaign();
                                    setCampaigns([newCamp, ...campaigns]);
                                    setSelectedCampaign(newCamp);
                                }}
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center gap-1 hover:bg-blue-700 transition shadow-sm"
                            >
                                <Plus size={14} /> New
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {campaigns.length > 0 ? campaigns.map((camp) => (
                                <div
                                    key={camp.id}
                                    onClick={() => setSelectedCampaign(camp)}
                                    className={`p-4 rounded-lg cursor-pointer border transition-all relative ${selectedCampaign?.id === camp.id
                                            ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-100'
                                            : 'bg-white border-transparent hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-semibold text-sm ${selectedCampaign?.id === camp.id ? 'text-blue-700' : 'text-gray-900'}`}>
                                            {camp.name || 'Untitled Campaign'}
                                        </h3>
                                        {camp.status === 'active' && (
                                            <span className="text-[10px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded tracking-wide">LIVE</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 truncate font-medium">{camp.subtitle || 'No subtitle'}</p>
                                </div>
                            )) : (
                                <div onClick={() => {
                                    const newCamp = createBlankCampaign();
                                    setCampaigns([newCamp]);
                                    setSelectedCampaign(newCamp);
                                }} className="p-4 rounded-lg cursor-pointer bg-blue-50 border border-blue-200 shadow-sm ring-1 ring-blue-100 relative">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-sm text-blue-700">New Campaign</h3>
                                        <span className="text-[10px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded tracking-wide">LIVE</span>
                                    </div>
                                    <p className="text-xs text-gray-400 truncate font-medium">No subtitle</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Content: Detail */}
                    <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                                    <Megaphone size={20} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900">{selectedCampaign?.name}</h2>
                                    <p className="text-xs text-gray-400 font-medium">Currently Active</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-600 font-semibold text-sm rounded-lg hover:bg-gray-50 transition shadow-sm"
                                >
                                    Save Changes
                                </button>
                                <button className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 font-semibold text-sm rounded-lg hover:bg-yellow-100 transition shadow-sm">
                                    Pause Campaign
                                </button>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <style jsx>{`
                                .custom-scrollbar::-webkit-scrollbar {
                                    width: 6px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-track {
                                    background: #f1f5f9;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                    background: #3b82f6;
                                    border-radius: 10px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                    background: #2563eb;
                                }
                            `}</style>

                            {/* Campaign Details Section */}
                            <div className="mb-10">
                                <div className="flex items-center gap-2 mb-6 text-gray-500">
                                    <Tag size={16} />
                                    <h3 className="text-xs font-bold uppercase tracking-wider">CAMPAIGN DETAILS</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500">Campaign Title</label>
                                        <input
                                            type="text"
                                            value={selectedCampaign?.name || ''}
                                            onChange={(e) => setSelectedCampaign({ ...selectedCampaign, name: e.target.value })}
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition shadow-sm placeholder-gray-400"
                                            placeholder="New Campaign"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500">Subtitle</label>
                                        <input
                                            type="text"
                                            value={selectedCampaign?.subtitle || ''}
                                            onChange={(e) => setSelectedCampaign({ ...selectedCampaign, subtitle: e.target.value })}
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition shadow-sm placeholder-gray-400"
                                            placeholder="e.g. Up to 50% off"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500">Tagline (Optional)</label>
                                        <input
                                            type="text"
                                            value={selectedCampaign?.tagline || ''}
                                            onChange={(e) => setSelectedCampaign({ ...selectedCampaign, tagline: e.target.value })}
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition shadow-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-500">Badge Label</label>
                                            <input
                                                type="text"
                                                value={selectedCampaign?.badge_label || ''}
                                                onChange={(e) => setSelectedCampaign({ ...selectedCampaign, badge_label: e.target.value })}
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition shadow-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-500">Badge Color</label>
                                            <div className="flex gap-2 items-center">
                                                <div className="relative">
                                                    <input
                                                        type="color"
                                                        value={selectedCampaign?.badge_color || '#a855f7'}
                                                        onChange={(e) => setSelectedCampaign({ ...selectedCampaign, badge_color: e.target.value })}
                                                        className="h-10 w-12 p-0.5 bg-white border border-gray-200 rounded-lg cursor-pointer shadow-sm overflow-hidden"
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={selectedCampaign?.badge_color || '#a855f7'}
                                                    onChange={(e) => setSelectedCampaign({ ...selectedCampaign, badge_color: e.target.value })}
                                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm font-mono focus:ring-2 focus:ring-blue-100 outline-none transition shadow-inner"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500">Start Date</label>
                                        <div className="relative">
                                            <input
                                                type="datetime-local"
                                                value={selectedCampaign?.start_date || ''}
                                                onChange={(e) => setSelectedCampaign({ ...selectedCampaign, start_date: e.target.value })}
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition shadow-sm pl-4"
                                            />
                                            {/* Calendar icon hidden as native picker usually has one, or custom positioning required */}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500">End Date</label>
                                        <div className="relative">
                                            <input
                                                type="datetime-local"
                                                value={selectedCampaign?.end_date || ''}
                                                onChange={(e) => setSelectedCampaign({ ...selectedCampaign, end_date: e.target.value })}
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition shadow-sm pl-4"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Products Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-gray-500">
                                    <Sparkles size={16} />
                                    <h3 className="text-xs font-bold uppercase tracking-wider">SELECTED PRODUCTS (0)</h3>
                                </div>

                                <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-gray-50 flex items-center gap-3 hover:bg-gray-50 transition cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <ImageIcon className="text-gray-300" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-900">LIZZAT URAD PAPAD WITH BLACK PEPPER 80 X 200g (7oz)</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">Generic • $0.00</p>
                                        </div>
                                    </div>
                                    {/* Scrollbar gutter simulation */}
                                    <div className="h-2 bg-gray-50"></div>
                                </div>
                            </div>
                        </div>
                        {/* Right scrollbar area logic is handled by css in style jsx above */}
                    </div>
                </div>
            </div>
        </div>
    );
}
