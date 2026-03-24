'use client';

import Link from 'next/link';

import { useCart } from '../CartContext';
import { CartItem } from './CartItem';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, clearCart, total } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-foreground text-lg">
            Mi selección{' '}
            {items.length > 0 && (
              <span className="text-sm font-normal text-gray-400">({items.length})</span>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-foreground text-2xl leading-none">
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <svg className="w-16 h-16 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-400 text-sm">Tu selección está vacía</p>
              <Link href="/vehicles" onClick={onClose} className="text-accent hover:underline text-sm font-medium">
                Ver catálogo
              </Link>
            </div>
          ) : (
            items.map((v) => (
              <CartItem key={v.id} vehicle={v} onRemove={removeFromCart} />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total estimado</span>
              <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full text-center bg-accent hover:bg-primary text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Proceder al checkout
            </Link>
            <button
              onClick={clearCart}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
            >
              Vaciar selección
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
