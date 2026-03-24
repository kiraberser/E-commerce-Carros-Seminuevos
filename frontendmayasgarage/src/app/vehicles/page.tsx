'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { FilterBar } from '@/features/vehicles/components/FilterBar';
import { VehicleCard } from '@/features/vehicles/components/VehicleCard';
import { useVehicles } from '@/features/vehicles/hooks/useVehicles';
import type { VehicleFilters } from '@/shared/types';

function CatalogContent() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);

  const filters: VehicleFilters = {
    make: searchParams.get('make') ?? undefined,
    price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : undefined,
    price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : undefined,
    year_min: searchParams.get('year_min') ? Number(searchParams.get('year_min')) : undefined,
    fuel_type: searchParams.get('fuel_type') ?? undefined,
    transmission: searchParams.get('transmission') ?? undefined,
    page,
  };

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [searchParams.toString()]);

  const { vehicles, count, loading, error } = useVehicles(filters);
  const totalPages = Math.ceil(count / 12);

  return (
    <div className="space-y-6">
      <FilterBar />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {loading ? 'Cargando…' : `${count} vehículo${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Grid */}
      {error ? (
        <p className="text-red-400 text-sm text-center py-12">{error}</p>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-40" />
                <div className="h-5 bg-gray-100 rounded w-28 mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm space-y-3">
          <p className="text-2xl">🚗</p>
          <p>No encontramos vehículos con esos filtros.</p>
          <Link href="/vehicles" className="text-accent hover:underline font-medium">Limpiar filtros</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:border-primary disabled:opacity-40 transition-colors"
          >
            ← Anterior
          </button>
          <span className="px-4 py-2 text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:border-primary disabled:opacity-40 transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-foreground mb-8">Catálogo de vehículos</h1>
      <Suspense fallback={<div className="text-sm text-gray-400">Cargando filtros…</div>}>
        <CatalogContent />
      </Suspense>
    </div>
  );
}
