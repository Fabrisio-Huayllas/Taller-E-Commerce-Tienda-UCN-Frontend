"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/services/productService";

function useGetProductDetail(productId: number) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    enabled: !!productId,
    refetchOnWindowFocus: false,
  });
}

// Wrapper para mantener compatibilidad con el código existente
export function useProductDetail(productId: number) {
  const { data, isLoading, error, refetch } = useGetProductDetail(productId);

  return {
    product: data || null,
    loading: isLoading,
    error: error?.message || null,
    refetch,
  };
}
