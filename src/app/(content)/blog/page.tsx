import type { Metadata } from "next";
import { BlogListView } from "@/features/content/blog";
import { blogService } from "@/services/blogService";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";

type PageProps = {
  searchParams: Promise<{ page?: string; q?: string; category?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q, category } = await searchParams;
  const title = q ? `جستجوی «${q}» در بلاگ ${siteConfig.name}` : `بلاگ ${siteConfig.name}`;
  const description = "راهنمای خرید، تحلیل بازار و آموزش‌های فنی مقاطع فولادی از تیم هایپر آهن.";
  const canonicalPath = category ? routes.blog.category(category) : routes.blog.list;

  return {
    title,
    description,
    alternates: { canonical: `${siteConfig.siteUrl}${canonicalPath}` },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page, q, category } = await searchParams;
  const query = q?.trim() ?? "";
  const categorySlug = category?.trim() || undefined;
  const pageNumber = Number(page) > 0 ? Number(page) : 1;

  const [result, categories, featured, latest, popular] = await Promise.all([
    blogService.list({ page: pageNumber, q: query, categorySlug }),
    blogService.getCategories(),
    blogService.getFeatured(),
    blogService.getLatest(),
    blogService.getMostVisited(),
  ]);

  return (
    <BlogListView
      result={result}
      categories={categories}
      featured={featured}
      latest={latest}
      popular={popular}
      query={query}
      categorySlug={categorySlug}
    />
  );
}
