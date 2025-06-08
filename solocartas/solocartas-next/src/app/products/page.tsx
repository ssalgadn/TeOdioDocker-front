import ProductGrid from '@/app/components/productPage/ProductGrid';
import { getProducts } from '@/lib/api'; // Importa desde el nuevo archivo
import type { ProductFilters } from '@/types/product';

interface ProductsPageProps {
  params: {}; // params estará vacío para esta ruta, pero lo aceptamos
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
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

  // La llamada a la API ahora es más limpia. Si falla, error.tsx se activará.
  const products = await getProducts(filters);

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Catálogo de cartas</h1>
      <p className="text-gray-700 mb-6">
        Compara precios de cartas TCG en distintas tiendas chilenas verificadas.
      </p>
      <ProductGrid initialProducts={products} />
    </main>
  );
}