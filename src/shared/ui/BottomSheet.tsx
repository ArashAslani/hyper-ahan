"use client";

import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-primary/40"
        aria-label="بستن"
        onClick={onClose}
      />
      <div className="animate-sheet-up relative z-10 max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-t-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-card)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full text-text-muted hover:bg-bg"
            aria-label="بستن"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
