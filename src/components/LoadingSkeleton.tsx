import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="card-interactive rounded-2xl border border-border bg-card overflow-hidden">
      <Skeleton className="mb-0 h-56 w-full" />
      <div className="p-8 space-y-4">
        <Skeleton className="h-6 w-3/4 rounded-lg" />
        <Skeleton className="h-5 w-1/2 rounded-lg" />
        <div className="space-y-2 py-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

export function ProductsGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-16">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Skeleton className="h-8 w-2/3 rounded-lg" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-11 w-full rounded-full" />
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  );
}
