interface ProductsErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function ProductsErrorState({
  error,
  onRetry,
}: ProductsErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <svg
        className="w-24 h-24 text-red-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Error al cargar productos
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
