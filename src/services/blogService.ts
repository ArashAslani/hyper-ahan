import { apiFetch, apiFetchRaw, ApiError } from "@/lib/api-client";
import { processBlogBody, estimateReadingTimeMinutes, excerptFromHtml } from "@/lib/blogContent";
import { parseTagsFromKeywords } from "@/lib/blogFormat";
import type { BlogCategory, BlogListResult, BlogPost, BlogPostSummary, BlogSortBy, FileDto } from "@/types";

/**
 * Raw backend DTOs — see docs/BlogModule_frontend_integration.md §3 and
 * docs/FileModule_frontend_integration.md §8 (Blog has fully migrated to the
 * unified `image: FileDto` contract — `imageUrl`/`imageName` no longer exist).
 */
type BlogPostDto = {
  id: string;
  title: string;
  description: string;
  body: string;
  slug: string;
  userId: string;
  ownerName: string;
  image: FileDto | null;
  categoryId: string;
  categoryTitle: string;
  categorySlug: string;
  visit: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalSlug?: string | null;
  publishedDate: string;
  updatedDate?: string | null;
  isPublished: boolean;
  creationDate: string;
  effectiveMetaTitle: string;
  effectiveMetaDescription: string;
};

type BlogCategoryDto = {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

type PaginatedDto<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

type OperationResultLike<T> = {
  isSuccess: boolean;
  statusCode: number;
  result?: T | null;
};

const DEFAULT_PAGE_SIZE = 6;
const DEFAULT_RELATED_LIMIT = 3;
const DEFAULT_ROW_LIMIT = 6;

type BlogListParams = {
  page?: number;
  pageSize?: number;
  q?: string;
  categorySlug?: string;
  sortBy?: BlogSortBy;
};

export type BlogBySlugResult =
  | { status: "found"; post: BlogPost }
  | { status: "redirect"; slug: string }
  | { status: "not-found" };

function toCategory(dto: BlogCategoryDto): BlogCategory {
  return {
    id: dto.id,
    name: dto.title,
    slug: dto.slug,
    description: dto.metaDescription ?? "",
  };
}

function toSummary(dto: BlogPostDto): BlogPostSummary {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    excerpt: dto.description || excerptFromHtml(dto.body),
    image: dto.image ?? null,
    categoryId: dto.categoryId,
    categorySlug: dto.categorySlug,
    categoryName: dto.categoryTitle,
    author: {
      id: dto.userId,
      name: dto.ownerName || "تیم هایپر آهن",
      avatar: null,
    },
    publishedAt: dto.publishedDate,
    updatedAt: dto.updatedDate ?? null,
    readingTimeMinutes: estimateReadingTimeMinutes(dto.body),
    tags: parseTagsFromKeywords(dto.metaKeywords),
    visits: dto.visit ?? 0,
  };
}

