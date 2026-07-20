"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/shared/ui/Button";
import { ConfirmDialog } from "../ConfirmDialog";

type AdminDeleteButtonProps = {
  onConfirm: () => void | Promise<void>;
  itemLabel?: string;
  title?: string;
  description?: string;
  /** Icon-only trigger for table action columns instead of a full labeled button. */
  compact?: boolean;
  disabled?: boolean;
  className?: string;
};

/** Reusable delete trigger — composes `ConfirmDialog` + danger `Button` with its own loading state. */
export function AdminDeleteButton({
  onConfirm,
  itemLabel,
  title,
  description,
  compact = false,
  disabled = false,
  className = "",
}: AdminDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={compact ? "ghost" : "danger"}
        disabled={disabled}
        onClick={() => setOpen(true)}
        aria-label={compact ? (title ?? "حذف") : undefined}
        className={compact ? "!px-2 text-danger hover:bg-danger/10" : className}
      >
        <FontAwesomeIcon icon={faTrash} />
        {compact ? null : "حذف"}
      </Button>

      <ConfirmDialog
        isOpen={open}
        onClose={() => !loading && setOpen(false)}
        onConfirm={handleConfirm}
        title={title ?? "حذف مورد"}
        description={
          description ??
          (itemLabel
            ? `آیا از حذف «${itemLabel}» مطمئن هستید؟ این عملیات قابل بازگشت نیست.`
            : "آیا از حذف این مورد مطمئن هستید؟ این عملیات قابل بازگشت نیست.")
        }
        confirmLabel="حذف"
        danger
        loading={loading}
      />
    </>
  );
}
