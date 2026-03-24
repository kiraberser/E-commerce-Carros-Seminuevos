'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from '@/features/auth/AuthContext';
import { useCart } from '@/features/cart/CartContext';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { vehiclesApi } from '@/features/vehicles/api';
import type { VehicleList } from '@/shared/types';

// ─── useBrands ────────────────────────────────────────────────────────────────

function useBrands(): string[] {
  const [brands, setBrands] = useState<string[]>([]);
  useEffect(() => {
    vehiclesApi.list({ page: 1 }).then((res) => {
      const makes = Array.from(
        new Set(res.data.results.map((v) => v.make).filter(Boolean))
      ).sort();
      setBrands(makes);
    }).catch(() => {});
  }, []);
  return brands;
}

// ─── Utility hooks ────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);
  return scrolled;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: string) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(Number(price));
}

// ─── SearchBar ────────────────────────────────────────────────────────────────

function SearchBar({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VehicleList[]>([]);
  const [searching, setSearching] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    vehiclesApi
      .list({ search: debouncedQuery, page: 1 })
      .then((res) => { if (!cancelled) setResults(res.data.results.slice(0, 5)); })
      .catch(() => { if (!cancelled) setResults([]); })
      .finally(() => { if (!cancelled) setSearching(false); });
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // Close on click outside — no full-page overlay needed
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/vehicles?search=${encodeURIComponent(query.trim())}`);
    setFocused(false);
    setQuery('');
    onNavigate?.();
  }

  function clear() {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  }

  function pick(id: number) {
    router.push(`/vehicles/${id}`);
    setFocused(false);
    setQuery('');
    onNavigate?.();
  }

  const showDropdown = focused && query.trim().length > 0;

  return (
    <>
      <div ref={containerRef} className="relative z-30 w-full">
        <form onSubmit={submit}>
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200 ${
              focused
                ? 'bg-white ring-2 ring-accent/60 shadow-lg'
                : 'bg-white/10 hover:bg-white/15'
            }`}
          >
            {/* Search icon */}
            <svg
              className={`w-4 h-4 shrink-0 transition-colors ${focused ? 'text-primary' : 'text-white/50'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Buscar marca, modelo, año…"
              className={`flex-1 bg-transparent text-sm outline-none transition-colors ${
                focused
                  ? 'text-foreground placeholder:text-gray-400'
                  : 'text-white placeholder:text-white/40'
              }`}
            />

            {searching && (
              <svg className="w-3.5 h-3.5 animate-spin text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}

            {query && !searching && (
              <button
                type="button"
                onClick={clear}
                className={`shrink-0 transition-colors ${focused ? 'text-gray-400 hover:text-gray-600' : 'text-white/40 hover:text-white/70'}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            {!searching && results.length === 0 && (
              <div className="px-4 py-5 text-center text-sm text-gray-400">
                Sin resultados para{' '}
                <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span>
              </div>
            )}

            {results.length > 0 && (
              <>
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                    Vehículos
                  </p>
                </div>

                {results.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => pick(v.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {v.primary_image ? (
                        <img
                          src={v.primary_image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {v.year} {v.make} {v.model}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {v.mileage.toLocaleString('es-MX')} km
                        {v.condition ? ` · ${v.condition === 'excellent' ? 'Excelente' : v.condition === 'good' ? 'Bueno' : 'Regular'}` : ''}
                      </p>
                    </div>

                    {/* Price + badge */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary">{formatPrice(v.price)}</p>
                      {v.is_reserved && (
                        <span className="text-[10px] text-primary/70 font-medium">Apartado</span>
                      )}
                      {!v.is_available && !v.is_reserved && (
                        <span className="text-[10px] text-gray-400 font-medium">No disp.</span>
                      )}
                    </div>
                  </button>
                ))}

                {/* Footer link */}
                <Link
                  href={`/vehicles?search=${encodeURIComponent(query)}`}
                  onClick={() => { setFocused(false); setQuery(''); onNavigate?.(); }}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-semibold text-accent hover:text-primary hover:bg-accent/5 transition-colors"
                >
                  Ver todos los resultados
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─── BrandsDropdown ───────────────────────────────────────────────────────────

function BrandsDropdown() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const brands = useBrands();

  function enter() {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function leave() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={enter}
        onMouseLeave={leave}
        className="flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors py-1 select-none"
      >
        Marcas
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel — shares mouse handlers to bridge the gap */}
      <div
        onMouseEnter={enter}
        onMouseLeave={leave}
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 transition-all duration-200 origin-top ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Caret */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45" />

        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Explorar por marca
        </p>

        {brands.length === 0 ? (
          <p className="text-sm text-gray-400 py-2">Cargando…</p>
        ) : (
          <div className="grid grid-cols-2 gap-1">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/vehicles?make=${encodeURIComponent(brand)}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-[#EED9B9]/60 hover:text-primary transition-colors font-medium group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary transition-colors shrink-0" />
                {brand}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100">
          <Link
            href="/vehicles"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1 text-xs font-semibold text-accent hover:text-primary transition-colors"
          >
            Ver catálogo completo
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { itemCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const pathname = usePathname();
  const scrolled = useScrolled();
  const brands = useBrands();

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  const isHome = pathname === '/';
  const isTransparent = isHome && !scrolled && !mobileOpen && !mobileSearchOpen;

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  const navLinkClass = (href: string) =>
    `text-sm transition-colors py-1 relative ${
      isActive(href)
        ? 'text-white font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded-full'
        : 'text-white/75 hover:text-white'
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          isTransparent
            ? 'bg-primary-dark/85 backdrop-blur-md'
            : 'bg-primary-dark shadow-lg shadow-black/20'
        }`}
      >
        {/* ── Main bar ── */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-base tracking-tight whitespace-nowrap shrink-0 group"
          >
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-md group-hover:bg-accent/90 transition-colors">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
            </div>
            <span className="text-white">Maya&apos;s Garage</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <Link href="/" className={navLinkClass('/')}>Inicio</Link>
            <Link href="/vehicles" className={navLinkClass('/vehicles')}>Catálogo</Link>
            <BrandsDropdown />
            <Link
              href="/vender"
              className="text-sm text-white/75 hover:text-white transition-colors py-1"
            >
              Vender
            </Link>
            {user?.is_staff && (
              <Link href="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>
            )}
          </div>

          {/* Desktop search */}
          <div className="hidden md:block flex-1 max-w-sm mx-4">
            <SearchBar />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">

            {/* Mobile: search toggle */}
            <button
              onClick={() => setMobileSearchOpen((v) => !v)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                mobileSearchOpen ? 'bg-white/15 text-white' : 'text-white/75 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Buscar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative p-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Carrito"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] bg-accent rounded-full text-[10px] font-bold flex items-center justify-center text-white px-1 shadow">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Auth — desktop */}
            {!isLoading && (
              <div className="hidden md:flex items-center gap-2 ml-1">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                      <div className="w-5 h-5 rounded-full bg-accent/70 flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">
                        {(user?.first_name?.[0] || user?.email?.[0] || '?')}
                      </div>
                      <span className="text-sm text-white/80 max-w-[100px] truncate">
                        {user?.first_name || user?.email}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="text-sm text-white/70 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Salir
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-sm text-white/75 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/auth/register"
                      className="text-sm bg-accent hover:bg-accent/90 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                mobileOpen ? 'bg-white/15 text-white' : 'text-white/75 hover:text-white hover:bg-white/10'
              }`}
              aria-label="Menú"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </nav>

        {/* ── Mobile search bar ── */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 pb-3 border-t border-white/10 pt-3">
            <SearchBar onNavigate={() => setMobileSearchOpen(false)} />
          </div>
        )}

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10">
            <div className="px-4 py-3 space-y-0.5">

              <Link
                href="/"
                className={`flex items-center justify-between py-3 text-sm border-b border-white/5 ${isActive('/') ? 'text-white font-semibold' : 'text-white/80'}`}
              >
                Inicio
                {isActive('/') && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
              </Link>

              <Link
                href="/vehicles"
                className={`flex items-center justify-between py-3 text-sm border-b border-white/5 ${isActive('/vehicles') ? 'text-white font-semibold' : 'text-white/80'}`}
              >
                Catálogo
                {isActive('/vehicles') && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
              </Link>

              <Link
                href="/vender"
                className="flex items-center justify-between py-3 text-sm border-b border-white/5 text-white/80"
              >
                Vender
              </Link>

              {/* Marcas accordion */}
              <div className="border-b border-white/5">
                <button
                  onClick={() => setMobileBrandsOpen((v) => !v)}
                  className="w-full flex items-center justify-between py-3 text-sm text-white/80 hover:text-white transition-colors"
                >
                  <span>Marcas</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${mobileBrandsOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mobileBrandsOpen && (
                  <div className="pb-3 grid grid-cols-2 gap-x-4 gap-y-1">
                    {brands.map((brand) => (
                      <Link
                        key={brand}
                        href={`/vehicles?make=${encodeURIComponent(brand)}`}
                        className="flex items-center gap-2 py-1.5 text-sm text-white/65 hover:text-white transition-colors"
                      >
                        <span className="w-1 h-1 rounded-full bg-white/30 shrink-0" />
                        {brand}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {user?.is_staff && (
                <Link
                  href="/dashboard"
                  className={`flex items-center justify-between py-3 text-sm border-b border-white/5 ${isActive('/dashboard') ? 'text-white font-semibold' : 'text-white/80'}`}
                >
                  Dashboard
                  {isActive('/dashboard') && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                </Link>
              )}

              {/* Auth section */}
              <div className="pt-3 space-y-1">
                {!isLoading && (
                  isAuthenticated ? (
                    <>
                      <p className="text-xs text-white/40 pb-1">
                        {user?.first_name ? `Hola, ${user.first_name}` : user?.email}
                      </p>
                      <button
                        onClick={() => { logout(); setMobileOpen(false); }}
                        className="w-full text-left py-2.5 text-sm text-white/80 hover:text-white transition-colors"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block py-2.5 text-sm text-white/80 hover:text-white transition-colors"
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        href="/auth/register"
                        className="block py-2.5 text-sm text-white font-semibold"
                      >
                        Registrarse →
                      </Link>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
