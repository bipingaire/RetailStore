'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { X, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
    item: any;
    onClose: () => void;
    onSuccess: () => void;
};

export default function EditInventoryModal({ item, onClose, onSuccess }: Props) {
    const supabase = createClientComponentClient();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: item.name,
        price: item.sales_price,
        stock: item.total_qty
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            // Update retail-store-inventory-item using the inventory_id
            const { error } = await supabase
                .from('retail-store-inventory-item')
                .update({
                    'custom-product-name': formData.name, // Allow renaming locally
                    'selling-price-amount': parseFloat(formData.price),
                    'current-stock-quantity': parseInt(formData.stock)
                })
                .eq('inventory-id', item.inventory_id);

            if (error) throw error;

            toast.success("Item updated successfully");
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to update: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Edit Product Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-600">Product Name (Display Alias)</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                        <p className="text-[10px] text-gray-400">Updates the name for your store only.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-600">Unit Price ($)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-600">Stock Quantity</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                            />
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
}
