"use client";

import { useController, useFormContext } from "react-hook-form";
import Editor from "react-simple-wysiwyg";
import { AdminField } from "../components/forms/AdminField";

type BlogBodyEditorProps = {
  name?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
};

/** Thin RHF wrapper around `react-simple-wysiwyg` — outputs HTML for the backend `body` field. */
export function BlogBodyEditor({
  name = "body",
  label = "متن مقاله",
  required = true,
  disabled = false,
}: BlogBodyEditorProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });

  return (
    <AdminField
      label={label}
      required={required}
      error={fieldState.error?.message}
      description="متن کامل مقاله (HTML)"
    >
      <div
        className={`overflow-hidden rounded-[var(--radius-md)] border bg-surface transition focus-within:ring-2 focus-within:ring-accent/30 ${
          fieldState.error ? "border-danger" : "border-border focus-within:border-accent"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <Editor
          value={field.value ?? ""}
          onChange={(event) => field.onChange(event.target.value)}
          onBlur={field.onBlur}
          containerProps={{
            style: { minHeight: 280, border: "none", resize: "vertical" },
          }}
        />
      </div>
    </AdminField>
  );
}
