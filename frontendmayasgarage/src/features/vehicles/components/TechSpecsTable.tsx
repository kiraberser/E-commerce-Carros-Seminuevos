import type { Vehicle } from '@/shared/types';

interface TechSpecsTableProps {
  vehicle: Vehicle;
}

const LABEL: Record<string, string> = {
  sku: 'SKU',
  year: 'Año',
  engine: 'Motor',
  transmission: 'Transmisión',
  fuel_type: 'Combustible',
  color: 'Color',
  doors: 'Puertas',
  mileage: 'Kilometraje',
  condition: 'Condición',
};

export function TechSpecsTable({ vehicle }: TechSpecsTableProps) {
  const specs: [string, string | number | null][] = [
    ['sku', vehicle.sku || null],
    ['year', vehicle.year],
    ['engine', vehicle.engine || null],
    ['transmission', vehicle.transmission || null],
    ['fuel_type', vehicle.fuel_type || null],
    ['color', vehicle.color || null],
    ['doors', vehicle.doors ?? null],
    ['mileage', vehicle.mileage ? `${vehicle.mileage.toLocaleString('es-MX')} km` : null],
    ['condition', vehicle.condition || null],
  ];

  const visible = specs.filter(([, val]) => val !== null && val !== '');

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <h3 className="px-6 py-4 font-bold text-foreground text-lg border-b border-gray-100">
        Ficha técnica
      </h3>
      <dl className="divide-y divide-gray-50">
        {visible.map(([key, val]) => (
          <div key={key} className="flex px-6 py-3">
            <dt className="w-40 text-sm font-medium text-gray-500">{LABEL[key]}</dt>
            <dd className="text-sm text-foreground capitalize">{String(val)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
