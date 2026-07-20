import type { FieldErrors } from "react-hook-form";
import type { MutableRefObject, Ref, RefCallback } from "react";

/** Resolves a nested RHF error message by dot-path (e.g. `"seo.metaTitle"`). */
export function getFieldError(errors: FieldErrors, name: string): string | undefined {
  const segments = name.split(".");
  let current: unknown = errors;
  for (const segment of segments) {
    if (typeof current !== "object" || current === null) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  const message = (current as { message?: unknown } | undefined)?.message;
  return typeof message === "string" ? message : undefined;
}

/** Merges multiple refs (e.g. RHF's registered ref + a local ref) into one callback ref. */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") ref(node);
      else (ref as MutableRefObject<T | null>).current = node;
    });
  };
}
