'use client';

import Link from 'next/link';
import Image from 'next/image'; // Keep for now if other images are used, or remove if not.
import { UserCircle2, ChevronDown, ChevronRight, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

interface DropdownItem {
  name: string;
  href?: string;
  subItems?: DropdownItem[];
  category?: string; // For catalog items
  type?: string; // For catalog sub-items
}

const catalogItems: DropdownItem[] = [
  {
    name: 'Pokemon',
    category: 'pokemon',
    subItems: [
      { name: 'Boosters', href: '/products?category=pokemon&type=boosters', type: 'boosters' },
      { name: 'Bundles', href: '/products?category=pokemon&type=bundles', type: 'bundles' },
      { name: 'Singles', href: '/products?category=pokemon&type=singles', type: 'singles' },
    ],
  },
  {
    name: 'Yu-Gi-Oh!',
    category: 'yu-gi-oh',
    subItems: [
      { name: 'Boosters', href: '/products?category=yu-gi-oh&type=boosters', type: 'boosters' },
      { name: 'Bundles', href: '/products?category=yu-gi-oh&type=bundles', type: 'bundles' },
      { name: 'Singles', href: '/products?category=yu-gi-oh&type=singles', type: 'singles' },
    ],
  },
  {
    name: 'Magic: The Gathering',
    category: 'magic-the-gathering',
    subItems: [
      { name: 'Boosters', href: '/products?category=magic-the-gathering&type=boosters', type: 'boosters' },
      { name: 'Bundles', href: '/products?category=magic-the-gathering&type=bundles', type: 'bundles' },
      { name: 'Singles', href: '/products?category=magic-the-gathering&type=singles', type: 'singles' },
    ],
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCatalogDropdownOpen, setIsCatalogDropdownOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering theme-dependent UI to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const catalogDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (catalogDropdownRef.current && !catalogDropdownRef.current.contains(event.target as Node)) {
        setIsCatalogDropdownOpen(false);
        setOpenSubmenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Placeholder for logout logic
    console.log('Logout clicked');
    setIsUserDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center relative z-50">
      {/* Contenedor izquierdo: logo + navegación */}
      <div className="flex items-center gap-8">
        <Link href="/">
          <span className="text-2xl font-bold text-blue-700 tracking-tight">SoloCartas</span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link
            href="/"
            className={`font-medium ${pathname === '/' ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
          >
            Inicio
          </Link>
          <div className="relative" ref={catalogDropdownRef}>
            <button
              onClick={() => setIsCatalogDropdownOpen(!isCatalogDropdownOpen)}
              onMouseEnter={() => setIsCatalogDropdownOpen(true)}
              onMouseLeave={() => setIsCatalogDropdownOpen(false)}
              className={`font-medium ${pathname.startsWith('/products') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors flex items-center`}
            >
              Catálogo
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isCatalogDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isCatalogDropdownOpen && (
              <div 
                className="absolute top-full left-0 right-0 bg-gray-50 shadow-lg z-40 border-t border-gray-200"
                onMouseEnter={() => setIsCatalogDropdownOpen(true)} // Keep dropdown open when mouse is over it
                onMouseLeave={() => { 
                  setIsCatalogDropdownOpen(false); 
                  setOpenSubmenu(null); 
                }} // Close when mouse leaves the dropdown area
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-around py-4">
                    {catalogItems.map((item) => (
                      <div key={item.name} className="relative group">
                        <button
                          onMouseEnter={() => setOpenSubmenu(item.category || null)}
                          // onMouseLeave={() => setOpenSubmenu(null)} // Optional: close submenu if mouse leaves button but stays in dropdown
                          className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md flex items-center gap-1"
                        >
                          {item.name}
                          {item.subItems && (
                            <ChevronRight className={`h-4 w-4 transition-transform ${openSubmenu === item.category ? 'rotate-90' : ''}`} />
                          )}
                        </button>
                        {item.subItems && openSubmenu === item.category && (
                          <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-md shadow-xl py-1 z-50 ring-1 ring-black ring-opacity-5">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href || '#'}
                                onClick={() => { setIsCatalogDropdownOpen(false); setOpenSubmenu(null); }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenedor derecho: avatar + dropdown */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-700" />
            )}
          </button>
        )}
        {/* User Dropdown */}
        <div className="relative" ref={userDropdownRef}>
        <button onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)} className="flex items-center">
          <UserCircle2 size={36} className="text-gray-500 group-hover:text-blue-600 transition-colors" strokeWidth={1.5} />
          <ChevronDown className={`h-5 w-5 ml-1 text-gray-600 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isUserDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-50">
            <Link
              href="/login"
              onClick={() => setIsUserDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setIsUserDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Register
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        )}
        </div>
      </div>
    </nav>
  );
}
