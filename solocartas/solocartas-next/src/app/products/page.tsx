import ProductGrid from '@/app/components/productPage/ProductGrid';
import type { ProductListItem, ProductFilters } from '@/types/product';


async function getProducts(filters: ProductFilters): Promise<ProductListItem[]> {
  const queryParams = new URLSearchParams();

  if (filters.name) queryParams.append('name', filters.name);
  if (filters.min_price) queryParams.append('min_price', filters.min_price.toString());
  if (filters.max_price) queryParams.append('max_price', filters.max_price.toString());
  if (filters.game) queryParams.append('game', filters.game);
  if (filters.product_type) queryParams.append('product_type', filters.product_type);
  if (filters.skip) queryParams.append('skip', filters.skip.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());

  const response = await fetch(`${process.env.BACKEND_URL}/products/?${queryParams.toString()}`, {
    cache: 'no-store', // Or configure caching as needed
  });

  if (!response.ok) {
    // Handle error appropriately
    console.error('Failed to fetch products:', await response.text());
    return [];
  }
  return response.json();
}

export default async function ProductsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = parseInt(searchParams.page as string) || 1;
  const limit = parseInt(searchParams.limit as string) || 12; // Default items per page
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
  // TODO: Get total number of products from API if available for pagination
  // const totalProducts = ...;
  // const totalPages = Math.ceil(totalProducts / limit);

  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Catálogo de cartas</h1>
      <p className="text-gray-700 mb-6">
        Compara precios de cartas TCG en distintas tiendas chilenas verificadas.
      </p>
      {/* Pass products and pagination info to ProductGrid */}
      {/* For now, ProductGrid will need significant refactoring to accept these props */}
      <ProductGrid initialProducts={products} />
    </main>
  );
}
