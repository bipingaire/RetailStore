'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { ShoppingBag, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

type CartItem = {
  inventory_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      // Load cart from localStorage
      const savedCart = localStorage.getItem('retail_cart');
      if (!savedCart) {
        setLoading(false);
        return;
      }

      const cartData: Record<string, number> = JSON.parse(savedCart);

      // Fetch product details for cart items
      const products = await apiClient.request('/api/shop/products', {});

      const cartItems: CartItem[] = Object.entries(cartData).map(([id, qty]) => {
        const product = (products as any[]).find(p => p.inventory_id === id);
        return {
          inventory_id: id,
          product_name: product?.product_name || 'Unknown',
          price: product?.price || 0,
          quantity: qty,
          image_url: product?.image_url,
        };
      });

      setCart(cartItems);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }

  function updateQuantity(id: string, delta: number) {
    const savedCart = JSON.parse(localStorage.getItem('retail_cart') || '{}');
    const current = savedCart[id] || 0;
    const newQty = Math.max(0, current + delta);

    if (newQty === 0) {
      delete savedCart[id];
    } else {
      savedCart[id] = newQty;
    }

    localStorage.setItem('retail_cart', JSON.stringify(savedCart));
    loadCart();
  }

  function removeItem(id: string) {
    const savedCart = JSON.parse(localStorage.getItem('retail_cart') || '{}');
    delete savedCart[id];
    localStorage.setItem('retail_cart', JSON.stringify(savedCart));
    loadCart();
    toast.success('Item removed from cart');
  }

  async function handleCheckout() {
    if (!apiClient.isAuthenticated()) {
      toast.error('Please login to checkout');
      sessionStorage.setItem('checkout_redirect', 'true');
      router.push('/shop/login');
      return;
    }

    setCheckingOut(true);
    try {
      const checkoutData = {
        items: cart.map(item => ({
          inventory_id: item.inventory_id,
          quantity: item.quantity,
        })),
      };

      const result = await apiClient.request('/api/shop/checkout', {
        method: 'POST',
        body: JSON.stringify(checkoutData),
      });

      // Clear cart
      localStorage.removeItem('retail_cart');
      toast.success('Order placed successfully!');
      router.push(`/shop/orders`);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black">Shopping Cart</h1>
          <Link href="/shop" className="text-green-600 font-bold hover:underline">
            Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some products to get started!</p>
            <Link href="/shop" className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.inventory_id} className="bg-white rounded-xl p-6 flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} className="w-full h-full object-cover" alt={item.product_name} />
                    ) : (
                      <ShoppingBag className="text-gray-300" size={32} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{item.product_name}</h3>
                    <p className="text-green-600 font-black text-xl">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.inventory_id, -1)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.inventory_id, 1)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.inventory_id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 sticky top-6">
                <h2 className="font-bold text-xl mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span className="text-green-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  {checkingOut ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}