import Image from "next/image";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    tag?: string;
    image?: string;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="relative h-32 w-full overflow-hidden rounded-lg bg-muted">
          {product.image ? (
            <Image
              alt={product.name}
              src={product.image}
              fill
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Image coming soon
            </div>
          )}
          {product.tag && (
            <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">
              {product.tag}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div>
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{product.price}</p>
          <Button size="sm" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

