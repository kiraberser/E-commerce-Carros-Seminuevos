'use client';

import Link from 'next/link';

import { useCart } from '@/features/cart/CartContext';
import { CartItem } from '@/features/cart/components/CartItem';

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartPage() {
  const { items, removeFromCart, clearCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="text-6xl">🚗</div>
        <h1 className="text-2xl font-bold text-foreground">Tu selección está vacía</h1>
        <p className="text-gray-500 text-sm">Explora nuestro catálogo y agrega los vehículos que te interesen.</p>
        <Link
          href="/vehicles"
          className="inline-block bg-accent hover:bg-primary text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Ver catálogo →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Mi selección</h1>
        <button
          onClick={clearCart}
          className="text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          Vaciar todo
        </button>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-2 mb-6">
        {items.map((v) => (
          <CartItem key={v.id} vehicle={v} onRemove={removeFromCart} />
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex justify-between text-sm text-gray-500">
          <span>{items.length} vehículo{items.length !== 1 ? 's' : ''}</span>
          <span>Subtotal</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-50 pt-4">
          <span className="font-bold text-foreground text-lg">Total estimado</span>
          <span className="text-2xl font-extrabold text-primary">{formatPrice(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="block w-full text-center bg-accent hover:bg-primary text-white font-bold py-3.5 rounded-xl transition-colors"
        >
          Proceder al checkout →
        </Link>
        <Link href="/vehicles" className="block w-full text-center text-sm text-gray-400 hover:text-foreground transition-colors">
          ← Seguir explorando
        </Link>
      </div>
    </div>
  );
}
