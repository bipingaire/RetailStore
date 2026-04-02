import Link from 'next/link';
import { ShoppingBag, Truck, Clock, Globe, ShieldCheck } from 'lucide-react';
import ShopFooter from '../components/shop-footer';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Minimal Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/shop" className="flex items-center gap-2 group">
            <div className="bg-green-600 text-white p-2 rounded-lg group-hover:scale-105 transition-transform">
              <ShoppingBag size={24} />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Indu<span className="text-green-600">Mart</span></span>
          </Link>
          <div className="flex items-center gap-6">
             <Link href="/shop" className="text-sm font-semibold text-gray-600 hover:text-green-600 transition">Return to Store</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-500">Everything you need to know about delivery times and methods.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <Truck className="text-green-600 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Standard Delivery</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Get your fresh groceries delivered to your door within 2-3 business days. Free for all orders over $50.
            </p>
            <span className="inline-block bg-gray-100 text-gray-800 text-sm font-bold px-3 py-1 rounded-full">$5.99 flat rate below $50</span>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <Clock className="text-blue-600 mb-4" size={32} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Express Next-Day</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Need it fast? Order before 2 PM local time and receive your groceries the very next morning.
            </p>
            <span className="inline-block bg-blue-50 text-blue-700 text-sm font-bold px-3 py-1 rounded-full">$14.99 flat rate</span>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Globe className="text-gray-400" size={24} /> Delivery Areas
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We currently offer local delivery within a 50-mile radius of our fulfillment centers. National shipping is available for non-perishable goods, pantry items, and household supplies. Fresh produce, dairy, and meats are restricted to local delivery to ensure the highest quality and safety.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <ShieldCheck className="text-gray-400" size={24} /> Cold-Chain Guarantee
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All perishable items are transported in temperature-controlled packaging utilizing standard dry ice and advanced insulation methods. We guarantee your products will arrive fresh and at the appropriate safe temperatures.
            </p>
          </section>
        </div>
      </main>

      <ShopFooter />
    </div>
  );
}
