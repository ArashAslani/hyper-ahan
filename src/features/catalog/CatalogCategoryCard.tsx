"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { catalogService } from "@/services/catalogService";
import { routes } from "@/lib/routes";
import { catalogRecent } from "@/lib/catalogRecent";
import type { CatalogCategory } from "@/types/catalog";

type CatalogCategoryCardProps = {
  category: CatalogCategory;
  expanded: boolean;
  onToggle: () => void;
  productCount?: number | null;
  priceAvailable?: boolean;
};

export function CatalogCategoryCard({
  category,
  expanded,
  onToggle,
  productCount,
  priceAvailable,
}: CatalogCategoryCardProps) {
  const router = useRouter();
  const embedded = category.children ?? [];
  const [children, setChildren] = useState<CatalogCategory[]>(embedded);
  const [resolved, setResolved] = useState(embedded.length > 0);
  const [pending, startTransition] = useTransition();
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!expanded || resolved) return;

    startTransition(async () => {
      setLoadError(null);
      try {
        const detail = await catalogService.getCategoryById(category.id);
        const next = detail?.children ?? [];
        setChildren(next);
        setResolved(true);
        if (next.length === 0) {
          catalogRecent.pushCategory({ id: category.id, name: category.name });
          router.push(routes.catalog.category(category.id));
        }
      } catch {
        setLoadError("بارگذاری زیردسته ممکن نشد");
        setResolved(true);
        setChildren([]);
      }
    });
  }, [expanded, resolved, category.id, category.name, router]);

  const goToPlp = () => {
    catalogRecent.pushCategory({ id: category.id, name: category.name });
    router.push(routes.catalog.category(category.id));
  };

  const handleActivate = () => {
    if (resolved && children.length === 0) {
      goToPlp();
      return;
    }
    onToggle();
  };

  const avatar = category.name.trim().slice(0, 1) || "·";
  const hint =
    productCount != null
      ? `${productCount.toLocaleString("fa-IR")} محصول`
      : resolved && children.length === 0
        ? "مشاهده محصولات"
        : "برای زیردسته‌ها باز کنید";

  return (
    <article className="overflow-hidden rounded-[var(--radius-md)] bg-surface shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={handleActivate}
        aria-expanded={expanded}
        className="flex min-h-14 w-full items-center gap-3 p-4 text-start transition active:bg-bg/80"
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-accent/10 text-base font-bold text-accent"
          aria-hidden
        >
          {avatar}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-text">{category.name}</span>
            {priceAvailable ? (
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                قیمت روز
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block text-xs font-medium text-text-muted">
            {hint}
          </span>
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`w-4 text-text-muted transition-transform duration-200 ease-out ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-2 pb-2 pt-1">
            {pending && !resolved ? (
              <div className="space-y-1 px-2 py-2">
                <div className="h-12 animate-pulse rounded-[var(--radius-md)] bg-bg" />
                <div className="h-12 animate-pulse rounded-[var(--radius-md)] bg-bg" />
              </div>
            ) : null}
            {loadError ? (
              <p className="px-3 py-2 text-sm text-danger">{loadError}</p>
            ) : null}
            {children.length > 0 ? (
              <ul className="space-y-0.5">
                {children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={routes.catalog.category(child.id)}
                      onClick={() =>
                        catalogRecent.pushCategory({
                          id: child.id,
                          name: child.name,
                        })
                      }
                      className="flex min-h-12 items-center justify-between rounded-[var(--radius-md)] px-3 text-sm text-text transition hover:bg-bg active:bg-bg"
                    >
                      <span className="font-medium">{child.name}</span>
                      <span className="text-accent" aria-hidden>
                        ←
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={routes.catalog.category(category.id)}
                    onClick={() =>
                      catalogRecent.pushCategory({
                        id: category.id,
                        name: category.name,
                      })
                    }
                    className="mt-1 flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-accent/10 px-3 text-sm font-bold text-accent"
                  >
                    مشاهده همه {category.name}
                  </Link>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
