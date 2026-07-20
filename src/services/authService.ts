import { apiFetch } from "@/lib/api-client";
import type { AdminLoginRequest, AdminLoginResponse } from "@/types";

/** Auth endpoints — see docs/frontend-auth-integration.md */
export const authService = {
  adminLogin(payload: AdminLoginRequest): Promise<AdminLoginResponse> {
    return apiFetch<AdminLoginResponse>("/api/user/auth/admin/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
