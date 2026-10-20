import { PostingError } from "./errors";

export type PostingEnvironment = {
  databaseUrl: string;
  zernioApiKey: string;
  r2AccountId: string;
  r2AccessKeyId: string;
  r2SecretAccessKey: string;
  r2Bucket: string;
  r2PublicBaseUrl: string;
  fabricDefaultWidth: number;
  fabricDefaultHeight: number;
  fabricMaxJsonBytes: number;
  fabricMaxPixels: number;
  fabricMaxObjects: number;
  fabricRenderTimeoutMs: number;
  fabricJpegQuality: number;
  fabricJpegBackground: string;
  fabricAllowedImageHosts: string[];
  postingLeaseSeconds: number;
};

let cachedEnvironment: PostingEnvironment | undefined;

function required(name: string, fallbackName?: string): string {
  const value = process.env[name]?.trim() || (
    fallbackName ? process.env[fallbackName]?.trim() : undefined
  );

  if (!value) {
    const fallback = fallbackName ? ` (or ${fallbackName})` : "";
    throw new PostingError(
      `Missing required environment variable ${name}${fallback}`,
      false,
    );
  }

  return value;
}

function numberFromEnvironment(
  name: string,
  defaultValue: number,
  minimum: number,
  maximum: number,
): number {
  const rawValue = process.env[name]?.trim();
  if (!rawValue) {
    return defaultValue;
  }

  const value = Number(rawValue);
  if (!Number.isFinite(value) || value < minimum || value > maximum) {
    throw new PostingError(
      `${name} must be a number between ${minimum} and ${maximum}`,
      false,
    );
  }

  return value;
}

function normalizedPublicBaseUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new PostingError(
      "CLOUDFLARE_R2_PUBLIC_BASE_URL must be a valid URL",
      false,
    );
  }

  if (url.protocol !== "https:") {
    throw new PostingError(
      "CLOUDFLARE_R2_PUBLIC_BASE_URL must use HTTPS",
      false,
    );
  }

  return url.toString().replace(/\/+$/, "");
}

function validatedDatabaseUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new PostingError("DATABASE_URL must be a valid URL", false);
  }

  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new PostingError(
      "DATABASE_URL must use the postgres:// or postgresql:// protocol",
      false,
    );
  }

  return value;
}

export function getPostingEnvironment(): PostingEnvironment {
  if (cachedEnvironment) {
    return cachedEnvironment;
  }

  const publicBaseUrl = normalizedPublicBaseUrl(
    required("CLOUDFLARE_R2_PUBLIC_BASE_URL"),
  );
  const configuredHosts = (process.env.FABRIC_ALLOWED_IMAGE_HOSTS ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  const r2PublicHost = new URL(publicBaseUrl).hostname.toLowerCase();

  cachedEnvironment = {
    databaseUrl: validatedDatabaseUrl(required("DATABASE_URL")),
    zernioApiKey: required("ZERNIO_API_KEY"),
    r2AccountId: required("CLOUDFLARE_R2_ACCOUNT_ID"),
    r2AccessKeyId: required("CLOUDFLARE_R2_ACCESS_KEY_ID"),
    r2SecretAccessKey: required("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
    r2Bucket: required("CLOUDFLARE_R2_BUCKET"),
    r2PublicBaseUrl: publicBaseUrl,
    fabricDefaultWidth: numberFromEnvironment(
      "FABRIC_DEFAULT_WIDTH",
      1080,
      1,
      8192,
    ),
    fabricDefaultHeight: numberFromEnvironment(
      "FABRIC_DEFAULT_HEIGHT",
      1080,
      1,
      8192,
    ),
    fabricMaxJsonBytes: numberFromEnvironment(
      "FABRIC_MAX_JSON_BYTES",
      5_000_000,
      1_000,
      50_000_000,
    ),
    fabricMaxPixels: numberFromEnvironment(
      "FABRIC_MAX_PIXELS",
      16_777_216,
      1,
      67_108_864,
    ),
    fabricMaxObjects: numberFromEnvironment(
      "FABRIC_MAX_OBJECTS",
      1_000,
      1,
      10_000,
    ),
    fabricRenderTimeoutMs: numberFromEnvironment(
      "FABRIC_RENDER_TIMEOUT_MS",
      30_000,
      1_000,
      300_000,
    ),
    fabricJpegQuality: numberFromEnvironment(
      "FABRIC_JPEG_QUALITY",
      0.92,
      0.1,
      1,
    ),
    fabricJpegBackground:
      process.env.FABRIC_JPEG_BACKGROUND?.trim() || "#ffffff",
    fabricAllowedImageHosts: Array.from(
      new Set([r2PublicHost, ...configuredHosts]),
    ),
    postingLeaseSeconds: numberFromEnvironment(
      "POSTING_LEASE_SECONDS",
      300,
      30,
      3600,
    ),
  };

  return cachedEnvironment;
}

export function resetPostingEnvironmentForTests(): void {
  cachedEnvironment = undefined;
}
