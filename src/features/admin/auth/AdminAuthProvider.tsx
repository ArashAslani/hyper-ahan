"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/services/authService";
import {
  STORAGE_KEYS,
  getStorageString,
  removeStorageItem,
  setStorageString,
} from "@/lib/storage";
import { isJwtExpired } from "@/lib/jwt";
import type { AdminLoginRequest } from "@/types";

type AdminAuthStatus = "loading" | "authenticated" | "unauthenticated";

type AdminAuthContextValue = {
  status: AdminAuthStatus;
  adminId: string | null;
  accessToken: string | null;
  login: (payload: AdminLoginRequest) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

function clearAdminSession() {
  removeStorageItem(STORAGE_KEYS.adminAccessToken);
  removeStorageItem(STORAGE_KEYS.adminId);
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AdminAuthStatus>("loading");
  const [adminId, setAdminId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Session can only be restored on the client (localStorage + JWT expiry
  // check aren't available during SSR), so this runs once after mount.
  // One-time client-only session bootstrap; no SSR-safe alternative exists.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const token = getStorageString(STORAGE_KEYS.adminAccessToken);
    const storedAdminId = getStorageString(STORAGE_KEYS.adminId);

    if (token && !isJwtExpired(token)) {
      setAccessToken(token);
      setAdminId(storedAdminId);
      setStatus("authenticated");
    } else {
      if (token) clearAdminSession();
      setStatus("unauthenticated");
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const login = useCallback(async (payload: AdminLoginRequest) => {
    const response = await authService.adminLogin(payload);
    setStorageString(STORAGE_KEYS.adminAccessToken, response.accessToken);
    setStorageString(STORAGE_KEYS.adminId, response.adminId);
    setAccessToken(response.accessToken);
    setAdminId(response.adminId);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setAccessToken(null);
    setAdminId(null);
    setStatus("unauthenticated");
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ status, adminId, accessToken, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
