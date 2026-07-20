import { Suspense } from "react";
import { EmptyState } from "@/shared/ui/EmptyState";
import { routes } from "@/lib/routes";
import type { BlogCategory, BlogListResult } from "@/types";
import { BlogPostCard } from "./BlogPostCard";
import { BlogCategorySidebar } from "./BlogCategorySidebar";
import { BlogCategoryChips } from "./BlogCategoryChips";
import { BlogSearchBar } from "./BlogSearchBar";
import { BlogPagination } from "./BlogPagination";
import { BlogBreadcrumb } from "./BlogBreadcrumb";
import { BlogChipsSkeleton } from "./BlogSkeletons";

type BlogCategoryViewProps = {
  category: BlogCategory;
  result: BlogListResult;
  categories: BlogCategory[];
};

export function BlogCategoryView({ category, result, categories }: BlogCategoryViewProps) {
  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    const base = routes.blog.category(category.slug);
    return qs ? `${base}?${qs}` : base;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogBreadcrumb items={[{ label: category.name }]} />

      <div className="mb-4">
        <h1 className="text-2xl font-bold text-text md:text-3xl">{category.name}</h1>
        {category.description ? (
          <p className="mt-2 text-sm text-text-muted md:text-base">{category.description}</p>
        ) : null}
      </div>

      <Suspense fallback={<BlogChipsSkeleton />}>
        <BlogCategoryChips categories={categories} activeSlug={category.slug} sticky={false} />
      </Suspense>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-[1fr_280px] md:gap-8">
        <div className="min-w-0">
          <div className="mb-4 md:hidden">
            <Suspense fallback={null}>
              <BlogSearchBar />
            </Suspense>
          </div>

          {result.items.length === 0 ? (
            <EmptyState
              title="مقاله‌ای در این دسته یافت نشد"
              description="به‌زودی مطالب جدیدی در این دسته منتشر می‌شود."
              icon="📰"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
        </div>

        <aside className="space-y-4">
          <div className="hidden md:block">
            <Suspense fallback={null}>
              <BlogSearchBar />
            </Suspense>
          </div>
          <BlogCategorySidebar categories={categories} activeSlug={category.slug} />
        </aside>
      </div>
    </div>
  );
}
