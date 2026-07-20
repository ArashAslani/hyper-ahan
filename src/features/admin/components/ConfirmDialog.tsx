"use client";

import { Modal } from "@/shared/ui/Modal";
import { Button } from "@/shared/ui/Button";

type ConfirmDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm button as destructive (e.g. delete actions). */
  danger?: boolean;
  loading?: boolean;
};

/** Reusable confirmation dialog for destructive/blocking Admin actions. */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "تأیید",
  cancelLabel = "انصراف",
  danger = false,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={loading ? () => {} : onClose} title={title}>
      {description ? (
        <p className="mb-6 text-center text-sm text-text-muted">{description}</p>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <Button
          type="button"
          variant={danger ? "danger" : "accent"}
          fullWidth
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              در حال انجام...
            </>
          ) : (
            confirmLabel
          )}
        </Button>
        <Button type="button" variant="outline" fullWidth disabled={loading} onClick={onClose}>
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
}
