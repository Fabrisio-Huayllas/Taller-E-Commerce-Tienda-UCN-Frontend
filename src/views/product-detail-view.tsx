"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProductDetail } from "@/hooks/useProductDetail";
import { useCartStore } from "@/stores/cartStore";
import { Toast } from "@/components/ui/toast";

interface ProductDetailViewProps {
  productId: number;
}

export default function ProductDetailView({
  productId,
}: ProductDetailViewProps) {
  const { product, loading, error } = useProductDetail(productId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (product) {
      // Calcular el precio numérico desde el precio base y descuento
      // Extraer el precio base (precio original sin descuento)
      const basePrice = parseFloat(product.price.replace(/[^0-9]+/g, ""));

      let successCount = 0;
      let lastError = null;

      for (let i = 0; i < quantity; i++) {
        const result = addItem({
          id: product.id,
          name: product.title,
          description: product.description,
          price: basePrice, // ✅ Guardar el precio ORIGINAL, no el precio con descuento
          imageUrl: product.imagesURL[0] || "",
          stock: product.stock,
          discount: product.discount, // El descuento se aplicará en el cart/checkout
        });

        if (result.success) {
          successCount++;
        } else {
          lastError = result.message;
          break; // Detener si llegamos al límite
        }
      }

      if (lastError) {
        setToast({ message: lastError, type: "error" });
      } else if (successCount > 0) {
        setToast({
          message: `${successCount} producto(s) agregado(s) al carrito`,
          type: "success",
        });
        setQuantity(1); // Resetear cantidad después de agregar
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <p className="text-red-500 text-lg">
          {error || "Producto no encontrado"}
        </p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Volver a productos
        </Link>
      </div>
    );
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
          <div className="space-y-4">
            {/* Imagen principal - FIX: usar min-h en lugar de aspect-square */}
            <div className="relative w-full min-h-[500px] lg:min-h-[600px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {!imageError && product.imagesURL[selectedImage] ? (
                <Image
                  src={product.imagesURL[selectedImage]}
                  alt={product.title}
                  width={450}
                  height={450}
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-contain max-w-full max-h-full"
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    className="w-32 h-32"
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
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {product.imagesURL.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.imagesURL.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setImageError(false);
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-blue-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`Vista ${index + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

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
              <label className="block text-sm font-medium text-gray-700">
                Cantidad:
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-xl font-semibold text-gray-700"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(product.stock, Number(e.target.value)),
                      ),
                    )
                  }
                  className="w-20 h-10 text-center bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold text-gray-900"
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 rounded-lg bg-white border-2 border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-xl font-semibold text-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm"
              >
                {product.isAvailable ? "Agregar al carrito" : "No disponible"}
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
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Especificaciones
              </h2>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-gray-500">Marca</dt>
                  <dd className="font-medium text-gray-900">
                    {product.brandName}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Estado</dt>
                  <dd className="font-medium text-gray-900">
                    {product.statusName}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Categoría</dt>
                  <dd className="font-medium text-gray-900">
                    {product.categoryName}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Stock</dt>
                  <dd className="font-medium text-gray-900">
                    {product.stock} unidades
                  </dd>
                </div>
              </dl>
            </div>
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
