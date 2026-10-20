import type { NewsletterContactOption } from "./types";

/**
 * A valid email can be used unless the contact has an explicit non-sendable
 * status. `unknown` is intentionally eligible and is promoted when a campaign
 * is submitted; explicit opt-outs remain protected.
 */
export function isNewsletterContactSendable(
  contact: NewsletterContactOption,
) {
  return (
    Boolean(contact.email?.trim()) &&
    (contact.emailMarketingStatus === "unknown" ||
      contact.emailMarketingStatus === "subscribed")
  );
}
