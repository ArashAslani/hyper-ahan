import { apiFetch, apiFetchBlob, apiFetchFormData } from "@/lib/api-client";
import type { FileDto, SliderButtonVariant, SliderTextAlignment } from "@/types";

type SliderAdminDto = {
  id: string;
  title: string;
  description?: string | null;
  image: FileDto | null;
  mobileImage: FileDto | null;
  images?: FileDto[];
  link: string;
  openInNewTab: boolean;
  buttonText?: string | null;
  buttonVariant?: string | null;
  overlayOpacity?: number | null;
  textAlignment?: string | null;
  displayOrder: number;
  priority: number;
  isActive: boolean;
  groupId: string;
  groupTitle: string;
  groupSlug?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  targetAudience?: string | null;
};

type SliderGroupDto = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
};

type PaginatedDto<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type SliderAdminSlide = {
  id: string;
  title: string;
  description: string;
  image: FileDto | null;
  mobileImage: FileDto | null;
  link: string;
  openInNewTab: boolean;
  buttonText: string;
  buttonVariant: SliderButtonVariant | "";
  overlayOpacity: number | null;
  textAlignment: SliderTextAlignment | "";
  displayOrder: number;
  priority: number;
  isActive: boolean;
  groupId: string;
  groupTitle: string;
  groupSlug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  createdAt: string;
  updatedAt: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type SliderAdminGroup = {
  id: string;
  title: string;
  slug: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
};

export type SliderAdminListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  groupId?: string;
  groupSlug?: string;
  isActive?: boolean;
};

