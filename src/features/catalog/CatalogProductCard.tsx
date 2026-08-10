import Link from "next/link";
import { routes } from "@/lib/routes";
import { SALE_MODE_LABELS } from "@/lib/catalogLabels";
import type { CatalogProduct } from "@/types/catalog";

type CatalogProductCardProps = {
  product: CatalogProduct;
  factoryName?: string;
};

/** Catalog PLP card — no hard-coded price; pricing loads on PDP. */
export function CatalogProductCard({
  product,
  factoryName,
}: CatalogProductCardProps) {
  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-card)] transition hover:-translate-y-0.5">
      <Link href={routes.catalog.product(product.id)} className="block p-4">
        <h3 className="text-base font-bold text-text">{product.displayName}</h3>
        {factoryName ? (
          <p className="mt-1 text-sm text-text-muted">{factoryName}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-muted">
          <span className="rounded-full bg-bg px-2 py-1">
            واحد: {product.registrationUnit}
          </span>
          <span className="rounded-full bg-accent/10 px-2 py-1 text-accent">
            {SALE_MODE_LABELS[product.saleMode] ?? "—"}
          </span>
        </div>
        <span className="mt-4 inline-block text-sm font-medium text-accent">
          مشاهده جزئیات ←
        </span>
      </Link>
    </article>
  );
}
