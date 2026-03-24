'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { vehiclesApi } from '@/features/vehicles/api';
import type { ConditionType, FuelType, TransmissionType, Vehicle, VehicleList } from '@/shared/types';

interface VehicleFormProps {
  vehicle?: Vehicle | VehicleList;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormState {
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  color: string;
  engine: string;
  doors: string;
  fuel_type: FuelType | '';
  transmission: TransmissionType | '';
  condition: ConditionType | '';
  description: string;
  is_available: boolean;
  is_negotiable: boolean;
}

function buildInitial(vehicle?: Vehicle | VehicleList): FormState {
  const full = vehicle && 'description' in vehicle ? vehicle : null;
  return {
    make: vehicle?.make ?? '',
    model: vehicle?.model ?? '',
    year: vehicle?.year?.toString() ?? '',
    price: vehicle?.price ?? '',
    mileage: vehicle?.mileage?.toString() ?? '',
    color: vehicle?.color ?? '',
    engine: full?.engine ?? '',
    doors: full?.doors?.toString() ?? '',
    fuel_type: vehicle?.fuel_type ?? '',
    transmission: vehicle?.transmission ?? '',
    condition: vehicle?.condition ?? '',
    description: full?.description ?? '',
    is_available: vehicle?.is_available ?? true,
    is_negotiable: vehicle?.is_negotiable ?? false,
  };
}

const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';
const inputClass =
  'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition';
const selectClass = inputClass;

export function VehicleForm({ vehicle, onSuccess, onCancel }: VehicleFormProps) {
  const [form, setForm] = useState<FormState>(() => buildInitial(vehicle));
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEdit = !!vehicle;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  }

  async function uploadToCloudinary(files: File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Error al subir imagen');
      const data = await res.json() as { url: string };
      urls.push(data.url);
    }
    return urls;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Upload images to Cloudinary first, then send URLs to backend
      const imageUrls = images.length > 0 ? await uploadToCloudinary(images) : [];

      const fd = new FormData();
      (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
        const val = form[key];
        if (val !== '') fd.append(key, String(val));
      });
      imageUrls.forEach((url) => fd.append('image_urls', url));

      if (isEdit) {
        await vehiclesApi.update(vehicle.id, fd);
        toast.success('Vehículo actualizado', { description: `${form.year} ${form.make} ${form.model}` });
      } else {
        await vehiclesApi.create(fd);
        toast.success('Vehículo creado', { description: `${form.year} ${form.make} ${form.model}` });
      }
      onSuccess();
    } catch {
      const msg = 'Ocurrió un error al guardar. Verifica los datos e intenta de nuevo.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Row: make / model / year */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Marca</label>
          <input name="make" value={form.make} onChange={handleChange} required className={inputClass} placeholder="Toyota" />
        </div>
        <div>
          <label className={labelClass}>Modelo</label>
          <input name="model" value={form.model} onChange={handleChange} required className={inputClass} placeholder="Corolla" />
        </div>
        <div>
          <label className={labelClass}>Año</label>
          <input name="year" type="number" value={form.year} onChange={handleChange} required min={1900} max={2100} className={inputClass} placeholder="2020" />
        </div>
      </div>

      {/* Row: price / mileage / color */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Precio (MXN)</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required min={0} className={inputClass} placeholder="350000" />
        </div>
        <div>
          <label className={labelClass}>Kilometraje</label>
          <input name="mileage" type="number" value={form.mileage} onChange={handleChange} required min={0} className={inputClass} placeholder="45000" />
        </div>
        <div>
          <label className={labelClass}>Color</label>
          <input name="color" value={form.color} onChange={handleChange} className={inputClass} placeholder="Blanco" />
        </div>
      </div>

      {/* Row: engine / doors */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Motor</label>
          <input name="engine" value={form.engine} onChange={handleChange} className={inputClass} placeholder="1.8L 4 cilindros" />
        </div>
        <div>
          <label className={labelClass}>Puertas</label>
          <input name="doors" type="number" value={form.doors} onChange={handleChange} min={2} max={6} className={inputClass} placeholder="4" />
        </div>
      </div>

      {/* Row: fuel / transmission / condition */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Combustible</label>
          <select name="fuel_type" value={form.fuel_type} onChange={handleChange} className={selectClass}>
            <option value="">— Selecciona —</option>
            <option value="gasoline">Gasolina</option>
            <option value="diesel">Diésel</option>
            <option value="hybrid">Híbrido</option>
            <option value="electric">Eléctrico</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Transmisión</label>
          <select name="transmission" value={form.transmission} onChange={handleChange} className={selectClass}>
            <option value="">— Selecciona —</option>
            <option value="manual">Manual</option>
            <option value="automatic">Automática</option>
            <option value="cvt">CVT</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Condición</label>
          <select name="condition" value={form.condition} onChange={handleChange} className={selectClass}>
            <option value="">— Selecciona —</option>
            <option value="excellent">Excelente</option>
            <option value="good">Bueno</option>
            <option value="fair">Regular</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className={inputClass}
          placeholder="Descripción del vehículo..."
        />
      </div>

      {/* Checkboxes */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} className="accent-primary w-4 h-4" />
          Disponible
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" name="is_negotiable" checked={form.is_negotiable} onChange={handleChange} className="accent-primary w-4 h-4" />
          Precio negociable
        </label>
      </div>

      {/* Images */}
      <div>
        <label className={labelClass}>Imágenes</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImages}
          className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
        />
        {images.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">{images.length} imagen{images.length !== 1 ? 'es' : ''} seleccionada{images.length !== 1 ? 's' : ''}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-2 text-sm font-semibold rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 text-sm font-semibold rounded-xl bg-accent hover:bg-primary text-white transition-colors disabled:opacity-60"
        >
          {loading ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear vehículo'}
        </button>
      </div>
    </form>
  );
}
