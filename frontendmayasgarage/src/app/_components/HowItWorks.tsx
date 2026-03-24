'use client';

import Link from 'next/link';
import { useState } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const TABS = {
  buy: {
    label: 'Compra',
    cta: { text: 'Ver autos', href: '/vehicles' },
    headline: 'El auto que quieres,\nmás cerca de lo que imaginas',
    steps: [
      {
        title: 'Encuentra tu auto ideal',
        description: 'Elige entre los autos disponibles en nuestro catálogo. Filtra por precio, marca, año y más.',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
      },
      {
        title: 'Elige tu forma de pago',
        description: 'Compra al contado o con un plan de pagos que se ajuste a tu presupuesto y situación.',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
      },
      {
        title: 'Recoge tu auto',
        description: 'Agenda una cita, firma la documentación y llévate tu auto. Rápido, seguro y sin complicaciones.',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        ),
      },
    ],
  },
  sell: {
    label: 'Vende',
    cta: { text: 'Cotizar mi auto', href: '/sell' },
    headline: 'Vende tu auto de forma\nrápida y sin complicaciones',
    steps: [
      {
        title: 'Cuéntanos sobre tu auto',
        description: 'Comparte los datos y fotos de tu vehículo. El proceso toma menos de 5 minutos.',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        title: 'Recibe tu cotización',
        description: 'Te damos una oferta justa y transparente basada en el mercado actual de Veracruz.',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
      {
        title: 'Completa la venta',
        description: 'Acepta la oferta, entrega tu auto y recibe tu pago de forma segura. Así de sencillo.',
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    ],
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function HowItWorks() {
  const [active, setActive] = useState<'buy' | 'sell'>('buy');
  const tab = TABS[active];

  return (
    <section id="como-funciona" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: heading + tab + CTA ── */}
          <div className="space-y-8">
            {/* Tab switcher */}
            <div className="inline-flex bg-gray-100 p-1 rounded-xl gap-1">
              {(['buy', 'sell'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    active === key
                      ? 'bg-primary-dark text-white shadow-sm'
                      : 'text-gray-500 hover:text-foreground'
                  }`}
                >
                  {TABS[key].label}
                </button>
              ))}
            </div>

            {/* Headline */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent mb-3">
                ¿Cómo funciona?
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-[1.1] tracking-tight whitespace-pre-line">
                {tab.headline}
              </h2>
            </div>

            {/* CTA */}
            <Link
              href={tab.cta.href}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-accent/25 text-sm active:scale-95"
            >
              {tab.cta.text}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Decorative number */}
            <p
              aria-hidden
              className="text-[130px] font-black leading-none select-none -mb-4 hidden lg:block"
              style={{ color: 'rgba(0,0,0,0.03)' }}
            >
              {active === 'buy' ? '01' : '02'}
            </p>
          </div>

          {/* ── Right: numbered steps ── */}
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-primary/20 via-accent/20 to-transparent hidden sm:block" />

            <div className="space-y-0">
              {tab.steps.map((step, i) => (
                <div
                  key={step.title}
                  className="flex gap-5 relative group py-7 border-b border-gray-100 last:border-0"
                >
                  {/* Number circle */}
                  <div className="shrink-0 relative z-10">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all duration-300 shadow-sm
                        ${i === 0
                          ? 'bg-primary text-white shadow-primary/30'
                          : i === 1
                          ? 'bg-accent text-white shadow-accent/30'
                          : 'bg-primary-dark text-white shadow-primary-dark/30'
                        } group-hover:scale-110`}
                    >
                      {i + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-gray-300">{step.icon}</span>
                      <h3 className="font-bold text-foreground text-base leading-snug">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
