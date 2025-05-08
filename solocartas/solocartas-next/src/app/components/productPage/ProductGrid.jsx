'use client';

import { useState } from 'react';
import CardProduct from './CardProduct';

const allProducts = [
  { id: 1, name: 'Charizard VMAX', price: 24990, store: 'Tienda Friki', image: 'https://via.placeholder.com/200x300?text=Charizard' },
  { id: 2, name: 'Blue-Eyes White Dragon', price: 18990, store: 'Geeklandia', image: 'https://via.placeholder.com/200x300?text=Blue-Eyes' },
  { id: 3, name: 'Dark Magician', price: 21990, store: 'Mundo Duelista', image: 'https://via.placeholder.com/200x300?text=Magician' },
  { id: 4, name: 'Pikachu Holo', price: 12990, store: 'CardZone', image: 'https://via.placeholder.com/200x300?text=Pikachu' },
  { id: 5, name: 'Mewtwo GX', price: 15990, store: 'Cartas Top', image: 'https://via.placeholder.com/200x300?text=Mewtwo' },
  { id: 6, name: 'One Piece Luffy Rare', price: 28990, store: 'LuffyStore', image: 'https://via.placeholder.com/200x300?text=Luffy' },
];

export default function ProductGrid() {
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredProducts = allProducts.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = maxPrice ? product.price <= parseInt(maxPrice) : true;
    return matchesName && matchesPrice;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Filtros a la izquierda */}
      <aside className="w-full lg:w-1/4">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre"
            className="border px-3 py-2 rounded w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio máximo"
            className="border px-3 py-2 rounded w-full"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <select className="border px-3 py-2 rounded w-full">
            <option value="">Todas las categorías</option>
            <option value="pokemon">Pokémon</option>
            <option value="magic">Magic</option>
            <option value="onepiece">One Piece</option>
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" />
            Solo con descuento
          </label>
        </div>
      </aside>

      {/* Grilla de productos a la derecha */}
      <section className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <CardProduct key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">No se encontraron cartas con esos criterios.</p>
          )}
        </div>
      </section>
    </div>
  );
}
