'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import CardProduct from './CardProduct';
import MultiRangeSlider from 'multi-range-slider-react';


const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 48];
const CATEGORIES = [
  { value: 'pokemon', label: 'Pokémon' },
  { value: 'yu-gi-oh', label: 'Yu-Gi-Oh!' },
  { value: 'magic-the-gathering', label: 'Magic: The Gathering' },
];
const TYPES = [
  { value: 'booster', label: 'Booster' },
  { value: 'bundle', label: 'Bundle' },
  { value: 'singles', label: 'Singles' },
];

export default function ProductGrid() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [sliderBaseMin, setSliderBaseMin] = useState(0);
  const [sliderBaseMax, setSliderBaseMax] = useState(100000); // Default max, updated from products
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const typeFromUrl = searchParams.get('type');
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
    if (typeFromUrl) setSelectedType(typeFromUrl);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch("https://te-odio-docker-back.vercel.app/cards/") // Consider fetching based on filters if API supports it
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        return response.json();
      })
      .then((data) => {
        const productList = Array.isArray(data) ? data : [];
        setProducts(productList);
        if (productList.length > 0) {
          const prices = productList.map(p => parseFloat(p.price)).filter(p => !isNaN(p));
          const minProductPrice = prices.length > 0 ? Math.min(...prices) : 0;
          const maxProductPrice = prices.length > 0 ? Math.max(...prices) : 100000;
          
          setSliderBaseMin(minProductPrice);
          setSliderBaseMax(maxProductPrice);
          setPriceRange({ min: minProductPrice, max: maxProductPrice }); // Initialize filter to full range
        } else {
          // Keep default sliderBaseMin/Max if no products, or set to a sensible default range
          setSliderBaseMin(0);
          setSliderBaseMax(100000);
          setPriceRange({ min: 0, max: 100000 });
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setProducts([]);
        setLoading(false);
      });
  }, []); // Fetch all products once on mount

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesName = product.name?.toLowerCase().includes(search.toLowerCase());
      const productPrice = parseFloat(product.price);
      const minPrice = parseFloat(priceRange.min);
      const maxPrice = parseFloat(priceRange.max);
      const matchesPrice =
        (isNaN(minPrice) || productPrice >= minPrice) &&
        (isNaN(maxPrice) || productPrice <= maxPrice);
      const matchesCategory = selectedCategory ? product.category?.toLowerCase() === selectedCategory.toLowerCase() : true;
      const matchesType = selectedType ? product.type?.toLowerCase() === selectedType.toLowerCase() : true;
      return matchesName && matchesPrice && matchesCategory && matchesType;
    });
  }, [products, search, priceRange, selectedCategory, selectedType]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [search, priceRange, selectedCategory, selectedType, itemsPerPage]);

  if (loading) return <p className="text-center py-10">Cargando productos...</p>;
  if (error) return <p className="text-center py-10 text-red-600">Error: {error}</p>;
  if (!loading && products.length === 0 && !error) return <p className="text-center py-10">No hay productos disponibles en este momento.</p>; 



  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-6">
      {/* Filtros a la izquierda */}
      <aside className="w-full lg:w-1/4 xl:w-1/5 space-y-6 bg-white p-6 rounded-lg shadow-md h-fit">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Filtros</h3>
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label>
          <input
            id="search"
            type="text"
            placeholder="Ej: Charizard VMAX"
            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rango de Precio</label>
          <MultiRangeSlider
            min={sliderBaseMin}
            max={sliderBaseMax}
            step={1000} // Adjust step for CLP, e.g., 100, 500, or 1000
            minValue={priceRange.min}
            maxValue={priceRange.max}
            onInput={(e) => {
              setPriceRange({ min: e.minValue, max: e.maxValue });
            }}
            ruler={false} // Hides the default ruler
            label={false} // Hides the default min/max labels on the slider
            style={{ border: 'none', boxShadow: 'none', padding: '15px 0px' }} // Basic styling override
            barLeftColor="#e5e7eb" // Tailwind gray-200
            barRightColor="#e5e7eb" // Tailwind gray-200
            barInnerColor="#3b82f6" // Tailwind blue-500
            thumbLeftColor="#ffffff"
            thumbRightColor="#ffffff"
          />
          <div className="mt-2 text-xs text-gray-600 flex justify-between">
            <span>${priceRange.min?.toLocaleString('es-CL')}</span>
            <span>${priceRange.max?.toLocaleString('es-CL')}</span>
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select 
            id="category"
            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select 
            id="type"
            className="border border-gray-300 px-3 py-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 bg-white"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
        </div>
        
        {/* <label className="flex items-center gap-2 text-sm text-gray-600 pt-2">
          <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
          Solo con descuento (Próximamente)
        </label> */}
      </aside>

      {/* Grilla de productos a la derecha */}
      <section className="flex-1">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            Mostrando {currentProducts.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} resultados
          </p>
          <div>
            <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700 mr-2">Items por página:</label>
            <select 
              id="itemsPerPage"
              className="border border-gray-300 px-2 py-1.5 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {ITEMS_PER_PAGE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>

        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <CardProduct key={product.id || product.name} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 col-span-full text-center py-10">No se encontraron cartas con esos criterios.</p>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-3">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
