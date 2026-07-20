"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faPlus, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import {
  AdminActionMenu,
  AdminDateDisplay,
  AdminDeleteButton,
  AdminPageHeader,
  AdminPagination,
  AdminStatusBadge,
  AdminTable,
  AdminToolbar,
  type AdminTableColumn,
} from "@/features/admin/components";
import { Button } from "@/shared/ui/Button";
import { AppImage } from "@/shared/ui/AppImage";
import { ApiError } from "@/lib/api-client";
import { routes } from "@/lib/routes";
import { useAdminAuth } from "../auth/AdminAuthProvider";
import {
  sliderAdminService,
  type SliderAdminGroup,
  type SliderAdminSlide,
} from "@/services/sliderAdminService";
import { isSlideCurrentlyLive, previewPathForGroupSlug } from "./sliderAdminUtils";

type StatusFilter = "all" | "active" | "inactive";
type SortKey = "displayOrder" | "priority" | "title" | "updatedAt";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "displayOrder", label: "ترتیب نمایش" },
  { value: "priority", label: "اولویت" },
  { value: "title", label: "عنوان" },
  { value: "updatedAt", label: "آخرین به‌روزرسانی" },
];

const PAGE_SIZE = 10;

const filterSelectClass =
  "min-h-[var(--touch-min)] rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

function sortSlides(items: SliderAdminSlide[], sortBy: SortKey): SliderAdminSlide[] {
  const next = [...items];
  next.sort((a, b) => {
    switch (sortBy) {
      case "priority":
        return b.priority - a.priority;
      case "title":
        return a.title.localeCompare(b.title, "fa");
      case "updatedAt": {
        const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bTime - aTime;
      }
      case "displayOrder":
      default:
        return a.displayOrder - b.displayOrder || b.priority - a.priority;
    }
  });
  return next;
}

