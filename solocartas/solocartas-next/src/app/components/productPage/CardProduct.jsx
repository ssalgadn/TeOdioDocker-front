'use client';

import { formatPriceCLP } from '@/utils/format';
import { useRouter } from 'next/navigation';

export default function CardProduct({ product }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white cursor-pointer"
    >
      <img
        src={product.image}
        alt={`Carta ${product.name}`}
        className="w-full h-[320px] object-cover bg-gray-100"
      />

      <div className="p-3 flex flex-col items-start">
        <h2 className="text-base font-semibold mb-1">{product.name}</h2>
        <p className="text-green-600 font-medium mb-1">{formatPriceCLP(product.price)}</p>
        <small className="text-gray-500 text-sm">Vendido por: {product.store}</small>
      </div>
    </div>
  );
}
