'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  title: string;
  href: string;
  description?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, href, description }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.08, rotate: 1 }}
      whileTap={{ scale: 0.98 }}
      className="group bg-gradient-to-br from-white/70 to-gray-100/80 dark:from-slate-800 dark:to-slate-900 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg cursor-pointer transform transition-all duration-300 hover:shadow-2xl"
    >
      <Link href={href}>
        <div className="flex flex-col space-y-3">
          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default function Landing() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-10 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950">
      
      <motion.header 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl sm:text-7xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text tracking-tight">
          SoloCartas
        </h1>
        <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Compara precios de Trading Card Games en Chile. Pokémon, Yu-Gi-Oh!, Magic y mucho más.
        </p>
      </motion.header>

      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="mb-24"
      >
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-10">Explora Categorías</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <CategoryCard 
            title="Ver Todo"
            href="/products"
            description="Explora todo nuestro catálogo y encuentra las mejores ofertas."
          />
          <CategoryCard 
            title="Pokémon"
            href="/products?game=pokemon"
            description="Atrapa las cartas que buscas al mejor precio."
          />
          <CategoryCard 
            title="Yu-Gi-Oh!"
            href="/products?game=yu-gi-oh"
            description="Colecciona y juega con las cartas más poderosas."
          />
          <CategoryCard 
            title="Magic: The Gathering"
            href="/products?game=magic-the-gathering"
            description="Sumérgete en el multiverso de Magic y consigue tus cartas."
          />
        </div>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 py-16 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-10">¿Por Qué Elegirnos?</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <motion.div whileHover={{ scale: 1.05 }} className="p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Ahorra Tiempo y Dinero</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Compara precios de múltiples tiendas sin esfuerzo.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Tiendas Verificadas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Solo comercios confiables para tu seguridad.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Comunidad Activa</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">(Próximamente) Opiniones y alertas de precios.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

    </main>
  );
}
