"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error en productos:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <svg
          className="w-24 h-24 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            Error al cargar productos
          </h2>
          <p className="text-gray-600">
            {error.message || "Ha ocurrido un error inesperado"}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
