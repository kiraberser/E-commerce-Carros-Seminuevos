import Link from 'next/link';

import type { VehicleList } from '@/shared/types';

interface CartItemProps {
  vehicle: VehicleList;
  onRemove: (id: number) => void;
}

function formatPrice(price: string): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export function CartItem({ vehicle, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {vehicle.primary_image ? (
          <img
            src={vehicle.primary_image}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/vehicles/${vehicle.id}`} className="font-semibold text-foreground hover:text-accent line-clamp-1">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Link>
        <p className="text-sm text-primary font-bold mt-0.5">{formatPrice(vehicle.price)}</p>
      </div>
      <button
        onClick={() => onRemove(vehicle.id)}
        className="text-gray-300 hover:text-red-400 transition-colors text-xl leading-none p-1"
      >
        ×
      </button>
    </div>
  );
}
