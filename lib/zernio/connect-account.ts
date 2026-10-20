import { getZernioClient } from '@/lib/zernio/client';
import {
  platformDisplayName,
  type ConnectablePlatform,
} from '@/lib/zernio/platforms';

export {
  CONNECTABLE_PLATFORMS,
  isConnectablePlatform,
  platformDisplayName,
  type ConnectablePlatform,
} from '@/lib/zernio/platforms';

function zernioErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'Unable to reach Zernio right now.';
  }

  const record = error as { error?: unknown; message?: unknown };
  const message = record.error ?? record.message;

  return typeof message === 'string' && message.trim()
    ? message
    : 'Unable to reach Zernio right now.';
}

export class ZernioConnectError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = 'ZernioConnectError';
    this.status = status;
  }
}

export async function getPlatformConnectAuthUrl(input: {
  platform: ConnectablePlatform;
  socialProfileId: string;
  redirectUrl: string;
}): Promise<string> {
  const zernio = getZernioClient();

  const result = await zernio.connect.getConnectUrl({
    path: { platform: input.platform },
    query: {
      profileId: input.socialProfileId,
      redirect_url: input.redirectUrl,
    },
  });

  if (result.error) {
    const status = result.response.status;

    if (status === 402) {
      throw new ZernioConnectError(
        'Account connection is temporarily unavailable. Please try again later.',
        402,
      );
    }

    if (status === 401 || status === 403) {
      throw new ZernioConnectError(
        'Unable to start the connection. Please try again.',
        502,
      );
    }

    throw new ZernioConnectError(
      `Unable to start the ${platformDisplayName(input.platform)} connection: ${zernioErrorMessage(result.error)}`,
      status >= 400 && status < 500 ? status : 502,
    );
  }

  const authUrl = result.data?.authUrl;

  if (!authUrl) {
    throw new ZernioConnectError(
      'Zernio accepted the request but did not return a connect URL.',
      502,
    );
  }

  return authUrl;
}

export async function verifyConnectedAccount(input: {
  socialProfileId: string;
  platform: ConnectablePlatform;
  accountId: string;
}) {
  const zernio = getZernioClient();

  const result = await zernio.accounts.listAccounts({
    query: { profileId: input.socialProfileId },
  });

  if (result.error) {
    throw new ZernioConnectError(
      `Unable to verify the connected account: ${zernioErrorMessage(result.error)}`,
      result.response.status >= 400 && result.response.status < 500
        ? result.response.status
        : 502,
    );
  }

  const account = result.data?.accounts?.find(
    (entry: { _id: string; platform: string }) =>
      entry._id === input.accountId && entry.platform === input.platform,
  );

  if (!account) {
    return null;
  }

  return {
    accountId: account._id,
    platform: input.platform,
    username: account.username ?? null,
  };
}

export function buildConnectCallbackUrl(request: Request) {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost ?? request.headers.get('host');

  if (!host) {
    throw new ZernioConnectError(
      'Unable to determine the app URL for the connection callback.',
      500,
    );
  }

  const forwardedProto = request.headers.get('x-forwarded-proto');
  const protocol =
    forwardedProto ??
    (host.includes('localhost') || host.startsWith('127.') ? 'http' : 'https');

  return `${protocol}://${host}/dashboard/social-media/connect/callback`;
}
