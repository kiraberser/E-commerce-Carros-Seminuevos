'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { VehicleList } from '@/shared/types';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: VehicleList[];
  addToCart: (vehicle: VehicleList) => void;
  removeFromCart: (vehicleId: number) => void;
  clearCart: () => void;
  isInCart: (vehicleId: number) => boolean;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'mayasgarage_cart';

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<VehicleList[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addToCart = useCallback((vehicle: VehicleList) => {
    setItems((prev) => {
      if (prev.some((v) => v.id === vehicle.id)) return prev;
      toast.success('Agregado a tu selección', {
        description: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      });
      return [...prev, vehicle];
    });
  }, []);

  const removeFromCart = useCallback((vehicleId: number) => {
    setItems((prev) => {
      const vehicle = prev.find((v) => v.id === vehicleId);
      if (vehicle) {
        toast('Eliminado de tu selección', {
          description: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        });
      }
      return prev.filter((v) => v.id !== vehicleId);
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const isInCart = useCallback(
    (vehicleId: number) => items.some((v) => v.id === vehicleId),
    [items],
  );

  const total = items.reduce((sum, v) => sum + Number(v.price), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isInCart, total, itemCount: items.length }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
