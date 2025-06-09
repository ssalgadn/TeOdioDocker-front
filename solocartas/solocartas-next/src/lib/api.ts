import type { ProductListItem, ProductFilters } from '@/types/product';

export async function getProducts(filters: ProductFilters): Promise<ProductListItem[]> {
  const queryParams = new URLSearchParams();

  if (filters.name) queryParams.append('name', filters.name);
  if (filters.min_price) queryParams.append('min_price', filters.min_price.toString());
  if (filters.max_price) queryParams.append('max_price', filters.max_price.toString());
  if (filters.game) queryParams.append('game', filters.game);
  if (filters.product_type) queryParams.append('product_type', filters.product_type);
  if (filters.skip) queryParams.append('skip', filters.skip.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());

  if (!process.env.BACKEND_URL) {
    console.error("BACKEND_URL environment variable is not set.");
    // En caso de error, lanzamos una excepción para que sea capturada por error.tsx
    throw new Error("La URL del backend no está configurada.");
  }

  const response = await fetch(`${process.env.BACKEND_URL}/products/?${queryParams.toString()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error('Failed to fetch products:', await response.text());
    throw new Error("No se pudieron cargar los productos desde la API.");
  }

  return response.json();
}