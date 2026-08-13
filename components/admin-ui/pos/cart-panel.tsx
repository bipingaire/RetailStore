'use client';
import { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, User, Percent, DollarSign, ArrowRight, X } from 'lucide-react';

export interface CartLineItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CustomerData {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  loyaltyPoints?: number;
}

interface CartPanelProps {
  items: CartLineItem[];
  customer: CustomerData | null;
  discountPct: number;
  taxPct: number;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onAddCustomItem: (name: string, price: number) => void;
  onSetDiscountPct: (pct: number) => void;
  onSetTaxPct: (pct: number) => void;
  onOpenCustomerModal: () => void;
  onOpenPaymentModal: () => void;
}

export default function CartPanel({
  items,
  customer,
  discountPct,
  taxPct,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onAddCustomItem,
  onSetDiscountPct,
  onSetTaxPct,
  onOpenCustomerModal,
  onOpenPaymentModal,
}: CartPanelProps) {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
  const discountAmount = (subtotal * discountPct) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxPct) / 100;
  const total = Math.max(0, taxableAmount + taxAmount);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(customPrice);
    if (!customName.trim() || isNaN(priceNum) || priceNum <= 0) return;
    onAddCustomItem(customName.trim(), priceNum);
    setCustomName('');
    setCustomPrice('');
    setShowCustomModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Customer Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
            {customer ? customer.name[0]?.toUpperCase() : <User size={18} />}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Customer</div>
            <div className="text-sm font-bold text-slate-800">
              {customer ? customer.name : 'Walk-in Guest'}
            </div>
          </div>
        </div>
        <button
          onClick={onOpenCustomerModal}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
        >
          {customer ? 'Change' : 'Add Customer'}
        </button>
      </div>

      {/* Cart Actions Bar */}
      <div className="px-4 py-2 bg-slate-100/60 border-b border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-600">
          <ShoppingCart size={14} className="text-indigo-600" />
          Cart Items ({items.reduce((a, b) => a + b.quantity, 0)})
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCustomModal(true)}
            className="text-indigo-600 font-semibold hover:underline"
          >
            + Custom Item
          </button>
          {items.length > 0 && (
            <button
              onClick={onClearCart}
              className="text-red-500 font-semibold hover:underline flex items-center gap-1"
            >
              <Trash2 size={12} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-slate-400">
            <ShoppingCart size={40} className="text-slate-200" />
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="text-xs text-slate-400 text-center max-w-xs">
              Click products from the catalog or scan barcodes to add items
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.productId}
              className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-3 hover:border-slate-300 transition-all"
            >
              <div className="flex-1 min-w-0 pr-3">
                <h5 className="text-xs font-bold text-slate-800 truncate">{item.name}</h5>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-1.5 py-1">
                <button
                  onClick={() => onUpdateQty(item.productId, -1)}
                  className="w-6 h-6 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <Minus size={12} />
                </button>
                <span className="w-6 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQty(item.productId, 1)}
                  className="w-6 h-6 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Subtotal & Delete */}
              <div className="flex items-center gap-2.5 pl-3">
                <span className="text-xs font-black text-slate-900 min-w-[50px] text-right">
                  ${item.subtotal.toFixed(2)}
                </span>
                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Calculations & Checkout Button */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
        {/* Discount & Tax Selectors */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-500 font-medium">Discount %</span>
            <input
              type="number"
              min="0"
              max="100"
              value={discountPct || ''}
              onChange={(e) => onSetDiscountPct(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
              placeholder="0"
              className="w-12 text-right font-bold text-slate-900 outline-none bg-transparent"
            />
          </div>
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-slate-500 font-medium">Tax %</span>
            <input
              type="number"
              min="0"
              max="100"
              value={taxPct || ''}
              onChange={(e) => onSetTaxPct(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
              placeholder="0"
              className="w-12 text-right font-bold text-slate-900 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Calculation Rows */}
        <div className="space-y-1.5 text-xs text-slate-500">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
          </div>
          {discountPct > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Discount ({discountPct}%)</span>
              <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          {taxPct > 0 && (
            <div className="flex justify-between">
              <span>Tax ({taxPct}%)</span>
              <span className="font-semibold text-slate-800">+${taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
            <span>TOTAL</span>
            <span className="text-lg text-indigo-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={onOpenPaymentModal}
          disabled={items.length === 0}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-2xl font-bold text-base shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <span>Pay ${total.toFixed(2)}</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Custom Line Item Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Custom Item</h3>
            <form onSubmit={handleAddCustom} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Open Key Ring"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                >
                  Add to Cart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
