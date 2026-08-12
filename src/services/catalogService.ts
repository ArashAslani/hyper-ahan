import { apiFetch, ApiError } from "@/lib/api-client";
import { mapImportantSpecifications } from "@/lib/importantSpecifications";
import {
  toComparisonUnit,
  toRegistrationUnit,
} from "@/lib/catalogUnitMapping";
import {
  mapCatalogPlpResponse,
  type CategoryPlpResponseDto,
} from "@/lib/catalogPlpMapping";
import type {
  CatalogCategory,
  CatalogFactory,
  CatalogOrderUnit,
  CatalogPlpQuery,
  CatalogPlpResult,
  CatalogProduct,
  CatalogSpecValue,
  OutOfStockDisplayPolicy,
  ProductCommercial,
  ProductCommercialState,
  RegistrationUnit,
  SaleMode,
  SpecDataType,
  SpecDefinition,
  SpecTemplate,
  FactoryStatus,
} from "@/types/catalog";

/** Raw backend DTOs — mapped only in this service. */

type CategoryDto = {
  id: string;
  name: string;
  parentCategoryId?: string | null;
  specificationTemplateId: string;
  isRoot: boolean;
  formulaTypeId?: string | null;
  children?: CategoryDto[];
};

type OrderUnitDto = {
  id: string;
  unit: string;
  conversionFactor: number;
  minimumOrderQuantity: number;
  maximumOrderQuantity?: number | null;
  isDefault: boolean;
};

type SpecValueDto = {
  specificationDefinitionId: string;
  value: string;
};

type RegistrationUnitDto = {
  code?: string;
  label?: string;
};

type ComparisonUnitDto = {
  code?: string;
  label?: string;
};

type ProductCommercialDto = {
  state?: string;
  amount?: number | null;
  currency?: string;
  comparisonUnit?: ComparisonUnitDto | null;
  priceUpdatedAt?: string | null;
};

type ProductDto = {
  id: string;
  displayName: string;
  categoryId: string;
  factoryId: string;
  /** Legacy string or current { code, label } RegistrationUnitDto. */
  registrationUnit: string | RegistrationUnitDto;
  saleMode: SaleMode | number;
  outOfStockDisplayPolicy: OutOfStockDisplayPolicy | number;
  orderUnits?: OrderUnitDto[] | null;
  specificationValues?: SpecValueDto[] | null;
  formulaTypeId?: string | null;
  commercial?: ProductCommercialDto | null;
  importantSpecifications?: Array<{ label?: string; value?: string }> | null;
};

type SpecDefinitionDto = {
  id: string;
  name: string;
  dataType: SpecDataType | number;
  displayOrder: number;
  isRequired: boolean;
  isSearchable: boolean;
};

type SpecTemplateDto = {
  id: string;
  name: string;
  definitions?: SpecDefinitionDto[] | null;
};

type FactoryDto = {
  id: string;
  name: string;
  status: FactoryStatus | number;
  isActive: boolean;
};

function toOrderUnit(dto: OrderUnitDto): CatalogOrderUnit {
  return {
    id: dto.id,
    unit: dto.unit,
    conversionFactor: dto.conversionFactor,
    minimumOrderQuantity: dto.minimumOrderQuantity,
    maximumOrderQuantity: dto.maximumOrderQuantity ?? null,
    isDefault: dto.isDefault,
  };
}

function toSpecValue(dto: SpecValueDto): CatalogSpecValue {
  return {
    specificationDefinitionId: dto.specificationDefinitionId,
    value: dto.value,
  };
}

function toCommercialState(raw: string | undefined): ProductCommercialState | null {
  if (raw === "Purchasable" || raw === "ContactUs") return raw;
  return null;
}

function toCommercial(
  dto: ProductCommercialDto | null | undefined,
  registrationUnit: RegistrationUnit,
): ProductCommercial | null {
  if (!dto) return null;
  const state = toCommercialState(dto.state);
  if (!state) return null;

  const currency = (dto.currency ?? "").trim().toUpperCase();
  const amount =
    typeof dto.amount === "number" && Number.isFinite(dto.amount)
      ? dto.amount
      : null;

  return {
    state,
    // Missing/invalid currency must not invent a price; UI omits numeric when currency unusable.
    amount: state === "Purchasable" ? amount : null,
    currency,
    comparisonUnit: toComparisonUnit(dto.comparisonUnit, registrationUnit),
    priceUpdatedAt: dto.priceUpdatedAt?.trim() || null,
  };
}

function toProduct(dto: ProductDto): CatalogProduct {
  const registrationUnit = toRegistrationUnit(dto.registrationUnit);
  return {
    id: dto.id,
    displayName: dto.displayName,
    categoryId: dto.categoryId,
    factoryId: dto.factoryId,
    registrationUnit,
    saleMode: dto.saleMode as SaleMode,
    outOfStockDisplayPolicy: dto.outOfStockDisplayPolicy as OutOfStockDisplayPolicy,
    orderUnits: (dto.orderUnits ?? []).map(toOrderUnit),
    specificationValues: (dto.specificationValues ?? []).map(toSpecValue),
    formulaTypeId: dto.formulaTypeId ?? null,
    commercial: toCommercial(dto.commercial, registrationUnit),
    importantSpecifications: mapImportantSpecifications(
      dto.importantSpecifications,
    ),
  };
}

