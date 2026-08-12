import type { ImportantSpecification } from "@/types/catalog";

/** Backend PLP max; Front only applies a defensive cap. */
export const MAX_IMPORTANT_SPECIFICATIONS = 2;

type ImportantSpecificationDto = {
  label?: string;
  value?: string;
};

/**
 * Map API `importantSpecifications` at the Catalog boundary.
 * Preserves Backend order and label/value text; defensively caps at the first
 * two entries without reordering; omits incomplete entries among those only
 * (does not pull later entries to fill the cap).
 */
export function mapImportantSpecifications(
  raw: ImportantSpecificationDto[] | null | undefined,
): ImportantSpecification[] {
  if (!raw?.length) return [];

  const mapped: ImportantSpecification[] = [];
  for (const item of raw.slice(0, MAX_IMPORTANT_SPECIFICATIONS)) {
    if (typeof item?.label !== "string" || typeof item?.value !== "string") {
      continue;
    }
    // Omit empty/whitespace-only entries; keep Backend text otherwise unchanged.
    if (!item.label.trim() || !item.value.trim()) continue;
    mapped.push({ label: item.label, value: item.value });
  }
  return mapped;
}

/** Defensive first-N view of already-mapped specs (no reorder). */
export function takeImportantSpecifications(
  items: ImportantSpecification[] | null | undefined,
  max = MAX_IMPORTANT_SPECIFICATIONS,
): ImportantSpecification[] {
  if (!items?.length || max <= 0) return [];
  return items.slice(0, max);
}
