'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      {/* Contenedor izquierdo: logo + navegación */}
      <div className="flex items-center gap-8">
        <Link href="/">
          <Image src="/logo.png" alt="SoloCartas logo" width={130} height={40} />
        </Link>
        <div className="flex gap-6">
          <Link
            href="/"
            className={`font-medium ${pathname === '/' ? 'text-blue-600' : 'text-gray-700'}`}
          >
            Inicio
          </Link>
          <Link
            href="/products"
            className={`font-medium ${pathname === '/products' ? 'text-blue-600' : 'text-gray-700'}`}
          >
            Catálogo
          </Link>
        </div>
      </div>

      {/* Contenedor derecho: avatar */}
      <div>
        <Image
          src="/usuario.png"
          alt="Usuario"
          width={36}
          height={36}
          className="rounded-full border border-gray-300"
        />
      </div>
    </nav>
  );
}
