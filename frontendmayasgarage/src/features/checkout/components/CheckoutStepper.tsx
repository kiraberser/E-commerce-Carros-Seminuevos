'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useCart } from '@/features/cart/CartContext';
import { useAuth } from '@/features/auth/AuthContext';
import type { Order, VehicleList } from '@/shared/types';

import { checkoutApi } from '../api';

type Step = 'data' | 'confirm' | 'success';

function formatPrice(price: string | number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(Number(price));
}

const STEP_LABELS: Record<Step, string> = {
  data: '1. Tus datos',
  confirm: '2. Confirmación',
  success: '3. ¡Listo!',
};

export function CheckoutStepper() {
  const { user } = useAuth();
  const { items, clearCart, total } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<Step>('data');
  const [notes, setNotes] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const created: Order[] = [];
      for (const vehicle of items) {
        const res = await checkoutApi.createOrder(vehicle.id, notes);
        created.push(res.data);
      }
      setOrders(created);
      clearCart();
      setStep('success');
      toast.success('¡Pedido confirmado!', {
        description: 'Nos pondremos en contacto contigo pronto.',
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      const msg = axiosErr?.response?.data?.detail ?? 'Error al procesar el pedido.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const steps: Step[] = ['data', 'confirm', 'success'];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${step === s ? 'text-accent font-semibold' : steps.indexOf(step) > i ? 'text-primary' : 'text-gray-300'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step === s ? 'bg-accent border-accent text-white' : steps.indexOf(step) > i ? 'bg-primary border-primary text-white' : 'border-gray-200 text-gray-300'}`}>
                {i + 1}
              </div>
              <span className="hidden sm:inline text-sm">{STEP_LABELS[s]}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${steps.indexOf(step) > i ? 'bg-primary' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step: data */}
      {step === 'data' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-xl font-bold text-foreground">Tus datos de contacto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
              <input readOnly value={`${user?.first_name} ${user?.last_name}`.trim() || user?.email} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input readOnly value={user?.email} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Notas adicionales (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="¿Tienes alguna pregunta o comentario sobre tu pedido?"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <button
            onClick={() => setStep('confirm')}
            disabled={items.length === 0}
            className="w-full bg-accent hover:bg-primary text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            Continuar →
          </button>
        </div>
      )}

      {/* Step: confirm */}
      {step === 'confirm' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-xl font-bold text-foreground">Confirmar pedido</h2>
          <div className="divide-y divide-gray-100">
            {items.map((v) => (
              <div key={v.id} className="flex items-center gap-4 py-3">
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {v.primary_image ? (
                    <img
                      src={v.primary_image}
                      alt={`${v.make} ${v.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{v.year} {v.make} {v.model}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{v.mileage.toLocaleString('es-MX')} km</p>
                </div>
                <span className="text-sm font-bold text-primary shrink-0">{formatPrice(v.price)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-gray-100 pt-4">
            <span>Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
          {notes && (
            <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3">
              <strong>Notas:</strong> {notes}
            </p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep('data')} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm hover:border-gray-300 transition-colors">
              ← Atrás
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 bg-accent hover:bg-primary text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
            >
              {loading ? 'Procesando…' : 'Confirmar pedido'}
            </button>
          </div>
        </div>
      )}

      {/* Step: success */}
      {step === 'success' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">¡Pedido confirmado!</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Nos pondremos en contacto contigo pronto para coordinar los siguientes pasos.
          </p>
          {orders.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-left divide-y divide-gray-100">
              {orders.map((o) => (
                <div key={o.id} className="py-2 flex justify-between">
                  <span className="text-gray-500">Orden #{o.id}</span>
                  <span className="font-medium text-foreground capitalize">{o.status}</span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => router.push('/vehicles')}
            className="bg-accent hover:bg-primary text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Seguir explorando
          </button>
        </div>
      )}
    </div>
  );
}
