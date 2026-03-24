'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { useAuth } from '@/features/auth/AuthContext';
import { VehicleForm } from '@/features/dashboard/components/VehicleForm';
import { VehicleTable } from '@/features/dashboard/components/VehicleTable';
import { vehiclesApi } from '@/features/vehicles/api';
import { useVehicles } from '@/features/vehicles/hooks/useVehicles';
import type { VehicleList } from '@/shared/types';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { vehicles, loading, refetch } = useVehicles({ page: 1 });

  const [showForm, setShowForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState<VehicleList | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.is_staff)) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || loading) {
    return <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Cargando…</div>;
  }

  if (!isAuthenticated || !user?.is_staff) return null;

  const stats = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.is_available && !v.is_reserved).length,
    reserved: vehicles.filter((v) => v.is_reserved).length,
    unavailable: vehicles.filter((v) => !v.is_available).length,
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este vehículo?')) return;
    try {
      await vehiclesApi.delete(id);
      refetch();
      toast.success('Vehículo eliminado');
    } catch {
      toast.error('No se pudo eliminar el vehículo.');
    }
  };

  const handleEdit = (vehicle: VehicleList) => {
    setEditVehicle(vehicle);
    setShowForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
        <button
          onClick={() => { setEditVehicle(null); setShowForm(true); }}
          className="bg-accent hover:bg-primary text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          + Nuevo vehículo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-foreground' },
          { label: 'Disponibles', value: stats.available, color: 'text-green-600' },
          { label: 'Apartados', value: stats.reserved, color: 'text-primary' },
          { label: 'No disponibles', value: stats.unavailable, color: 'text-gray-400' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</p>
            <p className={`text-3xl font-extrabold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Modal / Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 my-8">
            <h2 className="text-xl font-bold text-foreground mb-6">
              {editVehicle ? 'Editar vehículo' : 'Nuevo vehículo'}
            </h2>
            <VehicleForm
              vehicle={editVehicle ?? undefined}
              onSuccess={() => {
                setShowForm(false);
                setEditVehicle(null);
                refetch();
              }}
              onCancel={() => { setShowForm(false); setEditVehicle(null); }}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <VehicleTable vehicles={vehicles} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
