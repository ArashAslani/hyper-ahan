"use client";

import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-[var(--radius-lg)] bg-surface p-5 shadow-[var(--shadow-card)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 left-3 flex h-11 w-11 items-center justify-center text-text-muted"
          aria-label="بستن"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
        {title ? (
          <h2 className="mb-4 text-center text-lg font-bold text-text">
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </div>
  );
}
