"use client";

import { AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderDetailErrorStateProps {
  error: string;
  onRetry: () => void;
  onGoBack: () => void;
  isLoading?: boolean;
}

export function OrderDetailErrorState({
  error,
  onRetry,
  onGoBack,
  isLoading = false,
}: OrderDetailErrorStateProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Button onClick={onGoBack} variant="ghost" className="mb-6">
        Volver
      </Button>

      <div className="border border-red-200 rounded-lg bg-red-50 p-8 text-center">
        <div className="mb-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Error al cargar la orden
        </h3>
        <p className="text-red-700 mb-6">{error}</p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={onRetry}
            disabled={isLoading}
            variant="outline"
            className="inline-flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                Reintentando...
              </>
            ) : (
              <>
                <RotateCw className="w-4 h-4" />
                Reintentar
              </>
            )}
          </Button>
          <Button onClick={onGoBack} variant="ghost">
            Volver a órdenes
          </Button>
        </div>
      </div>
    </div>
  );
}
