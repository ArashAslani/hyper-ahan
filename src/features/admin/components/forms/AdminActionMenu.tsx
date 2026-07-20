"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowDown,
  faCloudArrowUp,
  faCopy,
  faEllipsisVertical,
  faEye,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type AdminActionMenuItem = {
  key: string;
  label: string;
  icon?: IconDefinition;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
};

type AdminActionMenuProps = {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onDelete?: () => void;
  extraActions?: AdminActionMenuItem[];
  className?: string;
};

/** Reusable per-row overflow menu for Admin list screens. */
export function AdminActionMenu({
  onEdit,
  onDuplicate,
  onPreview,
  onPublish,
  onUnpublish,
  onDelete,
  extraActions = [],
  className = "",
}: AdminActionMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const items: AdminActionMenuItem[] = [
    onEdit ? { key: "edit", label: "ویرایش", icon: faPen, onClick: onEdit } : null,
    onDuplicate ? { key: "duplicate", label: "کپی", icon: faCopy, onClick: onDuplicate } : null,
    onPreview ? { key: "preview", label: "پیش‌نمایش", icon: faEye, onClick: onPreview } : null,
    onPublish ? { key: "publish", label: "انتشار", icon: faCloudArrowUp, onClick: onPublish } : null,
    onUnpublish
      ? { key: "unpublish", label: "بازگشت به پیش‌نویس", icon: faCloudArrowDown, onClick: onUnpublish }
      : null,
    ...extraActions,
    onDelete ? { key: "delete", label: "حذف", icon: faTrash, onClick: onDelete, danger: true } : null,
  ].filter((item): item is AdminActionMenuItem => item !== null);

  if (items.length === 0) return null;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="عملیات بیشتر"
        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-text-muted transition hover:bg-bg hover:text-text"
      >
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute left-0 z-20 mt-1 w-48 rounded-[var(--radius-md)] border border-border bg-surface p-1.5 shadow-[var(--shadow-card)]"
        >
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className={`flex min-h-[var(--touch-min)] w-full items-center gap-2 rounded-[var(--radius-sm)] px-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                item.danger ? "text-danger hover:bg-danger/10" : "text-text hover:bg-bg"
              }`}
            >
              {item.icon ? <FontAwesomeIcon icon={item.icon} className="w-4" /> : null}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
