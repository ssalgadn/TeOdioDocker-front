import Link from 'next/link';

export default function Landing() {
  return (
    <main className="container mx-auto px-6 py-10">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-blue-600">SoloCartas</h1>
        <p className="mt-4 text-lg text-gray-700">
          Compara precios de cartas TCG en tiendas chilenas. Fácil, rápido y confiable.
        </p>
        <Link href="/products" className="text-blue-600 hover:text-blue-800 underline">
            Ir al catálogo
        </Link>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">¿Qué es SoloCartas?</h2>
        <p className="text-gray-700">
          Es una plataforma para comparar precios de cartas como Pokémon, Magic, One Piece, y más.
          Te muestra opciones de varias tiendas verificadas en un solo lugar.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-2">¿Por qué usarla?</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>🔍 Encuentra mejores precios sin ir tienda por tienda</li>
          <li>🔔 Recibe alertas cuando bajen los precios</li>
          <li>⭐ Opiniones reales de otras personas</li>
        </ul>
      </section>
    </main>
  );
}
