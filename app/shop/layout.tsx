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
    let syncing = false; // Guard to prevent re-entrant loops

    // One-time Google session sync on mount
    const syncGoogleSession = async () => {
      const token = localStorage.getItem("retail_token");
      if (token || syncing) return; // Already logged in or already syncing
      syncing = true;
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const session = await res.json();
          if (session?.backendToken) {
            localStorage.setItem("retail_token", session.backendToken);
            localStorage.setItem("accessToken", session.backendToken);
            if (session.backendUser) {
              localStorage.setItem("retail_user", JSON.stringify(session.backendUser));
            }
            setIsLoggedIn(true);
          }
        }
      } catch (e) {} finally {
        syncing = false;
      }
    };

    // Simple check for storage events (login/logout from other tabs or components)
    const check = () => {
      const token = localStorage.getItem("retail_token");
      setIsLoggedIn(!!token);

      // Clear cart on reload for unauthenticated users
      if (!token) {
        try {
          const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
          const isReload = nav ? nav.type === "reload" : performance.navigation.type === 1;
          const isFirstLoad = !sessionStorage.getItem('shop_visited');
          if (isReload || isFirstLoad) {
            localStorage.removeItem('retail_cart');
          }
          sessionStorage.setItem('shop_visited', 'true');
        } catch (e) {}
      }
    };

    // Run initial check and Google sync ONCE on mount
    check();
    syncGoogleSession();

    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="hidden md:block border-b bg-background">
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
