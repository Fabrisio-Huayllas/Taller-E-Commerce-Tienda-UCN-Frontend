"use client";

import Image from "next/image";
import { Product } from "@/services/productService";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { Toast } from "@/components/ui/toast";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Extraer el precio base (precio original sin descuento)
    const basePrice = parseFloat(product.price.replace(/[^0-9]+/g, ""));

    const result = addItem({
      id: product.id,
      name: product.title,
      description: product.description,
      price: basePrice, // ✅ Guardar el precio ORIGINAL, no el precio con descuento
      imageUrl: product.imagesURL[0] || "",
      stock: product.stock,
      discount: product.discount, // El descuento se aplicará en el cart/checkout
    });

    if (!result.success && result.message) {
      setToast({ message: result.message, type: "error" });
    } else if (result.success) {
      setToast({ message: "Producto agregado al carrito", type: "success" });
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div
        className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
        onClick={onClick}
      >
        <div className="relative w-full h-64 bg-gray-100">
          {!imageError && product.imagesURL[0] ? (
            <Image
              src={product.imagesURL[0]}
              alt={product.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-20 h-20"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {/* Badge de descuento */}
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              -{product.discount}%
            </div>
          )}
          {/* Badge de estado */}
          <div className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 rounded-md text-xs font-medium">
            {product.statusName}
          </div>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {product.title}
          </h3>

          {/* Marca y Categoría */}
          <div className="flex gap-2 text-xs text-gray-500">
            <span className="bg-gray-100 px-2 py-1 rounded">
              {product.brandName}
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded">
              {product.categoryName}
            </span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px]">
            {product.description}
          </p>

          {/* Precio */}
          <div className="flex items-center gap-2">
            {product.discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                {product.price}
              </span>
            )}
            <span className="text-2xl font-bold text-blue-600">
              {product.finalPrice}
            </span>
          </div>

          {/* Stock y Disponibilidad */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Stock:{" "}
              <span className="font-semibold text-gray-700">
                {product.stock} unidades
              </span>
            </span>
            <span
              className={`px-3 py-1 rounded-full font-medium ${
                product.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.stockIndicator}
            </span>
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </>
  );
};
