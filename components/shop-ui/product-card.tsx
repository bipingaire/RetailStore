import Image from "next/image";
import { Star, Plus, Heart } from "lucide-react";

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

  // Extract a mock brand from the name (e.g. first two words)
  const brand = product.name.split(' ').slice(0, 2).join(' ');

  return (
    <div className="group relative flex h-full flex-col overflow-hidden bg-white p-3 transition-all hover:shadow-md border border-transparent hover:border-gray-100 rounded-xl">
      {/* Heart Icon Top Right */}
      <div className="absolute right-3 top-3 z-10 cursor-pointer">
        <Heart className="h-6 w-6 text-black hover:text-red-500 transition-colors" strokeWidth={1.5} />
      </div>

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
        {product.image ? (
          <Image
            alt={product.name}
            src={product.image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain p-2"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-50 text-sm text-gray-400">
            No Image
          </div>
        )}
        {product.tag && (
          <Badge className="absolute left-2 top-2 bg-green-700 text-white hover:bg-green-800">
            {product.tag}
          </Badge>
        )}
      </div>

      {/* Add Button - Left Aligned, Overlapping image slightly */}
      <div className="-mt-5 mb-2 ml-1 relative z-10 self-start">
        <Button
          className="rounded-full bg-green-600 px-6 py-6 font-bold text-white hover:bg-green-700 shadow-[0_2px_8px_rgba(0,0,0,0.15)] text-lg h-auto"
        >
          <Plus className="mr-1.5 h-6 w-6 stroke-[2.5]" />
          Add
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1">
        <div className="flex items-end gap-1.5 mt-0.5">
          <span className="text-[22px] font-bold leading-none tracking-tight text-black">
            {product.price}
          </span>
          <span className="text-[13px] text-gray-500 leading-snug">$3.26/100g</span>
        </div>

        <h3 className="font-bold text-black mt-2 text-[15px]">
          {brand}
        </h3>

        <p className="line-clamp-3 text-[15px] text-gray-800 leading-snug font-normal">
          {product.name}
        </p>

        <div className="mt-auto pt-3 flex items-center gap-1 text-[13px] text-gray-500">
          <div className="flex text-black">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(rating)
                    ? "fill-current stroke-current"
                    : "fill-transparent stroke-gray-300 stroke-2"
                }`}
              />
            ))}
          </div>
          <span className="ml-1 cursor-pointer hover:underline">{reviews}</span>
        </div>
      </div>
    </div>
  );
}

