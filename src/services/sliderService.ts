import { apiFetch } from "@/lib/api-client";
import type { PublicSlide } from "@/types";

/**
 * Slider endpoints — see docs/SliderModule_frontend_integration.md §7.1.
 * Public reads are placement-agnostic: callers pass whatever group slug
 * they need, this service never hardcodes a placement name.
 */
export const sliderService = {
  async getGroup(groupSlug: string): Promise<PublicSlide[]> {
    try {
      return await apiFetch<PublicSlide[]>(
        `/api/sliders/group/${encodeURIComponent(groupSlug)}`,
      );
    } catch {
      // 404 (group missing/inactive), network error, backend down, etc. —
      // sliders are a non-critical visual placement, so degrade to "no
      // slides" instead of breaking the page.
      return [];
    }
  },
};
