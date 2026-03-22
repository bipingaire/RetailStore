'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function ShopFooter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [storeName, setStoreName] = useState('InduMart');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeEmail, setStoreEmail] = useState('');

  useEffect(() => {
    const loadInfo = async () => {
      try {
        const [name, address, email] = await Promise.all([
          apiClient.get('/settings/store_name'),
          apiClient.get('/settings/store_address'),
          apiClient.get('/settings/store_email'),
        ]);
        if (name?.value) setStoreName(name.value);
        if (address?.value) setStoreAddress(address.value);
        if (email?.value) setStoreEmail(email.value);
      } catch { /* use defaults */ }
    };
    loadInfo();
  }, []);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    // In a real integration, you'd POST to a newsletter service here
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <ShoppingBag size={20} />
              </div>
              <span className="text-xl font-black text-gray-900">{storeName}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">Fresh products delivered to your door.</p>
            {storeAddress && <p className="text-sm text-gray-700 font-semibold">{storeAddress}</p>}
            {storeEmail && <p className="text-xs text-gray-500">{storeEmail}</p>}
            {!storeAddress && !storeEmail && (
              <>
                <p className="text-sm text-gray-700 font-semibold">123 Market Street, NY</p>
                <p className="text-xs text-gray-500">support@indumart.com</p>
              </>
            )}
          </div>

          {/* Account */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Account</h3>
            <ul className="space-y-2.5">

              <li>
                <Link href="/shop/orders" className="text-sm text-gray-600 hover:text-green-600 transition flex items-center gap-1 group">
                  Order History <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link href="/shop/account" className="text-sm text-gray-600 hover:text-green-600 transition flex items-center gap-1 group">
                  My Account <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Help</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop/shipping" className="text-sm text-gray-600 hover:text-green-600 transition flex items-center gap-1 group">
                  Shipping Info <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link href="/shop/returns" className="text-sm text-gray-600 hover:text-green-600 transition flex items-center gap-1 group">
                  Returns <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link href="/shop/faq" className="text-sm text-gray-600 hover:text-green-600 transition flex items-center gap-1 group">
                  FAQ <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-xs text-gray-500 mb-3">Subscribe to get deals and new arrivals straight to your inbox.</p>
            {submitted ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-xl px-4 py-3">
                <CheckCircle size={18} />
                <span className="text-sm font-semibold">You're subscribed! 🎉</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition"
                >
                  Join
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">© {year} {storeName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/shop/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition">Privacy Policy</Link>
            <Link href="/shop/terms" className="text-xs text-gray-400 hover:text-gray-600 transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