export function SliderAdminListView() {
  const router = useRouter();
  const { accessToken } = useAdminAuth();
  const [items, setItems] = useState<SliderAdminSlide[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [groupId, setGroupId] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("displayOrder");
  const [groups, setGroups] = useState<SliderAdminGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [reorderSaving, setReorderSaving] = useState(false);

  const canReorder = Boolean(groupId) && sortBy === "displayOrder";

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    async function loadGroups() {
      try {
        const result = await sliderAdminService.listGroups(accessToken!);
        if (!cancelled) setGroups(result);
      } catch {
        // Optional filter — list still works.
      }
    }
    void loadGroups();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const loadSlides = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const result = await sliderAdminService.list(
        {
          page: groupId ? 1 : page,
          pageSize: groupId ? 100 : PAGE_SIZE,
          search: search || undefined,
          groupId: groupId || undefined,
          isActive:
            status === "active" ? true : status === "inactive" ? false : undefined,
        },
        accessToken,
      );
      setItems(sortSlides(result.items, sortBy));
      setTotal(result.total);
      setTotalPages(groupId ? 1 : result.totalPages);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "بارگذاری اسلایدها ناموفق بود.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, search, groupId, status, sortBy]);

  // Server list fetch — setState is the result of an async network call, not a render cascade.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void loadSlides();
  }, [loadSlides]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleGroupChange(value: string) {
    setGroupId(value);
    setPage(1);
  }

  function handleStatusChange(value: StatusFilter) {
    setStatus(value);
    setPage(1);
  }

  function handleSortChange(value: SortKey) {
    setSortBy(value);
    setPage(1);
  }

  async function runAction(id: string, action: () => Promise<void>) {
    if (!accessToken) return;
    setActionLoadingId(id);
    setError(null);
    try {
      await action();
      await loadSlides();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "عملیات ناموفق بود.");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleReorder(nextItems: SliderAdminSlide[]) {
    if (!accessToken || !canReorder) return;
    const previous = items;
    setItems(nextItems.map((item, index) => ({ ...item, displayOrder: index })));
    setReorderSaving(true);
    setError(null);
    try {
      await sliderAdminService.reorder(
        nextItems.map((item) => item.id),
        accessToken,
      );
    } catch (err) {
      setItems(previous);
      setError(err instanceof ApiError ? err.message : "ذخیره ترتیب ناموفق بود.");
    } finally {
      setReorderSaving(false);
    }
  }

  const columns: AdminTableColumn<SliderAdminSlide>[] = useMemo(
    () => [
      {
        key: "thumb",
        header: "تصویر",
        cellClassName: "w-16",
        render: (row) => (
          <div className="h-12 w-12 overflow-hidden rounded-[var(--radius-md)] bg-bg">
            <AppImage
              image={row.image}
              alt={row.title}
              preferThumbnail
              width={48}
              height={48}
              className="h-12 w-12"
              imgClassName="h-full w-full"
            />
          </div>
        ),
      },
      {
        key: "title",
        header: "عنوان",
        render: (row) => (
          <div className="min-w-0 max-w-xs">
            <p className="truncate font-medium text-text">{row.title}</p>
            <p className="truncate text-xs text-text-muted">{row.groupTitle}</p>
          </div>
        ),
      },
      {
        key: "group",
        header: "گروه",
        hideOnMobile: true,
        render: (row) => (
          <span className="text-sm text-text-muted">
            {row.groupSlug || row.groupTitle}
          </span>
        ),
      },
      {
        key: "displayOrder",
        header: "ترتیب",
        hideOnMobile: true,
        align: "center",
        render: (row) => (
          <span className="tabular-nums text-text-muted">{row.displayOrder}</span>
        ),
      },
      {
        key: "priority",
        header: "اولویت",
        hideOnMobile: true,
        align: "center",
        render: (row) => (
          <span className="tabular-nums text-text-muted">{row.priority}</span>
        ),
      },
      {
        key: "status",
        header: "وضعیت",
        hideOnMobile: true,
        render: (row) => (
          <AdminStatusBadge
            status={row.isActive ? "published" : "inactive"}
            label={row.isActive ? "فعال" : "غیرفعال"}
          />
        ),
      },
      {
        key: "published",
        header: "نمایش عمومی",
        hideOnMobile: true,
        render: (row) => (
          <AdminStatusBadge
            status={isSlideCurrentlyLive(row) ? "success" : "pending"}
            label={isSlideCurrentlyLive(row) ? "در حال نمایش" : "خارج از نمایش"}
          />
        ),
      },
      {
        key: "updatedAt",
        header: "آخرین ویرایش",
        hideOnMobile: true,
        render: (row) => <AdminDateDisplay date={row.updatedAt ?? row.createdAt} />,
      },
      {
        key: "actions",
        header: "عملیات",
        align: "end",
        render: (row) => (
          <div
            className="flex items-center justify-end gap-1"
            onClick={(event) => event.stopPropagation()}
          >
            <AdminActionMenu
              onEdit={() => router.push(routes.admin.sliders.edit(row.id))}
              onPreview={() =>
                window.open(
                  previewPathForGroupSlug(row.groupSlug || "home"),
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              onDuplicate={
                accessToken
                  ? () =>
                      void runAction(row.id, () =>
                        sliderAdminService.duplicate(row.id, accessToken).then(() => undefined),
                      )
                  : undefined
              }
              extraActions={[
                row.isActive
                  ? {
                      key: "disable",
                      label: "غیرفعال‌سازی",
                      icon: faToggleOff,
                      disabled: actionLoadingId === row.id,
                      onClick: () =>
                        void runAction(row.id, () =>
                          sliderAdminService.disable(row.id, accessToken!),
                        ),
                    }
                  : {
                      key: "enable",
                      label: "فعال‌سازی",
                      icon: faToggleOn,
                      disabled: actionLoadingId === row.id,
                      onClick: () =>
                        void runAction(row.id, () =>
                          sliderAdminService.enable(row.id, accessToken!),
                        ),
                    },
              ]}
            />
            <AdminDeleteButton
              compact
              itemLabel={row.title}
              disabled={actionLoadingId === row.id || !accessToken}
              onConfirm={() =>
                runAction(row.id, () => sliderAdminService.remove(row.id, accessToken!))
              }
            />
          </div>
        ),
      },
    ],
    // Closures refresh with latest token/action state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accessToken, actionLoadingId, router],
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="مدیریت اسلایدرها"
        description={
          total > 0
            ? `${total.toLocaleString("fa-IR")} اسلاید`
            : "ایجاد و مدیریت بنرهای اسلایدر"
        }
        breadcrumbs={[
          { label: "داشبورد", href: routes.admin.dashboard },
          { label: "اسلایدرها" },
        ]}
        actions={
          <Link href={routes.admin.sliders.new}>
            <Button variant="accent">
              <FontAwesomeIcon icon={faPlus} />
              اسلاید جدید
            </Button>
          </Link>
        }
      />

      {error ? (
        <div
          role="alert"
          className="rounded-[var(--radius-md)] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      ) : null}

      <AdminToolbar
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="جستجو در عنوان..."
        searchLoading={loading}
        filters={
          <>
            <select
              aria-label="فیلتر گروه"
              value={groupId}
              onChange={(event) => handleGroupChange(event.target.value)}
              className={filterSelectClass}
            >
              <option value="">همه گروه‌ها</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.title}
                </option>
              ))}
            </select>

            <select
              aria-label="فیلتر وضعیت"
              value={status}
              onChange={(event) => handleStatusChange(event.target.value as StatusFilter)}
              className={filterSelectClass}
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>

            <select
              aria-label="مرتب‌سازی"
              value={sortBy}
              onChange={(event) => handleSortChange(event.target.value as SortKey)}
              className={filterSelectClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </>
        }
      />

      {canReorder ? (
        <p className="text-xs text-text-muted">
          برای تغییر ترتیب، ردیف‌ها را بکشید و رها کنید
          {reorderSaving ? " — در حال ذخیره..." : ""}.
        </p>
      ) : null}

      <AdminTable
        columns={columns}
        data={items}
        getRowKey={(row) => row.id}
        loading={loading}
        onRowClick={
          canReorder ? undefined : (row) => router.push(routes.admin.sliders.edit(row.id))
        }
        emptyTitle="اسلایدی یافت نشد"
        emptyDescription="هنوز اسلایدی ایجاد نشده یا فیلترها نتیجه‌ای ندارند."
        emptyIcon={<FontAwesomeIcon icon={faImages} />}
        reorderable={canReorder}
        reorderDisabled={reorderSaving}
        onReorder={handleReorder}
      />

      <AdminPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
