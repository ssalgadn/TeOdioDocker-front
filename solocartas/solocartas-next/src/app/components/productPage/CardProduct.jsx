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
      className="border dark:border-gray-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-slate-800 cursor-pointer"
    >
      <img
        src={product.img_url}
        alt={`Carta ${product.name}`}
        className="w-full h-[320px] object-cover bg-gray-100 dark:bg-slate-700"
      />

      <div className="p-3 flex flex-col items-start">
        <h2 className="text-base font-semibold mb-1 dark:text-gray-100">{product.name}</h2>
        <p className="text-green-600 font-medium mb-1">{formatPriceCLP(product.min_price)}</p>
        {/* <small className="text-gray-500 text-sm">Juego: {product.game}</small> */}
        {/* You can add other fields like product.game or product.product_type here if desired */}
      </div>
    </div>
  );
}
