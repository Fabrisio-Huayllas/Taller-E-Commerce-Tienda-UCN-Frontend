"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error Boundary global para capturar errores en la aplicación
 * Proporciona UI de recuperación y opción de reintento
 */
export default function GlobalError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log del error para debugging
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-10 w-10 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  ¡Algo salió mal!
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Ha ocurrido un error inesperado en la aplicación.
                </p>
                {error.digest && (
                  <p className="mt-2 text-xs text-gray-500">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={reset}
                className="w-full"
                aria-label="Reintentar"
              >
                Intentar nuevamente
              </Button>

              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="w-full"
                aria-label="Volver al inicio"
              >
                Volver al inicio
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Si el problema persiste, contacta con soporte técnico.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
