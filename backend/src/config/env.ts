import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
};

const requireEnv = (value: string | undefined, name: string): string => {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return normalized;
};

const resolveNodeEnv = (value: string | undefined): "development" | "test" | "production" => {
  const normalized = (value ?? "development").trim().toLowerCase();
  if (normalized === "development" || normalized === "test" || normalized === "production") {
    return normalized;
  }
  throw new Error(`Invalid NODE_ENV value: ${value}`);
};

export const PORT = parsePort(process.env.PORT, 5000);
export const DATABASE_URL = requireEnv(process.env.DATABASE_URL, "DATABASE_URL");
export const CORS_ORIGIN = (process.env.CORS_ORIGIN ?? process.env.FRONTEND_URL ?? "").trim();
export const NODE_ENV = resolveNodeEnv(process.env.NODE_ENV);
