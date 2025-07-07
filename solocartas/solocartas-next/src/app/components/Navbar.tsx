'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserCircle2, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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
      { name: 'Boosters', href: '/products?game=pokemon&product_type=booster' },
      { name: 'Bundles', href: '/products?game=pokemon&product_type=bundle' },
      { name: 'Singles', href: '/products?game=pokemon&product_type=single' },
    ],
  },
  {
    name: 'Yu-Gi-Oh!',
    href: '/products?game=yu-gi-oh',
    subItems: [
      { name: 'Boosters', href: '/products?game=yu-gi-oh&product_type=booster' },
      { name: 'Bundles', href: '/products?game=yu-gi-oh&product_type=bundle' },
      { name: 'Singles', href: '/products?game=yu-gi-oh&product_type=single' },
    ],
  },
  {
    name: 'Magic: The Gathering',
    href: '/products?game=magic-the-gathering',
    subItems: [
      { name: 'Boosters', href: '/products?game=magic-the-gathering&product_type=booster' },
      { name: 'Bundles', href: '/products?game=magic-the-gathering&product_type=bundle' },
      { name: 'Singles', href: '/products?game=magic-the-gathering&product_type=single' },
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

  const { isAuthenticated, user, logout, isLoading } = useAuth();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
  };

  const handleCatalogEnter = () => {
    if (catalogCloseTimer.current) clearTimeout(catalogCloseTimer.current);
    setCatalogOpen(true);
  };

  const handleCatalogLeave = () => {
    catalogCloseTimer.current = setTimeout(() => {
      setCatalogOpen(false);
    }, 200);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-700">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo and Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-700 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            SoloCartas
          </Link>
          <div className="hidden md:flex items-center gap-6 text-gray-700 dark:text-gray-300 font-medium">
            <Link
              href="/"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                pathname === '/' ? 'text-blue-600 dark:text-blue-400' : ''
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/about-us"
              className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                pathname === '/about-us' ? 'text-blue-600 dark:text-blue-400' : ''
              }`}
            >
              About Us
            </Link>
            <button
              onMouseEnter={handleCatalogEnter}
              onFocus={handleCatalogEnter}
              onMouseLeave={handleCatalogLeave}
              onBlur={handleCatalogLeave}
              aria-haspopup="true"
              aria-expanded={isCatalogOpen}
              className={`flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium focus:outline-none ${
                pathname.startsWith('/products') || isCatalogOpen
                  ? 'text-blue-600 dark:text-blue-400'
                  : ''
              }`}
              type="button"
            >
              Catálogo
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Right Side: Theme toggle and user */}
        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              type="button"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <div className="relative" ref={userDropdownRef}>
            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
            ) : (
              <>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1 focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={isUserDropdownOpen}
                  type="button"
                >
                  {isAuthenticated && user?.picture ? (
                    <Image
                      src={user.picture}
                      alt={user.name || 'Avatar'}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                    <UserCircle2 className="text-gray-500 dark:text-gray-400" size={36} strokeWidth={1.5} />
                  )}
                  <ChevronDown
                    className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white dark:bg-slate-800 shadow-lg py-1 z-50 border border-gray-200 dark:border-slate-700">
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        type="button"
                      >
                        Logout
                      </button>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mega menu */}
      <div
        onMouseEnter={handleCatalogEnter}
        onMouseLeave={handleCatalogLeave}
        className={`absolute top-full left-0 right-0 bg-gray-700 dark:bg-gray-800 shadow-lg z-40 transition-opacity duration-300 ${
          isCatalogOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
            {megaMenuColumns.map((column) => (
              <div key={column.name} className="space-y-4">
                <Link
                  href={column.href || '#'}
                  onClick={() => setCatalogOpen(false)}
                  className="block text-lg font-semibold text-gray-100 dark:text-gray-50 hover:text-blue-300 dark:hover:text-blue-300 transition-colors mb-3"
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
                          className="block text-sm text-gray-300 dark:text-gray-400 hover:text-gray-100 dark:hover:text-gray-50 transition-colors"
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
    </header>
  );
}
