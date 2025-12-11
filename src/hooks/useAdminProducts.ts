import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  getAdminProducts,
  AdminProduct,
  AdminProductFilters,
} from "@/services/adminProductService";

export function useAdminProducts(filters: AdminProductFilters, refreshKey = 0) {
  const { data: session } = useSession();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!session?.accessToken) {
        setError("No hay token de autenticación");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getAdminProducts(session.accessToken, filters);
        setProducts(data.products);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error fetching products";
        setError(errorMessage);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [session?.accessToken, filters, refreshKey]);

  return {
    products,
    totalCount,
    totalPages,
    currentPage,
    loading,
    error,
  };
}
