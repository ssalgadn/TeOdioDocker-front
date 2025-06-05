'use client';

import { useParams } from 'next/navigation';
import ProductDetail from '@/app/components/productPage/ProductDetail';

// Simulamos obtener los productos (esto debería venir de tu API real)
const allProducts = [
  { 
    id: 1,
    name: 'Charizard VMAX',
    image: 'https://mesa1.cl/cdn/shop/products/981fb977-e4a7-45bc-b61c-f9164b19b64e_c6cdc997-1c21-41ec-ac5b-e82d32ae806f.png?v=1696303525',
    generalInfo: {
      setName: 'Sword & Shield: Darkness Ablaze',
      cardNumber: '020/189',
      rarity: 'VMAX Rare',
      category: 'Pokémon',
      releaseDate: '2020-08-14',
      description: 'Carta Pokémon Charizard VMAX de la expansión Sword & Shield: Darkness Ablaze. Una de las cartas más buscadas de la colección.',
    },
    stores: [
      { 
        id: 1,
        name: 'Tienda Friki',
        price: 24990,
        condition: 'Near Mint',
        stock: 3,
        url: '',
        rating: 4.8
      },
      {
        id: 2,
        name: 'Geeklandia',
        price: 26990,
        condition: 'Near Mint',
        stock: 1,
        url: '',
        rating: 4.5
      },
      {
        id: 3,
        name: 'CardZone',
        price: 23990,
        condition: 'Lightly Played',
        stock: 2,
        url: '',
        rating: 4.7
      }
    ],
    comments: [],
    priceHistory: [
      { date: '2025-01-01', avgPrice: 28990 },
      { date: '2025-02-01', avgPrice: 26990 },
      { date: '2025-03-01', avgPrice: 25990 },
      { date: '2025-04-01', avgPrice: 24990 },
      { date: '2025-05-01', avgPrice: 23990 }
    ]
  },
  // ... otros productos
];

export default function ProductPage() {
  const params = useParams();
  const product = allProducts.find(p => p.id === parseInt(params.id));

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-red-600">Producto no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <ProductDetail product={product} />
    </div>
  );
}
