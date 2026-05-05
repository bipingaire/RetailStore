import Image from "next/image";
import { Star, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    tag?: string;
    image?: string;
    rating?: number;
    reviews?: number;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  // Use a default rating and review count if not provided
  const rating = product.rating || 4.5;
  const reviews = product.reviews || Math.floor(Math.random() * 500) + 50;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-transparent bg-white p-4 transition-all hover:border-gray-200 hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white">
        {product.image ? (
          <Image
            alt={product.name}
            src={product.image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-2"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-500">
            Image coming soon
          </div>
        )}
        {product.tag && (
          <Badge className="absolute left-2 top-2 bg-green-700 text-white hover:bg-green-800">
            {product.tag}
          </Badge>
        )}
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(rating)
                    ? "fill-current"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="hover:underline cursor-pointer">{reviews}</span>
        </div>

        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            {product.price}
          </span>
        </div>

        <h3 className="line-clamp-3 text-sm font-normal text-gray-800 group-hover:underline cursor-pointer mt-1">
          {product.name}
        </h3>

        {/* Optional delivery text to make it look more like Walmart */}
        <div className="mt-1 flex flex-col gap-0.5 text-xs text-gray-600">
          <p><span className="font-semibold text-green-700">Pickup</span> available</p>
          <p><span className="font-semibold text-green-700">Delivery</span> available</p>
        </div>

        <div className="mt-auto pt-4">
          <Button
            className="w-full rounded-full bg-blue-600 font-bold text-white hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}

