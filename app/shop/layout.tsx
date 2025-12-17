import Link from "next/link";
import { ReactNode } from "react";
import { ShoppingBag, UserRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ShopLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="text-lg font-semibold">
            {params.slug}
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/shop/${params.slug}/cart`}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
            >
              <ShoppingBag className="h-4 w-4" />
              Cart
            </Link>
            <Link
              href={`/shop/${params.slug}/account`}
              className={cn(buttonVariants({ size: "sm" }), "gap-2")}
            >
              <UserRound className="h-4 w-4" />
              Account
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-10 px-6 py-10">{children}</main>
    </div>
  );
}

