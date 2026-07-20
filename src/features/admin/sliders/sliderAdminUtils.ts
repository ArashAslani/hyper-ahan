import { routes } from "@/lib/routes";

/** Maps a slider group slug to the public page that renders that placement. */
export function previewPathForGroupSlug(groupSlug: string): string {
  const slug = groupSlug.toLowerCase();
  if (slug === "home" || slug === "home-hero" || slug.startsWith("home")) {
    return routes.home;
  }
  if (slug.startsWith("blog")) return routes.blog.list;
  if (slug.startsWith("catalog") || slug.startsWith("product")) {
    return routes.products.list;
  }
  if (slug.startsWith("about")) return routes.about;
  if (slug.startsWith("contact")) return routes.contact;
  if (slug.startsWith("cart")) return routes.cart;
  return routes.home;
}

/** Whether a slide would currently appear on the public site (active + schedule). */
export function isSlideCurrentlyLive(slide: {
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
}): boolean {
  if (!slide.isActive) return false;
  const now = Date.now();
  if (slide.startDate) {
    const start = new Date(slide.startDate).getTime();
    if (!Number.isNaN(start) && now < start) return false;
  }
  if (slide.endDate) {
    const end = new Date(slide.endDate).getTime();
    if (!Number.isNaN(end) && now > end) return false;
  }
  return true;
}

export function toDatetimeLocalValue(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}
