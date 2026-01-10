'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MapPin, Truck, CreditCard, Banknote, Store, AlertTriangle, ArrowRight, Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TENANT_ID = 'PASTE_YOUR_REAL_TENANT_UUID_HERE'; // Replace with real ID

export default function CheckoutPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [payment, setPayment] = useState<'cod' | 'online' | 'store'>('store');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartCounts, setCartCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function initCart() {
      // 1. Read Storage
      const stored = localStorage.getItem('retail_cart');
      const counts = stored ? JSON.parse(stored) : {};
      setCartCounts(counts);

      const ids = Object.keys(counts);
      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      // 2. Fetch Details for IDs
      const { data } = await supabase
        .from('retail-store-inventory-item')
        .select(`
          id:inventory-id, 
          price:selling-price-amount, 
          global_product:global-product-master-catalog ( name:product-name, image:image-url )
        `)
        .in('inventory-id', ids);

      if (data) {
        // Merge DB data with LocalStorage counts
        const merged = data.map((item: any) => ({
          id: item.id,
          name: item.global_product?.name || 'Unknown Item',
          image: item.global_product?.image,
          price: item.price,
          qty: counts[item.id],
          restriction: 'all' // In real app, fetch this from DB
        }));
        setCartItems(merged);
      }
      setLoading(false);
    }
    initCart();
  }, []);

  // Sync back to local storage when counts change in this page
  useEffect(() => {
    if (!loading) {
      const validCounts: Record<string, number> = {};
      cartItems.forEach(i => validCounts[i.id] = i.qty);
      localStorage.setItem('retail_cart', JSON.stringify(validCounts));
    }
  }, [cartItems, loading]);

  const updateItemQty = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(0, item.qty + delta) };
      }
      return item;
    }).filter(i => i.qty > 0));
  };

  const hasStoreOnlyItems = cartItems.some(i => i.restriction === 'store_only');
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = method === 'delivery' ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          tenant_id: TENANT_ID,
          customer_phone: '555-0101',
          fulfillment_method: method,
          payment_method: payment,
          total_amount: total,
          status: 'pending',
          delivery_address: method === 'delivery' ? address : null
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        store_inventory_id: item.id,
        qty: item.qty,
        unit_price: item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // Clear Cart
      localStorage.removeItem('retail_cart');
      alert("✅ Order Placed Successfully!");
      router.push('/shop/orders'); // Go to history

    } catch (error: any) {
      console.error(error);
      alert("Failed to place order: " + error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-6 rounded-full shadow-lg mb-6">
          <Store size={48} className="text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans">
      <div className="bg-white p-4 border-b sticky top-0 z-10 flex items-center gap-4">
        <Link href="/shop" className="p-2 hover:bg-gray-100 rounded-full"><ArrowRight className="rotate-180" size={20} /></Link>
        <h1 className="text-xl font-bold">Checkout</h1>
      </div>

      <div className="p-4 space-y-6 max-w-lg mx-auto">

        {/* ITEMS LIST */}
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <h2 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Items ({cartItems.length})</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden border">
                  {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">IMG</div>}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-gray-900 line-clamp-2">{item.name}</div>
                    <button onClick={() => updateItemQty(item.id, -item.qty)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                    <div className="text-gray-500">Unit Price:</div>
                    <div className="text-right font-medium">${item.price}</div>

                    <div className="text-gray-500">Qty:</div>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => updateItemQty(item.id, -1)} className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"><Minus size={10} /></button>
                      <span className="font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateItemQty(item.id, 1)} className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"><Plus size={10} /></button>
                    </div>

                    <div className="text-gray-900 font-bold pt-1 border-t">Total Price:</div>
                    <div className="text-right font-bold text-emerald-600 pt-1 border-t transition-colors underline decoration-emerald-200 decoration-2 underline-offset-2">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FULFILLMENT */}
        <div>
          <h3 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-2">Delivery Method</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setMethod('pickup')} className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${method === 'pickup' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white'}`}>
              <Store className="mb-2" />
              <span className="font-bold text-sm">Pickup</span>
              <span className="text-xs mt-1 text-green-600">Free</span>
            </button>
            <button onClick={() => !hasStoreOnlyItems && setMethod('delivery')} className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all relative ${hasStoreOnlyItems ? 'opacity-50 cursor-not-allowed bg-gray-100' : method === 'delivery' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white'}`}>
              <Truck className="mb-2" />
              <span className="font-bold text-sm">Delivery</span>
              <span className="text-xs mt-1">$5.00</span>
              {hasStoreOnlyItems && <div className="absolute top-2 right-2 text-red-500"><AlertTriangle size={12} /></div>}
            </button>
          </div>
          {method === 'delivery' && (
            <textarea className="w-full border rounded-lg p-3 mt-3 text-sm outline-none focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Delivery Address..." value={address} onChange={(e) => setAddress(e.target.value)} />
          )}
        </div>

        {/* TOTALS */}
        <div className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
          <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm text-gray-500"><span>Delivery</span><span>${deliveryFee.toFixed(2)}</span></div>
          <div className="flex justify-between text-xl font-black text-gray-900 border-t pt-2 mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-50 safe-area-bottom">
        <Link href="/shop/checkout" className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-between px-6 hover:bg-gray-800 transition-all">
          <span>Proceed to Checkout</span>
          <ArrowRight />
        </Link>
      </div>
    </div>
  );
}