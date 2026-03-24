import api from '@/shared/lib/axios';
import type { User } from '@/shared/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  password: string;
  password2: string;
}

export interface AuthResponse {
  user: User;
  access: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>('/auth/login/', payload),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register/', payload),

  logout: () =>
    api.post('/auth/logout/'),

  refresh: () =>
    api.post<{ access: string }>('/auth/token/refresh/'),

  me: () =>
    api.get<User>('/users/me/'),
};
