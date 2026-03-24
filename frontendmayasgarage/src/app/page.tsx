import Link from 'next/link';

import { FeaturedVehicles } from './_components/FeaturedVehicles';
import { HowItWorks } from './_components/HowItWorks';
import { SloganCarousel } from './_components/SloganCarousel';

// ─── Why section data ─────────────────────────────────────────────────────────

const WHY_ITEMS = [
  {
    title: 'Vehículos verificados',
    description: 'Cada auto pasa por una revisión técnica completa antes de estar disponible. Sin sorpresas, solo calidad.',
    icon: (
      <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Financiamiento flexible',
    description: 'Te asesoramos para encontrar el plan de pago que mejor se adapte a tu presupuesto y situación.',
    icon: (
      <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    title: 'Servicio personalizado',
    description: 'Nuestro equipo te acompaña en cada paso del proceso, desde la búsqueda hasta que el auto está en tus manos.',
    icon: (
      <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '50+', label: 'Autos vendidos' },
  { value: '5', label: 'Años de experiencia' },
  { value: '100%', label: 'Verificados' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative text-white overflow-hidden">
        {/* Background video */}
        <video
          src="/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark overlay so text stays readable */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        {/* Dot grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-60 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-36 md:pb-20">
          {/* Location pill */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 text-white/90 px-3.5 py-1.5 rounded-full mb-6 border border-white/10">
            <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Veracruz Puerto, México
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] max-w-3xl tracking-tight">
            Encuentra tu{' '}
            <span
              className="relative inline-block"
              style={{ color: '#F4A261' }}
            >
              próximo auto
              <svg
                aria-hidden
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 300 8"
                fill="none"
              >
                <path d="M2 6 Q75 2 150 5 Q225 8 298 4" stroke="#D53E0F" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>{' '}
            en Maya&apos;s Garage
          </h1>

          <p className="text-white/70 text-lg mt-6 max-w-xl leading-relaxed">
            Autos seminuevos de gama media, verificados y a precios transparentes.
            Tu próximo viaje empieza aquí, en el puerto.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              href="/vehicles"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-accent/30 text-sm active:scale-95"
            >
              Ver catálogo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors border border-white/10 text-sm active:scale-95"
            >
              Crear cuenta
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-12 pt-10 border-t border-white/10">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-white/50 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Slogan Carousel ───────────────────────────────────────────────── */}
      <SloganCarousel />

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── Why Maya's Garage ─────────────────────────────────────────────── */}
      <section className="bg-primary-dark py-24 overflow-hidden relative">
        {/* Subtle pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16">
            <p className="text-accent text-xs font-bold uppercase tracking-[0.2em] mb-3">
              ¿Por qué elegirnos?
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              La garantía<br />
              <span className="text-white/40">Maya&apos;s Garage</span>
            </h2>
          </div>

          {/* Feature columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {WHY_ITEMS.map((item, i) => (
              <div
                key={item.title}
                className="group py-8 md:py-0 md:px-10 first:md:pl-0 last:md:pr-0"
              >
                {/* Large decorative number */}
                <p
                  aria-hidden
                  className="text-[80px] font-black leading-none mb-4 select-none"
                  style={{ color: 'rgba(255,255,255,0.04)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>

                {/* Icon */}
                <div className="w-13 h-13 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 w-14 h-14 group-hover:bg-accent/20 transition-colors">
                  {item.icon}
                </div>

                {/* Content */}
                <h3 className="text-white font-bold text-xl mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Vehicles ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent mb-2">
              Inventario actual
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Vehículos destacados
            </h2>
          </div>
          <Link
            href="/vehicles"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-primary transition-colors"
          >
            Ver todos
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <FeaturedVehicles />

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-primary transition-colors"
          >
            Ver todos los vehículos →
          </Link>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20"
        style={{
          background: 'linear-gradient(135deg, #9B0F06 0%, #5E0006 100%)',
        }}
      >
        {/* Decoration */}
        <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/[0.03] pointer-events-none" />
        <div aria-hidden className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-accent/10 pointer-events-none" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center space-y-5">
          <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">
            ¿Listo para el siguiente paso?
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
            El auto que buscas<br />está en nuestro catálogo
          </h2>
          <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
            Filtra por precio, año, combustible, transmisión y más. Encuentra el tuyo hoy.
          </p>
          <Link
            href="/vehicles"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-10 py-3.5 rounded-xl transition-all shadow-xl shadow-black/20 text-sm active:scale-95 mt-2"
          >
            Explorar catálogo
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
