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
