import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-8 flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen skeleton */}
          <div className="space-y-4">
            <Skeleton className="w-full h-[500px] lg:h-[600px] rounded-lg" />
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-6">
            <div className="flex gap-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <div className="border-t border-b py-6">
              <Skeleton className="h-12 w-48" />
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <div className="border-t pt-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
