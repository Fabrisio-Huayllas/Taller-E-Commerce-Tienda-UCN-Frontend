'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProduct';
import { ProductCard } from '@/components';
import Link from 'next/link';

export default function ProductsView() {
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(12);

  // Debounce: espera 500ms después de que el usuario deje de escribir
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPageNumber(1); // Reset a página 1 al buscar
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { products = [], totalCount, totalPages, currentPage, loading, error } = useProducts({
    pageNumber,
    pageSize,
    searchTerm: searchTerm || undefined,
  });

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-4xl font-bold text-center mb-8">
        Productos Disponibles
      </h1>

      {/* Buscador */}
      <div className="mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {loading && (
          <p className="text-sm text-gray-500 mt-2">Buscando...</p>
        )}
      </div>

      {/* Contador de productos */}
      <p className="text-center text-gray-600 mb-4">
        Mostrando {products.length} de {totalCount} productos
      </p>

      {/* Grid de productos */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-lg">Cargando productos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-lg text-gray-500">No se encontraron productos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="px-4 py-2">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setPageNumber(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}