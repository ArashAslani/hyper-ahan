import Link from "next/link";
import { BlogPostCard } from "@/features/content";
import { routes } from "@/lib/routes";
import type { BlogPostSummary } from "@/types";

type LatestArticlesProps = {
  posts: BlogPostSummary[];
};

export function LatestArticles({ posts }: LatestArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">آخرین مقالات</h2>
        <Link
          href={routes.blog.list}
          className="text-sm font-medium text-accent"
        >
          همه
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
      <Link
        href={routes.blog.list}
        className="mt-4 flex min-h-[var(--touch-min)] items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface px-4 text-sm font-bold text-text active:scale-95"
      >
        مشاهده همه مقالات
      </Link>
    </section>
  );
}
