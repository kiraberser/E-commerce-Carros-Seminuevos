import Link from 'next/link';

import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata = { title: "Iniciar sesión — Maya's Garage" };

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Bienvenido de vuelta</h1>
            <p className="text-gray-500 text-sm mt-2">Inicia sesión en tu cuenta</p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-gray-400 mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/auth/register" className="text-accent hover:underline font-medium">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
