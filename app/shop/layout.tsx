'use client';

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { ShoppingBag, UserRound, Package } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ShopLayout({
  children,
  params,
}: {
  children: ReactNode;
  params?: { slug?: string };
}) {
  const storeName = params?.slug || "InduMart";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check auth on mount and whenever storage changes
    const check = () => {
      const token =
        localStorage.getItem("retail_token") ||
        localStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
    };

    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      {/*
        Synchronously wipe the cart for unauthenticated users on full page reloads
        (before React hydrates or any useEffects run)
      */}
      <script dangerouslySetInnerHTML={{ __html: `
        try {
          var token = localStorage.getItem('retail_token') || localStorage.getItem('accessToken');
          if (!token) {
            var nav = performance.getEntriesByType("navigation")[0];
            var isReload = nav ? nav.type === "reload" : performance.navigation.type === 1;
            var isFirstLoad = !sessionStorage.getItem('shop_visited');
            
            if (isReload || isFirstLoad) {
              localStorage.removeItem('retail_cart');
            }
            sessionStorage.setItem('shop_visited', 'true');
          }
        } catch(e) {}
      ` }} />
      <header className="border-b bg-background">
        <div className="w-full flex items-center justify-between gap-4 px-6 py-4">
          <Link href="/shop" className="text-lg font-semibold">
            {storeName}
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/shop/cart"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
            >
              <ShoppingBag className="h-4 w-4" />
              Cart
            </Link>
            {/* Only show My Orders when the user is logged in */}
            {isLoggedIn && (
              <Link
                href="/shop/orders"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
              >
                <Package className="h-4 w-4" />
                My Orders
              </Link>
            )}
            <Link
              href="/shop/account"
              className={cn(buttonVariants({ size: "sm" }), "gap-2")}
            >
              <UserRound className="h-4 w-4" />
              Account
            </Link>
          </div>
        </div>
      </header>
      <main className="w-full">{children}</main>
    </div>
  );
}
