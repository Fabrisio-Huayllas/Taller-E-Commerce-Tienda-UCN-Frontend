"use client";

import { OrderDetail, OrderItem } from "@/types/orders";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface OrderDetailViewProps {
  order: OrderDetail;
  onDownloadPdf: () => Promise<void>;
  onGoBack: () => void;
  isDownloading?: boolean;
  downloadError?: string | null;
}

export function OrderDetailView({
  order,
  onDownloadPdf,
  onGoBack,
  isDownloading = false,
  downloadError,
}: OrderDetailViewProps) {
  const handleDownload = async () => {
    try {
      await onDownloadPdf();
    } catch (error) {
      console.error("Error descargando PDF:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con botón volver */}
        <div className="mb-6">
          <Button
            onClick={onGoBack}
            variant="ghost"
            className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mis ordenes
          </Button>
        </div>

        {/* Título y acciones */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Orden #{order.code}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {(() => {
                  const dateStr =
                    order.purchasedAt || order.createdAt || order.date;
                  if (!dateStr) return "Fecha no disponible";
                  try {
                    const d = new Date(dateStr);
                    if (Number.isNaN(d.getTime())) return "Fecha no disponible";
                    return d.toLocaleDateString("es-CL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  } catch {
                    return "Fecha no disponible";
                  }
                })()}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="whitespace-nowrap"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Descargando..." : "Descargar PDF"}
              </Button>
              {downloadError && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  {downloadError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Cantidad de productos
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {order.itemsCount ?? order.items.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total pagado
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${order.total?.toLocaleString() || "—"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Productos
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Cantidad
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.length > 0 ? (
                  order.items.map((item: OrderItem, index: number) => {
                    const imageUrl =
                      item.mainImageURL || item.productImage || "";
                    const price =
                      item.priceAtMomentFormatted || String(item.price) || "—";
                    const priceNumber =
                      item.priceAtMoment ||
                      (typeof item.price === "number" ? item.price : 0);
                    const subtotal =
                      priceNumber && item.quantity
                        ? `$${((priceNumber * item.quantity) / 1000).toFixed(3)}`
                        : "—";

                    return (
                      <tr
                        key={`item-${order.code}-${item.productId}-${index}`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {imageUrl && (
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                  src={imageUrl}
                                  alt={item.productTitle || "Producto"}
                                  width={64}
                                  height={64}
                                  className="object-cover rounded-lg"
                                />
                              </div>
                            )}
                            <span className="font-medium text-gray-900 dark:text-white">
                              {item.productTitle || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {price}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {item.quantity || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {subtotal}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          No hay items en esta orden
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen total */}
        <div className="flex justify-end">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 w-full sm:w-96">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal:</span>
                <span>${order.total?.toLocaleString() || "—"}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${order.total?.toLocaleString() || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton para loading state
interface OrderDetailSkeletonProps {
  onGoBack: () => void;
}

export function OrderDetailSkeleton({ onGoBack }: OrderDetailSkeletonProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button onClick={onGoBack} variant="ghost" className="mb-4" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mis ordenes
          </Button>
        </div>

        {/* Título */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96" />
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40" />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-3 flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Cantidad
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </td>
                    <td className="px-6 py-4 flex justify-center">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-12" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen */}
        <div className="flex justify-end">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 w-full sm:w-96">
            <div className="space-y-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
