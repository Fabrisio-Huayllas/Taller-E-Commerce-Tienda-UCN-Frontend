"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import { ProductsTable } from "@/components/admin/products-table";
import { ProductsFilter } from "@/components/admin/products-filter";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  toggleProductStatus,
  deleteProduct,
} from "@/services/adminProductService";
import {
  getCategories,
  getBrands,
  Category,
  Brand,
} from "@/services/catalogService";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { data: session } = useSession();
  const router = useRouter();

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  const [selectedBrand, setSelectedBrand] = useState<number | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  const [loadingFilters, setLoadingFilters] = useState(true);
  const pageSize = 10;

  const filters = useMemo(
    () => ({
      pageNumber,
      pageSize,
      searchTerm: searchTerm || undefined,
      categoryId: selectedCategory,
      brandId: selectedBrand,
      isAvailable: selectedStatus ? selectedStatus === "true" : undefined,
    }),
    [
      pageNumber,
      pageSize,
      searchTerm,
      selectedCategory,
      selectedBrand,
      selectedStatus,
    ],
  );

  const { products, totalCount, totalPages, currentPage, loading, error } =
    useAdminProducts(filters, refreshKey);

  const handleSearch = useCallback(() => {
    setSearchTerm(searchInput);
    setPageNumber(1);
  }, [searchInput]);

  const handleEdit = useCallback(
    (productId: number) => {
      router.push(`/admin/products/edit/${productId}`);
    },
    [router],
  );

  const handleToggleStatus = useCallback(
    async (productId: number) => {
      if (!session?.accessToken) return;

      try {
        await toggleProductStatus(productId, session.accessToken);
        toast.success("Estado del producto actualizado");
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al actualizar estado",
        );
      }
    },
    [session],
  );

  const handleDelete = useCallback(
    async (productId: number) => {
      if (!session?.accessToken) return;

      if (!confirm("¿Estás seguro de eliminar este producto?")) return;

      try {
        await deleteProduct(productId, session.accessToken);
        toast.success("Producto eliminado correctamente");
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al eliminar producto",
        );
      }
    },
    [session],
  );

  const handleCategoryChange = useCallback((categoryId?: number) => {
    setSelectedCategory(categoryId);
    setPageNumber(1);
  }, []);

  const handleBrandChange = useCallback((brandId?: number) => {
    setSelectedBrand(brandId);
    setPageNumber(1);
  }, []);

  const handleStatusChange = useCallback((status?: string) => {
    setSelectedStatus(status);
    setPageNumber(1);
  }, []);

  useEffect(() => {
    const loadFilters = async () => {
      if (!session?.accessToken) return;

      try {
        setLoadingFilters(true);
        const [categoriesData, brandsData] = await Promise.all([
          getCategories(session.accessToken),
          getBrands(session.accessToken),
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch {
        toast.error("Error al cargar filtros");
      } finally {
        setLoadingFilters(false);
      }
    };

    loadFilters();
  }, [session?.accessToken]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    redirect("/products");
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        <Button onClick={() => router.push("/admin/products/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {loadingFilters ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <ProductsFilter
          searchTerm={searchInput}
          onSearchChange={setSearchInput}
          onSearch={handleSearch}
          categories={categories}
          brands={brands}
          selectedCategory={selectedCategory}
          selectedBrand={selectedBrand}
          selectedStatus={selectedStatus}
          onCategoryChange={handleCategoryChange}
          onBrandChange={handleBrandChange}
          onStatusChange={handleStatusChange}
        />
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">Error: {error}</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No se encontraron productos
        </div>
      ) : (
        <>
          <ProductsTable
            products={products}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                variant="outline"
              >
                Anterior
              </Button>
              <span className="px-4 py-2">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                onClick={() =>
                  setPageNumber((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages || loading}
                variant="outline"
              >
                Siguiente
              </Button>
            </div>
          )}

          <p className="text-center text-gray-600 mt-4">
            Total: {totalCount} productos
          </p>
        </>
      )}
    </div>
  );
}
