import Link from "next/link";
import type { ReactNode } from "react";

export type QuickAccessItem = {
  id: string;
  label: string;
  href: string;
  /** Optional emphasis for primary discovery chips */
  emphasized?: boolean;
};

type CatalogQuickAccessProps = {
  items: QuickAccessItem[];
  title?: string;
};

export function CatalogQuickAccess({
  items,
  title = "دسترسی سریع",
}: CatalogQuickAccessProps) {
  if (items.length === 0) return null;

  return (
    <section aria-label={title} className="space-y-2">
      <h2 className="text-sm font-semibold text-text">{title}</h2>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`inline-flex min-h-12 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition active:scale-95 ${
              item.emphasized
                ? "bg-accent text-white"
                : "bg-surface text-text shadow-[var(--shadow-soft)]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}

type CatalogRecentlyUsedProps = {
  categories: { id: string; name: string }[];
  tools: { slug: string; title: string }[];
  searches: { q: string }[];
  categoryHref: (id: string) => string;
  toolHref: (slug: string) => string;
  searchHref: (q: string) => string;
};

export function CatalogRecentlyUsed({
  categories,
  tools,
  searches,
  categoryHref,
  toolHref,
  searchHref,
}: CatalogRecentlyUsedProps) {
  const hasAny =
    categories.length > 0 || tools.length > 0 || searches.length > 0;
  if (!hasAny) return null;

  return (
    <section aria-label="اخیراً استفاده‌شده" className="space-y-3">
      <h2 className="text-sm font-semibold text-text">اخیراً</h2>
      {categories.length > 0 ? (
        <RecentGroup title="دسته‌های بازدیدشده">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={categoryHref(c.id)}
              className="inline-flex min-h-11 shrink-0 items-center rounded-[var(--radius-md)] bg-surface px-3 text-sm font-medium text-text shadow-[var(--shadow-soft)]"
            >
              {c.name}
            </Link>
          ))}
        </RecentGroup>
      ) : null}
      {tools.length > 0 ? (
        <RecentGroup title="محاسبه‌گرها">
          {tools.map((t) => (
            <Link
              key={t.slug}
              href={toolHref(t.slug)}
              className="inline-flex min-h-11 shrink-0 items-center rounded-[var(--radius-md)] bg-surface px-3 text-sm font-medium text-text shadow-[var(--shadow-soft)]"
            >
              {t.title}
            </Link>
          ))}
        </RecentGroup>
      ) : null}
      {searches.length > 0 ? (
        <RecentGroup title="جستجوها">
          {searches.map((s) => (
            <Link
              key={s.q}
              href={searchHref(s.q)}
              className="inline-flex min-h-11 shrink-0 items-center rounded-[var(--radius-md)] bg-bg px-3 text-sm font-medium text-text-muted"
            >
              {s.q}
            </Link>
          ))}
        </RecentGroup>
      ) : null}
    </section>
  );
}

function RecentGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-text-muted">{title}</p>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </div>
  );
}
