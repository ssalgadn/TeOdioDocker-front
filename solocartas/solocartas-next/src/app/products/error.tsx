'use client'; // Los componentes de error deben ser componentes de cliente

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Puedes registrar el error en un servicio de monitoreo
    console.error(error);
  }, [error]);

  return (
    <main className="container mx-auto px-6 py-10 text-center">
      <h1 className="text-2xl font-bold text-red-600">Algo salió mal</h1>
      <p className="mt-2 text-gray-700">
        Ocurrió un error al cargar los productos. Por favor, intenta de nuevo.
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Reintentar
      </button>
    </main>
  );
}