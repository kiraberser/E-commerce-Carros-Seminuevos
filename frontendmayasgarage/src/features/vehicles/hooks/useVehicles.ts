'use client';

import { useCallback, useEffect, useState } from 'react';

import type { PaginatedResponse, VehicleFilters, VehicleList } from '@/shared/types';

import { vehiclesApi } from '../api';

interface UseVehiclesResult {
  vehicles: VehicleList[];
  count: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVehicles(filters?: VehicleFilters): UseVehiclesResult {
  const [vehicles, setVehicles] = useState<VehicleList[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    vehiclesApi
      .list(filters)
      .then((res) => {
        if (!cancelled) {
          setVehicles(res.data.results);
          setCount(res.data.count);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Error al cargar vehículos.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters), tick]);

  return { vehicles, count, loading, error, refetch };
}
