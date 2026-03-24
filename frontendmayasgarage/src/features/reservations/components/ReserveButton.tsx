'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth/AuthContext';
import type { Vehicle } from '@/shared/types';

import { reservationsApi } from '../api';

interface ReserveButtonProps {
  vehicle: Vehicle;
  onUpdate: (updated: Vehicle) => void;
}

export function ReserveButton({ vehicle, onUpdate }: ReserveButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  // Admins don't reserve — they manage
  if (!isAuthenticated || user?.is_staff) return null;

  const isMyReservation = vehicle.reserved_by === user?.id;
  const isOtherReservation = vehicle.is_reserved && !isMyReservation;

  if (isOtherReservation) {
    return (
      <div className="bg-primary/10 text-primary font-semibold px-5 py-3 rounded-xl text-center text-sm">
        Este vehículo ya está apartado
      </div>
    );
  }

  if (!vehicle.is_available) return null;

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = isMyReservation
        ? await reservationsApi.cancel(vehicle.id)
        : await reservationsApi.reserve(vehicle.id);
      onUpdate(res.data);
      if (isMyReservation) {
        toast('Reserva cancelada', { description: `${vehicle.year} ${vehicle.make} ${vehicle.model}` });
      } else {
        toast.success('¡Vehículo apartado!', { description: `${vehicle.year} ${vehicle.make} ${vehicle.model}` });
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      toast.error(axiosErr?.response?.data?.detail ?? 'Error al procesar la reserva.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-60 ${
        isMyReservation
          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
          : 'bg-primary hover:bg-primary-dark text-white'
      }`}
    >
      {loading
        ? '…'
        : isMyReservation
        ? 'Cancelar reserva'
        : 'Apartar vehículo'}
    </button>
  );
}
