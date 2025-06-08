import ProductDetail from '@/app/components/productPage/ProductDetail';
import { notFound } from 'next/navigation';

async function getProduct(id) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error('Backend URL is not configured');
  }
  const res = await fetch(`${backendUrl}/products/${id}`, { cache: 'no-store' }); // Consider caching strategy

  if (!res.ok) {
    if (res.status === 404) {
      notFound(); // Triggers the not-found page
    }
    // For other errors, you might want to throw or return a specific error object
    throw new Error(`Failed to fetch product ${id}: ${res.statusText}`);
  }
  return res.json();
}

export default async function ProductPage({ params }) {
  if (!params || !params.id) {
    notFound(); // Should not happen with typical routing but good to check
  }

  let product;
  try {
    product = await getProduct(params.id);
  } catch (error) {
    console.error(error);
    // You could render a specific error component here or re-throw to an error boundary
    return (
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-red-600">Error al cargar el producto</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  // The notFound() call within getProduct handles the case where product is null due to 404
  // So, an explicit !product check here for notFound might be redundant if getProduct always throws or calls notFound()
  // However, if getProduct could return null/undefined for other reasons, this check is still useful.
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
