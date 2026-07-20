export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function parseTagsFromKeywords(metaKeywords?: string | null): string[] {
  if (!metaKeywords) return [];
  return metaKeywords
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function initialsFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "؟";
  return trimmed.slice(0, 1);
}
