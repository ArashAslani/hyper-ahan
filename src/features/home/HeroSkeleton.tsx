import { Skeleton } from "@/shared/ui/Skeleton";

export function HeroSkeleton() {
  return (
    <section>
      <div className="w-full px-4 pt-3">
        <Skeleton className="h-48 w-full rounded-[var(--radius-lg)] md:h-64" />
      </div>
      <div className="px-4 pt-4">
        <Skeleton className="h-28 w-full rounded-[var(--radius-lg)]" />
      </div>
    </section>
  );
}
