"use client";

import { useState, useEffect, useRef } from "react";

interface FilterBarProps {
  onSearchChange: (search: string) => void;
  initialSearch?: string;
  isLoading?: boolean;
}

export function FilterBar({
  onSearchChange,
  initialSearch = "",
  isLoading = false,
}: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const isFirstRender = useRef(true);

  // Sincronizar con initialSearch cuando cambie desde la URL
  useEffect(() => {
    setSearchInput(initialSearch);
  }, [initialSearch]);

  // Debounce: espera 500ms después de que el usuario deje de escribir
  useEffect(() => {
    // No ejecutar en el primer render para evitar llamadas innecesarias
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      onSearchChange(searchInput);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]); // Solo depende de searchInput, no de onSearchChange

  return (
    <div className="mb-8 max-w-2xl mx-auto">
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
      {isLoading && (
        <p
          className="text-sm text-gray-500 mt-2"
          role="status"
          aria-live="polite"
        >
          Buscando...
        </p>
      )}
    </div>
  );
}
