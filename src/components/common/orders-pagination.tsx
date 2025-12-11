"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrdersPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function OrdersPagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: OrdersPaginationProps) {
  // Validar índices para evitar estados inválidos
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));
  const validTotalPages = Math.max(1, totalPages);

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = validTotalPages > 7;

    if (showEllipsis) {
      // Siempre mostrar primera página
      pages.push(1);

      // Mostrar rango alrededor de la página actual
      const start = Math.max(2, validCurrentPage - 1);
      const end = Math.min(validTotalPages - 1, validCurrentPage + 1);

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < validTotalPages - 1) {
        pages.push("...");
      }

      // Siempre mostrar última página
      pages.push(validTotalPages);
    } else {
      for (let i = 1; i <= validTotalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  if (validTotalPages <= 1) {
    return null;
  }

  // Validar que la página solicitada sea válida
  const handlePageChange = (page: number) => {
    const validPage = Math.max(1, Math.min(page, validTotalPages));
    onPageChange(validPage);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Página{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {validCurrentPage}
        </span>{" "}
        de{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {validTotalPages}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => handlePageChange(validCurrentPage - 1)}
          disabled={validCurrentPage === 1 || isLoading}
          variant="outline"
          size="sm"
          className="h-10 w-10 p-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex gap-1">
          {pages.map((page, idx) =>
            page === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <Button
                key={page}
                onClick={() => handlePageChange(page as number)}
                variant={page === validCurrentPage ? "default" : "outline"}
                size="sm"
                disabled={isLoading}
                className={`h-10 min-w-[2.5rem] ${
                  page === validCurrentPage
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </Button>
            ),
          )}
        </div>

        <Button
          onClick={() => handlePageChange(validCurrentPage + 1)}
          disabled={validCurrentPage === validTotalPages || isLoading}
          variant="outline"
          size="sm"
          className="h-10 w-10 p-0"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
