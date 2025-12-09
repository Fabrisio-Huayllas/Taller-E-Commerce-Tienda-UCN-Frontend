"use client";

import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

/**
 * Placeholder para el panel de administración
 */
export default function AdminProductsPage() {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    redirect("/products");
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Gestión de Productos</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Esta página está en construcción. Aquí podrás gestionar los
            productos de la tienda.
          </p>
        </div>
      </div>
    </div>
  );
}
