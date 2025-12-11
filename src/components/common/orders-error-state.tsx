"use client";

import { AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersErrorStateProps {
  error: string;
  onRetry: () => void;
  isLoading?: boolean;
}

export function OrdersErrorState({
  error,
  onRetry,
  isLoading = false,
}: OrdersErrorStateProps) {
  return (
    <div className="p-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-100 dark:bg-red-900/20">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Error al cargar ordenes
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {error}
      </p>
      <Button
        onClick={onRetry}
        disabled={isLoading}
        className="inline-flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Reintentando...
          </>
        ) : (
          <>
            <RotateCw className="w-4 h-4" />
            Reintentar
          </>
        )}
      </Button>
    </div>
  );
}
