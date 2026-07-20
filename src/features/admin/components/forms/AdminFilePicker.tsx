"use client";

import { useRef, useState, type DragEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faImage, faTrash } from "@fortawesome/free-solid-svg-icons";
import { AppImage } from "@/shared/ui/AppImage";
import { Button } from "@/shared/ui/Button";
import type { FileDto } from "@/types";

type AdminFilePickerProps = {
  label?: string;
  description?: string;
  value: FileDto | null;
  /** The caller owns the actual upload request — this only forwards the picked File. */
  onUpload: (file: File) => void;
  onRemove?: () => void;
  /** Opens a media-library / existing-file picker instead of uploading a new file. */
  onSelectExisting?: () => void;
  loading?: boolean;
  disabled?: boolean;
  accept?: string;
  className?: string;
};

/** Reusable image picker built on the unified `FileDto` contract — never uploads directly. */
export function AdminFilePicker({
  label,
  description,
  value,
  onUpload,
  onRemove,
  onSelectExisting,
  loading = false,
  disabled = false,
  accept = "image/*",
  className = "",
}: AdminFilePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isBusy = loading || disabled;

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onUpload(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (isBusy) return;
    handleFiles(event.dataTransfer.files);
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label ? <p className="text-sm font-medium text-text">{label}</p> : null}

      {value ? (
        <div className="relative w-full max-w-xs overflow-hidden rounded-[var(--radius-lg)] border border-border">
          <AppImage
            image={value}
            alt={value.alt ?? label ?? "تصویر"}
            width={value.width ?? 400}
            height={value.height ?? 300}
            className="aspect-[4/3] w-full"
          />
          <div className="absolute inset-0 flex items-end justify-end gap-2 bg-gradient-to-t from-black/50 via-transparent to-transparent p-2 opacity-0 transition-opacity duration-200 hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isBusy}
              aria-label="تغییر تصویر"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-text transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faCloudArrowUp} className="text-sm" />
            </button>
            {onRemove ? (
              <button
                type="button"
                onClick={onRemove}
                disabled={isBusy}
                aria-label="حذف تصویر"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-danger transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FontAwesomeIcon icon={faTrash} className="text-sm" />
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            if (!isBusy) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex w-full max-w-xs flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border-2 border-dashed p-6 text-center transition ${
            isDragging ? "border-accent bg-accent/5" : "border-border bg-bg"
          } ${isBusy ? "opacity-60" : ""}`}
        >
          <FontAwesomeIcon icon={faImage} className="text-2xl text-text-muted" />
          <p className="text-xs text-text-muted">تصویر را بکشید و رها کنید یا انتخاب کنید</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={isBusy}>
              {loading ? "در حال آپلود..." : "انتخاب فایل"}
            </Button>
            {onSelectExisting ? (
              <Button type="button" variant="ghost" onClick={onSelectExisting} disabled={isBusy}>
                انتخاب از فایل‌ها
              </Button>
            ) : null}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={isBusy}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
        className="sr-only"
        aria-label={label ?? "انتخاب تصویر"}
      />

      {description ? <p className="text-xs text-text-muted">{description}</p> : null}
    </div>
  );
}
