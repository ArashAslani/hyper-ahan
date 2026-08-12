import type { ComparisonUnit, RegistrationUnit } from "../types/catalog.ts";

export type RegistrationUnitDto = {
  code?: string;
  label?: string;
};

export type ComparisonUnitDto = {
  code?: string;
  label?: string;
};

/**
 * Boundary map for RegistrationUnit.
 * Label is Backend display text only (may be blank); never fall back to code.
 */
export function toRegistrationUnit(
  raw: string | RegistrationUnitDto | null | undefined,
): RegistrationUnit {
  if (typeof raw === "string") {
    const label = raw.trim();
    return { code: label.toLowerCase(), label };
  }
  const code = (raw?.code ?? "").trim().toLowerCase();
  const label = (raw?.label ?? "").trim();
  // Machine-identity only: if Backend omits code, derive from label when present.
  return { code: code || (label ? label.toLowerCase() : ""), label };
}

/**
 * Boundary map for ComparisonUnit.
 * Label is Backend display text only (may be blank); never substitute fallback.label.
 */
export function toComparisonUnit(
  raw: ComparisonUnitDto | null | undefined,
  fallback: RegistrationUnit,
): ComparisonUnit {
  const code = (raw?.code ?? "").trim().toLowerCase() || fallback.code;
  const label = (raw?.label ?? "").trim();
  return { code, label };
}
