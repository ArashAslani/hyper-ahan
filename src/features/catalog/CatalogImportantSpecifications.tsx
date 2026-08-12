import type { ImportantSpecification } from "@/types/catalog";
import { takeImportantSpecifications } from "@/lib/importantSpecifications";

type CatalogImportantSpecificationsProps = {
  items: ImportantSpecification[] | null | undefined;
  /** Tighter spacing/typography for PLP card scan density. */
  compact?: boolean;
};

/**
 * Presentational-only: renders Backend PLP important specifications.
 * No selection, sorting, translation, API calls, or Pricing behavior.
 */
export function CatalogImportantSpecifications({
  items,
  compact = false,
}: CatalogImportantSpecificationsProps) {
  const specs = takeImportantSpecifications(items);
  if (specs.length === 0) return null;

  return (
    <ul
      className={
        compact
          ? "mt-2 space-y-0.5 text-xs text-text-muted"
          : "space-y-1 text-sm text-text"
      }
    >
      {specs.map((spec, index) => (
        <li
          key={`${index}:${spec.label}`}
          className="min-w-0 truncate"
          title={`${spec.label}: ${spec.value}`}
        >
          <span className="text-text-muted">{spec.label}</span>
          <span className="text-text-muted">: </span>
          <span className="font-medium text-text">{spec.value}</span>
        </li>
      ))}
    </ul>
  );
}
