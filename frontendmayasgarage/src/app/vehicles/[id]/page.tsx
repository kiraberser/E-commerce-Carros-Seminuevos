'use client';

import Link from 'next/link';
import { use, useState } from 'react';

import { useAuth } from '@/features/auth/AuthContext';
import { useCart } from '@/features/cart/CartContext';
import { CommentsSection } from '@/features/comments/components/CommentsSection';
import { ReserveButton } from '@/features/reservations/components/ReserveButton';
import { TechSpecsTable } from '@/features/vehicles/components/TechSpecsTable';
import { VehicleGallery } from '@/features/vehicles/components/VehicleGallery';
import { useVehicle } from '@/features/vehicles/hooks/useVehicle';
import type { Vehicle } from '@/shared/types';

function formatPrice(price: string): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(Number(price));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VehicleDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const vehicleId = Number(id);
  const { vehicle: initialVehicle, loading, error } = useVehicle(vehicleId);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Sync local state when vehicle loads
  const displayVehicle = vehicle ?? initialVehicle;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
        <div className="aspect-video bg-gray-200 rounded-2xl mb-6" />
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-64" />
          <div className="h-10 bg-gray-200 rounded w-48" />
        </div>
      </div>
    );
  }

  if (error || !displayVehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-gray-400 text-lg mb-4">Vehículo no encontrado.</p>
        <Link href="/vehicles" className="text-accent hover:underline font-medium">← Volver al catálogo</Link>
      </div>
    );
  }

  const inCart = isInCart(displayVehicle.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/vehicles" className="hover:text-accent transition-colors">Catálogo</Link>
        <span>/</span>
        <span className="text-foreground">{displayVehicle.year} {displayVehicle.make} {displayVehicle.model}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Gallery + Specs */}
        <div className="lg:col-span-2 space-y-6">
          <VehicleGallery images={displayVehicle.images} alt={`${displayVehicle.year} ${displayVehicle.make} ${displayVehicle.model}`} />
          <TechSpecsTable vehicle={displayVehicle} />

          {/* Description */}
          {displayVehicle.description && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-foreground text-lg mb-3">Descripción</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{displayVehicle.description}</p>
            </div>
          )}

          {/* Comments */}
          <CommentsSection vehicleId={vehicleId} />
        </div>

        {/* Right: Price + Actions */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-20 space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-gray-400 uppercase tracking-wide font-medium">{displayVehicle.make}</p>
                {displayVehicle.sku && (
                  <span className="text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md select-all">
                    {displayVehicle.sku}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-foreground mt-0.5">
                {displayVehicle.model} <span className="text-gray-400 font-normal">{displayVehicle.year}</span>
              </h1>
            </div>

            {/* Price */}
            <div>
              <p className="text-3xl font-extrabold text-primary">{formatPrice(displayVehicle.price)}</p>
              {displayVehicle.is_negotiable && (
                <span className="inline-block text-xs text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded-full mt-1">
                  Precio negociable
                </span>
              )}
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              {displayVehicle.is_reserved && (
                <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                  Apartado
                </span>
              )}
              {!displayVehicle.is_available && (
                <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">
                  No disponible
                </span>
              )}
              {displayVehicle.is_available && !displayVehicle.is_reserved && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Disponible
                </span>
              )}
            </div>

            {/* Actions */}
            {displayVehicle.is_available && (
              <div className="space-y-3">
                {/* Add to cart */}
                <button
                  onClick={() => inCart ? removeFromCart(displayVehicle.id) : addToCart(displayVehicle)}
                  className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors ${
                    inCart
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                      : 'bg-accent hover:bg-primary text-white'
                  }`}
                >
                  {inCart ? '✓ En tu selección' : 'Agregar a selección'}
                </button>

                {/* Reserve */}
                {isAuthenticated && (
                  <ReserveButton vehicle={displayVehicle} onUpdate={(updated) => setVehicle(updated)} />
                )}
                {!isAuthenticated && (
                  <p className="text-xs text-center text-gray-400">
                    <Link href="/auth/login" className="text-accent hover:underline font-medium">Inicia sesión</Link> para apartar este vehículo
                  </p>
                )}
              </div>
            )}

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-50 text-sm">
              <div>
                <p className="text-xs text-gray-400">Kilometraje</p>
                <p className="font-semibold text-foreground">{displayVehicle.mileage.toLocaleString('es-MX')} km</p>
              </div>
              {displayVehicle.fuel_type && (
                <div>
                  <p className="text-xs text-gray-400">Combustible</p>
                  <p className="font-semibold text-foreground capitalize">{displayVehicle.fuel_type}</p>
                </div>
              )}
              {displayVehicle.transmission && (
                <div>
                  <p className="text-xs text-gray-400">Transmisión</p>
                  <p className="font-semibold text-foreground capitalize">{displayVehicle.transmission}</p>
                </div>
              )}
              {displayVehicle.color && (
                <div>
                  <p className="text-xs text-gray-400">Color</p>
                  <p className="font-semibold text-foreground capitalize">{displayVehicle.color}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
