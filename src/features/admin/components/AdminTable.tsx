"use client";

import { useState, type DragEvent, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "@/shared/ui/Skeleton";
import { AdminEmptyState } from "./AdminEmptyState";

export type AdminTableColumn<T> = {
  key: string;
  header: ReactNode;
  /** Custom cell renderer — required so the table never assumes a row shape. */
  render: (row: T, index: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  /** Hide this column below the `sm` breakpoint (useful for secondary/action columns). */
  hideOnMobile?: boolean;
  /** Right-align (defaults right-to-left text align, use for numeric/action columns). */
  align?: "start" | "center" | "end";
};

type AdminTableProps<T> = {
  columns: AdminTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string | number;
  loading?: boolean;
  skeletonRows?: number;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: ReactNode;
  className?: string;
  /**
   * Enables HTML5 row drag-and-drop. Caller persists the new order
   * (e.g. Slider reorder API). Does not sort client-only.
   */
  reorderable?: boolean;
  onReorder?: (nextData: T[]) => void;
  reorderDisabled?: boolean;
};

const ALIGN_CLASSES: Record<NonNullable<AdminTableColumn<unknown>["align"]>, string> = {
  start: "text-right",
  center: "text-center",
  end: "text-left",
};

/** Generic reusable data table for Admin CRUD screens — no domain logic. */
export function AdminTable<T>({
  columns,
  data,
  getRowKey,
  loading = false,
  skeletonRows = 5,
  onRowClick,
  emptyTitle = "داده‌ای برای نمایش وجود ندارد",
  emptyDescription,
  emptyIcon,
  className = "",
  reorderable = false,
  onReorder,
  reorderDisabled = false,
}: AdminTableProps<T>) {
  const showEmpty = !loading && data.length === 0;
  const [dragKey, setDragKey] = useState<string | number | null>(null);
  const colSpan = columns.length + (reorderable ? 1 : 0);

  function handleDragStart(event: DragEvent<HTMLTableRowElement>, key: string | number) {
    if (!reorderable || reorderDisabled) return;
    setDragKey(key);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(key));
  }

  function handleDragOver(event: DragEvent<HTMLTableRowElement>) {
    if (!reorderable || reorderDisabled || dragKey === null) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event: DragEvent<HTMLTableRowElement>, targetKey: string | number) {
    event.preventDefault();
    if (!reorderable || !onReorder || dragKey === null || dragKey === targetKey) {
      setDragKey(null);
      return;
    }
    const fromIndex = data.findIndex((row) => getRowKey(row) === dragKey);
    const toIndex = data.findIndex((row) => getRowKey(row) === targetKey);
    if (fromIndex < 0 || toIndex < 0) {
      setDragKey(null);
      return;
    }
    const next = [...data];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setDragKey(null);
    onReorder(next);
  }

  return (
    <div className={`overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface ${className}`}>
      <div className="max-h-[70vh] overflow-x-auto overflow-y-auto">
        <table className="w-full min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-bg text-xs font-semibold text-text-muted">
            <tr>
              {reorderable ? (
                <th className="w-10 px-3 py-3" scope="col">
                  <span className="sr-only">جابه‌جایی</span>
                </th>
              ) : null}
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 whitespace-nowrap ${ALIGN_CLASSES[column.align ?? "start"]} ${
                    column.hideOnMobile ? "hidden sm:table-cell" : ""
                  } ${column.headerClassName ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  {reorderable ? (
                    <td className="px-3 py-3">
                      <Skeleton className="h-4 w-3" />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 ${column.hideOnMobile ? "hidden sm:table-cell" : ""}`}
                    >
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : showEmpty ? (
              <tr>
                <td colSpan={colSpan} className="p-0">
                  <AdminEmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const rowKey = getRowKey(row);
                const isDragging = dragKey === rowKey;
                return (
                  <tr
                    key={rowKey}
                    draggable={reorderable && !reorderDisabled}
                    onDragStart={(event) => handleDragStart(event, rowKey)}
                    onDragOver={handleDragOver}
                    onDrop={(event) => handleDrop(event, rowKey)}
                    onDragEnd={() => setDragKey(null)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={`transition-colors duration-150 ${rowIndex % 2 === 1 ? "bg-bg/40" : ""} ${
                      isDragging ? "bg-accent/10 opacity-70" : ""
                    } ${
                      onRowClick && !reorderable
                        ? "cursor-pointer hover:bg-accent/5"
                        : "hover:bg-bg/60"
                    }`}
                  >
                    {reorderable ? (
                      <td className="px-3 py-3 text-text-muted">
                        <FontAwesomeIcon
                          icon={faGripVertical}
                          className="cursor-grab active:cursor-grabbing"
                          aria-hidden
                        />
                        <span className="sr-only">جابه‌جایی ردیف</span>
                      </td>
                    ) : null}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 text-text ${ALIGN_CLASSES[column.align ?? "start"]} ${
                          column.hideOnMobile ? "hidden sm:table-cell" : ""
                        } ${column.cellClassName ?? ""}`}
                      >
                        {column.render(row, rowIndex)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