export type SliderAdminListResult = {
  items: SliderAdminSlide[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type SliderAdminUpsertInput = {
  title: string;
  groupId: string;
  link: string;
  description?: string;
  displayOrder: number;
  priority: number;
  isActive: boolean;
  openInNewTab: boolean;
  buttonText?: string;
  buttonVariant?: string;
  /** Backend expects 0…1 */
  overlayOpacity?: number | null;
  textAlignment?: string;
  startDate?: string | null;
  endDate?: string | null;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  imageFile?: File | null;
  mobileImageFile?: File | null;
  clearMobileImage?: boolean;
};

export type SliderAdminUpdateInput = SliderAdminUpsertInput & {
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

function toSlide(dto: SliderAdminDto): SliderAdminSlide {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description ?? "",
    image: dto.image ?? null,
    mobileImage: dto.mobileImage ?? null,
    link: dto.link,
    openInNewTab: dto.openInNewTab,
    buttonText: dto.buttonText ?? "",
    buttonVariant: (dto.buttonVariant as SliderButtonVariant) ?? "",
    overlayOpacity: dto.overlayOpacity ?? null,
    textAlignment: (dto.textAlignment as SliderTextAlignment) ?? "",
    displayOrder: dto.displayOrder,
    priority: dto.priority,
    isActive: dto.isActive,
    groupId: dto.groupId,
    groupTitle: dto.groupTitle,
    groupSlug: dto.groupSlug ?? "",
    metaTitle: dto.metaTitle ?? "",
    metaDescription: dto.metaDescription ?? "",
    metaKeywords: dto.metaKeywords ?? "",
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt ?? null,
    startDate: dto.startDate ?? null,
    endDate: dto.endDate ?? null,
  };
}

function toGroup(dto: SliderGroupDto): SliderAdminGroup {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    description: dto.description ?? "",
    displayOrder: dto.displayOrder,
    isActive: dto.isActive,
  };
}

function appendUpsertFields(formData: FormData, input: SliderAdminUpsertInput) {
  formData.append("Title", input.title);
  formData.append("GroupId", input.groupId);
  formData.append("Link", input.link);
  formData.append("DisplayOrder", String(input.displayOrder));
  formData.append("Priority", String(input.priority));
  formData.append("IsActive", String(input.isActive));
  formData.append("OpenInNewTab", String(input.openInNewTab));

  if (input.description) formData.append("Description", input.description);
  if (input.buttonText) formData.append("ButtonText", input.buttonText);
  if (input.buttonVariant) formData.append("ButtonVariant", input.buttonVariant);
  if (input.overlayOpacity !== undefined && input.overlayOpacity !== null) {
    formData.append("OverlayOpacity", String(input.overlayOpacity));
  }
  if (input.textAlignment) formData.append("TextAlignment", input.textAlignment);
  if (input.startDate) formData.append("StartDate", input.startDate);
  if (input.endDate) formData.append("EndDate", input.endDate);
  if (input.metaTitle) formData.append("MetaTitle", input.metaTitle);
  if (input.metaDescription) formData.append("MetaDescription", input.metaDescription);
  if (input.metaKeywords) formData.append("MetaKeywords", input.metaKeywords);
  if (input.imageFile) formData.append("ImageFile", input.imageFile);
  if (input.mobileImageFile) formData.append("MobileImageFile", input.mobileImageFile);
  if (input.clearMobileImage) formData.append("ClearMobileImage", "true");
}

async function fileFromUrl(url: string, filename: string): Promise<File | null> {
  try {
    const blob = await apiFetchBlob(url);
    const extension = blob.type.split("/")[1] || "webp";
    return new File(
      [blob],
      filename.endsWith(`.${extension}`) ? filename : `${filename}.${extension}`,
      { type: blob.type || "image/webp" },
    );
  } catch {
    return null;
  }
}

/**
 * Admin Slider writes/reads — authenticated via Bearer Admin JWT.
 * Maps DTOs here only; UI never sees raw backend shapes.
 */
export const sliderAdminService = {
  async listGroups(accessToken: string): Promise<SliderAdminGroup[]> {
    const dtos = await apiFetch<SliderGroupDto[]>(`/api/admin/slider-groups`, {
      accessToken,
    });
    return dtos.map(toGroup);
  },

  async list(
    params: SliderAdminListParams,
    accessToken: string,
  ): Promise<SliderAdminListResult> {
    const dto = await apiFetch<PaginatedDto<SliderAdminDto>>(
      `/api/admin/sliders/search${buildQuery({
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 20,
        search: params.search,
        groupId: params.groupId,
        groupSlug: params.groupSlug,
        isActive: params.isActive,
      })}`,
      { accessToken },
    );

    return {
      items: dto.items.map(toSlide),
      total: dto.totalCount,
      page: dto.pageNumber,
      pageSize: dto.pageSize,
      totalPages: Math.max(1, dto.totalPages),
    };
  },

  async getById(id: string, accessToken: string): Promise<SliderAdminSlide> {
    const dto = await apiFetch<SliderAdminDto>(`/api/admin/sliders/${id}`, {
      accessToken,
    });
    return toSlide(dto);
  },

  async create(input: SliderAdminUpsertInput, accessToken: string): Promise<SliderAdminSlide> {
    const formData = new FormData();
    appendUpsertFields(formData, input);
    const dto = await apiFetchFormData<SliderAdminDto>(`/api/admin/sliders`, formData, {
      method: "POST",
      accessToken,
    });
    return toSlide(dto);
  },

  async update(input: SliderAdminUpdateInput, accessToken: string): Promise<SliderAdminSlide> {
    const formData = new FormData();
    formData.append("Id", input.id);
    appendUpsertFields(formData, input);
    const dto = await apiFetchFormData<SliderAdminDto>(`/api/admin/sliders`, formData, {
      method: "PUT",
      accessToken,
    });
    return toSlide(dto);
  },

  async remove(id: string, accessToken: string): Promise<void> {
    await apiFetch<null>(`/api/admin/sliders/${id}`, {
      method: "DELETE",
      accessToken,
    });
  },

  async enable(id: string, accessToken: string): Promise<void> {
    await apiFetch<null>(`/api/admin/sliders/${id}/enable`, {
      method: "PATCH",
      accessToken,
    });
  },

  async disable(id: string, accessToken: string): Promise<void> {
    await apiFetch<null>(`/api/admin/sliders/${id}/disable`, {
      method: "PATCH",
      accessToken,
    });
  },

  async reorder(orderedIds: string[], accessToken: string): Promise<void> {
    await apiFetch<null>(`/api/admin/sliders/reorder`, {
      method: "PATCH",
      accessToken,
      body: JSON.stringify({ orderedIds }),
    });
  },

  /** Creates a new slide by cloning metadata and re-uploading images from FileDto URLs. */
  async duplicate(id: string, accessToken: string): Promise<SliderAdminSlide> {
    const source = await sliderAdminService.getById(id, accessToken);
    if (!source.image?.url) {
      throw new Error("اسلاید مبدأ تصویر دسکتاپ ندارد.");
    }

    const imageFile = await fileFromUrl(source.image.url, `slide-${source.id}-desktop`);
    if (!imageFile) {
      throw new Error("دانلود تصویر دسکتاپ برای کپی ناموفق بود.");
    }

    const mobileImageFile = source.mobileImage?.url
      ? await fileFromUrl(source.mobileImage.url, `slide-${source.id}-mobile`)
      : null;

    return sliderAdminService.create(
      {
        title: `${source.title} (کپی)`,
        groupId: source.groupId,
        link: source.link,
        description: source.description || undefined,
        displayOrder: source.displayOrder + 1,
        priority: source.priority,
        isActive: false,
        openInNewTab: source.openInNewTab,
        buttonText: source.buttonText || undefined,
        buttonVariant: source.buttonVariant || undefined,
        overlayOpacity: source.overlayOpacity,
        textAlignment: source.textAlignment || undefined,
        startDate: source.startDate,
        endDate: source.endDate,
        metaTitle: source.metaTitle || undefined,
        metaDescription: source.metaDescription || undefined,
        metaKeywords: source.metaKeywords || undefined,
        imageFile,
        mobileImageFile,
      },
      accessToken,
    );
  },
};
