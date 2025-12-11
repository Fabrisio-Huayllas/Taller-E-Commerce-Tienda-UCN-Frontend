"use client";

import { useState, useCallback, useEffect } from "react";
import { GetOrdersParams, OrderDetail, Order } from "@/types/orders";
import { ordersService } from "@/services/ordersService";
import { useAuth } from "./useAuth";

export function useOrders(params?: GetOrdersParams) {
  const { accessToken, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated || !accessToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await ordersService.getOrders(accessToken, {
        pageNumber: params?.pageNumber || 1,
        pageSize: params?.pageSize || 10,
        searchTerm: params?.searchTerm,
      });

      setOrders(data.orders);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setPageSize(data.pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [
    isAuthenticated,
    accessToken,
    params?.pageNumber,
    params?.pageSize,
    params?.searchTerm,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    loading,
    error,
    refetch: fetchOrders,
  };
}

export function useOrderDetail(orderCode: string) {
  const { accessToken, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !orderCode) {
      setLoading(false);
      return;
    }

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await ordersService.getOrderDetail(accessToken, orderCode);
        setOrder(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error fetching order detail",
        );
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [isAuthenticated, accessToken, orderCode]);

  return { order, loading, error };
}

export function useDownloadOrderPdf() {
  const { accessToken, isAuthenticated } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadPdf = useCallback(
    async (orderCode: string) => {
      if (!isAuthenticated || !accessToken) {
        setError("No hay sesión activa");
        return;
      }

      try {
        setDownloading(true);
        setError(null);

        const blob = await ordersService.downloadOrderPdf(
          accessToken,
          orderCode,
        );

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `orden-${orderCode}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error downloading PDF");
      } finally {
        setDownloading(false);
      }
    },
    [isAuthenticated, accessToken],
  );

  return { downloadPdf, downloading, error };
}
