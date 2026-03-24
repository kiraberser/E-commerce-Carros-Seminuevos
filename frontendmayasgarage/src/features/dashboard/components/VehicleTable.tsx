'use client';

import type { VehicleList } from '@/shared/types';

interface VehicleTableProps {
  vehicles: VehicleList[];
  onEdit: (vehicle: VehicleList) => void;
  onDelete: (id: number) => void;
}

function formatPrice(price: string): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export function VehicleTable({ vehicles, onEdit, onDelete }: VehicleTableProps) {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        No hay vehículos registrados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Vehículo</th>
            <th className="px-4 py-3 text-right">Precio</th>
            <th className="px-4 py-3 text-center">Estado</th>
            <th className="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-50">
          {vehicles.map((v) => (
            <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 text-gray-400 font-mono">#{v.id}</td>
              <td className="px-4 py-3">
                <div className="font-semibold text-foreground">{v.year} {v.make} {v.model}</div>
                <div className="text-gray-400 text-xs flex items-center gap-2">
                  <span>{v.mileage.toLocaleString('es-MX')} km · {v.condition || '—'}</span>
                  {v.sku && <span className="font-mono text-gray-300">{v.sku}</span>}
                </div>
              </td>
              <td className="px-4 py-3 text-right font-semibold text-primary">{formatPrice(v.price)}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex flex-col gap-1 items-center">
                  {v.is_reserved && (
                    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">Apartado</span>
                  )}
                  {!v.is_available && (
                    <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">No disponible</span>
                  )}
                  {v.is_available && !v.is_reserved && (
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Disponible</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(v)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-background hover:bg-primary/10 text-primary font-medium transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(v.id)}
                    className="text-xs px-3 py-1.5 rounded-lg hover:bg-red-50 text-red-400 font-medium transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
