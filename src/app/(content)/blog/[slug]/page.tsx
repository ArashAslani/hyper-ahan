import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BlogPostView } from "@/features/content/blog";
import { blogService } from "@/services/blogService";
import { homeService } from "@/services/homeService";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/config/site";
import type { BlogPostSummary } from "@/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function absoluteUrl(path: string): string {
  return `${siteConfig.siteUrl}${path}`;
}

/**
 * Resolves a post's image to an absolute URL string for OG/Twitter/JSON-LD
 * metadata (which need a plain string, not an `AppImage` element). The File
 * module always returns absolute URLs; falls back to a site default only
 * when a post genuinely has no image.
 */
function resolveMetaImageUrl(image: BlogPostSummary["image"]): string {
  return image?.url ?? absoluteUrl("/images/placeholder.svg");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await blogService.getBySlug(slug);

  if (result.status !== "found") return {};

  const { post } = result;
  // `canonicalSlug` holds the post's *previous* slug (kept so the backend
  // can 301 old links) — the canonical URL is always the current slug.
  const canonical = absoluteUrl(routes.blog.detail(post.slug));
  const image = resolveMetaImageUrl(post.image);

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      url: canonical,
      images: [{ url: image, width: 1200, height: 675, alt: post.title }],
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await blogService.getBySlug(slug);

  if (result.status === "redirect") {
    redirect(routes.blog.detail(result.slug));
  }
  if (result.status === "not-found") {
    notFound();
  }

  const { post } = result;

  const [related, relatedProducts, adjacent] = await Promise.all([
    blogService.getRelated(post),
    homeService.getFeaturedProducts(),
    blogService.getAdjacent(post.slug),
  ]);

  const canonical = absoluteUrl(routes.blog.detail(post.slug));
  const image = resolveMetaImageUrl(post.image);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: [image],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Person", name: post.author.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: canonical,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: siteConfig.siteUrl },
      { "@type": "ListItem", position: 2, name: "بلاگ", item: absoluteUrl(routes.blog.list) },
      {
        "@type": "ListItem",
        position: 3,
        name: post.categoryName,
        item: absoluteUrl(routes.blog.category(post.categorySlug)),
      },
      { "@type": "ListItem", position: 4, name: post.title, item: canonical },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPostView
        post={post}
        related={related}
        relatedProducts={relatedProducts}
        previous={adjacent.previous}
        next={adjacent.next}
      />
    </>
  );
}
