'use client';

import { useState,useEffect } from 'react';
import CardProduct from './CardProduct';


export default function ProductGrid() {
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch("https://te-odio-docker-back.vercel.app/cards/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);
  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;


  const filteredProducts = products.filter((product) => {
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
