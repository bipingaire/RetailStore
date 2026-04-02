import Link from 'next/link';
import { ShoppingBag, RefreshCcw, Box, CreditCard, HelpCircle } from 'lucide-react';
import ShopFooter from '../components/shop-footer';

export default function ReturnsPage() {
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
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Returns & Refunds</h1>
          <p className="text-lg text-gray-500">Not completely satisfied? We're here to help make it right.</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="p-8 md:p-12 border-b border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-red-50 p-3 rounded-2xl flex-shrink-0">
                <RefreshCcw className="text-red-500" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Freshness Guarantee</h2>
                <p className="text-gray-600 leading-relaxed">
                  Due to the perishable nature of groceries, we do not accept physical returns of food items. However, if you receive a damaged product, expired item, or something lacking our quality standard, we offer a <strong className="text-gray-900">100% money-back guarantee</strong> within 48 hours of delivery.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 bg-gray-50/50">
            <div className="p-8 text-center">
              <Box className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">1. Report Issue</h3>
              <p className="text-sm text-gray-500">Contact us within 48 hours with a photo of the item.</p>
            </div>
            <div className="p-8 text-center">
              <HelpCircle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">2. Review</h3>
              <p className="text-sm text-gray-500">Our support team will approve your claim within 1 business day.</p>
            </div>
            <div className="p-8 text-center">
              <CreditCard className="w-10 h-10 text-gray-400 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">3. Refund</h3>
              <p className="text-sm text-gray-500">Funds are returned to your original payment method in 3-5 days.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Non-Perishable Items</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            For non-perishable goods (like kitchen utensils, sealed dry pantry goods, or cleaning supplies), standard returns are accepted within <strong className="text-gray-900">30 days</strong> of purchase.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-3 ml-2">
            <li>Items must be unopened, unused, and in their original packaging.</li>
            <li>Original receipt or order confirmation is required.</li>
            <li>Return shipping costs are the responsibility of the customer unless the item arrived defective.</li>
          </ul>
        </div>
      </main>

      <ShopFooter />
    </div>
  );
}
