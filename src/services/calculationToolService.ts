import { apiFetch, ApiError } from "@/lib/api-client";
import { buildQuery } from "@/lib/query";
import type {
  CalculationToolDetail,
  CalculationToolListItem,
  ExecuteToolResult,
  UiInput,
} from "@/types/catalog";

type UiInputDto = {
  key: string;
  label: string;
  type: string;
  unit?: string | null;
  required: boolean;
  options?: { value: string; label: string }[] | null;
};

type ToolListItemDto = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  displayOrder: number;
  isPinned: boolean;
};

type ToolDetailDto = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  displayOrder: number;
  formulaTypeId: string;
  targetPath: string;
  inputs?: UiInputDto[] | null;
};

type ExecuteResultDto = {
  quantity: number;
  unit?: string | null;
  formulaKey?: string | null;
  formulaTypeId: string;
  toolId: string;
};

function toUiInput(dto: UiInputDto): UiInput {
  return {
    key: dto.key,
    label: dto.label,
    type: dto.type,
    unit: dto.unit ?? null,
    required: dto.required,
    options: dto.options ?? null,
  };
}

function toListItem(dto: ToolListItemDto): CalculationToolListItem {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    description: dto.description,
    icon: dto.icon,
    category: dto.category,
    displayOrder: dto.displayOrder,
    isPinned: dto.isPinned,
  };
}

function toDetail(dto: ToolDetailDto): CalculationToolDetail {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    description: dto.description,
    icon: dto.icon,
    category: dto.category,
    seoTitle: dto.seoTitle ?? null,
    seoDescription: dto.seoDescription ?? null,
    displayOrder: dto.displayOrder,
    formulaTypeId: dto.formulaTypeId,
    targetPath: dto.targetPath,
    inputs: (dto.inputs ?? []).map(toUiInput),
  };
}

export type ExecuteToolRequest = {
  toolId: string;
  inputs: Record<string, number>;
  inputUnits?: Record<string, string | null>;
};

export const calculationToolService = {
  async list(anonymousId?: string): Promise<CalculationToolListItem[]> {
    const dtos = await apiFetch<ToolListItemDto[]>(
      `/api/calculation/tools${buildQuery({ anonymousId })}`,
      { next: { revalidate: 30 } },
    );
    return (dtos ?? [])
      .map(toListItem)
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return a.displayOrder - b.displayOrder;
      });
  },

  async getById(id: string): Promise<CalculationToolDetail | null> {
    try {
      const dto = await apiFetch<ToolDetailDto>(
        `/api/calculation/tools/${encodeURIComponent(id)}`,
        { next: { revalidate: 60 } },
      );
      return toDetail(dto);
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 404) return null;
      throw e;
    }
  },

  async getBySlug(slug: string): Promise<CalculationToolDetail | null> {
    try {
      const dto = await apiFetch<ToolDetailDto>(
        `/api/calculation/tools/by-slug/${encodeURIComponent(slug)}`,
        { next: { revalidate: 60 } },
      );
      return toDetail(dto);
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 404) return null;
      throw e;
    }
  },

  async execute(body: ExecuteToolRequest): Promise<ExecuteToolResult> {
    const dto = await apiFetch<ExecuteResultDto>("/api/calculation/execute", {
      method: "POST",
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return {
      quantity: dto.quantity,
      unit: dto.unit ?? null,
      formulaKey: dto.formulaKey ?? null,
      formulaTypeId: dto.formulaTypeId,
      toolId: dto.toolId,
    };
  },

  /**
   * Resolve a published tool slug for a Catalog formulaTypeId.
   * Uses list() then detail (formulaTypeId is not on list DTO). Never invents IDs.
   */
  async findSlugByFormulaTypeId(
    formulaTypeId: string,
  ): Promise<string | null> {
    const tools = await this.list();
    if (tools.length === 0) return null;
    const details = await Promise.all(
      tools.map((t) => this.getById(t.id).catch(() => null)),
    );
    const match = details.find(
      (d) => d != null && d.formulaTypeId === formulaTypeId,
    );
    return match?.slug ?? null;
  },
};
