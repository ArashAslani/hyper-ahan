import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCalculator,
  faFolder,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { SearchPageSearch } from "@/features/search/SearchPageSearch";
import { SearchRecentList } from "@/features/search/SearchRecentList";
import { SearchHitSecondaryLine } from "@/features/search/SearchHitSecondaryLine";
import { TrackRecentSearch } from "@/features/search/TrackRecentSearch";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Button } from "@/shared/ui/Button";
import {
  SEARCH_CONTENT_TYPE_LABELS,
  SEARCH_DISPLAY_ORDER,
  searchContentTypeName,
} from "@/lib/catalogLabels";
import { routes } from "@/lib/routes";
import { searchService } from "@/services/searchService";
import type { SearchContentType } from "@/types/catalog";

export const dynamic = "force-dynamic";

const TYPE_ICONS = {
  1: faBox,
  2: faFolder,
  3: faNewspaper,
  4: faCalculator,
} as const;

type PageProps = {
  searchParams: Promise<{
    q?: string;
    types?: string;
    page?: string;
    pageSize?: string;
    from?: string;
  }>;
};

function buildSearchHref(opts: {
  q: string;
  types?: string;
  page?: number;
}) {
  const params = new URLSearchParams();
  if (opts.q) params.set("q", opts.q);
  if (opts.types) params.set("types", opts.types);
  params.set("page", String(opts.page ?? 1));
  const qs = params.toString();
  return qs ? `${routes.search}?${qs}` : routes.search;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const types = sp.types?.trim() || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(sp.pageSize) || 20));
  const from = (sp.from ?? "").trim();
  const autoFocus = !q && from !== "home" && from !== "catalog";

  const result =
    q.length > 0
      ? await searchService.search({ q, types, page, pageSize }).catch(() => null)
      : null;

  const orderedGroups = result
    ? [...result.groups].sort((a, b) => {
        const order = new Map(SEARCH_DISPLAY_ORDER.map((t, i) => [t, i]));
        return (order.get(a.contentType) ?? 99) - (order.get(b.contentType) ?? 99);
      })
    : [];

  const totalPages = result
    ? Math.max(1, Math.ceil(result.totalHits / result.pageSize))
    : 1;

  const typeFilters: SearchContentType[] = [1, 2, 3, 4];

  return (
    <div className="px-4 py-4">
      <h1 className="mb-4 text-xl font-bold text-text">جستجو</h1>
      <SearchPageSearch
        key={q || "empty"}
        initialQuery={q}
        autoFocus={autoFocus}
      />
      {q ? <TrackRecentSearch q={q} /> : null}

      {q ? (
        <>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            <Link href={buildSearchHref({ q, page: 1 })}>
              <Button
                type="button"
                variant={!types ? "accent" : "outline"}
                className="shrink-0 text-sm"
              >
                همه
              </Button>
            </Link>
            {typeFilters.map((type) => {
              const name = searchContentTypeName(type);
              const active = types
                ?.split(",")
                .map((t) => t.trim())
                .includes(name);
              return (
                <Link
                  key={type}
                  href={buildSearchHref({
                    q,
                    types: name,
                    page: 1,
                  })}
                >
                  <Button
                    type="button"
                    variant={active ? "accent" : "outline"}
                    className="shrink-0 text-sm"
                  >
                    {SEARCH_CONTENT_TYPE_LABELS[type]}
                  </Button>
                </Link>
              );
            })}
          </div>

          {!result ? (
            <div className="mt-6">
              <EmptyState
                title="خطا در جستجو"
                description="لطفاً دوباره تلاش کنید."
                icon="⚠️"
              />
            </div>
          ) : result.totalHits === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="نتیجه‌ای یافت نشد"
                description={`برای «${q}» نتیجه‌ای پیدا نشد.`}
                icon="🔍"
              />
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <p className="text-sm text-text-muted">
                {result.totalHits.toLocaleString("fa-IR")} نتیجه
              </p>
              {orderedGroups.map((group) => (
                <section key={group.contentType}>
                  <h2 className="mb-2 text-sm font-bold text-text">
                    {SEARCH_CONTENT_TYPE_LABELS[group.contentType]}
                    <span className="mr-2 font-normal text-text-muted">
                      ({group.totalCount.toLocaleString("fa-IR")})
                    </span>
                  </h2>
                  <ul className="space-y-2">
                    {group.hits.map((hit) => (
                      <li key={hit.documentId}>
                        <Link
                          href={
                            hit.targetPath?.startsWith("/")
                              ? hit.targetPath
                              : `/${hit.targetPath ?? ""}`
                          }
                          className="flex min-h-[var(--touch-min)] items-center gap-3 rounded-[var(--radius-md)] bg-surface px-3 py-3 shadow-[var(--shadow-soft)]"
                        >
                          <FontAwesomeIcon
                            icon={TYPE_ICONS[hit.contentType]}
                            className="w-4 shrink-0 text-accent"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium text-text">{hit.title}</span>
                            <SearchHitSecondaryLine hit={hit} />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              {totalPages > 1 ? (
                <div className="flex items-center justify-between gap-2 pt-2">
                  {page > 1 ? (
                    <Link
                      href={buildSearchHref({ q, types, page: page - 1 })}
                      className="text-sm font-medium text-accent"
                    >
                      قبلی
                    </Link>
                  ) : (
                    <span />
                  )}
                  <span className="text-sm text-text-muted">
                    صفحه {page.toLocaleString("fa-IR")} از{" "}
                    {totalPages.toLocaleString("fa-IR")}
                  </span>
                  {page < totalPages ? (
                    <Link
                      href={buildSearchHref({ q, types, page: page + 1 })}
                      className="text-sm font-medium text-accent"
                    >
                      بعدی
                    </Link>
                  ) : (
                    <span />
                  )}
                </div>
              ) : null}
            </div>
          )}
        </>
      ) : (
        <SearchRecentList />
      )}
    </div>
  );
}
