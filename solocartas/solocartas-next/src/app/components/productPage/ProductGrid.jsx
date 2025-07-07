'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Suspense } from 'react';
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

export default function ProductGrid({ initialProducts }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActualProductGrid initialProducts={initialProducts} />
    </Suspense>
  );
}

function ActualProductGrid({ initialProducts }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('name') || '');
  
  const initialMinPrice = parseFloat(searchParams.get('min_price') || '0');
  const initialMaxPrice = parseFloat(searchParams.get('max_price') || '100000');
  const [priceRange, setPriceRange] = useState({ min: initialMinPrice, max: initialMaxPrice });

  const [sliderBaseMin] = useState(0); 
  const [sliderBaseMax] = useState(100000); 

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('game') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('product_type') || '');
  
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [itemsPerPage, setItemsPerPage] = useState(parseInt(searchParams.get('limit') || ITEMS_PER_PAGE_OPTIONS[0].toString()));

  const updateFiltersInUrl = useCallback((newFilters) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key] !== undefined && newFilters[key] !== null && newFilters[key] !== '' && !(key === 'min_price' && newFilters[key] === 0) && !(key === 'max_price' && newFilters[key] === sliderBaseMax) ) { 
        current.set(key, newFilters[key].toString());
      } else {
        current.delete(key);
      }
    });

    const primaryFiltersChanged = ['name', 'min_price', 'max_price', 'game', 'product_type'].some(key => key in newFilters);
    if (primaryFiltersChanged && !('page' in newFilters)) {
        current.set('page', '1');
    }
    
    router.push(`${pathname}?${current.toString()}`);
  }, [searchParams, router, pathname, sliderBaseMax]);

  const handleApplyFilters = () => {
    const filtersToApply = {
      name: search,
      min_price: priceRange.min,
      max_price: priceRange.max === sliderBaseMax ? '' : priceRange.max, // Don't send max_price if it's the default max
      game: selectedCategory,
      product_type: selectedType,
    };
    updateFiltersInUrl(filtersToApply);
  };
  
  const totalProductsOnPage = initialProducts ? initialProducts.length : 0;

  if (!initialProducts) {
    return <p className="text-center py-10">Cargando productos...</p>; 
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 items-start">
        {/* Filter Section */}
        <div className="md:col-span-1 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg mb-8 md:mb-0">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">Filtros</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Buscar por nombre</label>
              <input
                type="text"
                id="search"
                placeholder="Ej: Charizard VMAX"
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-3 py-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rango de Precio</label>
              <MultiRangeSlider
                min={sliderBaseMin}
                max={sliderBaseMax}
                step={1000}
                minValue={priceRange.min}
                maxValue={priceRange.max}
                onInput={(e) => { 
                  setPriceRange({ min: e.minValue, max: e.maxValue });
                }}
                ruler={false}
                label={false}
                style={{ border: 'none', boxShadow: 'none', padding: '15px 0px' }}
                barLeftColor="#e5e7eb"
                barInnerColor="#3b82f6"
                barRightColor="#e5e7eb"
                thumbLeftColor="#ffffff"
                thumbRightColor="#ffffff"
              />
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 flex justify-between">
                <span>${priceRange.min?.toLocaleString('es-CL')}</span>
                <span>${priceRange.max?.toLocaleString('es-CL')}</span>
              </div>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
              <select 
                id="category"
                className="border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-gray-200 px-3 py-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 bg-white dark:focus:bg-slate-600"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)} 
              >
                <option value="">Todas las categorías</option>
                {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
              <select 
                id="type"
                className="border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-gray-200 px-3 py-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 bg-white dark:focus:bg-slate-600"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)} 
              >
                <option value="">Todos los tipos</option>
                {TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>
            <button
              onClick={handleApplyFilters}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Aplicar filtros
            </button>
          </div>
        </div>

        {/* Product Listing Section */}
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {totalProductsOnPage > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {((currentPage - 1) * itemsPerPage) + totalProductsOnPage} de {totalProductsOnPage} resultados en esta página
            </p>
            <div>
              <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Items por página:</label>
              <select 
                id="itemsPerPage"
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 px-2 py-1.5 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-sm dark:focus:bg-gray-600"
                value={itemsPerPage}
                onChange={(e) => { 
                  const newLimit = parseInt(e.target.value);
                  setItemsPerPage(newLimit);
                  updateFiltersInUrl({ limit: newLimit, page: 1 }); 
                }}
              >
                {ITEMS_PER_PAGE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </div>

          {initialProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {initialProducts.map((product) => (
                <CardProduct key={product.id || product.name} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-10">No se encontraron cartas con esos criterios.</p>
          )}

          {(initialProducts.length >= itemsPerPage || currentPage > 1) && (
            <div className="mt-8 flex justify-center items-center gap-3">
              <button 
                onClick={() => { 
                  const newPage = Math.max(1, currentPage - 1);
                  setCurrentPage(newPage);
                  updateFiltersInUrl({ page: newPage });
                }}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {currentPage}
              </span>
              <button 
                onClick={() => { 
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  updateFiltersInUrl({ page: newPage });
                }}
                disabled={initialProducts.length < itemsPerPage}
                className={`px-4 py-2 border dark:border-gray-600 rounded-md text-sm font-medium transition-colors
                ${!initialProducts || initialProducts.length < itemsPerPage ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
