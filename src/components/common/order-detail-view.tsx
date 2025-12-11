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
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button onClick={onGoBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Orden #{order.code}</h1>
          <p className="text-gray-600 mt-1">
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
                });
              } catch {
                return "Fecha no disponible";
              }
            })()}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Button onClick={handleDownload} disabled={isDownloading}>
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? "Descargando..." : "Descargar PDF"}
          </Button>
          {downloadError && (
            <p className="text-xs text-red-600">{downloadError}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            Cantidad de productos
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {order.itemsCount ?? order.items.length}
          </p>
        </div>
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            ${order.total || "—"}
          </p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                Producto
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                Precio
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                Cantidad
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.length > 0 ? (
              order.items.map((item: OrderItem, index: number) => {
                const imageUrl = item.mainImageURL || item.productImage || "";
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
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={item.productTitle || "Producto"}
                            width={48}
                            height={48}
                            className="object-cover rounded"
                          />
                        )}
                        <span className="font-medium">
                          {item.productTitle || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{price}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      {item.quantity || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">
                      {subtotal}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                  No hay items en esta orden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 w-full sm:w-64">
          <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
            <span>Total:</span>
            <span>${order.total}</span>
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
    <div className="max-w-4xl mx-auto px-4 animate-pulse">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button onClick={onGoBack} variant="ghost" className="mb-4" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div className="h-8 bg-gray-200 rounded w-40 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-48" />
        </div>
        <Button disabled>
          <Download className="w-4 h-4 mr-2" />
          Descargar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 bg-gray-50">
            <div className="h-3 bg-gray-200 rounded w-16 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-24" />
          </div>
        ))}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                Producto
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                Precio
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white">
                Cantidad
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-8 mx-auto" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-20 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
