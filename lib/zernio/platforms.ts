export const CONNECTABLE_PLATFORMS = ['instagram', 'facebook'] as const;

export type ConnectablePlatform = (typeof CONNECTABLE_PLATFORMS)[number];

export function isConnectablePlatform(
  value: unknown,
): value is ConnectablePlatform {
  return (
    typeof value === 'string' &&
    (CONNECTABLE_PLATFORMS as readonly string[]).includes(value)
  );
}

export function platformDisplayName(platform: ConnectablePlatform) {
  return platform === 'instagram' ? 'Instagram' : 'Facebook';
}
