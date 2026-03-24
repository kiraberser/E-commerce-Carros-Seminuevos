import api from '@/shared/lib/axios';
import type { Vehicle } from '@/shared/types';

export const reservationsApi = {
  reserve: (vehicleId: number) =>
    api.post<Vehicle>(`/vehicles/${vehicleId}/reserve/`),

  cancel: (vehicleId: number) =>
    api.delete<Vehicle>(`/vehicles/${vehicleId}/reserve/`),
};
