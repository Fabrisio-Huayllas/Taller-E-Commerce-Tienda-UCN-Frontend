import ProductsView from "@/views/products-view";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    page?: string;
  }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const search = params.search;
  const category = params.category;
  const brand = params.brand;
  const page = params.page;

  let title = "Productos - Tienda UCN";
  let description = "Explora nuestro catálogo de productos disponibles.";

  const filters: string[] = [];

  if (search) {
    filters.push(`búsqueda: "${search}"`);
  }

  if (category) {
    filters.push("filtrado por categoría");
  }

  if (brand) {
    filters.push("filtrado por marca");
  }

  if (filters.length > 0) {
    title = `Productos - ${filters.join(", ")} - Tienda UCN`;
    description = `Productos filtrados por: ${filters.join(", ")} en Tienda UCN.`;
  }

  if (page && parseInt(page) > 1) {
    title += ` - Página ${page}`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default function ProductsPage() {
  return <ProductsView />;
}
