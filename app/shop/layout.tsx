import Link from "next/link";
import { ReactNode } from "react";
import { ShoppingBag, UserRound, Package, Search, Phone } from "lucide-react";

export default function ShopLayout({
  children,
  params,
}: {
  children: ReactNode;
  params?: { slug?: string };
}) {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top Bar */}
      <div className="border-b bg-white py-2">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          <Link href="/shop" className="text-xl font-bold tracking-tight text-gray-900">
            InduMart
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/shop/cart" className="flex items-center gap-2 hover:text-green-600 transition">
              <ShoppingBag size={16} />
              Cart
            </Link>
            <Link href="/shop/orders" className="flex items-center gap-2 hover:text-green-600 transition">
              <Package size={16} />
              My Orders
            </Link>
            <Link href="/shop/account" className="flex items-center gap-2 hover:text-green-600 transition">
              <UserRound size={16} />
              Account
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b bg-white py-6 sticky top-0 z-50 shadow-sm/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-8">
          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-2 shrink-0">
            <div className="bg-green-600 rounded-lg p-1.5">
              <ShoppingBag className="text-white h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">
              Indu<span className="text-green-600">Mart</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full bg-gray-100 border-none rounded-full py-3 pl-6 pr-12 text-sm font-medium focus:ring-2 focus:ring-green-500 transition-all outline-none"
            />
            <button className="absolute right-1.5 top-1.5 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition">
              <Search size={18} />
            </button>
          </div>

          {/* Contact & Actions */}
          <div className="flex items-center gap-6 shrink-0 ml-auto">
            <div className="hidden lg:flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
                <Phone size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Call To Order</span>
                <span className="text-sm font-black text-gray-900">917 325 6396</span>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-200 hidden lg:block"></div>

            <Link href="/shop/cart" className="relative group">
              <div className="h-12 w-12 rounded-full bg-green-50 text-green-700 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-all">
                <ShoppingBag size={22} />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  0
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <main className="w-full min-h-[calc(100vh-140px)] bg-gray-50">
        {children}
      </main>

      {/* Footer Area Placeholder */}
      <div className="bg-white border-t py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center text-gray-400 text-sm">
          © 2024 RetailRevive Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
