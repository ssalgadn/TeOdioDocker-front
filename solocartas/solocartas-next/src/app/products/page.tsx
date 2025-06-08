import ProductGrid from '@/app/components/productPage/ProductGrid';
import type { ProductListItem, ProductFilters } from '@/types/product';

interface ProductsPageProps {
  params?: { [key: string]: string | string[] | undefined };
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getProducts(filters: ProductFilters): Promise<ProductListItem[]> {
  const queryParams = new URLSearchParams();

  if (filters.name) queryParams.append('name', filters.name);
  if (filters.min_price) queryParams.append('min_price', filters.min_price.toString());
  if (filters.max_price) queryParams.append('max_price', filters.max_price.toString());
  if (filters.game) queryParams.append('game', filters.game);
  if (filters.product_type) queryParams.append('product_type', filters.product_type);
  if (filters.skip) queryParams.append('skip', filters.skip.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());

  if (typeof process.env.BACKEND_URL === 'undefined') {
    console.error("BACKEND_URL is not defined in getProducts. Please check your environment variables.");
    return [];
  }

  const response = await fetch(`${process.env.BACKEND_URL}/products/?${queryParams.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch products:', await response.text());
    return [];
  }
  return response.json();
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  try {
    if (typeof process.env.BACKEND_URL === 'undefined') {
      console.error("BACKEND_URL is not defined in ProductsPage. Please check your environment variables.");
      return (
        <main className="container mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-red-600">Error de Configuración del Servidor</h1>
          <p>La URL del backend no está configurada. Por favor, contacte al administrador.</p>
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
      <main className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Catálogo de cartas</h1>
        <p className="text-gray-700 mb-6">
          Compara precios de cartas TCG en distintas tiendas chilenas verificadas.
        </p>
        <ProductGrid initialProducts={products} />
      </main>
    );
  } catch (error) {
    console.error("Error rendering ProductsPage:", error);
    const errorMessage = error instanceof Error ? error.message : "Un error desconocido ocurrió";
    const errorStack = error instanceof Error ? error.stack : undefined;

    return (
      <main className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-red-600">Error al Cargar la Página</h1>
        <p>Ocurrió un error inesperado: {errorMessage}. Por favor, intente más tarde.</p>
        {process.env.NODE_ENV === 'development' && errorStack && (
          <pre className="mt-4 p-4 bg-red-100 text-red-700 rounded text-xs whitespace-pre-wrap">
            {errorStack}
          </pre>
        )}
      </main>
    );
  }
}
