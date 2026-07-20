"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faPlus } from "@fortawesome/free-solid-svg-icons";
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
  blogAdminService,
  type BlogAdminPost,
} from "@/services/blogAdminService";
import type { BlogSortBy } from "@/types";

type StatusFilter = "all" | "published" | "draft";

const SORT_OPTIONS: { value: BlogSortBy; label: string }[] = [
  { value: "PublishDateDesc", label: "جدیدترین انتشار" },
  { value: "PublishDateAsc", label: "قدیمی‌ترین انتشار" },
  { value: "VisitDesc", label: "پربازدیدترین" },
  { value: "VisitAsc", label: "کم‌بازدیدترین" },
  { value: "TitleAsc", label: "عنوان (الف → ی)" },
  { value: "TitleDesc", label: "عنوان (ی → الف)" },
];

const PAGE_SIZE = 10;

const filterSelectClass =
  "min-h-[var(--touch-min)] rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

export function BlogAdminListView() {
  const router = useRouter();
  const { accessToken } = useAdminAuth();
  const [items, setItems] = useState<BlogAdminPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<BlogSortBy>("PublishDateDesc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    async function loadCategories() {
      try {
        const result = await blogAdminService.getCategories(accessToken!);
        if (!cancelled) setCategories(result);
      } catch {
        // Optional filter — list still works.
      }
    }
    void loadCategories();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const loadPosts = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const result = await blogAdminService.list(
        {
          page,
          pageSize: PAGE_SIZE,
          title: search || undefined,
          categoryId: categoryId || undefined,
          isPublished:
            status === "published" ? true : status === "draft" ? false : undefined,
          sortBy,
        },
        accessToken,
      );
      setItems(result.items);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "بارگذاری مقالات ناموفق بود.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, search, categoryId, status, sortBy]);

  // Server list fetch — setState is the result of an async network call, not a render cascade.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleCategoryChange(value: string) {
    setCategoryId(value);
    setPage(1);
  }

  function handleStatusChange(value: StatusFilter) {
    setStatus(value);
    setPage(1);
  }

  function handleSortChange(value: BlogSortBy) {
    setSortBy(value);
    setPage(1);
  }

  async function runAction(id: string, action: () => Promise<void>) {
    if (!accessToken) return;
    setActionLoadingId(id);
    setError(null);
    try {
      await action();
      await loadPosts();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "عملیات ناموفق بود.");
    } finally {
      setActionLoadingId(null);
    }
  }

  const columns: AdminTableColumn<BlogAdminPost>[] = useMemo(
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
            <p className="truncate text-xs text-text-muted">{row.categoryTitle}</p>
          </div>
        ),
      },
      {
        key: "status",
        header: "وضعیت",
        hideOnMobile: true,
        render: (row) => (
          <AdminStatusBadge status={row.isPublished ? "published" : "draft"} />
        ),
      },
      {
        key: "visits",
        header: "بازدید",
        hideOnMobile: true,
        align: "center",
        render: (row) => (
          <span className="tabular-nums text-text-muted">
            {row.visits.toLocaleString("fa-IR")}
          </span>
        ),
      },
      {
        key: "publishedAt",
        header: "تاریخ انتشار",
        hideOnMobile: true,
        render: (row) => <AdminDateDisplay date={row.publishedAt} />,
      },
      {
        key: "updatedAt",
        header: "آخرین ویرایش",
        hideOnMobile: true,
        render: (row) => <AdminDateDisplay date={row.updatedAt} />,
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
              onEdit={() => router.push(routes.admin.blog.edit(row.id))}
              onPreview={() =>
                window.open(routes.blog.detail(row.slug), "_blank", "noopener,noreferrer")
              }
              onPublish={
                !row.isPublished && accessToken
                  ? () =>
                      void runAction(row.id, () =>
                        blogAdminService.publish(row.id, accessToken),
                      )
                  : undefined
              }
              onUnpublish={
                row.isPublished && accessToken
                  ? () =>
                      void runAction(row.id, () =>
                        blogAdminService.unpublish(row.id, accessToken),
                      )
                  : undefined
              }
            />
            <AdminDeleteButton
              compact
              itemLabel={row.title}
              disabled={actionLoadingId === row.id || !accessToken}
              onConfirm={() =>
                runAction(row.id, () => blogAdminService.remove(row.id, accessToken!))
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
        title="مدیریت مقالات"
        description={
          total > 0
            ? `${total.toLocaleString("fa-IR")} مقاله`
            : "ایجاد و مدیریت محتوای بلاگ"
        }
        breadcrumbs={[
          { label: "داشبورد", href: routes.admin.dashboard },
          { label: "مقالات" },
        ]}
        actions={
          <Link href={routes.admin.blog.new}>
            <Button variant="accent">
              <FontAwesomeIcon icon={faPlus} />
              مقاله جدید
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
              aria-label="فیلتر وضعیت"
              value={status}
              onChange={(event) => handleStatusChange(event.target.value as StatusFilter)}
              className={filterSelectClass}
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="published">منتشر شده</option>
              <option value="draft">پیش‌نویس</option>
            </select>

            <select
              aria-label="فیلتر دسته"
              value={categoryId}
              onChange={(event) => handleCategoryChange(event.target.value)}
              className={filterSelectClass}
            >
              <option value="">همه دسته‌ها</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </select>

            <select
              aria-label="مرتب‌سازی"
              value={sortBy}
              onChange={(event) => handleSortChange(event.target.value as BlogSortBy)}
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

      <AdminTable
        columns={columns}
        data={items}
        getRowKey={(row) => row.id}
        loading={loading}
        onRowClick={(row) => router.push(routes.admin.blog.edit(row.id))}
        emptyTitle="مقاله‌ای یافت نشد"
        emptyDescription="هنوز مقاله‌ای ایجاد نشده یا فیلترها نتیجه‌ای ندارند."
        emptyIcon={<FontAwesomeIcon icon={faNewspaper} />}
      />

      <AdminPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
