const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5043/api";

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
}

interface CategoriesResponse {
  message: string;
  data: {
    categories: Category[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

interface BrandsResponse {
  message: string;
  data: {
    brands: Brand[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export async function getCategories(token: string): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/admin/category?PageSize=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener categorías");
  }

  const result: CategoriesResponse = await response.json();
  return result.data.categories;
}

export async function getBrands(token: string): Promise<Brand[]> {
  const response = await fetch(`${API_BASE_URL}/admin/brand?PageSize=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener marcas");
  }

  const result: BrandsResponse = await response.json();
  return result.data.brands;
}
