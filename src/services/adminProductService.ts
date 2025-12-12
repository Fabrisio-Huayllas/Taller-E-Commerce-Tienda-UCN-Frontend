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
  isAvailable?: boolean;
}

// ============= NUEVAS INTERFACES PARA FORMULARIOS =============

export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  status: "New" | "Used";
  categoryId: number;
  brandId: number;
  images?: FileList;
}

export interface ProductDetail {
  id: number;
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  status: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  images: Array<{
    id: number;
    imageUrl: string;
    publicId: string;
  }>;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============= FUNCIONES EXISTENTES =============

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
  if (filters?.isAvailable !== undefined)
    params.append("IsAvailable", filters.isAvailable.toString());

  const url = `${API_BASE_URL}/product/admin/products?${params}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

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

// ============= NUEVAS FUNCIONES PARA CREAR/EDITAR =============

export async function getProductById(
  productId: number,
  token: string,
): Promise<ProductDetail> {
  const response = await fetch(`${API_BASE_URL}/product/admin/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el producto");
  }

  const result = await response.json();
  return result.data;
}

export async function createProduct(
  data: ProductFormData,
  token: string,
): Promise<string> {
  const formData = new FormData();

  formData.append("Title", data.title);
  formData.append("Description", data.description);
  formData.append("Price", data.price.toString());
  formData.append("Discount", data.discount.toString());
  formData.append("Stock", data.stock.toString());
  formData.append("Status", data.status);
  formData.append("CategoryId", data.categoryId.toString());
  formData.append("BrandId", data.brandId.toString());

  if (data.images) {
    Array.from(data.images).forEach((file) => {
      formData.append("Images", file);
    });
  }

  const response = await fetch(`${API_BASE_URL}/product`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear el producto");
  }

  const result = await response.json();
  return result.data;
}

export async function updateProduct(
  productId: number,
  data: Omit<ProductFormData, "images">,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/product/admin/products/${productId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.title, // ✅ Cambiado: title → name
        description: data.description,
        price: data.price,
        discount: data.discount,
        stock: data.stock,
        status: data.status,
        categoryId: data.categoryId,
        brandId: data.brandId,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar el producto");
  }
}

export async function uploadProductImages(
  productId: number,
  files: FileList,
  token: string,
): Promise<void> {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${API_BASE_URL}/product/${productId}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al subir las imágenes");
  }
}

export async function deleteProductImage(
  productId: number,
  imageId: number,
  token: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/product/${productId}/images/${imageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Error al eliminar la imagen");
  }
}