function toCategory(dto: CategoryDto): CatalogCategory {
  return {
    id: dto.id,
    name: dto.name,
    parentCategoryId: dto.parentCategoryId ?? null,
    specificationTemplateId: dto.specificationTemplateId,
    isRoot: dto.isRoot,
    formulaTypeId: dto.formulaTypeId ?? null,
    children: dto.children?.map(toCategory),
  };
}

function toTemplate(dto: SpecTemplateDto): SpecTemplate {
  const definitions: SpecDefinition[] = (dto.definitions ?? [])
    .map((d) => ({
      id: d.id,
      name: d.name,
      dataType: d.dataType as SpecDataType,
      displayOrder: d.displayOrder,
      isRequired: d.isRequired,
      isSearchable: d.isSearchable,
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return { id: dto.id, name: dto.name, definitions };
}

function toFactory(dto: FactoryDto): CatalogFactory {
  return {
    id: dto.id,
    name: dto.name,
    status: dto.status as FactoryStatus,
    isActive: dto.isActive,
  };
}

/** Build a forest from a flat category list using parentCategoryId. */
export function buildCategoryTree(categories: CatalogCategory[]): CatalogCategory[] {
  const byId = new Map<string, CatalogCategory>();
  for (const c of categories) {
    byId.set(c.id, { ...c, children: [] });
  }
  const roots: CatalogCategory[] = [];
  for (const c of byId.values()) {
    if (c.parentCategoryId && byId.has(c.parentCategoryId)) {
      byId.get(c.parentCategoryId)!.children!.push(c);
    } else if (c.isRoot || !c.parentCategoryId) {
      roots.push(c);
    } else {
      roots.push(c);
    }
  }
  return roots;
}

export const catalogService = {
  async getCategories(): Promise<CatalogCategory[]> {
    const dtos = await apiFetch<CategoryDto[]>("/api/catalog/categories", {
      next: { revalidate: 120 },
    });
    return dtos.map(toCategory);
  },

  async getCategoryTree(): Promise<CatalogCategory[]> {
    const flat = await this.getCategories();
    // Prefer children from detail shape if present; otherwise build from flat list.
    if (flat.some((c) => c.children && c.children.length > 0)) {
      return flat.filter((c) => c.isRoot || !c.parentCategoryId);
    }
    return buildCategoryTree(flat);
  },

  async getCategoryById(id: string): Promise<CatalogCategory | null> {
    try {
      const dto = await apiFetch<CategoryDto>(
        `/api/catalog/categories/${encodeURIComponent(id)}`,
        { next: { revalidate: 120 } },
      );
      return toCategory(dto);
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 404) return null;
      throw e;
    }
  },

  async getProductById(id: string): Promise<CatalogProduct | null> {
    try {
      const dto = await apiFetch<ProductDto>(
        `/api/catalog/products/${encodeURIComponent(id)}`,
        { next: { revalidate: 60 } },
      );
      return toProduct(dto);
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 404) return null;
      throw e;
    }
  },

  async getProductsByCategory(categoryId: string): Promise<CatalogProduct[]> {
    const dtos = await apiFetch<ProductDto[]>(
      `/api/catalog/products/by-category/${encodeURIComponent(categoryId)}`,
      { next: { revalidate: 60 } },
    );
    return dtos.map(toProduct);
  },

  async queryCategoryPlp(query: CatalogPlpQuery): Promise<CatalogPlpResult> {
    const dto = await apiFetch<CategoryPlpResponseDto<ProductDto>>(
      `/api/catalog/categories/${encodeURIComponent(query.categoryId)}/plp`,
      {
        method: "POST",
        body: JSON.stringify(query),
        cache: "no-store",
      },
    );
    return mapCatalogPlpResponse(dto, toProduct);
  },

  async getProductsByFactory(factoryId: string): Promise<CatalogProduct[]> {
    const dtos = await apiFetch<ProductDto[]>(
      `/api/catalog/products/by-factory/${encodeURIComponent(factoryId)}`,
      { next: { revalidate: 60 } },
    );
    return dtos.map(toProduct);
  },

  async getTemplates(): Promise<SpecTemplate[]> {
    const dtos = await apiFetch<SpecTemplateDto[]>("/api/catalog/templates", {
      next: { revalidate: 120 },
    });
    return dtos.map(toTemplate);
  },

  async getTemplateById(id: string): Promise<SpecTemplate | null> {
    try {
      const dto = await apiFetch<SpecTemplateDto>(
        `/api/catalog/templates/${encodeURIComponent(id)}`,
        { next: { revalidate: 120 } },
      );
      return toTemplate(dto);
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 404) return null;
      throw e;
    }
  },

  async getFactories(): Promise<CatalogFactory[]> {
    const dtos = await apiFetch<FactoryDto[]>("/api/catalog/factories", {
      next: { revalidate: 120 },
    });
    return dtos.map(toFactory);
  },

  async getFactoryById(id: string): Promise<CatalogFactory | null> {
    try {
      const dto = await apiFetch<FactoryDto>(
        `/api/catalog/factories/${encodeURIComponent(id)}`,
        { next: { revalidate: 120 } },
      );
      return toFactory(dto);
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 404) return null;
      throw e;
    }
  },
};
