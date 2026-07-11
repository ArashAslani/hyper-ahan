export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius-md)] bg-border/70 ${className}`}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-soft)]">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}
