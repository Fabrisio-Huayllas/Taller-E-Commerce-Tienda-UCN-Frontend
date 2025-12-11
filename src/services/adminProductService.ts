const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5043/api";

export interface AdminProduct {
  id: number;
  title: string;
  mainImageURL: string;
  price: string;
  stock: number;
  stockIndicator: string;
  categoryName: string;
  brandName: string;
  statusName: string;
  isAvailable: boolean;
  updatedAt: string;
  finalPrice: string;
}

interface BackendProduct {
  id?: number;
  productId?: number;
  title: string;
  mainImageURL: string;
  price: string;
  stock: number;
  stockIndicator: string;
  categoryName: string;
  brandName: string;
  statusName: string;
  isAvailable: boolean;
  updatedAt: string;
  finalPrice: string;
}

interface AdminProductsResponse {
  message: string;
  data: {
    products: BackendProduct[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface AdminProductFilters {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
}

export async function getAdminProducts(
  token: string,
  filters?: AdminProductFilters,
): Promise<{
  products: AdminProduct[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}> {
  const params = new URLSearchParams();

  if (filters?.pageNumber)
    params.append("PageNumber", filters.pageNumber.toString());
  if (filters?.pageSize) params.append("PageSize", filters.pageSize.toString());
  if (filters?.searchTerm) params.append("SearchTerm", filters.searchTerm);
  if (filters?.categoryId)
    params.append("CategoryId", filters.categoryId.toString());
  if (filters?.brandId) params.append("BrandId", filters.brandId.toString());
  if (filters?.minPrice) params.append("MinPrice", filters.minPrice.toString());
  if (filters?.maxPrice) params.append("MaxPrice", filters.maxPrice.toString());

  const response = await fetch(
    `${API_BASE_URL}/product/admin/products?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }

  const result: AdminProductsResponse = await response.json();

  const mappedProducts = result.data.products.map(
    (product: BackendProduct) => ({
      ...product,
      id: product.id || product.productId || 0,
    }),
  );

  return {
    ...result.data,
    products: mappedProducts,
  };
}

export async function toggleProductStatus(
  productId: number,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/product/${productId}/toggle-active`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al cambiar estado del producto");
  }
}

export async function deleteProduct(
  productId: number,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/product/admin/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al eliminar producto");
  }
}
