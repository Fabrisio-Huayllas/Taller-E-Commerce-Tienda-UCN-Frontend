"use client";

import { Button } from "@/components/ui/button";

/**
 * Error boundary específico para la ruta de login
 */
export default function LoginError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
            <h2 className="text-xl font-bold text-gray-900">
              Error en el inicio de sesión
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              No se pudo procesar tu solicitud de inicio de sesión.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            Intentar nuevamente
          </Button>

          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="w-full"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
