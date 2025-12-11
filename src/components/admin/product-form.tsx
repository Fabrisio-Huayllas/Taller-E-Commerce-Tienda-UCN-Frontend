"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "./products-image";
import {
  productSchema,
  ProductFormValues,
} from "@/lib/validations/admin,validation";
import { Category, Brand } from "@/services/catalogService";
import { ProductDetail } from "@/services/adminProductService";

interface ProductFormProps {
  initialData?: ProductDetail;
  categories: Category[];
  brands: Brand[];
  onSubmit: (data: ProductFormValues) => Promise<void>;
  isLoading: boolean;
  onDeleteImage?: (imageId: number) => Promise<void>;
}

export function ProductForm({
  initialData,
  categories,
  brands,
  onSubmit,
  isLoading,
  onDeleteImage,
}: ProductFormProps) {
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          price: initialData.price,
          discount: initialData.discount,
          stock: initialData.stock,
          status: initialData.status as "New" | "Used",
          categoryId: initialData.categoryId,
          brandId: initialData.brandId,
        }
      : {
          discount: 0,
          status: "New",
        },
  });

  const images = watch("images");

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!onDeleteImage) return;

    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;

    try {
      setDeletingImageId(imageId);
      await onDeleteImage(imageId);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Error al eliminar imagen",
      );
    } finally {
      setDeletingImageId(null);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Título <span className="text-red-500">*</span>
        </label>
        <Input
          {...register("title")}
          placeholder="Ej: Notebook HP Pavilion"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description")}
          placeholder="Describe el producto..."
          rows={4}
          disabled={isLoading}
          className="w-full px-3 py-2 border rounded-md"
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Grid: Precio, Descuento, Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Precio */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Precio ($) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            placeholder="0.00"
            disabled={isLoading}
          />
          {errors.price && (
            <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Descuento */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Descuento (%)
          </label>
          <Input
            type="number"
            step="0.01"
            {...register("discount", { valueAsNumber: true })}
            placeholder="0"
            disabled={isLoading}
          />
          {errors.discount && (
            <p className="text-sm text-red-500 mt-1">
              {errors.discount.message}
            </p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Stock <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            {...register("stock", { valueAsNumber: true })}
            placeholder="0"
            disabled={isLoading}
          />
          {errors.stock && (
            <p className="text-sm text-red-500 mt-1">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Grid: Estado, Categoría, Marca */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Estado */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Estado <span className="text-red-500">*</span>
          </label>
          <select
            {...register("status")}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="New">Nuevo</option>
            <option value="Used">Usado</option>
          </select>
          {errors.status && (
            <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            {...register("categoryId", { valueAsNumber: true })}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Marca <span className="text-red-500">*</span>
          </label>
          <select
            {...register("brandId", { valueAsNumber: true })}
            disabled={isLoading}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Selecciona una marca</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brandId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.brandId.message}
            </p>
          )}
        </div>
      </div>

      {/* Imágenes */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Imágenes {!initialData && <span className="text-red-500">*</span>}
        </label>
        <ImageUpload
          value={images}
          onChange={(files) => setValue("images", files)}
          existingImages={initialData?.images}
          onDeleteExisting={
            onDeleteImage ? handleDeleteExistingImage : undefined
          }
          error={errors.images?.message}
        />
        {deletingImageId && (
          <p className="text-sm text-gray-500 mt-2">
            <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
            Eliminando imagen...
          </p>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>{initialData ? "Actualizar" : "Crear"} Producto</>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
