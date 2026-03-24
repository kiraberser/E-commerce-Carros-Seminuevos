'use client';

import { useEffect, useRef, useState } from 'react';

const SLOGANS = [
  { text: 'Tu próximo auto está aquí,\nen el corazón de Veracruz.', accent: 'Veracruz.' },
  { text: 'Calidad seminueva.\nPrecio justo. Confianza real.', accent: 'Confianza real.' },
  { text: 'Cada auto verificado.\nCada cliente, una prioridad.', accent: 'una prioridad.' },
  { text: 'Encontrar el auto correcto\nno debería ser complicado.', accent: 'no debería ser complicado.' },
  { text: 'Donde los sueños ruedan\nsobre cuatro llantas.', accent: 'sobre cuatro llantas.' },
];

export function SloganCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = (idx: number, dir: 'next' | 'prev') => {
    if (animating) return;
    setAnimating(true);
    setPrev(current);
    setDirection(dir);
    setCurrent(idx);
    setTimeout(() => {
      setPrev(null);
      setAnimating(false);
    }, 500);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      go((current + 1) % SLOGANS.length, 'next');
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, animating]);

  const slogan = SLOGANS[current];
  const prevSlogan = prev !== null ? SLOGANS[prev] : null;

  const getSlide = (isEntering: boolean) => {
    if (direction === 'next') return isEntering ? 'translateX(60px)' : 'translateX(-60px)';
    return isEntering ? 'translateX(-60px)' : 'translateX(60px)';
  };

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      style={{ background: 'linear-gradient(160deg, #1A0002 0%, #3D0004 50%, #5E0006 100%)' }}
    >
      {/* Subtle grain texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Large decorative number */}
      <div
        aria-hidden
        className="absolute right-8 top-1/2 -translate-y-1/2 text-[180px] sm:text-[220px] font-black leading-none select-none pointer-events-none hidden lg:block"
        style={{ color: 'rgba(255,255,255,0.03)', fontVariantNumeric: 'tabular-nums' }}
      >
        {String(current + 1).padStart(2, '0')}
      </div>

      {/* Accent line left */}
      <div
        aria-hidden
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-24 rounded-r-full"
        style={{ background: 'linear-gradient(to bottom, #D53E0F, #9B0F06)' }}
      />

      <div className="relative max-w-5xl mx-auto px-8 sm:px-12 lg:px-16">
        <div className="flex items-center gap-6 mb-8">
          {/* Label */}
          <span
            className="text-[10px] font-bold uppercase tracking-[0.25em] px-3 py-1 rounded-full border"
            style={{ color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.1)' }}
          >
            Maya&apos;s Garage
          </span>
          {/* Progress bar */}
          <div className="flex-1 max-w-32 h-px" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((current + 1) / SLOGANS.length) * 100}%`,
                background: 'linear-gradient(to right, #D53E0F, #F4A261)',
              }}
            />
          </div>
          <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {String(current + 1).padStart(2, '0')} / {String(SLOGANS.length).padStart(2, '0')}
          </span>
        </div>

        {/* Slide container */}
        <div className="relative overflow-hidden" style={{ minHeight: '120px' }}>
          {/* Exiting slide */}
          {prevSlogan && (
            <p
              aria-hidden
              className="absolute inset-0 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.15] tracking-tight whitespace-pre-line pointer-events-none"
              style={{
                color: 'rgba(255,255,255,0.9)',
                opacity: 0,
                transform: getSlide(false),
                transition: 'opacity 0.45s ease, transform 0.45s ease',
              }}
            >
              {prevSlogan.text}
            </p>
          )}

          {/* Entering slide */}
          <p
            key={current}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.15] tracking-tight whitespace-pre-line"
            style={{
              color: 'rgba(255,255,255,0.9)',
              opacity: animating ? 0 : 1,
              transform: animating ? getSlide(true) : 'translateX(0)',
              transition: animating
                ? 'none'
                : 'opacity 0.45s ease, transform 0.45s ease',
            }}
          >
            {slogan.text.split(slogan.accent).map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <span
                    className="relative inline"
                    style={{ color: '#F4A261' }}
                  >
                    {slogan.accent}
                  </span>
                </span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-10">
          {/* Prev */}
          <button
            onClick={() => go((current - 1 + SLOGANS.length) % SLOGANS.length, 'prev')}
            aria-label="Anterior"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLButtonElement).style.color = 'white';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {SLOGANS.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i, i > current ? 'next' : 'prev')}
                aria-label={`Frase ${i + 1}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 24 : 6,
                  height: 6,
                  background: i === current
                    ? 'linear-gradient(to right, #D53E0F, #F4A261)'
                    : 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => go((current + 1) % SLOGANS.length, 'next')}
            aria-label="Siguiente"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.5)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
              (e.currentTarget as HTMLButtonElement).style.color = 'white';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
