import Link from "next/link";

interface ProductsEmptyStateProps {
  searchTerm?: string;
}

export function ProductsEmptyState({ searchTerm }: ProductsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <svg
        className="w-24 h-24 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {searchTerm
            ? "No se encontraron productos"
            : "No hay productos disponibles"}
        </h3>
        <p className="text-gray-500 mb-4">
          {searchTerm
            ? `No hay resultados para "${searchTerm}". Intenta con otra búsqueda.`
            : "Vuelve más tarde para ver nuestros productos."}
        </p>
        {searchTerm && (
          <Link
            href="/products"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todos los productos
          </Link>
        )}
      </div>
    </div>
  );
}
