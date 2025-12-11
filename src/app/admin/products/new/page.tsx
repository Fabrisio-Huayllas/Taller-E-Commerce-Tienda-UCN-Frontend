"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import {
  getCategories,
  getBrands,
  Category,
  Brand,
} from "@/services/catalogService";
import { createProduct } from "@/services/adminProductService";
import { ProductFormValues } from "@/lib/validations/admin,validation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { isAdmin, isLoading: authLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!session?.accessToken) return;

      try {
        const [categoriesData, brandsData] = await Promise.all([
          getCategories(session.accessToken),
          getBrands(session.accessToken),
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch {
        toast.error("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session?.accessToken]);

  const handleSubmit = async (data: ProductFormValues) => {
    if (!session?.accessToken) return;

    try {
      setSubmitting(true);
      await createProduct(data, session.accessToken);
      toast.success("Producto creado exitosamente");
      router.push("/admin/products");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al crear producto",
      );
    } finally {
      setSubmitting(false);
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

  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Producto</h1>

      <ProductForm
        categories={categories}
        brands={brands}
        onSubmit={handleSubmit}
        isLoading={submitting}
      />
    </div>
  );
}
