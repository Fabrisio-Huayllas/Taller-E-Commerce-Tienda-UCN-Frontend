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
    <div>
      <h1 className="text-3xl font-bold mb-6">Mis Órdenes</h1>

      <OrdersFilterBar
        onSearch={handleSearch}
        onPageSizeChange={handlePageSizeChange}
        isLoading={loading}
      />

      {error && (
        <OrdersErrorState error={error} onRetry={refetch} isLoading={loading} />
      )}

      {!error && (
        <>
          {loading && !orders.length ? (
            <OrdersTableSkeleton />
          ) : (
            <OrdersTable orders={orders} />
          )}

          <OrdersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={loading}
          />
        </>
      )}
    </div>
  );
}
