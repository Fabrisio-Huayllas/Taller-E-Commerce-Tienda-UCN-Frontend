"use client";

import { Order } from "@/types/orders";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-700">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No hay ordenes
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Aun no has realizado ninguna compra
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Codigo
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Fecha
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Productos
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Total
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {orders.map((order: Order) => (
            <tr
              key={order.code}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-mono text-gray-900 dark:text-white font-medium">
                  {order.code}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {(() => {
                    const dateStr = order.date;
                    if (!dateStr) return "—";
                    try {
                      const d = new Date(dateStr);
                      if (Number.isNaN(d.getTime())) return "—";
                      return d.toLocaleDateString("es-CL");
                    } catch {
                      return "—";
                    }
                  })()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${order.total.toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/orders/${order.code}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20"
                  >
                    Ver detalle
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface OrdersTableSkeletonProps {
  rows?: number;
}

export function OrdersTableSkeleton({ rows = 5 }: OrdersTableSkeletonProps) {
  return (
    <div className="overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Codigo
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Fecha
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Productos
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Total
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array.from({ length: rows }).map((_, i: number) => (
            <tr key={i}>
              <td className="px-6 py-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
              </td>
              <td className="px-6 py-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse" />
              </td>
              <td className="px-6 py-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 animate-pulse" />
              </td>
              <td className="px-6 py-4">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
              </td>
              <td className="px-6 py-4">
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
