"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface RemoveItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  productName: string;
}

export function RemoveItemDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  productName,
}: RemoveItemDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 animate-scale-in">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Eliminar producto
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              ¿Estás seguro de que deseas eliminar{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {productName}
              </span>{" "}
              del carrito?
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={onConfirm}
                disabled={isLoading}
                className="cursor-pointer"
              >
                {isLoading ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
