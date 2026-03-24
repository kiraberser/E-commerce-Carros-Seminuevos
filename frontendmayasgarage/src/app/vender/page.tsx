'use client';

import Link from 'next/link';
import { useState } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: '01',
    title: 'Cuéntanos sobre tu auto',
    desc: 'Llena el formulario con los datos de tu vehículo. Marca, modelo, año, kilometraje y condición. Toma menos de 3 minutos.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Recibe tu cotización',
    desc: 'Nuestro equipo revisa la información y te contacta con una oferta justa y transparente basada en el mercado de Veracruz.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Completa la venta',
    desc: 'Acepta la oferta, entrega tu auto y recibe tu pago de forma segura. Sin trámites complicados ni esperas interminables.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const PERKS = [
  {
    title: 'Pago inmediato',
    desc: 'Recibes tu dinero el mismo día que cerramos el trato. Sin cheques, sin esperas.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Sin intermediarios',
    desc: 'Tratas directamente con nosotros. No hay comisiones ocultas ni terceros involucrados.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Proceso 100% seguro',
    desc: 'Documentación verificada y proceso legal transparente. Tu auto en buenas manos.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Precio justo garantizado',
    desc: 'Valuación basada en el mercado real de Veracruz. Sin ofertas por debajo del valor.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
];

const FAQS = [
  {
    q: '¿Qué tipos de autos compran?',
    a: 'Compramos la mayoría de marcas y modelos con menos de 15 años de antigüedad. El auto debe estar en condición manejable y con documentación en regla.',
  },
  {
    q: '¿Cuánto tiempo tarda el proceso?',
    a: 'Desde que llenas el formulario hasta recibir tu pago puede tardar entre 24 y 72 horas. El proceso de inspección y firma suele hacerse en el mismo día.',
  },
  {
    q: '¿Necesito llevar el auto al local?',
    a: 'Sí, la inspección final se hace en nuestras instalaciones en Veracruz Puerto. Puedes agendar la cita al horario que más te convenga.',
  },
  {
    q: '¿La cotización me obliga a vender?',
    a: 'No. La cotización es completamente gratuita y sin compromiso. Solo decides si aceptas cuando estés 100% de acuerdo con la oferta.',
  },
];

// ─── Form ─────────────────────────────────────────────────────────────────────

