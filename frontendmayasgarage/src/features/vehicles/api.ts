import api from '@/shared/lib/axios';
import type { PaginatedResponse, Vehicle, VehicleFilters, VehicleList } from '@/shared/types';

export const vehiclesApi = {
  list: (filters?: VehicleFilters) =>
    api.get<PaginatedResponse<VehicleList>>('/vehicles/', { params: filters }),

  get: (id: number) =>
    api.get<Vehicle>(`/vehicles/${id}/`),

  create: (formData: FormData) =>
    api.post<Vehicle>('/vehicles/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: number, formData: FormData) =>
    api.patch<Vehicle>(`/vehicles/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  delete: (id: number) =>
    api.delete(`/vehicles/${id}/`),

  deleteImage: (imageId: number) =>
    api.delete(`/vehicles/images/${imageId}/`),
};
