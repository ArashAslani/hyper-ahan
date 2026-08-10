"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCalculator,
  faFolder,
  faNewspaper,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { SearchBar } from "@/shared/ui/SearchBar";
import { SearchHitSecondaryLine } from "@/features/search/SearchHitSecondaryLine";
import { routes } from "@/lib/routes";
import {
  SEARCH_CONTENT_TYPE_LABELS,
  SEARCH_DISPLAY_ORDER,
} from "@/lib/catalogLabels";
import { groupSuggestHits, searchService } from "@/services/searchService";
import type { SearchContentType, SearchHit } from "@/types/catalog";

const TYPE_ICONS: Record<SearchContentType, typeof faBox> = {
  1: faBox,
  2: faFolder,
  3: faNewspaper,
  4: faCalculator,
};

export type SearchEntryFrom = "home" | "catalog";

type GlobalSearchProps = {
  initialQuery?: string;
  /** When true, typing triggers suggest; Enter goes to SRP. */
  enableSuggest?: boolean;
  /** Called with the submitted query (if any) before navigation. */
  onNavigate?: (query?: string) => void;
  /** Autofocus the input (direct `/search` entry only). */
  autoFocus?: boolean;
  /**
   * Marks navigations that originated outside `/search` so the SRP
   * can suppress autofocus on empty entry.
   */
  entryFrom?: SearchEntryFrom;
};

export function GlobalSearch({
  initialQuery = "",
  enableSuggest = true,
  onNavigate,
  autoFocus = false,
  entryFrom,
}: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const abortRef = useRef<AbortController | null>(null);

  const trimmed = query.trim();
  const canSuggest = enableSuggest && trimmed.length >= 2;

  useEffect(() => {
    if (!canSuggest) return;

    const timer = window.setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      startTransition(async () => {
        try {
          const result = await searchService.suggest(trimmed, 8);
          if (!controller.signal.aborted) {
            setHits(result);
            setError(null);
          }
        } catch {
          if (!controller.signal.aborted) {
            setHits([]);
            setError("پیشنهادی در دسترس نیست");
          }
        }
      });
    }, 280);

    return () => {
      window.clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [trimmed, canSuggest]);

  const groups = useMemo(() => {
    if (!canSuggest) return [];
    const grouped = groupSuggestHits(hits);
    const order = new Map(SEARCH_DISPLAY_ORDER.map((t, i) => [t, i]));
    return grouped.sort(
      (a, b) => (order.get(a.contentType) ?? 99) - (order.get(b.contentType) ?? 99),
    );
  }, [hits, canSuggest]);

  const buildSearchHref = (q: string) => {
    const params = new URLSearchParams();
    if (q) {
      params.set("q", q);
      params.set("page", "1");
    } else if (entryFrom) {
      params.set("from", entryFrom);
    }
    const qs = params.toString();
    return qs ? `${routes.search}?${qs}` : routes.search;
  };

  const goToResults = () => {
    const q = query.trim();
    onNavigate?.(q || undefined);
    router.push(buildSearchHref(q));
  };

  const goToHit = (hit: SearchHit) => {
    const raw = hit.targetPath?.trim() ?? "";
    // Reject protocol-relative / absolute URLs (open-redirect hardening).
    const safe =
      raw.startsWith("/") &&
      !raw.startsWith("//") &&
      !raw.includes("://") &&
      !raw.includes("\\")
        ? raw
        : raw && !raw.includes("://") && !raw.startsWith("//")
          ? `/${raw.replace(/^\/+/, "")}`
          : routes.search;
    onNavigate?.(query.trim() || undefined);
    router.push(safe || routes.search);
  };

  return (
    <div className="space-y-3">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={goToResults}
        autoFocus={autoFocus}
        placeholder="جستجوی محصول، دسته، مقاله، محاسبه‌گر..."
      />

      {canSuggest ? (
        <div className="rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-soft)]">
          {pending && hits.length === 0 ? (
            <p className="px-4 py-3 text-sm text-text-muted">در حال جستجو…</p>
          ) : null}
          {error ? (
            <p className="px-4 py-3 text-sm text-text-muted">{error}</p>
          ) : null}
          {!error && groups.length === 0 && !pending ? (
            <p className="px-4 py-3 text-sm text-text-muted">نتیجه‌ای یافت نشد</p>
          ) : null}
          {groups.map((group) => (
            <div key={group.contentType} className="border-t border-border first:border-t-0">
              <p className="px-4 pt-3 text-xs font-bold text-text-muted">
                {SEARCH_CONTENT_TYPE_LABELS[group.contentType]}
              </p>
              <ul>
                {group.hits.map((hit) => (
                  <li key={hit.documentId}>
                    <button
                      type="button"
                      onClick={() => goToHit(hit)}
                      className="flex min-h-[var(--touch-min)] w-full items-center gap-3 px-4 py-2 text-start text-sm text-text hover:bg-bg"
                    >
                      <FontAwesomeIcon
                        icon={TYPE_ICONS[hit.contentType] ?? faSearch}
                        className="w-4 shrink-0 text-accent"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">{hit.title}</span>
                        <SearchHitSecondaryLine hit={hit} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button
            type="button"
            onClick={goToResults}
            className="flex min-h-[var(--touch-min)] w-full items-center justify-center border-t border-border text-sm font-medium text-accent"
          >
            مشاهده همه نتایج
          </button>
        </div>
      ) : null}
    </div>
  );
}
