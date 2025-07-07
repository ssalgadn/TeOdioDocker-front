import ProductDetail from '@/app/components/productPage/ProductDetail';
import { notFound } from 'next/navigation';

async function getProduct(id) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error('Backend URL is not configured');
  }
  const res = await fetch(`${backendUrl}/products/${id}`, { cache: 'no-store' });

  if (!res.ok) {
    if (res.status === 404) {
      notFound(); 
    }
    throw new Error(`Failed to fetch product ${id}: ${res.statusText}`);
  }
  return res.json();
}

export default async function ProductPage({ params }) {
  if (!params || !params.id) {
    notFound();
  }

  let product;
  try {
    product = await getProduct(params.id);
  } catch (error) {
    console.error(error);
    return (
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-red-600">Error al cargar el producto</h1>
        <p>{error.message}</p>
      </div>
    );
  }


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
