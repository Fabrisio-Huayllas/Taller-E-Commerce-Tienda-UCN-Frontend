"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import {
  OrdersTable,
  OrdersTableSkeleton,
  OrdersFilterBar,
  OrdersPagination,
  OrdersErrorState,
} from "@/components";

export function OrdersView() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { orders, totalPages, currentPage, loading, error, refetch } =
    useOrders({
      pageNumber,
      pageSize,
      searchTerm,
    });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPageNumber(1); // Reset to first page on search
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageNumber(1); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Mis Órdenes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Historial completo de tus compras
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <OrdersFilterBar
            onSearch={handleSearch}
            onPageSizeChange={handlePageSizeChange}
            isLoading={loading}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <OrdersErrorState
              error={error}
              onRetry={refetch}
              isLoading={loading}
            />
          </div>
        )}

        {/* Orders Table */}
        {!error && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {loading && !orders.length ? (
              <OrdersTableSkeleton />
            ) : (
              <OrdersTable orders={orders} />
            )}
          </div>
        )}

        {/* Pagination */}
        {!error && orders.length > 0 && (
          <div className="mt-6">
            <OrdersPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
