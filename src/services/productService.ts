import { logger } from "@/lib/logger";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5043/api";

export interface Product {
  id: number;
  title: string;
  description: string;
  imagesURL: string[];
  price: string;
  discount: number;
  stock: number;
  stockIndicator: string;
  categoryName: string;
  brandName: string;
  statusName: string;
  isAvailable: boolean;
  finalPrice: string;
}

export interface ProductsResponse {
  message: string;
  data: {
    products: Product[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export interface ProductDetailResponse {
  message: string;
  data: Product;
}

export interface ProductFilters {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  categoryId?: number;
  brandId?: number;
}

export async function getProducts(
  filters?: ProductFilters,
): Promise<ProductsResponse["data"]> {
  try {
    const params = new URLSearchParams();

    if (filters?.pageNumber)
      params.append("PageNumber", filters.pageNumber.toString());
    if (filters?.pageSize)
      params.append("PageSize", filters.pageSize.toString());
    if (filters?.searchTerm) params.append("SearchTerm", filters.searchTerm);
    if (filters?.categoryId)
      params.append("CategoryId", filters.categoryId.toString());
    if (filters?.brandId) params.append("BrandId", filters.brandId.toString());

    const url = `${API_BASE_URL}/product/products${params.toString() ? `?${params.toString()}` : ""}`;
    logger.info("Fetching products", { url, filters });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const result: ProductsResponse = await response.json();
    logger.info("Products fetched successfully", {
      count: result.data.products.length,
      total: result.data.totalCount,
    });

    return result.data;
  } catch (error) {
    logger.error("Error fetching products", error);
    throw error;
  }
}

export async function getProductById(id: number): Promise<Product> {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Producto no encontrado");
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const result: ProductDetailResponse = await response.json();
    logger.info("Product detail fetched", { id, title: result.data.title });

    return result.data;
  } catch (error) {
    logger.error("Error fetching product detail", { id, error });
    throw error;
  }
}
