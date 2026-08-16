'use client';
import { useEffect, useState } from 'react';
import { ShoppingBag, CheckCircle, Store, Tag } from 'lucide-react';

interface CartItemDisplay {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface SaleCompleteData {
  customerName?: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountTendered?: number;
  changeDue?: number;
}

export default function CustomerDisplayPage() {
  const [items, setItems] = useState<CartItemDisplay[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [saleComplete, setSaleComplete] = useState<SaleCompleteData | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;

    const channel = new BroadcastChannel('pos_customer_display');

    channel.onmessage = (event) => {
      const data = event.data;
      if (!data) return;

      if (data.type === 'CART_UPDATE') {
        setItems(data.items || []);
        setSubtotal(data.subtotal || 0);
        setTax(data.tax || 0);
        setDiscount(data.discount || 0);
        setTotal(data.total || 0);
        setSaleComplete(null);
      } else if (data.type === 'SALE_COMPLETE') {
        setSaleComplete({
          customerName: data.customerName,
          subtotal: data.subtotal || 0,
          tax: data.tax || 0,
          discount: data.discount || 0,
          total: data.total || 0,
          amountTendered: data.amountTendered,
          changeDue: (data.amountTendered || 0) > (data.total || 0) ? (data.amountTendered || 0) - (data.total || 0) : 0,
        });
      } else if (data.type === 'CLEAR') {
        setItems([]);
        setSubtotal(0);
        setTax(0);
        setDiscount(0);
        setTotal(0);
        setSaleComplete(null);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col justify-between select-none">
      {/* Top Header */}
      <header className="px-8 py-5 border-b border-slate-800 bg-slate-900 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md">
            <Store size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">RETAIL<span className="text-indigo-400">OS</span></h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Customer Counter Display</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE TERMINAL
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto w-full">
        {saleComplete ? (
          /* Sale Complete Screen */
          <div className="lg:col-span-12 flex flex-col items-center justify-center py-16 text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500 text-emerald-400 flex items-center justify-center shadow-2xl">
              <CheckCircle size={56} />
            </div>
            <h2 className="text-4xl font-black text-white">Thank You for Shopping!</h2>
            <p className="text-lg text-slate-400">Your transaction has been completed successfully.</p>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full space-y-4 shadow-xl text-left">
              <div className="flex justify-between items-center text-slate-400 text-sm">
                <span>Total Amount Paid</span>
                <span className="text-3xl font-black text-emerald-400">${saleComplete.total.toFixed(2)}</span>
              </div>
              {saleComplete.amountTendered && saleComplete.amountTendered > 0 && (
                <>
                  <div className="flex justify-between text-sm text-slate-400 border-t border-slate-800 pt-3">
                    <span>Cash Tendered</span>
                    <span className="font-bold text-white">${saleComplete.amountTendered.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-amber-400 border-t border-slate-800 pt-3">
                    <span>Change Returned</span>
                    <span className="text-xl">${(saleComplete.changeDue || 0).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty / Welcome Screen */
          <div className="lg:col-span-12 flex flex-col items-center justify-center py-24 text-center space-y-4 text-slate-500">
            <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-slate-600">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-300">Welcome to RetailOS</h2>
            <p className="text-sm text-slate-500">Items added to your purchase will appear here in real time.</p>
          </div>
        ) : (
          /* Active Cart Display */
          <>
            {/* Items List (Left 7 Cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Tag size={16} /> Scanned Items ({items.length})
              </h3>
              <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto pr-2">
                {items.map((item, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-base text-white truncate">{item.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <span className="text-lg font-black text-indigo-400">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Summary (Right 5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-900/40 rounded-3xl p-8 shadow-2xl space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Order Summary</h3>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-amber-400 font-medium">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                {tax > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Tax</span>
                    <span>+${tax.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-800 pt-6 flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Payable</span>
                <span className="text-5xl font-black text-emerald-400 tracking-tight">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="px-8 py-4 bg-slate-900 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
        RetailOS POS System &bull; Live Secondary Terminal Display
      </footer>
    </div>
  );
}
