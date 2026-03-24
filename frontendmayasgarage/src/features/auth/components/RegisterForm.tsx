'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '../AuthContext';

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      const username = form.email.split('@')[0] + '_' + Math.floor(Math.random() * 1000);
      await register({ ...form, username });
      toast.success('¡Cuenta creada! Bienvenido a Maya\'s Garage.');
      router.push('/');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: Record<string, string[]> } };
      const data = axiosErr?.response?.data;
      const msg = data
        ? Object.values(data).flat()[0]
        : 'Error al crear la cuenta. Intenta de nuevo.';
      setError(String(msg));
      toast.error(String(msg));
    } finally {
      setLoading(false);
    }
  };

  const fields: { name: keyof typeof form; label: string; type: string; placeholder: string }[] = [
    { name: 'first_name', label: 'Nombre', type: 'text', placeholder: 'Juan' },
    { name: 'last_name', label: 'Apellido', type: 'text', placeholder: 'García' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com' },
    { name: 'phone', label: 'Teléfono (opcional)', type: 'tel', placeholder: '+52 229 123 4567' },
    { name: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••' },
    { name: 'password2', label: 'Confirmar contraseña', type: 'password', placeholder: '••••••••' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.name} className={f.name === 'email' || f.name === 'phone' ? 'sm:col-span-2' : ''}>
            <label htmlFor={f.name} className="block text-sm font-medium text-foreground mb-1">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              required={f.name !== 'phone'}
              value={form[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-foreground"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent hover:bg-primary text-white font-semibold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  );
}
