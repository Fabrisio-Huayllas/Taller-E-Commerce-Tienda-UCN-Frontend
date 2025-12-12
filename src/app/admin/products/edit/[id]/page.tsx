"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import {
  getCategories,
  getBrands,
  Category,
  Brand,
} from "@/services/catalogService";
import {
  getProductById,
  updateProduct,
  uploadProductImages,
  deleteProductImage,
  ProductDetail,
} from "@/services/adminProductService";
import { ProductFormValues } from "@/lib/validations/admin,validation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const { isAdmin, isLoading: authLoading } = useAuth();

  const productId = Number(params.id);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!session?.accessToken) return;

      try {
        const [productData, categoriesData, brandsData] = await Promise.all([
          getProductById(productId, session.accessToken),
          getCategories(session.accessToken),
          getBrands(session.accessToken),
        ]);
        setProduct(productData);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch {
        toast.error("Error al cargar datos");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session?.accessToken, productId, router]);

  const handleSubmit = async (data: ProductFormValues) => {
    if (!session?.accessToken) return;

    try {
      setSubmitting(true);

      // Actualizar datos del producto
      await updateProduct(productId, data, session.accessToken);

      // Si hay nuevas imágenes, subirlas
      if (data.images && data.images.length > 0) {
        await uploadProductImages(productId, data.images, session.accessToken);
      }

      toast.success("Producto actualizado exitosamente");
      router.push("/admin/products");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al actualizar producto",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!session?.accessToken || !product) return;

    try {
      await deleteProductImage(productId, imageId, session.accessToken);

      // Actualizar estado local
      setProduct({
        ...product,
        images: product.images.filter((img) => img.id !== imageId),
      });

      toast.success("Imagen eliminada");
    } catch (error) {
      throw error;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    redirect("/products");
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24">
        <p>Producto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Editar Producto</h1>

      <ProductForm
        initialData={product}
        categories={categories}
        brands={brands}
        onSubmit={handleSubmit}
        isLoading={submitting}
        onDeleteImage={handleDeleteImage}
      />
    </div>
  );
}
