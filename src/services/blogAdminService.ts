import { apiFetch, apiFetchFormData } from "@/lib/api-client";
import type { BlogSortBy, FileDto } from "@/types";

/** Raw admin blog post DTO from `/api/admin/blog/posts`. */
type BlogAdminPostDto = {
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
  effectiveMetaTitle?: string;
  effectiveMetaDescription?: string;
};

type BlogAdminCategoryDto = {
  id: string;
  title: string;
  slug: string;
};

type PaginatedDto<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type BlogAdminPost = {
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
  visits: number;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  publishedAt: string;
  updatedAt: string | null;
  createdAt: string;
  isPublished: boolean;
};

export type BlogAdminCategoryOption = {
  id: string;
  title: string;
  slug: string;
};

export type BlogAdminListParams = {
  page?: number;
  pageSize?: number;
  title?: string;
  categoryId?: string;
  /** `true` = published only, `false` = drafts only, omit = all */
  isPublished?: boolean;
  sortBy?: BlogSortBy;
};

export type BlogAdminListResult = {
  items: BlogAdminPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type BlogAdminUpsertInput = {
  title: string;
  description: string;
  body: string;
  slug: string;
  userId: string;
  ownerName: string;
  categoryId: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  imageFile?: File | null;
};

export type BlogAdminUpdateInput = BlogAdminUpsertInput & {
  id: string;
};

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

function toAdminPost(dto: BlogAdminPostDto): BlogAdminPost {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? "",
    body: dto.body ?? "",
    slug: dto.slug,
    userId: dto.userId,
    ownerName: dto.ownerName,
    image: dto.image ?? null,
    categoryId: dto.categoryId,
    categoryTitle: dto.categoryTitle,
    categorySlug: dto.categorySlug,
    visits: dto.visit ?? 0,
    metaTitle: dto.metaTitle ?? "",
    metaDescription: dto.metaDescription ?? "",
    metaKeywords: dto.metaKeywords ?? "",
    publishedAt: dto.publishedDate,
    updatedAt: dto.updatedDate ?? null,
    createdAt: dto.creationDate,
    isPublished: dto.isPublished,
  };
}

function appendUpsertFields(formData: FormData, input: BlogAdminUpsertInput) {
  formData.append("title", input.title);
  formData.append("description", input.description);
  formData.append("body", input.body);
  formData.append("slug", input.slug);
  formData.append("userId", input.userId);
  formData.append("ownerName", input.ownerName);
  formData.append("categoryId", input.categoryId);
  if (input.metaTitle) formData.append("metaTitle", input.metaTitle);
  if (input.metaDescription) formData.append("metaDescription", input.metaDescription);
  if (input.metaKeywords) formData.append("metaKeywords", input.metaKeywords);
  if (input.imageFile) formData.append("ImageFile", input.imageFile);
}

/**
 * Admin Blog writes/reads — authenticated via Bearer Admin JWT.
 * Maps DTOs here only; UI never sees raw backend shapes.
 */
export const blogAdminService = {
  async list(
    params: BlogAdminListParams,
    accessToken: string,
  ): Promise<BlogAdminListResult> {
    const dto = await apiFetch<PaginatedDto<BlogAdminPostDto>>(
      `/api/admin/blog/posts/search${buildQuery({
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
        title: params.title,
        categoryId: params.categoryId,
        isPublished: params.isPublished,
        sortBy: params.sortBy ?? "PublishDateDesc",
      })}`,
      { accessToken },
    );

    return {
      items: dto.items.map(toAdminPost),
      total: dto.totalCount,
      page: dto.pageNumber,
      pageSize: dto.pageSize,
      totalPages: Math.max(1, dto.totalPages),
    };
  },

  async getById(id: string, accessToken: string): Promise<BlogAdminPost> {
    const dto = await apiFetch<BlogAdminPostDto>(`/api/admin/blog/posts/${id}`, {
      accessToken,
    });
    return toAdminPost(dto);
  },

  async getCategories(accessToken: string): Promise<BlogAdminCategoryOption[]> {
    // Public categories endpoint is documented for admin panel reads too.
    const dtos = await apiFetch<BlogAdminCategoryDto[]>(`/api/blog/categories`, {
      accessToken,
    });
    return dtos.map((dto) => ({
      id: dto.id,
      title: dto.title,
      slug: dto.slug,
    }));
  },

  async create(input: BlogAdminUpsertInput, accessToken: string): Promise<BlogAdminPost> {
    const formData = new FormData();
    appendUpsertFields(formData, input);
    const dto = await apiFetchFormData<BlogAdminPostDto>(
      `/api/admin/blog/posts`,
      formData,
      { method: "POST", accessToken },
    );
    return toAdminPost(dto);
  },

  async update(input: BlogAdminUpdateInput, accessToken: string): Promise<BlogAdminPost> {
    const formData = new FormData();
    formData.append("id", input.id);
    appendUpsertFields(formData, input);
    const dto = await apiFetchFormData<BlogAdminPostDto>(
      `/api/admin/blog/posts`,
      formData,
      { method: "PUT", accessToken },
    );
    return toAdminPost(dto);
  },

  async remove(id: string, accessToken: string): Promise<void> {
    await apiFetch<null>(`/api/admin/blog/posts/${id}`, {
      method: "DELETE",
      accessToken,
    });
  },

  async publish(id: string, accessToken: string): Promise<void> {
    await apiFetch<null>(`/api/admin/blog/posts/${id}/publish`, {
      method: "PATCH",
      accessToken,
    });
  },

  async unpublish(id: string, accessToken: string): Promise<void> {
    await apiFetch<null>(`/api/admin/blog/posts/${id}/unpublish`, {
      method: "PATCH",
      accessToken,
    });
  },

  async updateSeo(
    id: string,
    payload: { metaTitle?: string; metaDescription?: string; metaKeywords?: string },
    accessToken: string,
  ): Promise<void> {
    await apiFetch<null>(`/api/admin/blog/posts/${id}/seo`, {
      method: "PATCH",
      accessToken,
      body: JSON.stringify({ id, ...payload }),
    });
  },

  async changeSlug(
    id: string,
    newSlug: string,
    accessToken: string,
    keepCanonical = true,
  ): Promise<void> {
    await apiFetch<null>(`/api/admin/blog/posts/${id}/slug`, {
      method: "PATCH",
      accessToken,
      body: JSON.stringify({ id, newSlug, keepCanonical }),
    });
  },
};
