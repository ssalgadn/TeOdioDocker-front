import ProductGrid from '@/app/components/productPage/ProductGrid';

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Catálogo de cartas</h1>
      <p className="text-gray-700 mb-6">
        Compara precios de cartas TCG en distintas tiendas chilenas verificadas.
      </p>
      <ProductGrid />
    </main>
  );
}
