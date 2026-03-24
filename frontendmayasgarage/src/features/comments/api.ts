import api from '@/shared/lib/axios';
import type { Comment, PaginatedResponse } from '@/shared/types';

export const commentsApi = {
  list: (vehicleId: number) =>
    api.get<PaginatedResponse<Comment>>(`/vehicles/${vehicleId}/comments/`),

  create: (vehicleId: number, body: string) =>
    api.post<Comment>(`/vehicles/${vehicleId}/comments/`, { body }),

  delete: (commentId: number) =>
    api.delete(`/comments/${commentId}/`),
};
