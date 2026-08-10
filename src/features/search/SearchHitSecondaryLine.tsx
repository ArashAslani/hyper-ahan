import type { SearchHit } from "@/types/catalog";

const PRODUCT: SearchHit["contentType"] = 1;

/**
 * Compact secondary line for product Search hits only.
 * Renders Backend-provided Factory + at most two display-ready metadata items.
 */
export function SearchHitSecondaryLine({ hit }: { hit: SearchHit }) {
  if (hit.contentType !== PRODUCT) return null;

  const parts: string[] = [];
  const factory = hit.factoryName?.trim();
  if (factory) parts.push(factory);

  for (const item of (hit.metadata ?? []).slice(0, 2)) {
    const label = item.label.trim();
    const value = item.value.trim();
    if (!label || !value) continue;
    parts.push(`${label}: ${value}`);
  }

  if (parts.length === 0) return null;

  return (
    <span className="mt-0.5 block truncate text-xs text-text-muted">
      {parts.join(" · ")}
    </span>
  );
}
