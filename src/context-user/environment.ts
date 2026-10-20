import { PostingError } from "../posting/errors";

export type ContextUserEnvironment = {
  creativeModel: string;
  designModel: string;
  visionModel: string;
  imageDiscoveryCredentials: Readonly<Record<string, string>>;
  imageToolCallLimit: number;
  modelTimeoutMs: number;
  imageMaxBytes: number;
  modelImageMaxPixels: number;
};

function integer(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    throw new PostingError(`${name} must be an integer between ${min} and ${max}`, false);
  }
  return value;
}

let cached: ContextUserEnvironment | undefined;

export function getContextUserEnvironment(): ContextUserEnvironment {
  if (cached) return cached;
  cached = {
    // Generation credentials are validated lazily by the stage that needs
    // them, so a publication-only retry can reuse completed AI work.
    creativeModel: process.env.SOCIAL_MEDIA_CREATIVE_MODEL?.trim() ?? "",
    designModel: process.env.SOCIAL_MEDIA_DESIGN_MODEL?.trim() ?? "",
    visionModel: process.env.SOCIAL_MEDIA_VISION_MODEL?.trim() ?? "",
    imageDiscoveryCredentials: {
      pixabay: process.env.PIXABAY_API_KEY?.trim() ?? "",
    },
    imageToolCallLimit: 6,
    modelTimeoutMs: integer("SOCIAL_MEDIA_MODEL_TIMEOUT_MS", 90_000, 5_000, 300_000),
    imageMaxBytes: integer("SOCIAL_MEDIA_SOURCE_IMAGE_MAX_BYTES", 20 * 1024 * 1024, 100_000, 50 * 1024 * 1024),
    modelImageMaxPixels: integer("SOCIAL_MEDIA_MODEL_IMAGE_MAX_PIXELS", 2_000_000, 100_000, 8_000_000),
  };
  return cached;
}

export function resetContextUserEnvironmentForTests(): void {
  cached = undefined;
}
