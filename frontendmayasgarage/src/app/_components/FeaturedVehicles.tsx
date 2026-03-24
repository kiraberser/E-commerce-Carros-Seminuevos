'use client';

import Link from 'next/link';

import { VehicleCard } from '@/features/vehicles/components/VehicleCard';
import { useVehicles } from '@/features/vehicles/hooks/useVehicles';

export function FeaturedVehicles() {
  const { vehicles, loading, error } = useVehicles({ is_available: true, page: 1 });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
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
    );
  }

  if (error) {
    return <p className="text-gray-400 text-sm text-center py-8">{error}</p>;
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        <p>Próximamente agregaremos vehículos al catálogo.</p>
        <Link href="/vehicles" className="text-accent hover:underline mt-2 inline-block">Ver catálogo</Link>
      </div>
    );
  }

  const featured = vehicles.slice(0, 3);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {featured.map((v) => (
        <VehicleCard key={v.id} vehicle={v} />
      ))}
    </div>
  );
}