function toFullPost(dto: BlogPostDto): BlogPost {
  const { html, headings } = processBlogBody(dto.body);
  return {
    ...toSummary(dto),
    bodyHtml: html,
    headings,
    metaTitle: dto.effectiveMetaTitle || dto.title,
    metaDescription: dto.effectiveMetaDescription || dto.description,
    canonicalSlug: dto.canonicalSlug ?? null,
  };
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function resolveCategoryId(categorySlug?: string): Promise<string | undefined> {
  if (!categorySlug) return undefined;
  const categories = await blogService.getCategories();
  return categories.find((category) => category.slug === categorySlug)?.id;
}

function toListResult(dto: PaginatedDto<BlogPostDto>): BlogListResult {
  return {
    items: dto.items.map(toSummary),
    total: dto.totalCount,
    page: dto.pageNumber,
    pageSize: dto.pageSize,
    totalPages: Math.max(1, dto.totalPages),
  };
}

/**
 * Public Blog reads — backed by the real backend documented in
 * docs/BlogModule_frontend_integration.md. All public endpoints are
 * unauthenticated reads of published content only.
 */
export const blogService = {
  async list({
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    q = "",
    categorySlug,
    sortBy = "PublishDateDesc",
  }: BlogListParams = {}): Promise<BlogListResult> {
    // The dedicated by-category-slug endpoint is the documented preference
    // for pure category landing pages (no free-text query, default sort).
    if (!q && categorySlug && sortBy === "PublishDateDesc") {
      const dto = await apiFetch<PaginatedDto<BlogPostDto>>(
        `/api/blog/posts/by-category-slug/${encodeURIComponent(categorySlug)}${buildQuery({ page, pageSize })}`,
      );
      return toListResult(dto);
    }

    const categoryId = await resolveCategoryId(categorySlug);
    const dto = await apiFetch<PaginatedDto<BlogPostDto>>(
      `/api/blog/posts/search${buildQuery({
        title: q || undefined,
        categoryId,
        page,
        pageSize,
        sortBy,
      })}`,
    );
    return toListResult(dto);
  },

  async getLatest(count = DEFAULT_ROW_LIMIT): Promise<BlogPostSummary[]> {
    const dtos = await apiFetch<BlogPostDto[]>(`/api/blog/posts/latest${buildQuery({ count })}`);
    return dtos.map(toSummary);
  },

  async getMostVisited(count = DEFAULT_ROW_LIMIT): Promise<BlogPostSummary[]> {
    const dtos = await apiFetch<BlogPostDto[]>(`/api/blog/posts/most-visited${buildQuery({ count })}`);
    return dtos.map(toSummary);
  },

  async getBest(count = DEFAULT_ROW_LIMIT): Promise<BlogPostSummary[]> {
    const dtos = await apiFetch<BlogPostDto[]>(`/api/blog/posts/best${buildQuery({ count })}`);
    return dtos.map(toSummary);
  },

  async getFeatured(): Promise<BlogPostSummary | null> {
    const best = await blogService.getBest(1);
    if (best[0]) return best[0];
    const latest = await blogService.getLatest(1);
    return latest[0] ?? null;
  },

  async getBySlug(slug: string): Promise<BlogBySlugResult> {
    const res = await apiFetchRaw(`/api/blog/posts/by-slug/${encodeURIComponent(slug)}`, {
      redirect: "manual",
    });

    if (res.status === 404) return { status: "not-found" };

    let body: OperationResultLike<BlogPostDto> | null = null;
    try {
      body = (await res.json()) as OperationResultLike<BlogPostDto>;
    } catch {
      body = null;
    }

    if (!body) return { status: "not-found" };

    if (res.status === 301 || body.statusCode === 301) {
      const newSlug = body.result?.slug;
      if (newSlug && newSlug !== slug) return { status: "redirect", slug: newSlug };
    }

    if (!body.isSuccess || !body.result) return { status: "not-found" };

    return { status: "found", post: toFullPost(body.result) };
  },

  async getRelated(post: BlogPost, limit = DEFAULT_RELATED_LIMIT): Promise<BlogPostSummary[]> {
    const sameCategory = await blogService.list({
      categorySlug: post.categorySlug,
      pageSize: limit + 1,
    });
    const filtered = sameCategory.items.filter((item) => item.slug !== post.slug);
    if (filtered.length) return filtered.slice(0, limit);

    const latest = await blogService.getLatest(limit + 1);
    return latest.filter((item) => item.slug !== post.slug).slice(0, limit);
  },

  async getAdjacent(slug: string): Promise<{ previous: BlogPostSummary | null; next: BlogPostSummary | null }> {
    const { items } = await blogService.list({ pageSize: 100 });
    const index = items.findIndex((item) => item.slug === slug);
    if (index === -1) return { previous: null, next: null };

    // List is sorted newest-first, so the "previous" (older) post sits after
    // it in the array and the "next" (newer) post sits before it.
    return {
      previous: items[index + 1] ?? null,
      next: items[index - 1] ?? null,
    };
  },

  async getCategories(): Promise<BlogCategory[]> {
    const dtos = await apiFetch<BlogCategoryDto[]>("/api/blog/categories");
    return dtos.map(toCategory);
  },

  async getCategoryBySlug(slug: string): Promise<BlogCategory | null> {
    try {
      const dto = await apiFetch<BlogCategoryDto>(
        `/api/blog/categories/by-slug/${encodeURIComponent(slug)}`,
      );
      return toCategory(dto);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) return null;
      throw error;
    }
  },
};
