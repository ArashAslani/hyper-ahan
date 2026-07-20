import DOMPurify from "isomorphic-dompurify";
import type { BlogHeading } from "@/types";

const HEADING_REGEX = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;
const WORDS_PER_MINUTE = 180;

function slugifyHeading(text: string, index: number): string {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
  return base ? `${base}-${index}` : `heading-${index}`;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

/**
 * Sanitizes a backend-supplied blog body and injects stable `id`s on every
 * h2/h3 so a table of contents can scroll-spy against them.
 */
export function processBlogBody(rawHtml: string): {
  html: string;
  headings: BlogHeading[];
} {
  const sanitized = DOMPurify.sanitize(rawHtml ?? "", {
    ADD_ATTR: ["target", "rel"],
  });

  const headings: BlogHeading[] = [];
  let index = 0;

  const html = sanitized.replace(
    HEADING_REGEX,
    (match, level: string, attrs: string, inner: string) => {
      const text = stripTags(inner);
      if (!text) return match;

      const id = slugifyHeading(text, index++);
      headings.push({ id, text, level: Number(level) as 2 | 3 });

      const cleanedAttrs = attrs.replace(/\s*id="[^"]*"/i, "");
      return `<h${level} id="${id}"${cleanedAttrs}>${inner}</h${level}>`;
    },
  );

  return { html, headings };
}

/** Reading time estimate from plain text, since the backend doesn't provide one. */
export function estimateReadingTimeMinutes(html: string): number {
  const text = stripTags(html ?? "");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/** Short plain-text excerpt derived from the body when the backend description is empty. */
export function excerptFromHtml(html: string, maxLength = 160): string {
  const text = stripTags(html ?? "");
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}
