/**
 * Calculator → PDP/ATC handoff.
 * Engineering qty/unit only — never money, never QuoteCart lines.
 */

export const ENGINEERING_PREFILL_KEY = "ha_engineering_prefill_v1";

export type EngineeringPrefill = {
  productId: string;
  quantity: number;
  unit: string | null;
  toolId?: string | null;
  formulaTypeId?: string | null;
  createdAt: number;
};

/** Case-insensitive trim compare of unit strings. */
export function unitsMatch(
  a: string | null | undefined,
  b: string | null | undefined,
): boolean {
  if (a == null || b == null) return false;
  const left = a.trim().toLowerCase();
  const right = b.trim().toLowerCase();
  if (!left || !right) return false;
  return left === right;
}

export function writeEngineeringPrefill(
  prefill: Omit<EngineeringPrefill, "createdAt">,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: EngineeringPrefill = {
      ...prefill,
      createdAt: Date.now(),
    };
    window.sessionStorage.setItem(
      ENGINEERING_PREFILL_KEY,
      JSON.stringify(payload),
    );
  } catch {
    /* private mode / quota */
  }
}

export function readEngineeringPrefill(
  productId?: string,
): EngineeringPrefill | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(ENGINEERING_PREFILL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EngineeringPrefill;
    if (
      !parsed ||
      typeof parsed.productId !== "string" ||
      typeof parsed.quantity !== "number" ||
      !Number.isFinite(parsed.quantity)
    ) {
      return null;
    }
    if (productId && parsed.productId !== productId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearEngineeringPrefill(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(ENGINEERING_PREFILL_KEY);
  } catch {
    /* ignore */
  }
}

/** Compact audit string for QuoteCartItem.calculationRef. */
export function formatEngineeringAuditRef(
  prefill: Pick<EngineeringPrefill, "quantity" | "unit" | "toolId">,
): string {
  const unit = prefill.unit?.trim() || "";
  const tool = prefill.toolId ? `|tool:${prefill.toolId}` : "";
  return `eng:${prefill.quantity}${unit ? `:${unit}` : ""}${tool}`;
}
