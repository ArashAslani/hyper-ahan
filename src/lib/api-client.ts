/**
 * Stub for API phase. Controllers often return HTTP 200 with isSuccess=false.
 * Always check isSuccess — see docs/frontend-integration.md
 */

export type OperationError = {
  message: string;
  errorCode: string | null;
  type: number;
};

export type OperationResult<T> = {
  isSuccess: boolean;
  result: T | null;
  errors: OperationError[];
  statusCode: number;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function unwrapOperationResult<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    throw new ApiError("Unauthorized", 401);
  }

  const body = (await res.json()) as OperationResult<T>;
  if (!body.isSuccess) {
    throw new ApiError(body.errors?.[0]?.message ?? "خطا", body.statusCode);
  }
  return body.result as T;
}

// Prefer an explicit origin. Empty env values are treated as unset.
// Default: local backend. Browser may also use same-origin `/api` via
// next.config.ts rewrites when NEXT_PUBLIC_API_BASE_URL is intentionally blank
// in production-style proxy setups — for local admin CRUD we hit 5062 directly.
function resolveApiBaseUrl(): string {
  const raw =
    typeof window === "undefined"
      ? process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL
      : process.env.NEXT_PUBLIC_API_BASE_URL;
  const trimmed = raw?.trim();
  if (trimmed) return trimmed.replace(/\/$/, "");
  return "http://localhost:5062";
}

const API_BASE_URL = resolveApiBaseUrl();

type ApiFetchInit = RequestInit & {
  accessToken?: string | null;
};

/** Central fetch wrapper — all HTTP calls to the backend must go through this. */
export async function apiFetch<T>(
  path: string,
  init: ApiFetchInit = {},
): Promise<T> {
  const { accessToken, headers, ...rest } = init;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  return unwrapOperationResult<T>(res);
}

/**
 * Multipart helper for FormData uploads (Blog/Slider/Catalog admin create/update).
 * Do NOT set Content-Type — the browser must attach the multipart boundary.
 */
export async function apiFetchFormData<T>(
  path: string,
  formData: FormData,
  init: ApiFetchInit & { method?: string } = {},
): Promise<T> {
  const { accessToken, headers, method = "POST", ...rest } = init;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    body: formData,
    ...rest,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  return unwrapOperationResult<T>(res);
}

/**
 * Low-level fetch that returns the raw Response instead of unwrapping it.
 * Use only when a call needs to inspect status/headers directly (e.g. the
 * blog slug-redirect flow) — everything else should use `apiFetch`.
 */
export async function apiFetchRaw(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, init);
}

/**
 * Download a binary resource (e.g. FileDto.url) for re-upload / duplicate flows.
 * Accepts absolute URLs or API-relative paths.
 */
export async function apiFetchBlob(url: string, init: RequestInit = {}): Promise<Blob> {
  const resolved =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  const res = await fetch(resolved, init);
  if (!res.ok) {
    throw new ApiError("دانلود فایل ناموفق بود", res.status);
  }
  return res.blob();
}
