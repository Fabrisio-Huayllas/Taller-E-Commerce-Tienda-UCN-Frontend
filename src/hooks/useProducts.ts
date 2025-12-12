"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts, ProductFilters } from "@/services/productService";

function useGetProductsForCustomer(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    staleTime: 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Wrapper para la vista con lógica adicional
export function useProducts(filters?: ProductFilters) {
  const { data, isLoading, error, refetch } =
    useGetProductsForCustomer(filters);

  return {
    products: data?.products || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    pageSize: data?.pageSize || 12,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}
