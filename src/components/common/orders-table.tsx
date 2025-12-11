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
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                Código
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                Fecha
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                Productos
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                Total
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                No hay órdenes
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-gray-700 border-b">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
              Código
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
              Fecha
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
              Productos
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
              Total
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr
              key={order.code}
              className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
            >
              <td className="px-4 py-3 text-sm font-mono">{order.code}</td>
              <td className="px-4 py-3 text-sm">
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
              </td>
              <td className="px-4 py-3 text-sm">{order.itemsCount}</td>
              <td className="px-4 py-3 text-sm font-semibold">
                ${order.total}
              </td>
              <td className="px-4 py-3 text-sm">
                <Link href={`/orders/${order.code}`}>
                  <Button variant="outline" size="sm">
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
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-gray-700 border-b">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              Código
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              Fecha
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              Productos
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              Total
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 dark:text-white">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i: number) => (
            <tr key={i} className="border-b">
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              </td>
              <td className="px-4 py-3">
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
