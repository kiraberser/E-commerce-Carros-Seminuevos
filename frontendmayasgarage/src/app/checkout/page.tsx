'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '@/features/auth/AuthContext';
import { useCart } from '@/features/cart/CartContext';
import { CheckoutStepper } from '@/features/checkout/components/CheckoutStepper';

export default function CheckoutPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?next=/checkout');
    }
    if (!isLoading && isAuthenticated && items.length === 0) {
      router.push('/cart');
    }
  }, [isLoading, isAuthenticated, items.length, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Cargando…</div>;
  }

  if (!isAuthenticated || items.length === 0) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-foreground mb-10">Checkout</h1>
      <CheckoutStepper />
    </div>
  );
}
