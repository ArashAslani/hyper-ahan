import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogCategoryView } from "@/features/content/blog";
import { blogService } from "@/services/blogService";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/config/site";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await blogService.getCategoryBySlug(slug);

  if (!category) return {};

  const title = `${category.name} | بلاگ ${siteConfig.name}`;
  const description = category.description || `مقالات دسته ${category.name} در بلاگ ${siteConfig.name}`;
  const canonical = `${siteConfig.siteUrl}${routes.blog.category(category.slug)}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: "website", url: canonical },
    twitter: { card: "summary", title, description },
  };
}

export default async function BlogCategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const category = await blogService.getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const pageNumber = Number(page) > 0 ? Number(page) : 1;
  const [result, categories] = await Promise.all([
    blogService.list({ page: pageNumber, categorySlug: slug }),
    blogService.getCategories(),
  ]);

  return <BlogCategoryView category={category} result={result} categories={categories} />;
}
