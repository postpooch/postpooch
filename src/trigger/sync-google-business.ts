import {
  AbortTaskRunError,
  logger,
  metadata,
  schedules,
  task,
  wait,
} from "@trigger.dev/sdk/v3";

import { GoogleBusinessRepository } from "../../lib/google-business/repository";
import { GoogleBusinessService } from "../../lib/google-business/service";
import type { ProviderRateLimit } from "../../lib/google-business/types";
import { GoogleBusinessProviderError } from "../../lib/google-business/zernio-provider";

const SYNC_BATCH_SIZE = 1_000;
const SYNC_CONCURRENCY = 4;
const DEFAULT_REQUESTS_PER_MINUTE = 40;

function configuredRequestsPerMinute() {
  const value = Number(process.env.GOOGLE_BUSINESS_SYNC_REQUESTS_PER_MINUTE);
  return Number.isFinite(value) && value >= 10 ? Math.floor(value) : DEFAULT_REQUESTS_PER_MINUTE;
}

function waitSeconds(rate: ProviderRateLimit) {
  const base = Math.max(6, Math.ceil((60 * SYNC_CONCURRENCY) / configuredRequestsPerMinute()));
  const reserve = rate.limit === null ? null : Math.max(5, Math.ceil(rate.limit * 0.25));
  if (rate.retryAfterSeconds !== null) return Math.max(base, Math.ceil(rate.retryAfterSeconds) + 1);
  if (rate.remaining !== null && reserve !== null && rate.remaining <= reserve && rate.resetAt !== null) {
    return Math.max(base, Math.ceil(rate.resetAt - Date.now() / 1_000) + 1);
  }
  return base;
}

async function durablePace(rate: ProviderRateLimit) {
  const seconds = waitSeconds(rate);
  metadata.set("rateLimitRemaining", rate.remaining).set("paceSeconds", seconds);
  await wait.for({ seconds });
}

export const syncGoogleBusinessLocation = task({
  id: "sync-google-business-location",
  maxDuration: 900,
  ttl: "30h",
  queue: { concurrencyLimit: SYNC_CONCURRENCY },
  retry: {
    maxAttempts: 5,
    minTimeoutInMs: 5_000,
    maxTimeoutInMs: 120_000,
    factor: 2,
    randomize: true,
  },
  run: async (payload: { locationId: string }) => {
    metadata.set("locationId", payload.locationId).set("stage", "starting");
    try {
      const result = await new GoogleBusinessService().syncLocation(payload.locationId, durablePace);
      metadata.set("stage", result.status);
      logger.info("Google Business location reconciliation finished", {
        locationId: payload.locationId,
        ...result,
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Google Business sync failure";
      metadata.set("stage", "failed").set("error", message);
      logger.error("Google Business location reconciliation failed", { locationId: payload.locationId, error: message });
      if (error instanceof GoogleBusinessProviderError && !error.retryable) {
        throw new AbortTaskRunError(message);
      }
      throw error;
    }
  },
});

export const startDailyGoogleBusinessSync = schedules.task({
  id: "start-daily-google-business-sync",
  cron: {
    pattern: "0 4 * * *",
    timezone: "America/Phoenix",
  },
  maxDuration: 900,
  ttl: "2h",
  queue: { concurrencyLimit: 1 },
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 10_000,
    maxTimeoutInMs: 60_000,
    factor: 2,
    randomize: true,
  },
  run: async (payload) => {
    const repository = new GoogleBusinessRepository();
    const occurrence = payload.timestamp.toISOString().slice(0, 10);
    let afterId: string | null = null;
    let queued = 0;
    metadata.set("stage", "enumerating").set("occurrence", occurrence);
    while (true) {
      const ids = await repository.listSyncLocationIds(afterId, SYNC_BATCH_SIZE);
      if (!ids.length) break;
      await syncGoogleBusinessLocation.batchTrigger(
        ids.map((locationId) => ({
          payload: { locationId },
          options: {
            idempotencyKey: `google-business:${occurrence}:${locationId}`,
            idempotencyKeyTTL: "30h",
            concurrencyKey: locationId,
          },
        })),
      );
      queued += ids.length;
      afterId = ids.at(-1)!;
      metadata.set("queued", queued).set("lastLocationId", afterId);
      if (ids.length < SYNC_BATCH_SIZE) break;
    }
    metadata.set("stage", "queued").set("queued", queued);
    logger.info("Daily Google Business reconciliation queued", { queued, occurrence, timezone: payload.timezone });
    return { queued, occurrence, timezone: payload.timezone };
  },
});
