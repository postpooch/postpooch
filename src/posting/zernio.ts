import type Zernio from "@zernio/node";

import { PostingError, toErrorMessage } from "./errors";
import type { PublishedPost } from "./types";

const PLATFORM_ALIASES: Readonly<Record<string, string>> = {
  x: "twitter",
  "x/twitter": "twitter",
  "google business": "googlebusiness",
  "google business profile": "googlebusiness",
  "google-business": "googlebusiness",
  google_business: "googlebusiness",
};

const SUPPORTED_PLATFORMS = new Set([
  "instagram",
  "facebook",
  "twitter",
  "linkedin",
  "tiktok",
  "youtube",
  "pinterest",
  "threads",
  "bluesky",
  "reddit",
  "snapchat",
  "telegram",
  "whatsapp",
  "googlebusiness",
  "discord",
]);

export function normalizePlatform(value: string): string {
  const normalized = value.trim().toLowerCase();
  const platform = PLATFORM_ALIASES[normalized] ?? normalized;
  if (!SUPPORTED_PLATFORMS.has(platform)) {
    throw new PostingError(`Unsupported Zernio platform: ${value}`, false);
  }

  return platform;
}

function existingPostId(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const record = error as Record<string, unknown>;
  if (
    record.details &&
    typeof record.details === "object" &&
    !Array.isArray(record.details)
  ) {
    const id = (record.details as Record<string, unknown>).existingPostId;
    return typeof id === "string" ? id : undefined;
  }

  return undefined;
}

export async function publishWithZernio(input: {
  client: Zernio;
  requestId: string;
  scheduleId: string;
  occurrenceAt: string;
  /** One or more Zernio platform targets sharing the same rendered content. */
  targets: ReadonlyArray<{ platform: string; accountId: string }>;
  caption: string | null;
  mediaUrls: string[];
}): Promise<PublishedPost> {
  if (input.targets.length === 0) {
    throw new PostingError("At least one publish target is required", false);
  }

  const platforms = input.targets.map((target) => {
    if (!target.accountId.trim()) {
      throw new PostingError(
        `Missing account id for platform ${target.platform}`,
        false,
      );
    }
    return {
      platform: normalizePlatform(target.platform),
      accountId: target.accountId.trim(),
    };
  });

  const result = await input.client.posts.createPost({
    body: {
      content: input.caption ?? undefined,
      mediaItems: input.mediaUrls.map((url) => ({
        type: "image" as const,
        url,
        mimeType: "image/jpeg",
      })),
      platforms,
      publishNow: true,
      metadata: {
        source: "postpooch",
        scheduleId: input.scheduleId,
        occurrenceAt: input.occurrenceAt,
      },
    },
    headers: {
      "x-request-id": input.requestId,
    },
  });

  if (result.error) {
    const duplicatePostId = existingPostId(result.error);
    if (result.response.status === 409 && duplicatePostId) {
      return { postId: duplicatePostId };
    }

    const retryable =
      result.response.status === 408 ||
      result.response.status === 425 ||
      result.response.status === 429 ||
      result.response.status >= 500;
    throw new PostingError(
      `Zernio returned HTTP ${result.response.status}: ${toErrorMessage(result.error)}`,
      retryable,
    );
  }

  const response = result.data as typeof result.data & {
    existingPost?: { _id?: string };
  };
  const postId = response.post?._id ?? response.existingPost?._id;
  if (!postId) {
    throw new PostingError(
      "Zernio accepted the request but did not return a post ID",
      true,
    );
  }

  return { postId };
}
