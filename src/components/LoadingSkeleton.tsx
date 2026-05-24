import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function ProductsGridSkeleton() {
  return (
    <div className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-20 w-full" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
