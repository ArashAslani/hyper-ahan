import { apiFetch } from "@/lib/api-client";

type RebuildResultDto = {
  upserted: number;
  removed: number;
};

/**
 * Admin Search — NoStore; always send Authorization.
 * Product/category admin mutations live under /api/admin/catalog (wizard forms later).
 */
export const searchAdminService = {
  async rebuild(accessToken: string): Promise<RebuildResultDto> {
    return apiFetch<RebuildResultDto>("/api/admin/search/rebuild", {
      method: "POST",
      accessToken,
      cache: "no-store",
    });
  },
};
