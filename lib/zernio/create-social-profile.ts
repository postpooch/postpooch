import { getZernioClient } from '@/lib/zernio/client';

type CreateZernioSocialProfileInput = {
  /** Auth user id — used as the unique Zernio profile name per multi-tenant docs. */
  userId: string;
  email?: string;
};

function existingZernioProfileId(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const record = error as Record<string, unknown>;
  const details = record.details;

  if (details && typeof details === 'object' && !Array.isArray(details)) {
    const id = (details as Record<string, unknown>).existingProfileId;
    return typeof id === 'string' ? id : undefined;
  }

  return undefined;
}

function errorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'Unknown Zernio error.';
  }

  const message = (error as { error?: unknown; message?: unknown }).error
    ?? (error as { message?: unknown }).message;

  return typeof message === 'string' && message.trim()
    ? message
    : 'Unknown Zernio error.';
}

/**
 * Creates a Zernio workspace profile for a PostPooch user and returns its `_id`.
 * That id belongs in `profiles.social_profile_id` (DB row), not to be confused
 * with the Zernio "profile" concept itself.
 */
export async function createZernioSocialProfile({
  userId,
  email,
}: CreateZernioSocialProfileInput): Promise<string> {
  const zernio = getZernioClient();

  const result = await zernio.profiles.createProfile({
    body: {
      name: userId,
      ...(email ? { description: email } : {}),
    },
    headers: {
      'Idempotency-Key': userId,
    },
  });

  if (result.error) {
    const duplicateId = existingZernioProfileId(result.error);

    if (result.response.status === 409 && duplicateId) {
      return duplicateId;
    }

    if (result.response.status === 409) {
      const listed = await zernio.profiles.listProfiles({
        query: { name: userId },
      });
      const recoveredId = listed.data?.profiles?.[0]?._id;

      if (recoveredId) {
        return recoveredId;
      }
    }

    throw new Error(
      `Unable to create Zernio profile (HTTP ${result.response.status}): ${errorMessage(result.error)}`,
    );
  }

  const socialProfileId = result.data?.profile?._id;

  if (!socialProfileId) {
    throw new Error('Zernio accepted the request but did not return a profile id.');
  }

  return socialProfileId;
}
