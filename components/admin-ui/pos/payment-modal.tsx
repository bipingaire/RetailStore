'use client';
import { useState } from 'react';
import { Banknote, CreditCard, X, CheckCircle2, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { CustomerData, CartLineItem } from './cart-panel';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  subtotalAmount: number;
  taxAmount: number;
  discountAmount: number;
  items: CartLineItem[];
  customer: CustomerData | null;
  onCompleteSale: (paymentMethod: 'CASH' | 'CARD' | 'STRIPE', amountTendered?: number) => Promise<void>;
}

export default function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  subtotalAmount,
  taxAmount,
  discountAmount,
  items,
  customer,
  onCompleteSale,
}: PaymentModalProps) {
  const [method, setMethod] = useState<'CASH' | 'CARD' | 'STRIPE'>('CASH');
  const [tenderedStr, setTenderedStr] = useState<string>(totalAmount.toFixed(2));
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const tenderedVal = parseFloat(tenderedStr) || 0;
  const changeDue = Math.max(0, tenderedVal - totalAmount);
  const isInsufficient = method === 'CASH' && tenderedVal < totalAmount;

  const quickDenominations = [
    totalAmount,
    Math.ceil(totalAmount / 5) * 5,
    Math.ceil(totalAmount / 10) * 10,
    Math.ceil(totalAmount / 20) * 20,
    50,
    100,
  ].filter((v, i, self) => v >= totalAmount && self.indexOf(v) === i);

  const handlePay = async () => {
    if (isInsufficient) return;
    setProcessing(true);
    try {
      await onCompleteSale(method, method === 'CASH' ? tenderedVal : totalAmount);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Process Checkout</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select payment method & complete transaction
            </p>
          </div>
          <button onClick={onClose} disabled={processing} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Total Amount Callout */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 text-center shadow-inner">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Amount Due</div>
            <div className="text-3xl font-black mt-1 text-emerald-400">${totalAmount.toFixed(2)}</div>
            {customer && (
              <div className="text-xs text-slate-300 mt-1">Customer: {customer.name}</div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('CASH')}
                className={`py-3 px-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                  method === 'CASH'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Banknote size={20} className={method === 'CASH' ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="text-xs">Cash</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('CARD')}
                className={`py-3 px-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                  method === 'CARD'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <CreditCard size={20} className={method === 'CARD' ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="text-xs">Card Terminal</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('STRIPE')}
                className={`py-3 px-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                  method === 'STRIPE'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <CreditCard size={20} className={method === 'STRIPE' ? 'text-indigo-600' : 'text-slate-400'} />
                <span className="text-xs">Stripe Online</span>
              </button>
            </div>
          </div>

          {/* Cash Change Due Calculator */}
          {method === 'CASH' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Cash Tendered ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={tenderedStr}
                  onChange={(e) => setTenderedStr(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xl font-bold text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {quickDenominations.map((denom) => (
                  <button
                    key={denom}
                    type="button"
                    onClick={() => setTenderedStr(denom.toFixed(2))}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl text-xs font-bold text-slate-800 shadow-sm"
                  >
                    ${denom.toFixed(2)}
                  </button>
                ))}
              </div>

              {/* Change Due Display */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-600">Change Due to Customer</span>
                <span
                  className={`text-lg font-black ${
                    isInsufficient ? 'text-red-500' : 'text-emerald-600'
                  }`}
                >
                  {isInsufficient
                    ? `Need $${(totalAmount - tenderedVal).toFixed(2)} more`
                    : `$${changeDue.toFixed(2)}`}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <button
            onClick={handlePay}
            disabled={processing || isInsufficient}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            {processing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing Sale...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                Complete Transaction
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
