'use client';
import { useParams } from 'next/navigation';

export default function ShopSlugPage() {
  const params = useParams();

  return (
    <div className="p-12 text-center">
      <h1 className="text-2xl font-bold capitalize">{params.slug}</h1>
      <p className="text-gray-500 mt-2">Page content coming soon</p>
    </div>
  );
}