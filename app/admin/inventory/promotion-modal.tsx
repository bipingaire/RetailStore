'use client';
import { useEffect, useState } from 'react';
import { Tag, X, Percent, DollarSign, Share2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';



type Campaign = { id: string; title: string; slug?: string };

export default function PromotionModal({ product, batch, onClose }: any) {
  // Supabase removed - refactor needed
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'percentage' | 'fixed_price'>('percentage');
  const [value, setValue] = useState(30); // Default 30% off
  const [days, setDays] = useState(3); // Default 3 day sale
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignId, setCampaignId] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    supabase
      .from('product_segments')
      .select('id, title, slug')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => setCampaigns((data as any[]) || []));
  }, []);

  const handleSave = async () => {
    setLoading(true);

    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const { data: promoData, error } = await supabase
      .from('promotions')
      .insert({
        tenant_id: 'PASTE_YOUR_COPIED_UUID_HERE', // <--- REMEMBER TO USE YOUR REAL ID
        store_inventory_id: product.id,
        batch_id: batch?.id || null, // If null, applies to all batches of this product
        title: batch ? `Clearance: Expires Soon!` : `Special Offer`,
        discount_type: type,
        discount_value: value,
        end_date: endDate.toISOString()
      })
      .select()
      .single();

    setLoading(false);
    if (error) {
      toast.error("Error creating promotion");
      console.error(error);
    } else {
      // Optionally attach to campaign
      if (campaignId) {
        await supabase
          .from('segment_products')
          .upsert({
            segment_id: campaignId,
            store_inventory_id: product.id,
            highlight_label: batch ? 'Clearance' : 'Promo',
          });
      }
      setStatus('✅ Promotion Live on Website' + (campaignId ? ' & Campaign' : ''));
      onClose();
    }
  };

  const handleGenerateImage = () => {
    setStatus('Queued image generation (stub). Connect Canva/LLM to render creatives.');
  };

  const handlePostSocial = () => {
    setStatus('Posting to social (stub). Wire to your social API.');
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-white/80 hover:text-white">
            <X size={20} />
          </button>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Tag className="fill-white/20" />
            Create Flash Deal
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {product.name} {batch && `(Batch Exp: ${batch.days_left} days left)`}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Campaign attach */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Add to existing campaign (optional)</label>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
            >
              <option value="">Do not attach</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Type */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setType('percentage')}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition ${type === 'percentage' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
            >
              % Discount
            </button>
            <button
              onClick={() => setType('fixed_price')}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition ${type === 'fixed_price' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
            >
              $ Fixed Price
            </button>
          </div>

          {/* Value Input */}
          <div className="text-center">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {type === 'percentage' ? 'Percentage Off' : 'New Price'}
            </label>
            <div className="relative inline-block">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="text-4xl font-black text-gray-800 w-32 text-center border-b-2 border-blue-500 focus:outline-none focus:border-purple-500 bg-transparent"
              />
              <span className="absolute right-0 top-2 text-gray-400">
                {type === 'percentage' ? <Percent size={20} /> : <DollarSign size={20} />}
              </span>
            </div>
            {/* Live Preview */}
            <p className="text-sm text-green-600 mt-2 font-medium">
              Customer sees: {type === 'percentage' ? `${value}% OFF` : `$${value} Deal`}
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Duration</label>
            <div className="flex gap-2">
              {[1, 3, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`flex-1 py-2 border rounded hover:bg-gray-50 ${days === d ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200'}`}
                >
                  {d} Day{d > 1 && 's'}
                </button>
              ))}
            </div>
          </div>

          {/* POS Reminder */}
          <div className="bg-yellow-50 border border-yellow-100 rounded p-3 text-xs text-yellow-800">
            <strong>Note:</strong> Remember to update the POS price or keep a coupon code at the register.
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleGenerateImage}
              type="button"
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 hover:border-purple-200 hover:text-purple-700"
            >
              <ImageIcon size={14} /> Generate post image
            </button>
            <button
              onClick={handlePostSocial}
              type="button"
              className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              <Share2 size={14} /> Post to social
            </button>
            {status && <span className="text-[11px] text-green-700">{status}</span>}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition transform hover:scale-[1.02]"
          >
            {loading ? 'Publishing...' : '🚀 Push Live to Website'}
          </button>
        </div>

      </div>
    </div>
  );
}
