import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { getAccessToken, setAccessToken } from './tokens';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true, // send httpOnly refresh_token cookie on every request
});

// ─── Request interceptor: attach access token ───────────────────────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: silent token refresh on 401 ──────────────────────

let _refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      try {
        // Deduplicate concurrent refresh calls
        if (!_refreshing) {
          _refreshing = axios
            .post<{ access: string }>(
              `${BASE_URL}/api/auth/token/refresh/`,
              {},
              { withCredentials: true },
            )
            .then((res) => {
              setAccessToken(res.data.access);
              return res.data.access;
            })
            .finally(() => {
              _refreshing = null;
            });
        }

        const newAccess = await _refreshing;
        originalConfig.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalConfig);
      } catch {
        setAccessToken(null);
        // Redirect to login if we're in a browser context
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
