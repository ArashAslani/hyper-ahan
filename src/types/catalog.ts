/**
 * Catalog / Search / Pricing / Calculation domain types —
 * aligned with docs/docs/frontend/01-Frontend-API-Contracts.md
 */

// ─── Shared pagination ───────────────────────────────────────────────

export type PaginatedData<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
};

// ─── Catalog enums (numeric from backend) ────────────────────────────

export type SaleMode = 1 | 2 | 3;
/** FullyOnline=1, SemiCustom=2, FullyCustom=3 */

export type OutOfStockDisplayPolicy = 1 | 2 | 3;
/** Hidden=1, TaggedNoAction=2, ContactButton=3 */

export type SpecDataType = 1 | 2 | 3 | 4 | 5 | 6;
/** Text=1, Number=2, Decimal=3, Boolean=4, Date=5, Selection=6 */

export type FactoryStatus = 1 | 2;
/** Active=1, Inactive=2 */

// ─── Catalog DTOs (frontend domain shapes after service mapping) ─────

export type CatalogCategory = {
  id: string;
  name: string;
  parentCategoryId: string | null;
  specificationTemplateId: string;
  isRoot: boolean;
  formulaTypeId: string | null;
  children?: CatalogCategory[];
};

export type CatalogOrderUnit = {
  id: string;
  unit: string;
  conversionFactor: number;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number | null;
  isDefault: boolean;
};

export type CatalogSpecValue = {
  specificationDefinitionId: string;
  value: string;
};

export type CatalogProduct = {
  id: string;
  displayName: string;
  categoryId: string;
  factoryId: string;
  registrationUnit: string;
  saleMode: SaleMode;
  outOfStockDisplayPolicy: OutOfStockDisplayPolicy;
  orderUnits: CatalogOrderUnit[];
  specificationValues: CatalogSpecValue[];
  formulaTypeId: string | null;
};

export type SpecDefinition = {
  id: string;
  name: string;
  dataType: SpecDataType;
  displayOrder: number;
  isRequired: boolean;
  isSearchable: boolean;
};

export type SpecTemplate = {
  id: string;
  name: string;
  definitions: SpecDefinition[];
};

export type CatalogFactory = {
  id: string;
  name: string;
  status: FactoryStatus;
  isActive: boolean;
};

// ─── Search ──────────────────────────────────────────────────────────

export type SearchContentType = 1 | 2 | 3 | 4;
/** Product=1, Category=2, Article=3, CalculationTool=4 */

/** Display-ready Persian label/value from Backend Search. Never a definition ID. */
export type SearchMetadataItem = {
  label: string;
  value: string;
};

export type SearchHit = {
  documentId: string;
  sourceId: string;
  contentType: SearchContentType;
  title: string;
  targetPath: string;
  relevanceScore: number;
  /** Optional; product hits only. */
  factoryName?: string | null;
  /** Optional; at most two display-ready items from Backend. */
  metadata?: SearchMetadataItem[] | null;
};

export type SearchGroup = {
  contentType: SearchContentType;
  hits: SearchHit[];
  totalCount: number;
};

export type GroupedSearchResult = {
  groups: SearchGroup[];
  totalHits: number;
  page: number;
  pageSize: number;
};

// ─── Pricing ─────────────────────────────────────────────────────────

export type FinalPrice = {
  isSellable: boolean;
  salesStatus: string | number;
  resolvedBasePrice: number | null;
  payableQuantity: number | null;
  subtotal: number | null;
  vatApplied: boolean;
  vatAmount: number | null;
  finalPrice: number | null;
  appliedTierId: string | null;
  priceId: string | null;
};

export type ActivePrice = {
  isSellable: boolean;
  salesStatus: string | number;
  price: {
    id: string;
    amount?: number;
    currency?: string;
  } | null;
};

// ─── Calculation Tools ───────────────────────────────────────────────

export type UiInputType = string;

export type UiInput = {
  key: string;
  label: string;
  type: UiInputType;
  unit?: string | null;
  required: boolean;
  options?: { value: string; label: string }[] | null;
};

export type CalculationToolListItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  displayOrder: number;
  isPinned: boolean;
};

export type CalculationToolDetail = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  category: string;
  seoTitle: string | null;
  seoDescription: string | null;
  displayOrder: number;
  formulaTypeId: string;
  targetPath: string;
  inputs: UiInput[];
};

export type ExecuteToolResult = {
  quantity: number;
  unit: string | null;
  formulaKey: string | null;
  formulaTypeId: string;
  toolId: string;
};
