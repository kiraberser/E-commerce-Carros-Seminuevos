'use client';

import axios from 'axios';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { setAccessToken } from '@/shared/lib/tokens';
import type { User } from '@/shared/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

interface RegisterData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  password: string;
  password2: string;
}

interface AuthResponse {
  user: User;
  access: string;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: attempt silent refresh to restore session from httpOnly cookie
  useEffect(() => {
    const silentRefresh = async () => {
      try {
        const res = await axios.post<{ access: string }>(
          `${BASE_URL}/api/auth/token/refresh/`,
          {},
          { withCredentials: true },
        );
        setAccessToken(res.data.access);
        // Fetch user profile with new token
        const profileRes = await axios.get<User>(`${BASE_URL}/api/users/me/`, {
          headers: { Authorization: `Bearer ${res.data.access}` },
          withCredentials: true,
        });
        setUser(profileRes.data);
      } catch {
        // No valid session — that's fine
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    silentRefresh();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await axios.post<AuthResponse>(
      `${BASE_URL}/api/auth/login/`,
      { email, password },
      { withCredentials: true },
    );
    setAccessToken(res.data.access);
    setUser(res.data.user);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const res = await axios.post<AuthResponse>(
      `${BASE_URL}/api/auth/register/`,
      data,
      { withCredentials: true },
    );
    setAccessToken(res.data.access);
    setUser(res.data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout/`,
        {},
        { withCredentials: true },
      );
    } finally {
      setAccessToken(null);
      setUser(null);
      toast('Sesión cerrada', { description: 'Hasta pronto.' });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
