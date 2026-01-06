import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type StoreHeroProps = {
  storeName: string;
  tagline: string;
};

export function StoreHero({ storeName, tagline }: StoreHeroProps) {
  return (
    <Card className="overflow-hidden bg-gradient-to-r from-primary/10 via-background to-background">
      <CardContent className="space-y-6 p-8 sm:flex sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-4">
          <Badge className="bg-primary text-primary-foreground">
            {storeName}
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight">{tagline}</h1>
          <p className="text-muted-foreground">
            Daily offers, seasonal drops, and live loyalty perks in one place.
          </p>
          <Button asChild>
            <Link href="#offers" className="flex items-center gap-2">
              Browse offers
              <ShoppingBag className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="hidden h-32 w-32 rounded-full border border-dashed border-primary/40 sm:flex sm:items-center sm:justify-center">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Store OS
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

