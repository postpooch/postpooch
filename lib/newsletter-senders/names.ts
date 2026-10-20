const PROFILE_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const NEWSLETTER_SENDING_ROOT_DOMAIN = "postpoochmail.com";

export function newsletterSenderNames(
  profileId: string,
  rootDomain = NEWSLETTER_SENDING_ROOT_DOMAIN,
) {
  if (!PROFILE_ID.test(profileId)) {
    throw new Error("A valid profile ID is required to create newsletter sender names.");
  }
  const key = profileId.replaceAll("-", "").toLowerCase();
  const identityDomain = `mail-${key}.${rootDomain}`;
  return {
    tenantName: `pp-${key}`,
    identityDomain,
    fromEmail: `sender-${key}@${identityDomain}`,
    mailFromDomain: `bounce.${identityDomain}`,
  };
}
