import api from '@/shared/lib/axios';
import type { Order } from '@/shared/types';

export const checkoutApi = {
  createOrder: (vehicleId: number, notes?: string) =>
    api.post<Order>('/orders/', { vehicle: vehicleId, notes: notes ?? '' }),

  listOrders: () =>
    api.get<Order[]>('/orders/'),

  getOrder: (id: number) =>
    api.get<Order>(`/orders/${id}/`),
};
