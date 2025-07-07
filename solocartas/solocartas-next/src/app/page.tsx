import Link from 'next/link';
import Image from 'next/image'; 

interface CategoryCardProps {
  title: string;
  href: string;
  imageSrc?: string;
  bgColorClass: string;
  textColorClass?: string;
  description?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, href, imageSrc, bgColorClass, textColorClass = 'text-white', description }) => {
  return (
    <Link href={href} className={`block rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out ${bgColorClass} p-6 transform hover:scale-105`}>
      {imageSrc && (
        <div className="relative h-40 w-full mb-4 rounded-md overflow-hidden">
          <Image src={imageSrc} alt={title} layout="fill" objectFit="cover" />
        </div>
      )}
      <h3 className={`text-2xl font-bold ${textColorClass} mb-2`}>{title}</h3>
      {description && <p className={`${textColorClass} text-sm opacity-90`}>{description}</p>}
    </Link>
  );
};

export default function Landing() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-10 dark:bg-slate-800">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-500 sm:text-6xl">
          Bienvenido a SoloCartas
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Tu central para comparar precios de Trading Card Games en Chile. Encuentra las mejores ofertas para Pokémon, Yu-Gi-Oh!, Magic y más.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-10">Explora Nuestras Categorías</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <CategoryCard 
            title="Ver Todo"
            href="/products"
            description="Explora nuestro catálogo completo de cartas."
            bgColorClass="bg-gradient-to-br from-purple-500 to-indigo-600"
          />
          <CategoryCard 
            title="Pokémon"
            href="/products?game=pokemon"
            description="Atrapa las mejores ofertas para cartas Pokémon."
            bgColorClass="bg-gradient-to-br from-yellow-400 to-orange-500"
          />
          <CategoryCard 
            title="Yu-Gi-Oh!"
            href="/products?game=yu-gi-oh"
            description="Encuentra cartas raras y poderosas de Yu-Gi-Oh!."
            bgColorClass="bg-gradient-to-br from-red-500 to-pink-600"
          />
          <CategoryCard 
            title="Magic: The Gathering"
            href="/products?game=magic-the-gathering"
            description="Descubre el multiverso de Magic: The Gathering."
            bgColorClass="bg-gradient-to-br from-teal-500 to-cyan-600"
          />
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-slate-700 py-12 rounded-lg shadow-md">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">¿Por Qué SoloCartas?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-blue-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-1">Ahorra Tiempo y Dinero</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Compara precios de múltiples tiendas en un solo lugar. No más búsquedas interminables.</p>
            </div>
            <div>
              <div className="text-blue-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-1">Tiendas Verificadas</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Solo trabajamos con tiendas confiables para asegurar una buena experiencia de compra.</p>
            </div>
            <div>
              <div className="text-blue-600 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-1">Comunidad Activa</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">(Próximamente) Opiniones, listas de deseos y alertas de precios para tus cartas favoritas.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
