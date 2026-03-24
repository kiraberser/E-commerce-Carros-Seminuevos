import Link from 'next/link';

import { RegisterForm } from '@/features/auth/components/RegisterForm';

export const metadata = { title: "Crear cuenta — Maya's Garage" };

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">Crea tu cuenta</h1>
            <p className="text-gray-500 text-sm mt-2">Únete a Maya&apos;s Garage y comienza tu búsqueda</p>
          </div>
          <RegisterForm />
          <p className="text-center text-sm text-gray-400 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-accent hover:underline font-medium">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
