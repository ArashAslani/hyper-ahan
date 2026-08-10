import { apiFetch } from "@/lib/api-client";
import { buildQuery } from "@/lib/query";
import type {
  GroupedSearchResult,
  SearchContentType,
  SearchGroup,
  SearchHit,
  SearchMetadataItem,
} from "@/types/catalog";

/** Backend caps product presentation metadata at two items. */
const MAX_PRODUCT_METADATA = 2;

type SearchMetadataItemDto = {
  label?: string;
  value?: string;
};

type SearchHitDto = {
  documentId: string;
  sourceId: string;
  contentType: SearchContentType | number;
  title: string;
  targetPath: string;
  relevanceScore: number;
  factoryName?: string | null;
  metadata?: SearchMetadataItemDto[] | null;
};

type SearchGroupDto = {
  contentType: SearchContentType | number;
  hits: SearchHitDto[];
  totalCount: number;
};

type GroupedSearchResultDto = {
  groups: SearchGroupDto[];
  totalHits: number;
  page: number;
  pageSize: number;
};

function toMetadata(dto: SearchMetadataItemDto[] | null | undefined): SearchMetadataItem[] | undefined {
  if (!dto?.length) return undefined;
  const items = dto
    .map((m) => ({
      label: (m.label ?? "").trim(),
      value: (m.value ?? "").trim(),
    }))
    .filter((m) => m.label.length > 0 && m.value.length > 0)
    .slice(0, MAX_PRODUCT_METADATA);
  return items.length > 0 ? items : undefined;
}

function toHit(dto: SearchHitDto): SearchHit {
  const factoryName = dto.factoryName?.trim() || null;
  return {
    documentId: dto.documentId,
    sourceId: dto.sourceId,
    contentType: dto.contentType as SearchContentType,
    title: dto.title,
    targetPath: dto.targetPath,
    relevanceScore: dto.relevanceScore,
    factoryName,
    metadata: toMetadata(dto.metadata),
  };
}

function toGroup(dto: SearchGroupDto): SearchGroup {
  return {
    contentType: dto.contentType as SearchContentType,
    hits: (dto.hits ?? []).map(toHit),
    totalCount: dto.totalCount,
  };
}

export type SearchParams = {
  q: string;
  types?: string;
  page?: number;
  pageSize?: number;
};

export const searchService = {
  async suggest(q: string, limit = 8): Promise<SearchHit[]> {
    const trimmed = q.trim();
    if (trimmed.length < 2) return [];
    const dtos = await apiFetch<SearchHitDto[]>(
      `/api/search/suggest${buildQuery({ q: trimmed, limit })}`,
      { cache: "no-store" },
    );
    return (dtos ?? []).map(toHit);
  },

  async search(params: SearchParams): Promise<GroupedSearchResult> {
    const dto = await apiFetch<GroupedSearchResultDto>(
      `/api/search${buildQuery({
        q: params.q.trim(),
        types: params.types,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 20,
      })}`,
      { cache: "no-store" },
    );
    return {
      groups: (dto.groups ?? []).map(toGroup),
      totalHits: dto.totalHits,
      page: dto.page,
      pageSize: dto.pageSize,
    };
  },
};

/** Group flat suggest hits by contentType without reordering within each group. */
export function groupSuggestHits(hits: SearchHit[]): SearchGroup[] {
  const map = new Map<SearchContentType, SearchHit[]>();
  for (const hit of hits) {
    const list = map.get(hit.contentType) ?? [];
    list.push(hit);
    map.set(hit.contentType, list);
  }
  return Array.from(map.entries()).map(([contentType, groupHits]) => ({
    contentType,
    hits: groupHits,
    totalCount: groupHits.length,
  }));
}
