"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GlobalSearch } from "@/features/search/GlobalSearch";
import {
  CatalogQuickAccess,
  CatalogRecentlyUsed,
  type QuickAccessItem,
} from "@/features/catalog/CatalogQuickAccess";
import { CatalogCategoryCard } from "@/features/catalog/CatalogCategoryCard";
import {
  CatalogContextShortcut,
  type ContextShortcut,
} from "@/features/catalog/CatalogContextShortcut";
import { EmptyState } from "@/shared/ui/EmptyState";
import { catalogRecent } from "@/lib/catalogRecent";
import { routes } from "@/lib/routes";
import type { CatalogCategory } from "@/types/catalog";
import type { CalculationToolListItem } from "@/types/catalog";

type CatalogBrowseViewProps = {
  categories: CatalogCategory[];
  tools: CalculationToolListItem[];
};

const SHORTCUT_EVERY = 3;

function readRecentSnapshot() {
  return {
    categories: catalogRecent
      .getCategories()
      .map((c) => ({ id: c.id, name: c.name })),
    tools: catalogRecent
      .getTools()
      .map((t) => ({ slug: t.slug, title: t.title })),
    searches: catalogRecent.getSearches().map((s) => ({ q: s.q })),
  };
}

export function CatalogBrowseView({ categories, tools }: CatalogBrowseViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const recentSnapshot = useMemo(() => readRecentSnapshot(), []);
  const recentCategories = recentSnapshot.categories;
  const recentTools = recentSnapshot.tools;
  const [recentSearches, setRecentSearches] = useState(
    () => readRecentSnapshot().searches,
  );

  const quickAccess = useMemo((): QuickAccessItem[] => {
    const items: QuickAccessItem[] = [];
    const popular = categories.slice(0, 4);
    for (const c of popular) {
      items.push({
        id: `cat-${c.id}`,
        label: c.name,
        href: routes.catalog.category(c.id),
      });
    }
    if (tools.length > 0) {
      items.unshift({
        id: "tools",
        label: "محاسبه‌گرها",
        href: routes.tools.list,
        emphasized: true,
      });
    }
    items.push({
      id: "blog",
      label: "راهنما و مقالات",
      href: routes.blog.list,
    });
    items.push({
      id: "search",
      label: "جستجو",
      href: `${routes.search}?from=catalog`,
    });
    return items;
  }, [categories, tools]);

  const shortcuts = useMemo((): ContextShortcut[] => {
    const list: ContextShortcut[] = [];
    const pinnedTool = tools.find((t) => t.isPinned) ?? tools[0];
    if (pinnedTool) {
      list.push({
        id: `tool-${pinnedTool.id}`,
        title: pinnedTool.title,
        description: "محاسبه مهندسی قبل از سفارش",
        href: routes.tools.detail(pinnedTool.slug),
      });
    } else if (tools.length === 0) {
      list.push({
        id: "tools-portal",
        title: "محاسبه‌گرها",
        description: "ابزارهای منتشرشده را ببینید",
        href: routes.tools.list,
      });
    }
    list.push({
      id: "blog-guide",
      title: "راهنمای خرید",
      description: "مقالات و نکات انتخاب مقطع",
      href: routes.blog.list,
    });
    if (categories[0]) {
      list.push({
        id: `popular-${categories[0].id}`,
        title: `محصولات ${categories[0].name}`,
        description: "ورود سریع به پرفروش‌ترین دسته",
        href: routes.catalog.category(categories[0].id),
      });
    }
    return list;
  }, [tools, categories]);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (categories.length === 0) {
    return (
      <div className="space-y-5 px-4 py-4 pb-24">
        <header className="space-y-1">
          <h1 className="text-xl font-bold text-text">کاتالوگ</h1>
          <p className="text-sm text-text-muted">
            جستجو سریع‌تر از مرور دسته‌هاست
          </p>
        </header>
        <GlobalSearch
          entryFrom="catalog"
          enableSuggest
          onNavigate={(q) => {
            if (q) catalogRecent.pushSearch(q);
          }}
        />
        <EmptyState
          title="دسته‌ای یافت نشد"
          description="اتصال به سرور برقرار نیست یا هنوز دسته‌ای ثبت نشده."
          icon="📂"
        />
        <div className="text-center">
          <Link
            href={`${routes.search}?from=catalog`}
            className="text-sm font-medium text-accent"
          >
            رفتن به جستجو
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 py-4 pb-24">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-text">کاتالوگ</h1>
        <p className="text-sm text-text-muted">
          جستجو سریع‌تر از مرور دسته‌هاست
        </p>
      </header>

      <GlobalSearch
        entryFrom="catalog"
        enableSuggest
        onNavigate={(q) => {
          if (q) {
            catalogRecent.pushSearch(q);
            setRecentSearches(
              catalogRecent.getSearches().map((s) => ({ q: s.q })),
            );
          }
        }}
      />

      <CatalogQuickAccess items={quickAccess} />

      <CatalogRecentlyUsed
        categories={recentCategories}
        tools={recentTools}
        searches={recentSearches}
        categoryHref={routes.catalog.category}
        toolHref={routes.tools.detail}
        searchHref={(q) => `${routes.search}?q=${encodeURIComponent(q)}`}
      />

      <section aria-label="دسته‌بندی‌ها" className="space-y-3">
        <h2 className="text-sm font-semibold text-text">دسته‌بندی‌ها</h2>
        {categories.map((category, index) => {
          const showShortcut =
            shortcuts.length > 0 &&
            index > 0 &&
            index % SHORTCUT_EVERY === 0;
          const shortcut =
            shortcuts[Math.floor(index / SHORTCUT_EVERY) % shortcuts.length];

          return (
            <div key={category.id} className="space-y-3">
              {showShortcut && shortcut ? (
                <CatalogContextShortcut shortcut={shortcut} />
              ) : null}
              <CatalogCategoryCard
                category={category}
                expanded={expandedId === category.id}
                onToggle={() => handleToggle(category.id)}
              />
            </div>
          );
        })}
      </section>
    </div>
  );
}
