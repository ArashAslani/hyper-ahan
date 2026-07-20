import { Skeleton } from "@/shared/ui/Skeleton";

export function BlogPostCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-soft)] ${className}`}
    >
      <Skeleton className="aspect-[16/9] rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function FeaturedPostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-card)]">
      <Skeleton className="aspect-[4/5] rounded-none sm:aspect-[16/9] md:aspect-[21/9]" />
    </div>
  );
}

export function BlogHeroSkeleton() {
  return (
    <div className="bg-primary px-4 py-10 md:py-14">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <Skeleton className="mx-auto h-5 w-32 bg-white/20" />
        <Skeleton className="mx-auto h-8 w-3/4 bg-white/20" />
        <Skeleton className="mx-auto h-4 w-1/2 bg-white/20" />
        <Skeleton className="mx-auto mt-4 h-12 w-full bg-white/20" />
      </div>
    </div>
  );
}

export function BlogChipsSkeleton() {
  return (
    <div className="flex gap-2 px-4 py-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-9 w-24 flex-shrink-0 rounded-full" />
      ))}
    </div>
  );
}

export function BlogPostRowSkeleton() {
  return (
    <div className="px-4 py-3">
      <Skeleton className="mb-3 h-6 w-40" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <BlogPostCardSkeleton key={index} className="w-64 flex-shrink-0 sm:w-72" />
        ))}
      </div>
    </div>
  );
}

export function BlogListSkeleton() {
  return (
    <div>
      <BlogHeroSkeleton />
      <BlogChipsSkeleton />
      <div className="container mx-auto px-4 py-4">
        <FeaturedPostCardSkeleton />
      </div>
      <BlogPostRowSkeleton />
      <BlogPostRowSkeleton />
      <div className="container mx-auto px-4 py-4">
        <Skeleton className="mb-4 h-6 w-40" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <BlogPostCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BlogPostDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-4 aspect-[16/9] w-full" />
      <div className="mt-6 space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
