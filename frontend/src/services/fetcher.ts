const DEFAULT_TIMEOUT_MS = 8000;

export class ApiRequestError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.details = details;
  }
}

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");
const ensureApiPath = (value: string) => {
  const base = trimTrailingSlash(value);
  return base.endsWith("/api") ? base : `${base}/api`;
};

export const getApiBaseUrl = (): string => {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.trim() ??
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ??
    "";

  if (!raw) {
    return "";
  }

  return ensureApiPath(raw);
};

export const shouldUseRemoteApi = (): boolean => getApiBaseUrl().length > 0;

export const shouldAllowMockFallback = (): boolean => {
  return process.env.NEXT_PUBLIC_ENABLE_MOCK_FALLBACK !== "false";
};

const createUrl = (path: string): string => {
  const base = getApiBaseUrl();

  if (!base) {
    throw new ApiRequestError("Missing NEXT_PUBLIC_API_URL");
  }

  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export const fetchJson = async <T>(
  path: string,
  init?: RequestInit,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const isFormDataBody = typeof FormData !== "undefined" && init?.body instanceof FormData;
    const response = await fetch(createUrl(path), {
      ...init,
      headers: {
        ...(isFormDataBody ? {} : { "Content-Type": "application/json" }),
        ...(init?.headers ?? {})
      },
      signal: controller.signal,
      cache: "no-store"
    });

    if (!response.ok) {
      let message = `API request failed (${response.status})`;
      let details: unknown;

      try {
        const errorBody = (await response.json()) as {
          error?: { message?: string; details?: unknown };
          message?: string;
        };

        if (errorBody?.error?.message) {
          message = errorBody.error.message;
          details = errorBody.error.details;
        } else if (errorBody?.message) {
          message = errorBody.message;
        }
      } catch {
        // Keep default message if response body is not JSON.
      }

      throw new ApiRequestError(message, response.status, details);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    throw new ApiRequestError("Could not reach API service. Please check that backend is running.");
  } finally {
    clearTimeout(timeoutId);
  }
};
