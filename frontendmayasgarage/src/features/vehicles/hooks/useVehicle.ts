'use client';

import { useEffect, useState } from 'react';

import type { Vehicle } from '@/shared/types';

import { vehiclesApi } from '../api';

interface UseVehicleResult {
  vehicle: Vehicle | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVehicle(id: number): UseVehicleResult {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    vehiclesApi
      .get(id)
      .then((res) => { if (!cancelled) setVehicle(res.data); })
      .catch(() => { if (!cancelled) setError('Error al cargar el vehículo.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id, tick]);

  return { vehicle, loading, error, refetch: () => setTick((t) => t + 1) };
}
