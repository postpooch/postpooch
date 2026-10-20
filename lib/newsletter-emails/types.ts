/**
 * Newsletter email drafts owned by a profile (`newsletter_emails`).
 *
 * Architecture:
 * - Catalog templates may be authored as MJML.
 * - Picking a template converts MJML → Templatical JSON once, then stores JSON here.
 * - The editor always loads/autosaves Templatical JSON (`content` is jsonb).
 * - JSON → MJML happens only on export/send (`editor.toMjml()`).
 */

export type NewsletterEmailRow = {
  id: string;
  created_at: string;
  profile_id: string;
  newsletter_campaign_id: string | null;
  /** jsonb document from Postgres (object), or legacy text/MJML string. */
  content: unknown;
};

export type NewsletterEmail = {
  id: string;
  createdAt: string;
  profileId: string;
  campaignId: string | null;
  /** Templatical JSON object, legacy JSON/MJML string, or null. */
  content: unknown;
  /** Empty canvas — no blocks yet. */
  isBlank: boolean;
};
