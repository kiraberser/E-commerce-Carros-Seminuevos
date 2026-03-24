'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [make, setMake] = useState(searchParams.get('make') ?? '');
  const [priceMin, setPriceMin] = useState(searchParams.get('price_min') ?? '');
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') ?? '');
  const [yearMin, setYearMin] = useState(searchParams.get('year_min') ?? '');
  const [fuel, setFuel] = useState(searchParams.get('fuel_type') ?? '');
  const [transmission, setTransmission] = useState(searchParams.get('transmission') ?? '');

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (make) params.set('make', make);
    if (priceMin) params.set('price_min', priceMin);
    if (priceMax) params.set('price_max', priceMax);
    if (yearMin) params.set('year_min', yearMin);
    if (fuel) params.set('fuel_type', fuel);
    if (transmission) params.set('transmission', transmission);
    router.push(`/vehicles?${params.toString()}`);
  }, [make, priceMin, priceMax, yearMin, fuel, transmission, router]);

  const clearFilters = () => {
    setMake(''); setPriceMin(''); setPriceMax(''); setYearMin(''); setFuel(''); setTransmission('');
    router.push('/vehicles');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wide">Filtros</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <input
          value={make}
          onChange={(e) => setMake(e.target.value)}
          placeholder="Marca o modelo"
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        />
        <input
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          type="number"
          placeholder="Precio mín."
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        />
        <input
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          type="number"
          placeholder="Precio máx."
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        />
        <input
          value={yearMin}
          onChange={(e) => setYearMin(e.target.value)}
          type="number"
          placeholder="Año desde"
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        />
        <select
          value={fuel}
          onChange={(e) => setFuel(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
          <option value="">Combustible</option>
          <option value="gasoline">Gasolina</option>
          <option value="diesel">Diésel</option>
          <option value="hybrid">Híbrido</option>
          <option value="electric">Eléctrico</option>
        </select>
        <select
          value={transmission}
          onChange={(e) => setTransmission(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
          <option value="">Transmisión</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automática</option>
          <option value="cvt">CVT</option>
        </select>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={applyFilters}
          className="bg-accent hover:bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          Buscar
        </button>
        <button
          onClick={clearFilters}
          className="text-gray-500 hover:text-foreground text-sm px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
