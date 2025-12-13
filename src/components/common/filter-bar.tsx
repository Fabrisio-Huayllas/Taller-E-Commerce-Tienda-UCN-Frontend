"use client";

import { useState, useEffect, useRef } from "react";

export interface FilterBarFilters {
  search: string;
  categoryId: string;
  brandId: string;
}

interface FilterBarProps {
  onFiltersChange: (filters: FilterBarFilters) => void;
  initialSearch?: string;
  initialCategoryId?: string;
  initialBrandId?: string;
  categories?: Array<{ id: number; name: string }>;
  brands?: Array<{ id: number; name: string }>;
  isLoading?: boolean;
}

export function FilterBar({
  onFiltersChange,
  initialSearch = "",
  initialCategoryId = "",
  initialBrandId = "",
  categories = [],
  brands = [],
  isLoading = false,
}: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [brandId, setBrandId] = useState(initialBrandId);
  const isFirstRender = useRef(true);

  // Sincronizar con valores iniciales cuando cambien desde la URL
  useEffect(() => {
    setSearchInput(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setCategoryId(initialCategoryId);
  }, [initialCategoryId]);

  useEffect(() => {
    setBrandId(initialBrandId);
  }, [initialBrandId]);

  // Debounce solo para búsqueda textual: espera 500ms después de que el usuario deje de escribir
  useEffect(() => {
    // No ejecutar en el primer render para evitar llamadas innecesarias
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onFiltersChange({ search: searchInput, categoryId, brandId });
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]); // Solo depende de searchInput para debounce

  // Cambios inmediatos en filtros de categoría/marca
  useEffect(() => {
    if (isFirstRender.current) return;
    onFiltersChange({ search: searchInput, categoryId, brandId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, brandId]);

  const handleClearFilters = () => {
    setSearchInput("");
    setCategoryId("");
    setBrandId("");
    onFiltersChange({ search: "", categoryId: "", brandId: "" });
  };

  const hasActiveFilters = searchInput || categoryId || brandId;

  return (
    <div className="mb-8">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Búsqueda textual */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Buscar productos"
            disabled={isLoading}
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Filtros de Categoría y Marca */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="category-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoría
            </label>
            <select
              id="category-filter"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Filtrar por categoría"
              disabled={isLoading || categories.length === 0}
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="brand-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Marca
            </label>
            <select
              id="brand-filter"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Filtrar por marca"
              disabled={isLoading || brands.length === 0}
            >
              <option value="">Todas las marcas</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={handleClearFilters}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {isLoading && (
          <p
            className="text-sm text-gray-500 text-center"
            role="status"
            aria-live="polite"
          >
            Aplicando filtros...
          </p>
        )}
      </div>
    </div>
  );
}
