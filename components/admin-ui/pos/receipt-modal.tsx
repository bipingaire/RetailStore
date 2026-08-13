'use client';
import { useRef } from 'react';
import { Printer, CheckCircle, X, ShoppingBag } from 'lucide-react';
import { CartLineItem, CustomerData } from './cart-panel';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleNumber: string;
  date: Date;
  items: CartLineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  amountTendered?: number;
  customer?: CustomerData | null;
  storeName?: string;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  saleNumber,
  date,
  items,
  subtotal,
  discount,
  tax,
  total,
  paymentMethod,
  amountTendered,
  customer,
  storeName = 'RETAIL OS STORE',
}: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const changeDue = amountTendered ? Math.max(0, amountTendered - total) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Action Header (hidden in print) */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
            <CheckCircle size={16} /> Sale Completed!
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Printer size={14} /> Print Receipt
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Thermal Receipt Content */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-900 font-mono text-xs space-y-4 print:p-0 print:overflow-visible">
          {/* Header & Logo */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
            <div className="font-black text-sm uppercase tracking-widest text-slate-900">{storeName}</div>
            <div className="text-[10px] text-slate-500">Official Sales Receipt</div>
            <div className="text-[10px] text-slate-400 mt-1">Receipt #: {saleNumber}</div>
            <div className="text-[10px] text-slate-400">Date: {new Date(date).toLocaleString()}</div>
          </div>

          {/* Customer Info */}
          {customer && (
            <div className="pb-3 border-b border-dashed border-slate-300 space-y-0.5 text-[10px]">
              <div><span className="text-slate-400">Customer:</span> {customer.name}</div>
              {customer.phone && <div><span className="text-slate-400">Phone:</span> {customer.phone}</div>}
              {customer.loyaltyPoints !== undefined && (
                <div><span className="text-slate-400">Loyalty Points:</span> {customer.loyaltyPoints}</div>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="space-y-2 pb-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between font-bold text-[10px] uppercase text-slate-400 border-b border-slate-200 pb-1">
              <span>Item</span>
              <span>Qty x Price</span>
              <span className="text-right">Total</span>
            </div>
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between items-start gap-1">
                <div className="flex-1 truncate pr-1">
                  <div className="font-semibold text-slate-800">{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.quantity} x ${item.price.toFixed(2)}</div>
                </div>
                <span className="font-bold text-slate-900">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Calculation Breakdown */}
          <div className="space-y-1 text-slate-600 text-[11px] pb-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>+${tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
              <span>TOTAL:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment & Change */}
          <div className="space-y-1 text-[10px] pb-3 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Method:</span>
              <span className="font-bold text-slate-800">{paymentMethod}</span>
            </div>
            {amountTendered !== undefined && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tendered:</span>
                  <span>${amountTendered.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Change Due:</span>
                  <span>${changeDue.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          {/* Footer Barcode Placeholder & Thank you */}
          <div className="text-center space-y-2 pt-1">
            <div className="text-[10px] text-slate-500 font-semibold">Thank you for shopping with us!</div>
            <div className="text-[9px] text-slate-400">Please retain this receipt for returns or exchanges.</div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 print:hidden">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
          >
            New Sale / Clear
          </button>
        </div>
      </div>
    </div>
  );
}
