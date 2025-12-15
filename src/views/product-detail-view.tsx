"use client";

import { useState } from "react";
import Link from "next/link";
import { useProductDetail } from "@/hooks/useProductDetails";
import { useProductDetailCart } from "@/hooks/useProductDetailCart";
import { Toast } from "@/components/ui/toast";
import { ProductImageCarousel } from "@/components/common/product-image-carousel";
import { ProductDetailsTable } from "@/components/common/product-details-table";
import { ProductLoadingState } from "@/components/common/product-loading-state";
import { ProductErrorState } from "@/components/common/product-error-state";
import { ProductDetailEmptyState } from "@/components/common/product-detail-empty-state";

interface ProductDetailViewProps {
  productId: number;
}

export default function ProductDetailView({
  productId,
}: ProductDetailViewProps) {
  const { product, loading, error, refetch } = useProductDetail(productId);
  const {
    quantity,
    setQuantity,
    incrementQuantity,
    decrementQuantity,
    handleAddToCart: addToCart,
    buttonText,
    canAddMore,
    canDecrement,
  } = useProductDetailCart({ product });

  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const handleAddToCart = () => {
    const result = addToCart();
    if (result.success) {
      setToast({ message: result.message, type: "success" });
    } else {
      setToast({ message: result.message, type: "error" });
    }
  };

  if (loading) {
    return <ProductLoadingState />;
  }

  if (error) {
    return <ProductErrorState error={error} onRetry={() => refetch()} />;
  }

  if (!product) {
    return <ProductDetailEmptyState />;
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-blue-600">
                Productos
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 truncate max-w-md">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <ProductImageCarousel
            images={product.imagesURL}
            title={product.title}
            discount={product.discount}
          />

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Marca y Estado */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-600 uppercase tracking-wide">
                {product.brandName}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {product.statusName}
              </span>
            </div>

            {/* Título */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Categoría */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Categoría:</span>
              <span className="text-sm font-medium text-gray-700">
                {product.categoryName}
              </span>
            </div>

            {/* Precio */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl font-bold text-gray-900">
                  {product.finalPrice}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      {product.price}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  product.isAvailable
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{product.stockIndicator}</span>
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{product.stock}</span> unidades
                disponibles
              </p>
            </div>

            {/* Selector de cantidad */}
            <div className="space-y-3">
              <label
                htmlFor="quantity-input"
                className="block text-sm font-medium text-gray-700"
              >
                Cantidad:
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQuantity}
                  disabled={!canDecrement}
                  className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-xl font-semibold text-gray-700 transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <input
                  id="quantity-input"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 h-10 text-center bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold text-gray-900"
                  aria-label="Cantidad a agregar"
                />
                <button
                  onClick={incrementQuantity}
                  disabled={!canAddMore}
                  className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-xl font-semibold text-gray-700 transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
                {quantity >= product.stock && (
                  <span className="text-sm text-orange-600 font-medium">
                    Máximo
                  </span>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
                aria-label={buttonText}
              >
                {product.isAvailable ? buttonText : "No disponible"}
              </button>

              <Link
                href="/products"
                className="block w-full text-center border-2 border-gray-300 py-4 rounded-lg hover:border-gray-400 transition-colors font-medium text-gray-700"
              >
                Volver a productos
              </Link>
            </div>

            {/* Descripción */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Descripción del producto
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Especificaciones */}
            <ProductDetailsTable
              brandName={product.brandName}
              statusName={product.statusName}
              categoryName={product.categoryName}
              stock={product.stock}
            />
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
