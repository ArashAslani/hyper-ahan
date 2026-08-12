import type {
  CatalogPlpMetadata,
  CatalogPlpProductPage,
  CatalogPlpSpecificationFacet,
  SpecDataType,
} from "../types/catalog.ts";

export type CatalogPlpControlFacet =
  | { kind: "factory"; order: number }
  | { kind: "specification"; order: number; facet: CatalogPlpSpecificationFacet };

export function orderCatalogPlpControlFacets(
  metadata: Pick<CatalogPlpMetadata, "factoryFacet" | "specificationFacets">,
): CatalogPlpControlFacet[] {
  const sections: CatalogPlpControlFacet[] = [];
  if (metadata.factoryFacet) {
    sections.push({ kind: "factory", order: metadata.factoryFacet.order });
  }
  for (const facet of metadata.specificationFacets) {
    sections.push({ kind: "specification", order: facet.order, facet });
  }
  return sections.sort((left, right) => left.order - right.order);
}

export type CategoryPlpMetadataDto = {
  categoryId: string;
  isLeafCategory: boolean;
  factoryFacet?: {
    order: number;
    options?: Array<{ factoryId: string; label: string }> | null;
  } | null;
  specificationFacets?: Array<{
    definitionId: string;
    label: string;
    dataType: SpecDataType | number;
    order: number;
    numeric?: {
      minimum: number;
      maximum: number;
      step?: number | null;
      unitCode?: string | null;
      unitLabel?: string | null;
    } | null;
    selection?: {
      options?: Array<{
        optionId: string;
        label: string;
        displayOrder: number;
      }> | null;
    } | null;
    booleanCapability?: boolean | null;
  }> | null;
  sortOptions?: Array<{
    key: string;
    label: string;
    isDefault: boolean;
    isAvailable: boolean;
  }> | null;
};

export type CategoryPlpResponseDto<TProduct> = {
  metadata: CategoryPlpMetadataDto;
  products: {
    items?: TProduct[] | null;
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
};

export function mapCatalogPlpMetadata(
  dto: CategoryPlpMetadataDto,
): CatalogPlpMetadata {
  return {
    categoryId: dto.categoryId,
    isLeafCategory: dto.isLeafCategory,
    factoryFacet: dto.factoryFacet
      ? {
          order: dto.factoryFacet.order,
          options: (dto.factoryFacet.options ?? []).map((option) => ({
            factoryId: option.factoryId,
            label: option.label,
          })),
        }
      : null,
    specificationFacets: (dto.specificationFacets ?? []).map((facet) => ({
      definitionId: facet.definitionId,
      label: facet.label,
      dataType: facet.dataType as SpecDataType,
      order: facet.order,
      numeric: facet.numeric
        ? {
            minimum: facet.numeric.minimum,
            maximum: facet.numeric.maximum,
            step: facet.numeric.step ?? null,
            unitCode: facet.numeric.unitCode ?? null,
            unitLabel: facet.numeric.unitLabel ?? null,
          }
        : null,
      selection: facet.selection
        ? {
            options: (facet.selection.options ?? []).map((option) => ({
              optionId: option.optionId,
              label: option.label,
              displayOrder: option.displayOrder,
            })),
          }
        : null,
      booleanCapability: facet.booleanCapability ?? null,
    })),
    sortOptions: (dto.sortOptions ?? []).map((option) => ({
      key: option.key,
      label: option.label,
      isDefault: option.isDefault,
      isAvailable: option.isAvailable,
    })),
  };
}

export function mapCatalogPlpResponse<TDto, TProduct>(
  dto: CategoryPlpResponseDto<TDto>,
  mapProduct: (product: TDto) => TProduct,
): {
  metadata: CatalogPlpMetadata;
  products: Omit<CatalogPlpProductPage, "items"> & { items: TProduct[] };
} {
  return {
    metadata: mapCatalogPlpMetadata(dto.metadata),
    products: {
      items: (dto.products.items ?? []).map(mapProduct),
      page: dto.products.page,
      pageSize: dto.products.pageSize,
      totalCount: dto.products.totalCount,
      totalPages: dto.products.totalPages,
      hasPreviousPage: dto.products.hasPreviousPage,
      hasNextPage: dto.products.hasNextPage,
    },
  };
}
