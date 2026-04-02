'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import ShopFooter from '../components/shop-footer';

const FAQS = [
  {
    question: "How do I modify or cancel my order?",
    answer: "You can modify or cancel your order up until it is marked as 'Shipped' or 'Out for Delivery'. To do so, visit 'My Account' > 'Order History', select your recent order, and click 'Cancel Order'."
  },
  {
    question: "Do you offer contact-free delivery?",
    answer: "Yes! All deliveries default to contact-free. Our drivers will leave your groceries at your doorstep and send you a notification text once the delivery is complete."
  },
  {
    question: "What happens if an item I ordered is out of stock?",
    answer: "If an item becomes unavailable after you place your order, we will automatically substitute it with a similar item of equal or greater quality at no extra cost. If no suitable substitute exists, you will be instantly refunded for that item."
  },
  {
    question: "How do you keep items cold during delivery?",
    answer: "We use insulated thermal bags alongside eco-friendly ice packs and dry ice to ensure perishables, frozen foods, and dairy remain at their optimal temperatures right up to your doorstep."
  },
  {
    question: "Do you have a minimum order value?",
    answer: "Yes, our minimum order value is $20. Orders under $50 are subject to a flat $5.99 delivery fee, while orders over $50 qualify for free standard delivery."
  }
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-500">Quick answers to your most common questions.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${openIndex === index ? 'border-green-500 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className={`font-bold text-lg ${openIndex === index ? 'text-green-700' : 'text-gray-900'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-green-600' : ''}`} 
                  size={20} 
                />
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
           <p className="text-gray-500 mb-4">Still have questions?</p>
           <a href="mailto:support@indumart.com" className="inline-block bg-white text-gray-900 border border-gray-200 font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition">
             Contact Support
           </a>
        </div>
      </main>

      <ShopFooter />
    </div>
  );
}
