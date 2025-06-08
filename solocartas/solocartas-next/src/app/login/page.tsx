"use client";

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.');
      } else {
        setError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div><h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar sesión</h2></div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="email-address" className="sr-only">Correo electrónico</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600 text-center pt-2">{error}</p>}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm"><a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">¿Olvidaste tu contraseña?</a></div>
          </div>
          <div className="pt-2">
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
              {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center"><p className="text-gray-600">¿No tienes una cuenta?{' '}<Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Regístrate aquí</Link></p></div>
      </div>
    </div>
  );
}