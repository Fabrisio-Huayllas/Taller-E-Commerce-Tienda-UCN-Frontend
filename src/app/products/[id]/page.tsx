import ProductDetailView from "@/views/product-detail-view";
import type { Metadata } from "next";
import { getProductById } from "@/services/productService";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await getProductById(Number(id));

    return {
      title: `${product.title} - Tienda UCN`,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.imagesURL.length > 0 ? [product.imagesURL[0]] : [],
        type: "website",
      },
    };
  } catch {
    return {
      title: "Producto - Tienda UCN",
      description: "Detalles del producto",
    };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailView productId={Number(id)} />;
}
