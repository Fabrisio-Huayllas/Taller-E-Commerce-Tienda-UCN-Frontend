"use client";

import { useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ProductCard } from "@/components/common/product-card";
import { FilterBar, FilterBarFilters } from "@/components/common/filter-bar";
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
  const categoryFilter = searchParams.get("category") || "";
  const brandFilter = searchParams.get("brand") || "";
  const pageNumber = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 12;

  // Obtener categorías y marcas disponibles para filtros
  const { categories, brands } = useProductFilters();

  // Fetch con TanStack Query - solo enviamos búsqueda textual a la API
  const {
    products: allProducts,
    loading,
    error,
    refetch,
  } = useProducts({
    pageNumber: 1, // Obtenemos todos para filtrar client-side
    pageSize: 50, // Máximo permitido por el backend
    searchTerm: searchTerm || undefined,
  });

  // Filtrar productos por categoría y marca en el frontend
  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (categoryFilter) {
      const categoryName = categories.find(
        (c) => c.id.toString() === categoryFilter,
      )?.name;
      if (categoryName) {
        filtered = filtered.filter(
          (p) => p.categoryName.toLowerCase() === categoryName.toLowerCase(),
        );
      }
    }

    if (brandFilter) {
      const brandName = brands.find(
        (b) => b.id.toString() === brandFilter,
      )?.name;
      if (brandName) {
        filtered = filtered.filter(
          (p) => p.brandName.toLowerCase() === brandName.toLowerCase(),
        );
      }
    }

    return filtered;
  }, [allProducts, categoryFilter, brandFilter, categories, brands]);

  // Paginación manual en el frontend
  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = pageNumber;
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const products = filteredProducts.slice(startIndex, endIndex);

  // Actualizar URL con nuevos parámetros
  const updateURL = useCallback(
    (
      newSearch?: string,
      newCategoryId?: string,
      newBrandId?: string,
      newPage?: number,
    ) => {
      const params = new URLSearchParams();

      const finalSearch = newSearch !== undefined ? newSearch : searchTerm;
      const finalCategoryId =
        newCategoryId !== undefined ? newCategoryId : categoryFilter;
      const finalBrandId = newBrandId !== undefined ? newBrandId : brandFilter;
      const finalPage = newPage !== undefined ? newPage : pageNumber;

      if (finalSearch) params.set("search", finalSearch);
      if (finalCategoryId) params.set("category", finalCategoryId);
      if (finalBrandId) params.set("brand", finalBrandId);
      if (finalPage > 1) params.set("page", finalPage.toString());

      const queryString = params.toString();
      router.push(`/products${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [router, searchTerm, categoryFilter, brandFilter, pageNumber],
  );

  const handleFiltersChange = useCallback(
    (filters: FilterBarFilters) => {
      updateURL(filters.search, filters.categoryId, filters.brandId, 1); // Reset a página 1 al cambiar filtros
    },
    [updateURL],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateURL(undefined, undefined, undefined, page);
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

      {/* Buscador y Filtros */}
      <FilterBar
        onFiltersChange={handleFiltersChange}
        initialSearch={searchTerm}
        initialCategoryId={categoryFilter}
        initialBrandId={brandFilter}
        categories={categories}
        brands={brands}
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
