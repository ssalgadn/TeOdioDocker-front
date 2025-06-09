import ProductGrid from '@/app/components/productPage/ProductGrid';
import { getProducts } from '@/lib/api';
import type { ProductFilters } from '@/types/product';
import { Suspense } from 'react';

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  
  if (!process.env.BACKEND_URL) {
    return (
      <main className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-red-600">Error de Configuración</h1>
        <p>La URL del backend no está configurada.</p>
      </main>
    );
  }

  const page = parseInt(searchParams.page as string) || 1;
  const limit = parseInt(searchParams.limit as string) || 12;
  const skip = (page - 1) * limit;

  const filters: ProductFilters = {
    name: searchParams.name as string | undefined,
    min_price: searchParams.min_price ? parseFloat(searchParams.min_price as string) : undefined,
    max_price: searchParams.max_price ? parseFloat(searchParams.max_price as string) : undefined,
    game: searchParams.game as string | undefined,
    product_type: searchParams.product_type as string | undefined,
    skip: skip,
    limit: limit,
  };

  const products = await getProducts(filters);

  return (
    <main className="container mx-auto px-6 py-10 dark:bg-slate-800">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">Catálogo de cartas</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Compara precios de cartas TCG en distintas tiendas chilenas verificadas.
      </p>
      <Suspense fallback={<div className="dark:text-gray-300">Cargando productos...</div>}>
        <ProductGrid initialProducts={products} />
      </Suspense>
    </main>
  );
}