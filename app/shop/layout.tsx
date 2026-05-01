'use client';

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { ShoppingBag, UserRound, Package } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

let initialClearDone = false;

export default function ShopLayout({
  children,
  params,
}: {
  children: ReactNode;
  params?: { slug?: string };
}) {
  const storeName = params?.slug || "InduMart";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (typeof window !== 'undefined' && !initialClearDone) {
    initialClearDone = true;
    const token = localStorage.getItem("retail_token");
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
  }

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
    };

    // Run initial check and Google sync ONCE on mount
    check();
    syncGoogleSession();

    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="w-full">{children}</main>
    </div>
  );
}
