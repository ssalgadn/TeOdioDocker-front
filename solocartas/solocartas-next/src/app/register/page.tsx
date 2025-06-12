"use client";

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const validatePasswordPolicy = (password: string): { isValid: boolean; message?: string } => {
  const errors: string[] = [];
  if (password.length < 8) errors.push("• Tener al menos 8 caracteres de longitud.");
  const types = {
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };
  const typesCount = Object.values(types).filter(Boolean).length;
  if (typesCount < 3) errors.push("• Contener al menos 3 de los 4 tipos de caracteres.");
  if (errors.length > 0) return { isValid: false, message: "La contraseña debe cumplir:\n" + errors.join("\n") };
  return { isValid: true };
};

const parseSignupError = (message: string): string => {
  if (message.includes('auth/email-already-in-use')) {
    return 'Ya existe una cuenta registrada con este correo.';
  }
  if (message.includes('auth/invalid-email')) {
    return 'El correo electrónico ingresado no es válido.';
  }
  if (message.includes('auth/weak-password')) {
    return 'La contraseña es demasiado débil. Intenta con una más segura.';
  }
  return 'Ocurrió un error durante el registro. Por favor, intenta nuevamente.';
};

export default function RegisterPage() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const { signup, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const passwordValidation = validatePasswordPolicy(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message!);
      return;
    }

    try {
      await signup(email, password, username);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(parseSignupError(err.message));
      } else {
        setError('Ocurrió un error inesperado durante el registro.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear una cuenta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <input id="username" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} required
                className="w-full appearance-none block px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <input id="email" type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full appearance-none block px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="relative">
              <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full appearance-none block px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirmar contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                className="w-full appearance-none block px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm whitespace-pre-line mt-4" role="alert">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button type="submit" disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
