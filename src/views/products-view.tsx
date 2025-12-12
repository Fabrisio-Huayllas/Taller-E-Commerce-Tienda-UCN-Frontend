"use client";

import { useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/common/product-card";
import { FilterBar } from "@/components/common/filter-bar";
import { ProductsPagination } from "@/components/common/products-pagination";
import { ProductsEmptyState } from "@/components/common/products-empty-state";
import { ProductsErrorState } from "@/components/common/products-error-state";
import { ProductsGridSkeleton } from "@/components/common/product-card-skeleton";
import Link from "next/link";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Leer parámetros de la URL
  const searchTerm = searchParams.get("search") || "";
  const pageNumber = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 12;

  // Fetch con TanStack Query
  const {
    products,
    totalCount,
    totalPages,
    currentPage,
    loading,
    error,
    refetch,
  } = useProducts({
    pageNumber,
    pageSize,
    searchTerm: searchTerm || undefined,
  });

  // Actualizar URL con nuevos parámetros
  const updateURL = useCallback(
    (newSearch?: string, newPage?: number) => {
      const params = new URLSearchParams();

      const finalSearch = newSearch !== undefined ? newSearch : searchTerm;
      const finalPage = newPage !== undefined ? newPage : pageNumber;

      if (finalSearch) params.set("search", finalSearch);
      if (finalPage > 1) params.set("page", finalPage.toString());

      const queryString = params.toString();
      router.push(`/products${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [router, searchTerm, pageNumber],
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      updateURL(search, 1); // Reset a página 1 al buscar
    },
    [updateURL],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateURL(undefined, page);
    },
    [updateURL],
  );

  // Memoizar la grid de productos
  const productsGrid = useMemo(
    () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    ),
    [products],
  );

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-center mb-8">
        Productos Disponibles
      </h1>

      {/* Buscador */}
      <FilterBar
        onSearchChange={handleSearchChange}
        initialSearch={searchTerm}
        isLoading={loading}
      />

      {/* Contador de productos */}
      {!loading && (
        <p className="text-center text-gray-600 mb-4" role="status">
          Mostrando {products.length} de {totalCount} productos
        </p>
      )}

      {/* Contenido principal */}
      {error ? (
        <ProductsErrorState error={error} onRetry={() => refetch()} />
      ) : loading ? (
        <ProductsGridSkeleton />
      ) : products.length === 0 ? (
        <ProductsEmptyState searchTerm={searchTerm} />
      ) : (
        <>
          {productsGrid}

          {/* Paginación */}
          {totalPages > 1 && (
            <ProductsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={loading}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function ProductsView() {
  return (
    <Suspense fallback={<ProductsGridSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
