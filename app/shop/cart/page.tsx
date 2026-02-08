'use client';
import { useState, useEffect } from 'react';
import { MapPin, Truck, CreditCard, Banknote, Store, AlertTriangle, ArrowRight, Loader2, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const stored = localStorage.getItem('retail_cart');
    const counts: Record<string, number> = stored ? JSON.parse(stored) : {};

    // For now, create mock items from localStorage IDs
    // In a real app, you'd fetch product details from backend
    const items: CartItem[] = Object.entries(counts).map(([id, quantity]) => ({
      id,
      name: `Product ${id}`,
      price: 0, // Would come from API
      quantity
    }));

    setCartItems(items);
    setLoading(false);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const newItems = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0);

    setCartItems(newItems);

    // Update localStorage
    const counts: Record<string, number> = {};
    newItems.forEach(item => {
      counts[item.id] = item.quantity;
    });
    localStorage.setItem('retail_cart', JSON.stringify(counts));
  };

  const removeItem = (id: string) => {
    const newItems = cartItems.filter(item => item.id !== id);
    setCartItems(newItems);

    const counts: Record<string, number> = {};
    newItems.forEach(item => {
      counts[item.id] = item.quantity;
    });
    localStorage.setItem('retail_cart', JSON.stringify(counts));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700">
            Continue Shopping <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="text-green-600 hover:text-green-700 mb-4 inline-block">
            ← Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center gap-4">

                {/* Image */}
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-green-600 font-bold">${item.price.toFixed(2)}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:text-red-500"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:text-green-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/shop/checkout"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </Link>

              <div className="mt-4 text-center text-sm text-gray-500">
                Secure checkout powered by InduMart
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}