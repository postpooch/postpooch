const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isNewsletterEmailId(
  value: string | undefined | null,
): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function newsletterEditorHref(emailId: string) {
  return `/dashboard/newsletter/editor?email=${encodeURIComponent(emailId)}`;
}

export function newsletterComposeHref(emailId: string) {
  return `/dashboard/newsletter/compose?email=${encodeURIComponent(emailId)}`;
}
