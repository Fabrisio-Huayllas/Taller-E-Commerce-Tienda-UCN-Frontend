"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface ProductImageCarouselProps {
  images: string[];
  title: string;
  discount: number;
}

export function ProductImageCarousel({
  images,
  title,
  discount,
}: ProductImageCarouselProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setSelectedImage(index);
        setImageError(false);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        setImageError(false);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        setImageError(false);
      }
    },
    [images.length],
  );

  return (
    <div
      className="space-y-4"
      role="region"
      aria-label="Galería de imágenes del producto"
    >
      {/* Imagen principal */}
      <div className="relative w-full min-h-[500px] lg:min-h-[600px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        {!imageError && images[selectedImage] ? (
          <Image
            src={images[selectedImage]}
            alt={`${title} - vista principal`}
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
              aria-label="Imagen no disponible"
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
        {discount > 0 && (
          <div
            className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded text-sm font-bold"
            role="status"
            aria-label={`${discount}% de descuento`}
          >
            -{discount}%
          </div>
        )}

        {/* Navegación con flechas */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => {
                setSelectedImage((prev) =>
                  prev > 0 ? prev - 1 : images.length - 1,
                );
                setImageError(false);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              aria-label="Imagen anterior"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                setSelectedImage((prev) =>
                  prev < images.length - 1 ? prev + 1 : 0,
                );
                setImageError(false);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              aria-label="Imagen siguiente"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div
          className="grid grid-cols-5 gap-2"
          role="tablist"
          aria-label="Miniaturas de imágenes"
        >
          {images.map((url, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                setImageError(false);
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedImage === index
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              role="tab"
              aria-selected={selectedImage === index}
              aria-label={`Vista ${index + 1} de ${images.length}`}
              tabIndex={selectedImage === index ? 0 : -1}
            >
              <Image
                src={url}
                alt={`${title} - vista ${index + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
