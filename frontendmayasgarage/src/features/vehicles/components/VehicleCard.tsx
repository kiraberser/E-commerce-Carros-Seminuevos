import Link from 'next/link';

import type { VehicleList } from '@/shared/types';

interface VehicleCardProps {
  vehicle: VehicleList;
}

const TRANS_ES: Record<string, string> = {
  manual: 'Manual',
  automatic: 'Automático',
  cvt: 'CVT',
};

const FUEL_ES: Record<string, string> = {
  gasoline: 'Gasolina',
  diesel: 'Diésel',
  hybrid: 'Híbrido',
  electric: 'Eléctrico',
};

const COND_ES: Record<string, { label: string; color: string }> = {
  excellent: { label: 'Excelente', color: 'bg-emerald-100 text-emerald-700' },
  good: { label: 'Bueno', color: 'bg-blue-100 text-blue-700' },
  fair: { label: 'Regular', color: 'bg-amber-100 text-amber-700' },
};

function formatPrice(price: string): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const cond = vehicle.condition ? COND_ES[vehicle.condition] : null;

  return (
    <Link href={`/vehicles/${vehicle.id}`} className="group block">
      <article
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm
                   transition-all duration-300 ease-out
                   group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-black/10"
      >
        {/* ── Image ── */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          {vehicle.primary_image ? (
            <img
              src={vehicle.primary_image}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M19 9l-2.586-5.172A2 2 0 0014.628 2H9.372a2 2 0 00-1.786 1.828L5 9M19 9H5M19 9l1.5 6M5 9L3.5 15M3.5 15A2 2 0 005.5 17h13a2 2 0 002-1.886L21.5 9M3.5 15h17M7 17v2M17 17v2" />
              </svg>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

          {/* Price — bottom right */}
          <div className="absolute bottom-3 right-3">
            <span className="bg-primary text-white text-sm font-extrabold px-3 py-1.5 rounded-xl shadow-lg shadow-primary/40 tracking-tight">
              {formatPrice(vehicle.price)}
            </span>
          </div>

          {/* Status badges — top left */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {vehicle.is_reserved && (
              <span className="bg-primary/85 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow">
                Apartado
              </span>
            )}
            {!vehicle.is_available && !vehicle.is_reserved && (
              <span className="bg-gray-800/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow">
                Vendido
              </span>
            )}
            {vehicle.is_negotiable && vehicle.is_available && (
              <span className="bg-accent/85 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow">
                Negociable
              </span>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-4 space-y-2.5">
          {/* Make + year */}
          <p className="text-[11px] text-gray-400 uppercase tracking-[0.12em] font-semibold">
            {vehicle.make} &nbsp;·&nbsp; {vehicle.year}
          </p>

          {/* Model */}
          <h3 className="font-bold text-foreground text-lg leading-tight group-hover:text-primary transition-colors duration-200">
            {vehicle.model}
          </h3>

          {/* Spec pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            <span className="text-[11px] text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
              {vehicle.mileage.toLocaleString('es-MX')} km
            </span>
            {vehicle.transmission && (
              <span className="text-[11px] text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                {TRANS_ES[vehicle.transmission] ?? vehicle.transmission}
              </span>
            )}
            {vehicle.fuel_type && (
              <span className="text-[11px] text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                {FUEL_ES[vehicle.fuel_type] ?? vehicle.fuel_type}
              </span>
            )}
            {cond && (
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${cond.color}`}>
                {cond.label}
              </span>
            )}
          </div>
        </div>

        {/* ── Bottom accent bar (slides in on hover) ── */}
        <div
          className="h-[3px] bg-gradient-to-r from-primary via-accent to-accent/50
                     origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        />
      </article>
    </Link>
  );
}
