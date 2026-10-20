import "server-only";

import { getDbPool } from "@/lib/db/client";
import { newsletterSenderNames } from "@/lib/newsletter-senders/names";
import { queueNewsletterSenderSetup } from "@/lib/newsletter-senders/setup-queue";

export type NewsletterSenderSetupInput = {
  profileId: string;
  replyToEmail: string;
  replyToVerified: boolean;
};

export async function initializeNewsletterSenderSetup(
  input: NewsletterSenderSetupInput,
) {
  const names = newsletterSenderNames(input.profileId);
  const email = input.replyToEmail.trim().toLowerCase();
  if (!email) throw new Error("A reply-to email is required for newsletter setup.");
  const configurationSetName =
    process.env.NEWSLETTER_SES_CONFIGURATION_SET?.trim() ||
    "my-first-configuration-set";
  const client = await getDbPool().connect();
  try {
    await client.query("begin");
    await client.query(
      `
        insert into public.newsletter_ses_tenants (
          profile_id, tenant_name, configuration_set_name, status
        ) values ($1::uuid, $2, $3, 'pending')
        on conflict (profile_id) do update
          set updated_at = now()
      `,
      [input.profileId, names.tenantName, configurationSetName],
    );
    await client.query(
      `
        insert into public.newsletter_sending_identities (
          profile_id, identity_domain, from_local_part, from_email,
          mail_from_domain, reply_to_email, reply_to_verified_at, status
        ) values ($1::uuid, $2, $3, $4, $5, $6,
          case when $7::boolean then now() else null end, 'pending')
        on conflict (profile_id) do update
          set reply_to_email = excluded.reply_to_email,
              reply_to_verified_at = case
                when $7::boolean then coalesce(
                  public.newsletter_sending_identities.reply_to_verified_at,
                  now()
                )
                else null
              end,
              status = case
                when public.newsletter_sending_identities.reply_to_email = excluded.reply_to_email
                  and public.newsletter_sending_identities.status = 'ready'
                  and $7::boolean
                then 'ready'
                else 'pending'
              end,
              verified_at = case
                when public.newsletter_sending_identities.reply_to_email = excluded.reply_to_email
                then public.newsletter_sending_identities.verified_at
                else null
              end,
              ready_at = case
                when public.newsletter_sending_identities.reply_to_email = excluded.reply_to_email
                then public.newsletter_sending_identities.ready_at
                else null
              end,
              updated_at = now()
      `,
      [
        input.profileId,
        names.identityDomain,
        names.fromEmail.split("@")[0],
        names.fromEmail,
        names.mailFromDomain,
        email,
        input.replyToVerified,
      ],
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  try {
    const messageId = await queueNewsletterSenderSetup(input.profileId);
    return { ...names, queued: true, messageId };
  } catch (error) {
    const message = error instanceof Error ? `${error.name}: ${error.message}` : "Unknown queue error";
    await getDbPool().query(
      `
        update public.newsletter_ses_tenants
        set last_error = $2, next_attempt_at = now(), updated_at = now()
        where profile_id = $1::uuid
      `,
      [input.profileId, message.slice(0, 2_000)],
    );
    console.error("Newsletter sender setup enqueue failed", {
      profileId: input.profileId,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return { ...names, queued: false, messageId: null };
  }
}

export async function getNewsletterSenderSetup(profileId: string) {
  const result = await getDbPool().query<{
    fromEmail: string;
    status: string;
    verificationStatus: string;
    replyToVerified: boolean;
    tenantStatus: string;
  }>(
    `
      select
        identity.from_email as "fromEmail",
        identity.status,
        identity.verification_status as "verificationStatus",
        identity.reply_to_verified_at is not null as "replyToVerified",
        tenant.status as "tenantStatus"
      from public.newsletter_sending_identities identity
      join public.newsletter_ses_tenants tenant on tenant.profile_id = identity.profile_id
      where identity.profile_id = $1::uuid
      limit 1
    `,
    [profileId],
  );
  const setup = result.rows[0];
  if (!setup) return null;
  return {
    fromEmail: setup.fromEmail,
    ready:
      setup.status === "ready" &&
      setup.verificationStatus === "SUCCESS" &&
      setup.replyToVerified &&
      setup.tenantStatus === "ready",
  };
}
