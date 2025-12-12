import ProductsView from "@/views/products-view";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const search = params.search;
  const page = params.page;

  let title = "Productos - Tienda UCN";
  let description = "Explora nuestro catálogo de productos disponibles.";

  if (search) {
    title = `"${search}" - Búsqueda de Productos`;
    description = `Resultados de búsqueda para "${search}" en Tienda UCN.`;
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
