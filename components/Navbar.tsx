// ✅ path: components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { clearToken } from '@/lib/api';

// ✅ Baca token dari localStorage ATAU sessionStorage
function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Auto close dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, [pathname]);

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('username');
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername(null);
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/onramptoofframp', label: 'Onramp to Offramp' },
    { href: '/transactions', label: 'Transactions' },
    { href: '/future-roadmap', label: 'Future Roadmap' },
  ];

  const isActivePath = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center">
            <div className="text-xl font-bold text-slate-900">
              BRDZ XRPL Ramp
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated &&
              navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActivePath(item.href) ? 'nav-link-active' : 'nav-link'}
                >
                  {item.label}
                </Link>
              ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3 relative" ref={dropdownRef}>
            {isAuthenticated ? (
              <>
                {/* Avatar */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold hover:opacity-90 transition"
                  title={username || 'User'}
                >
                  {username?.charAt(0).toUpperCase() || '?'}
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-lg shadow-lg w-40 py-2 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className={isActivePath('/login') ? 'nav-link-active' : 'nav-link'}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
              aria-expanded="false"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated &&
                navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-lg ${
                      isActivePath(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

              <div className="border-t border-slate-200 pt-2 mt-2">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
