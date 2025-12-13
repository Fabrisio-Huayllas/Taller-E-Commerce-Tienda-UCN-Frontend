"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/productService";
import { useMemo } from "react";

/**
 * Hook para obtener las categorías y marcas disponibles para filtros
 * Hace una consulta inicial de productos para extraer valores únicos
 */
export function useProductFilters() {
  // Obtener un conjunto grande de productos sin filtros para extraer categorías/marcas
  const { data, isLoading } = useQuery({
    queryKey: ["product-filters"],
    queryFn: () => getProducts({ pageSize: 50, pageNumber: 1 }),
    staleTime: 5 * 60 * 1000, // 5 minutos - los filtros no cambian con frecuencia
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  const categories = useMemo(() => {
    if (!data?.products) return [];

    const uniqueCategories = new Map<string, { id: number; name: string }>();
    data.products.forEach((product) => {
      if (product.categoryName) {
        const key = product.categoryName.toLowerCase();
        if (!uniqueCategories.has(key)) {
          // Generar un ID hash basado en el nombre para consistencia
          const id = Math.abs(
            product.categoryName.split("").reduce((a, b) => {
              a = (a << 5) - a + b.charCodeAt(0);
              return a & a;
            }, 0),
          );
          uniqueCategories.set(key, {
            id,
            name: product.categoryName,
          });
        }
      }
    });

    return Array.from(uniqueCategories.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [data]);

  const brands = useMemo(() => {
    if (!data?.products) return [];

    const uniqueBrands = new Map<string, { id: number; name: string }>();
    data.products.forEach((product) => {
      if (product.brandName) {
        const key = product.brandName.toLowerCase();
        if (!uniqueBrands.has(key)) {
          const id = Math.abs(
            product.brandName.split("").reduce((a, b) => {
              a = (a << 5) - a + b.charCodeAt(0);
              return a & a;
            }, 0),
          );
          uniqueBrands.set(key, {
            id,
            name: product.brandName,
          });
        }
      }
    });

    return Array.from(uniqueBrands.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [data]);

  return {
    categories,
    brands,
    isLoading,
  };
}
