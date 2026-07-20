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

// In the browser, relative paths go through the next.config.ts rewrite proxy
// (same-origin, no CORS). On the server there is no running request to
// piggyback a rewrite on — even at build time during static generation — so
// server-side calls need an absolute backend origin.
const API_BASE_URL =
  typeof window === "undefined"
    ? (process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5062")
    : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "");

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
