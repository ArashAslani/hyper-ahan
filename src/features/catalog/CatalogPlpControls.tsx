"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { orderCatalogPlpControlFacets } from "@/lib/catalogPlpMapping";
import {
  buildCatalogPlpContinuousHref,
  resetCatalogPlpPage,
  type CatalogPlpUrlState,
} from "@/lib/catalogPlpQuery";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { Fab } from "@/shared/ui/Fab";
import type {
  CatalogPlpMetadata,
  CatalogPlpProductPage,
} from "@/types/catalog";

type RangeDraft = { minimum: string; maximum: string };

type ControlsDraft = {
  sort: string;
  factoryIds: string[];
  selectionByDefinition: Record<string, string[]>;
  rangesByDefinition: Record<string, RangeDraft>;
  booleansByDefinition: Record<string, "" | "true" | "false">;
};

type CatalogPlpControlsProps = {
  metadata: CatalogPlpMetadata;
  productPage: CatalogPlpProductPage;
  urlState: CatalogPlpUrlState;
  pathname: string;
  loadedCount?: number;
  loadingMore?: boolean;
};

function draftFromState(state: CatalogPlpUrlState): ControlsDraft {
  return {
    sort: state.sort,
    factoryIds: [...(state.factoryIds ?? [])],
    selectionByDefinition: Object.fromEntries(
      (state.selectionFilters ?? []).map((filter) => [
        filter.definitionId,
        [...filter.optionIds],
      ]),
    ),
    rangesByDefinition: Object.fromEntries(
      (state.numericRangeFilters ?? []).map((filter) => [
        filter.definitionId,
        {
          minimum: String(filter.minimum),
          maximum: String(filter.maximum),
        },
      ]),
    ),
    booleansByDefinition: Object.fromEntries(
      (state.booleanFilters ?? []).map((filter) => [
        filter.definitionId,
        filter.value ? "true" : "false",
      ]),
    ) as Record<string, "" | "true" | "false">,
  };
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function appliedFilterCount(state: CatalogPlpUrlState): number {
  return (
    (state.factoryIds?.length ?? 0) +
    (state.selectionFilters?.reduce(
      (sum, filter) => sum + filter.optionIds.length,
      0,
    ) ?? 0) +
    (state.numericRangeFilters?.length ?? 0) +
    (state.booleanFilters?.length ?? 0)
  );
}

export function CatalogPlpControls({
  metadata,
  productPage,
  urlState,
  pathname,
  loadedCount,
  loadingMore = false,
}: CatalogPlpControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState<ControlsDraft>(() =>
    draftFromState(urlState),
  );

  const availableSorts = metadata.sortOptions.filter(
    (option) => option.isAvailable,
  );
  const hasSupportedSpecificationFacet = metadata.specificationFacets.some(
    (facet) =>
      (facet.dataType === 6 && Boolean(facet.selection)) ||
      ((facet.dataType === 2 || facet.dataType === 3) &&
        Boolean(facet.numeric)) ||
      (facet.dataType === 4 && Boolean(facet.booleanCapability)),
  );
  const hasControls =
    Boolean(metadata.factoryFacet) ||
    hasSupportedSpecificationFacet ||
    availableSorts.length > 1;
  const orderedFacets = orderCatalogPlpControlFacets(metadata);
  const activeCount = appliedFilterCount(urlState);
  const shownCount = loadedCount ?? productPage.items.length;
  const activeSortLabel =
    availableSorts.find((option) => option.key === urlState.sort)?.label ??
    availableSorts.find((option) => option.isDefault)?.label ??
    "مرتب‌سازی";

  function openSheet() {
    setDraft(draftFromState(urlState));
    setSheetOpen(true);
  }

  function applyDraft() {
    const selectedSort =
      availableSorts.find((option) => option.key === draft.sort)?.key ??
      availableSorts.find((option) => option.isDefault)?.key ??
      urlState.sort;

    const numericRangeFilters = metadata.specificationFacets.flatMap(
      (facet) => {
        if (
          (facet.dataType !== 2 && facet.dataType !== 3) ||
          !facet.numeric
        ) {
          return [];
        }
        const range = draft.rangesByDefinition[facet.definitionId];
        if (!range || (!range.minimum && !range.maximum)) return [];
        const minimum = Number(range.minimum);
        const maximum = Number(range.maximum);
        if (
          range.minimum === "" ||
          range.maximum === "" ||
          !Number.isFinite(minimum) ||
          !Number.isFinite(maximum)
        ) {
          return [];
        }
        return [{ definitionId: facet.definitionId, minimum, maximum }];
      },
    );

    const selectionFilters = metadata.specificationFacets.flatMap((facet) => {
      if (facet.dataType !== 6 || !facet.selection) return [];
      const optionIds = draft.selectionByDefinition[facet.definitionId] ?? [];
      return optionIds.length > 0
        ? [{ definitionId: facet.definitionId, optionIds }]
        : [];
    });

    const booleanFilters = metadata.specificationFacets.flatMap((facet) => {
      if (facet.dataType !== 4 || !facet.booleanCapability) return [];
      const value = draft.booleansByDefinition[facet.definitionId];
      return value === "true" || value === "false"
        ? [{ definitionId: facet.definitionId, value: value === "true" }]
        : [];
    });

    const href = buildCatalogPlpContinuousHref(
      pathname,
      resetCatalogPlpPage({
        page: urlState.page,
        sort: selectedSort,
        factoryIds: draft.factoryIds,
        selectionFilters,
        numericRangeFilters,
        booleanFilters,
      }),
    );
    setSheetOpen(false);
    startTransition(() => router.push(href));
  }

  function clearControls() {
    setSheetOpen(false);
    startTransition(() => router.push(pathname));
  }

  return (
    <>
      <div className="sticky top-0 z-20 -mx-4 mb-3 border-b border-border/80 bg-bg/95 px-4 py-2 backdrop-blur-sm">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-text-muted" aria-live="polite">
            {shownCount.toLocaleString("fa-IR")} از{" "}
            {productPage.totalCount.toLocaleString("fa-IR")} محصول
            {activeCount > 0
              ? ` · ${activeCount.toLocaleString("fa-IR")} فیلتر فعال`
              : ""}
          </p>
          {isPending || loadingMore ? (
            <span className="text-xs text-text-muted">در حال به‌روزرسانی...</span>
          ) : null}
        </div>
        {hasControls ? (
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <button
              type="button"
              onClick={openSheet}
              className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text shadow-[var(--shadow-soft)]"
            >
              {activeSortLabel}
            </button>
            <button
              type="button"
              onClick={openSheet}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium shadow-[var(--shadow-soft)] ${
                activeCount > 0
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-border bg-surface text-text"
              }`}
              aria-label="فیلتر و مرتب‌سازی محصولات"
            >
              فیلترها
              {activeCount > 0
                ? ` (${activeCount.toLocaleString("fa-IR")})`
                : ""}
            </button>
          </div>
        ) : null}
      </div>

      {hasControls ? (
        <>
          <Fab
            onClick={openSheet}
            aria-label="فیلتر و مرتب‌سازی محصولات"
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
          >
            <FontAwesomeIcon icon={faSliders} />
          </Fab>
          <BottomSheet
            isOpen={sheetOpen}
            onClose={() => setSheetOpen(false)}
            title="فیلتر و مرتب‌سازی"
          >
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                applyDraft();
              }}
            >
              {availableSorts.length > 0 ? (
                <fieldset className="space-y-2">
                  <legend className="font-bold text-text">مرتب‌سازی</legend>
                  {availableSorts.map((option) => (
                    <label
                      key={option.key}
                      className="flex min-h-[var(--touch-min)] cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border px-3 py-2"
                    >
                      <input
                        type="radio"
                        name="plp-sort"
                        value={option.key}
                        checked={draft.sort === option.key}
                        onChange={() =>
                          setDraft((current) => ({
                            ...current,
                            sort: option.key,
                          }))
                        }
                      />
                      <span className="min-w-0 break-words">{option.label}</span>
                    </label>
                  ))}
                </fieldset>
              ) : null}

              {orderedFacets.map((section) => {
                if (section.kind === "factory" && metadata.factoryFacet) {
                  return (
                    <fieldset key="factory" className="space-y-2">
                      <legend className="font-bold text-text">کارخانه</legend>
                      {metadata.factoryFacet.options.map((option) => (
                        <label
                          key={option.factoryId}
                          className="flex min-h-[var(--touch-min)] cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border px-3 py-2"
                        >
                          <input
                            type="checkbox"
                            checked={draft.factoryIds.includes(option.factoryId)}
                            onChange={() =>
                              setDraft((current) => ({
                                ...current,
                                factoryIds: toggleValue(
                                  current.factoryIds,
                                  option.factoryId,
                                ),
                              }))
                            }
                          />
                          <span className="min-w-0 break-words">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </fieldset>
                  );
                }

                if (section.kind !== "specification") return null;
                const facet = section.facet;

                if (facet.dataType === 6 && facet.selection) {
                  const selected =
                    draft.selectionByDefinition[facet.definitionId] ?? [];
                  return (
                    <fieldset key={facet.definitionId} className="space-y-2">
                      <legend className="break-words font-bold text-text">
                        {facet.label}
                      </legend>
                      {facet.selection.options.map((option) => (
                        <label
                          key={option.optionId}
                          className="flex min-h-[var(--touch-min)] cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border px-3 py-2"
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(option.optionId)}
                            onChange={() =>
                              setDraft((current) => ({
                                ...current,
                                selectionByDefinition: {
                                  ...current.selectionByDefinition,
                                  [facet.definitionId]: toggleValue(
                                    current.selectionByDefinition[
                                      facet.definitionId
                                    ] ?? [],
                                    option.optionId,
                                  ),
                                },
                              }))
                            }
                          />
                          <span className="min-w-0 break-words">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </fieldset>
                  );
                }

                if (
                  (facet.dataType === 2 || facet.dataType === 3) &&
                  facet.numeric
                ) {
                  const range = draft.rangesByDefinition[facet.definitionId] ?? {
                    minimum: "",
                    maximum: "",
                  };
                  const step = facet.numeric.step ?? "any";
                  const unitLabel = facet.numeric.unitLabel?.trim();
                  return (
                    <fieldset key={facet.definitionId} className="space-y-2">
                      <legend className="break-words font-bold text-text">
                        {facet.label}
                        {unitLabel ? (
                          <span className="mr-1 text-sm font-normal text-text-muted">
                            ({unitLabel})
                          </span>
                        ) : null}
                      </legend>
                      <div className="grid grid-cols-2 gap-2">
                        <label className="space-y-1 text-sm text-text-muted">
                          <span>از</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            value={range.minimum}
                            min={facet.numeric.minimum}
                            max={facet.numeric.maximum}
                            step={step}
                            required={range.maximum !== ""}
                            onChange={(event) =>
                              setDraft((current) => ({
                                ...current,
                                rangesByDefinition: {
                                  ...current.rangesByDefinition,
                                  [facet.definitionId]: {
                                    ...range,
                                    minimum: event.target.value,
                                  },
                                },
                              }))
                            }
                            className="min-h-[var(--touch-min)] w-full min-w-0 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-text"
                          />
                        </label>
                        <label className="space-y-1 text-sm text-text-muted">
                          <span>تا</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            value={range.maximum}
                            min={range.minimum || facet.numeric.minimum}
                            max={facet.numeric.maximum}
                            step={step}
                            required={range.minimum !== ""}
                            onChange={(event) =>
                              setDraft((current) => ({
                                ...current,
                                rangesByDefinition: {
                                  ...current.rangesByDefinition,
                                  [facet.definitionId]: {
                                    ...range,
                                    maximum: event.target.value,
                                  },
                                },
                              }))
                            }
                            className="min-h-[var(--touch-min)] w-full min-w-0 rounded-[var(--radius-md)] border border-border bg-surface px-3 text-text"
                          />
                        </label>
                      </div>
                    </fieldset>
                  );
                }

                if (facet.dataType === 4 && facet.booleanCapability) {
                  return (
                    <label
                      key={facet.definitionId}
                      className="block space-y-2"
                    >
                      <span className="break-words font-bold text-text">
                        {facet.label}
                      </span>
                      <select
                        value={
                          draft.booleansByDefinition[facet.definitionId] ?? ""
                        }
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            booleansByDefinition: {
                              ...current.booleansByDefinition,
                              [facet.definitionId]: event.target.value as
                                | ""
                                | "true"
                                | "false",
                            },
                          }))
                        }
                        className="min-h-[var(--touch-min)] w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-text"
                      >
                        <option value="">بدون محدودیت</option>
                        <option value="true">بله</option>
                        <option value="false">خیر</option>
                      </select>
                    </label>
                  );
                }

                return null;
              })}

              <div className="sticky bottom-0 flex gap-2 bg-surface pt-3">
                <Button type="submit" fullWidth disabled={isPending}>
                  اعمال
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  disabled={isPending}
                  onClick={clearControls}
                >
                  پاک‌کردن
                </Button>
              </div>
            </form>
          </BottomSheet>
        </>
      ) : null}
    </>
  );
}
