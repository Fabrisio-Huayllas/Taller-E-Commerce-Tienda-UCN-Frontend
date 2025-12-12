import { ProductsGridSkeleton } from "@/components/common/product-card-skeleton";

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-8 animate-pulse" />

      <div className="mb-8 max-w-2xl mx-auto">
        <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />

      <ProductsGridSkeleton />
    </div>
  );
}
