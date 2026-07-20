import { Suspense } from "react";
import { faClockRotateLeft, faFire } from "@fortawesome/free-solid-svg-icons";
import { EmptyState } from "@/shared/ui/EmptyState";
import { routes } from "@/lib/routes";
import type { BlogCategory, BlogListResult, BlogPostSummary } from "@/types";
import { BlogPostCard } from "./BlogPostCard";
import { FeaturedPostCard } from "./FeaturedPostCard";
import { BlogPostRow } from "./BlogPostRow";
import { BlogCategoryChips } from "./BlogCategoryChips";
import { BlogHero } from "./BlogHero";
import { BlogPagination } from "./BlogPagination";
import { BlogChipsSkeleton } from "./BlogSkeletons";

type BlogListViewProps = {
  result: BlogListResult;
  categories: BlogCategory[];
  featured: BlogPostSummary | null;
  latest: BlogPostSummary[];
  popular: BlogPostSummary[];
  query: string;
  categorySlug?: string;
};

export function BlogListView({
  result,
  categories,
  featured,
  latest,
  popular,
  query,
  categorySlug,
}: BlogListViewProps) {
  const isDefaultView = !query && !categorySlug && result.page === 1;
  const activeCategory = categories.find((category) => category.slug === categorySlug);

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (categorySlug) params.set("category", categorySlug);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${routes.blog.list}?${qs}` : routes.blog.list;
  };

  return (
    <div className="animate-fade-in-up">
      <BlogHero initialQuery={query} totalArticles={result.total} />

      <Suspense fallback={<BlogChipsSkeleton />}>
        <BlogCategoryChips categories={categories} activeSlug={categorySlug} />
      </Suspense>

      <div className="container mx-auto px-4">
        {isDefaultView && featured ? (
          <div className="py-4">
            <FeaturedPostCard post={featured} />
          </div>
        ) : null}

        {isDefaultView ? (
          <>
            <BlogPostRow title="آخرین مقالات" icon={faClockRotateLeft} posts={latest} />
            <BlogPostRow title="پربازدیدترین مقالات" icon={faFire} posts={popular} />
          </>
        ) : null}

        <section className="py-4">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-bold text-text">
              {query
                ? `نتایج جستجو برای «${query}»`
                : activeCategory
                  ? activeCategory.name
                  : "همه مقالات"}
            </h2>
            <span className="text-sm text-text-muted">{result.total} مقاله</span>
          </div>

          {result.items.length === 0 ? (
            <EmptyState
              title="مقاله‌ای یافت نشد"
              description={
                query
                  ? `برای «${query}» نتیجه‌ای پیدا نشد. عبارت دیگری را جستجو کنید یا از دسته‌بندی‌ها استفاده کنید.`
                  : "در حال حاضر مقاله‌ای در این بخش موجود نیست."
              }
              icon="📰"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <BlogPagination
            currentPage={result.page}
            totalPages={result.totalPages}
            buildHref={buildHref}
          />
        </section>
      </div>
    </div>
  );
}
