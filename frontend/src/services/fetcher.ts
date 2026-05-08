const DEFAULT_TIMEOUT_MS = 8000;
export const DEMO_MODE_COOKIE_NAME = "storemesh_demo_mode";
export const DEMO_MODE_COOKIE_VALUE = "mock";

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

const readCookieValue = (cookieString: string, name: string): string | null => {
  const prefix = `${name}=`;
  const parts = cookieString.split(";").map((part) => part.trim());
  const cookie = parts.find((part) => part.startsWith(prefix));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(prefix.length));
};

export const isDemoModeEnabled = async (): Promise<boolean> => {
  if (typeof window !== "undefined") {
    return readCookieValue(document.cookie, DEMO_MODE_COOKIE_NAME) === DEMO_MODE_COOKIE_VALUE;
  }

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore.get(DEMO_MODE_COOKIE_NAME)?.value === DEMO_MODE_COOKIE_VALUE;
  } catch {
    return false;
  }
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