interface FormData {
  make: string;
  model: string;
  year: string;
  mileage: string;
  condition: string;
  color: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

const EMPTY: FormData = {
  make: '', model: '', year: '', mileage: '', condition: '', color: '',
  name: '', phone: '', email: '', notes: '',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VenderPage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/60 focus:bg-white/8 transition-all';
  const labelClass = 'block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5';

  return (
    <div className="min-h-screen" style={{ background: '#0D0002' }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(155,15,6,0.35) 0%, transparent 70%)',
          }}
        />
        {/* Grid lines */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Tag */}
            <span
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] mb-6 px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(213,62,15,0.15)', color: '#F4A261', border: '1px solid rgba(213,62,15,0.25)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Vende tu auto
            </span>

            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6"
              style={{ color: 'white' }}
            >
              Tu auto vale{' '}
              <span
                className="relative"
                style={{
                  background: 'linear-gradient(135deg, #D53E0F 0%, #F4A261 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                más de lo
              </span>{' '}
              que crees.
            </h1>

            <p className="text-lg text-white/50 leading-relaxed max-w-xl mb-10">
              En Maya&apos;s Garage compramos tu auto de forma rápida, justa y sin complicaciones.
              Cotización gratuita, pago el mismo día.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#cotizar"
                className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl text-sm transition-all active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #D53E0F 0%, #9B0F06 100%)',
                  color: 'white',
                  boxShadow: '0 0 40px rgba(213,62,15,0.3)',
                }}
              >
                Cotizar mi auto gratis
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <Link
                href="/vehicles"
                className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-xl text-sm transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
              >
                Ver catálogo
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-px mt-20 border border-white/[0.07] rounded-2xl overflow-hidden max-w-2xl">
            {[
              { value: '5 días', label: 'Tiempo promedio de venta' },
              { value: '100%', label: 'Proceso transparente' },
              { value: '$0', label: 'Sin comisiones ocultas' },
            ].map((s, i) => (
              <div
                key={i}
                className="flex-1 min-w-[120px] px-6 py-5"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <p className="text-2xl font-black" style={{ color: '#F4A261' }}>{s.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks ─────────────────────────────────────────────────────────── */}
      <section className="py-16 border-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {PERKS.map((p, i) => (
              <div
                key={i}
                className="p-6 group"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ background: 'rgba(213,62,15,0.12)', color: '#D53E0F' }}
                >
                  {p.icon}
                </div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: 'white' }}>{p.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(213,62,15,0.8)' }}>
              Así de fácil
            </p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: 'white' }}>
              3 pasos para vender
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="relative p-8 rounded-2xl group"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="absolute top-12 -right-3 w-6 h-px hidden md:block"
                    style={{ background: 'rgba(213,62,15,0.3)' }}
                  />
                )}

                {/* Number */}
                <div className="flex items-start justify-between mb-8">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-all group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, rgba(213,62,15,0.2), rgba(155,15,6,0.2))',
                      border: '1px solid rgba(213,62,15,0.25)',
                      color: '#F4A261',
                    }}
                  >
                    {step.n}
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.1)' }}>{step.icon}</span>
                </div>

                <h3 className="text-lg font-bold mb-3" style={{ color: 'white' }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ──────────────────────────────────────────────────────────── */}
      <section id="cotizar" className="py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

            {/* Left: copy */}
            <div className="lg:sticky lg:top-28 space-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: 'rgba(213,62,15,0.8)' }}>
                  Cotización gratuita
                </p>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight" style={{ color: 'white' }}>
                  ¿Listo para vender<br />
                  <span style={{
                    background: 'linear-gradient(135deg, #D53E0F, #F4A261)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    tu auto?
                  </span>
                </h2>
                <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Llena el formulario y te contactamos en menos de 24 horas con una oferta personalizada. Sin compromiso.
                </p>
              </div>

              {/* Trust badges */}
              <div className="space-y-3">
                {[
                  'Cotización sin costo ni compromiso',
                  'Respuesta en menos de 24 horas',
                  'Pago seguro el mismo día del cierre',
                  'Asesoría en trámites incluida',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(213,62,15,0.15)' }}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#D53E0F' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Contact direct */}
              <div
                className="p-5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  También puedes contactarnos directo
                </p>
                <a
                  href="tel:+522291234567"
                  className="flex items-center gap-3 group"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(213,62,15,0.12)' }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#D53E0F' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold group-hover:opacity-100 transition-opacity" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    +52 229 123 4567
                  </span>
                </a>
              </div>
            </div>

            {/* Right: form */}
            <div
              className="rounded-2xl p-8"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {submitted ? (
                <div className="text-center py-12 space-y-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ background: 'rgba(213,62,15,0.15)' }}
                  >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#D53E0F' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black" style={{ color: 'white' }}>¡Solicitud enviada!</h3>
                  <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Nos pondremos en contacto contigo en menos de 24 horas con tu cotización personalizada.
                  </p>
                  <button
                    onClick={() => { setForm(EMPTY); setSubmitted(false); }}
                    className="text-sm font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
                    style={{ color: '#F4A261' }}
                  >
                    Enviar otra cotización
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Datos del vehículo
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Marca</label>
                        <input name="make" required value={form.make} onChange={handleChange} placeholder="Volkswagen" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Modelo</label>
                        <input name="model" required value={form.model} onChange={handleChange} placeholder="Jetta" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Año</label>
                        <input name="year" required type="number" min={1990} max={2025} value={form.year} onChange={handleChange} placeholder="2018" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Kilometraje</label>
                        <input name="mileage" required type="number" min={0} value={form.mileage} onChange={handleChange} placeholder="85,000" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Condición</label>
                        <select name="condition" required value={form.condition} onChange={handleChange} className={inputClass}>
                          <option value="" disabled>Selecciona</option>
                          <option value="excellent">Excelente</option>
                          <option value="good">Buena</option>
                          <option value="fair">Regular</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Color</label>
                        <input name="color" value={form.color} onChange={handleChange} placeholder="Blanco" className={inputClass} />
                      </div>
                    </div>
                  </div>

                  <div
                    className="border-t"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest mb-4 mt-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Tus datos de contacto
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Nombre</label>
                          <input name="name" required value={form.name} onChange={handleChange} placeholder="Juan García" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Teléfono</label>
                          <input name="phone" required type="tel" value={form.phone} onChange={handleChange} placeholder="+52 229 000 0000" className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Email</label>
                        <input name="email" required type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Información adicional (opcional)</label>
                        <textarea
                          name="notes"
                          value={form.notes}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Extras, historial de servicio, razón de venta..."
                          className={inputClass + ' resize-none'}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full font-bold py-4 rounded-xl text-sm transition-all active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #D53E0F 0%, #9B0F06 100%)',
                      color: 'white',
                      boxShadow: '0 0 30px rgba(213,62,15,0.25)',
                    }}
                  >
                    Solicitar cotización gratuita →
                  </button>

                  <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    Sin compromiso. Tus datos están seguros.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-24 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black mb-12 text-center" style={{ color: 'white' }}>
            Preguntas frecuentes
          </h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  background: openFaq === i ? 'rgba(213,62,15,0.07)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${openFaq === i ? 'rgba(213,62,15,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'background 0.2s, border-color 0.2s',
                }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm pr-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {faq.q}
                  </span>
                  <svg
                    className="w-4 h-4 shrink-0 transition-transform duration-200"
                    style={{
                      color: openFaq === i ? '#D53E0F' : 'rgba(255,255,255,0.3)',
                      transform: openFaq === i ? 'rotate(45deg)' : 'none',
                    }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-4xl font-black" style={{ color: 'white' }}>
            ¿Tienes más preguntas?
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Visítanos en Veracruz Puerto o escríbenos. Estamos aquí para ayudarte.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="#cotizar"
              className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-xl text-sm transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #D53E0F, #9B0F06)',
                color: 'white',
              }}
            >
              Cotizar ahora
            </a>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded-xl text-sm transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
