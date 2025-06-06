'use client';

import Link from 'next/link';
import { UserCircle2, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

// ... (La interfaz DropdownItem y el array megaMenuColumns no cambian)
interface DropdownItem {
  name: string;
  href?: string;
  subItems?: DropdownItem[];
}

const megaMenuColumns: DropdownItem[] = [
  {
    name: 'Pokémon',
    href: '/products?game=pokemon',
    subItems: [
      { name: 'Boosters', href: '/products?game=pokemon&type=boosters' },
      { name: 'Bundles', href: '/products?game=pokemon&type=bundles' },
      { name: 'Singles', href: '/products?game=pokemon&type=singles' },
    ],
  },
  {
    name: 'Yu-Gi-Oh!',
    href: '/products?game=yu-gi-oh',
    subItems: [
      { name: 'Boosters', href: '/products?game=yu-gi-oh&type=boosters' },
      { name: 'Bundles', href: '/products?game=yu-gi-oh&type=bundles' },
      { name: 'Singles', href: '/products?game=yu-gi-oh&type=singles' },
    ],
  },
  {
    name: 'Magic: The Gathering',
    href: '/products?game=magic-the-gathering',
    subItems: [
      { name: 'Boosters', href: '/products?game=magic-the-gathering&type=boosters' },
      { name: 'Bundles', href: '/products?game=magic-the-gathering&type=bundles' },
      { name: 'Singles', href: '/products?game=magic-the-gathering&type=singles' },
    ],
  },
];


export default function Navbar() {
  const pathname = usePathname();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCatalogOpen, setCatalogOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const catalogCloseTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsUserDropdownOpen(false);
  };
  
  const handleCatalogEnter = () => {
    if (catalogCloseTimer.current) {
      clearTimeout(catalogCloseTimer.current);
    }
    setCatalogOpen(true);
  };

  const handleCatalogLeave = () => {
    catalogCloseTimer.current = setTimeout(() => {
      setCatalogOpen(false);
    }, 200); // Pequeño delay para permitir que el mouse se mueva al menú
  };

  return (
    // La NAV ahora es el contenedor principal para la lógica de hover
    <div className="relative" onMouseLeave={handleCatalogLeave}>
      <nav className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          {/* Left Side: Logo and Navigation Links */}
          <div className="flex items-center gap-8">
            <Link href="/">
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-500 tracking-tight">SoloCartas</span>
            </Link>
            <div className="hidden md:flex gap-6 items-center">
              <Link
                href="/"
                className={`font-medium ${pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
              >
                Inicio
              </Link>
              
              {/* --- CAMBIO AQUÍ: Se reemplazó el <div> por <Link> --- */}
              <Link
                href="/products"
                onMouseEnter={handleCatalogEnter}
                className={`font-medium ${pathname.startsWith('/products') || isCatalogOpen ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'} hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center cursor-pointer`}
              >
                <span>Catálogo</span>
                <ChevronDown className={`h-4 w-4 ml-1 text-current transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>

          {/* Right Side: Theme Toggle and User Dropdown */}
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <div className="relative" ref={userDropdownRef}>
              <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center">
                <UserCircle2 size={36} className="text-gray-500 dark:text-gray-400" strokeWidth={1.5} />
                <ChevronDown className={`h-5 w-5 ml-1 text-gray-600 dark:text-gray-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-xl py-1 z-50">
                  <Link href="/login" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Login</Link>
                  <Link href="/register" onClick={() => setIsUserDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Register</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mega Menu está AHORA FUERA de la NAV pero dentro del wrapper con la lógica de hover */}
      <div
        onMouseEnter={handleCatalogEnter} // Mantener abierto si el mouse entra al menú
        className={`absolute top-full left-0 right-0 // Posicionamiento full-width
                   bg-gray-700 dark:bg-gray-800 shadow-lg z-40
                   transition-opacity duration-300
                   ${isCatalogOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
            {megaMenuColumns.map((column) => (
              <div key={column.name} className="space-y-4">
                <Link
                  href={column.href || '#'}
                  onClick={() => setCatalogOpen(false)}
                  className="text-lg font-semibold text-gray-100 dark:text-gray-50 hover:text-blue-300 dark:hover:text-blue-300 transition-colors block mb-3"
                >
                  {column.name}
                </Link>
                {column.subItems && (
                  <ul className="space-y-2">
                    {column.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.href || '#'}
                          onClick={() => setCatalogOpen(false)}
                          className="text-gray-300 dark:text-gray-400 hover:text-gray-100 dark:hover:text-gray-50 transition-colors text-sm"
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}