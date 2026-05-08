export const DEFAULT_TIMEOUT_MS = 8000;
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
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
    throw new ApiRequestError("Missing NEXT_PUBLIC_API_URL");
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
    const cookieValue = readCookieValue(document.cookie, DEMO_MODE_COOKIE_NAME);
    return cookieValue === DEMO_MODE_COOKIE_VALUE;
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

type CachedResponse = {
  data: unknown;
  timestamp: number;
};

const apiCache = new Map<string, CachedResponse>(); // Clear cache by removing old entries

const getFromCache = <T>(key: string): T | null => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < API_CACHE_DURATION) {
    return cached.data as T;
  }
  apiCache.delete(key);
  return null;
};

const setCache = (key: string, data: unknown): void => {
  apiCache.set(key, { data, timestamp: Date.now() });
};

export const fetchJson = async <T>(
  path: string,
  init?: RequestInit,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
  useCache: boolean = false
): Promise<T> => {
  // Disable caching completely to force fresh data
  const cacheKey = '';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const isFormDataBody = typeof FormData !== "undefined" && init?.body instanceof FormData;
    const url = createUrl(path);
    // Add cache-busting timestamp
    const cacheBustingUrl = url.includes('?') ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`;
    
    const response = await fetch(cacheBustingUrl, {
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

    const result = await response.json();
    if (useCache) {
      setCache(cacheKey, result);
    }
    return result as T;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    throw new ApiRequestError("Could not reach API service. Please check that backend is running.");
  } finally {
    clearTimeout(timeoutId);
  }
};
