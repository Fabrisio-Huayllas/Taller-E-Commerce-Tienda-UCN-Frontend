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
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        onClick={() => handlePageChange(validCurrentPage - 1)}
        disabled={validCurrentPage === 1 || isLoading}
        variant="outline"
        size="sm"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 py-1">
            ...
          </span>
        ) : (
          <Button
            key={page}
            onClick={() => handlePageChange(page as number)}
            variant={page === validCurrentPage ? "default" : "outline"}
            size="sm"
            disabled={isLoading}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        onClick={() => handlePageChange(validCurrentPage + 1)}
        disabled={validCurrentPage === validTotalPages || isLoading}
        variant="outline"
        size="sm"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
