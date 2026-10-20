import "server-only";

import { z } from "zod";

import { getDbPool } from "@/lib/db/client";

export { listNewsletterAudiencesForProfile } from "@/lib/newsletter-audiences/store";
export type { NewsletterAudience as NewsletterAudienceOption } from "@/lib/newsletter-audiences/types";

export type NewsletterCampaignListItem = {
  emailId: string;
  campaignId: string | null;
  subjectLine: string;
  status:
    | "draft"
    | "preparing"
    | "queued"
    | "dispatching"
    | "sending"
    | "completed"
    | "cancelled"
    | "failed";
  createdAt: string;
  sendTime: string | null;
  sentCount: number;
  totalSendCount: number;
};

/**
 * Sidebar history includes standalone email drafts as well as campaigns that
 * have entered the send flow. This keeps "Finish later" drafts discoverable.
 */
export async function listNewsletterCampaignsForProfile(
  profileId: string,
): Promise<NewsletterCampaignListItem[]> {
  const result = await getDbPool().query<NewsletterCampaignListItem>(
    `
      select
        email.id as "emailId",
        campaign.id as "campaignId",
        coalesce(
          nullif(btrim(campaign.subject_line), ''),
          case when campaign.id is null then 'Untitled draft' else 'Untitled campaign' end
        ) as "subjectLine",
        coalesce(campaign.status, 'draft') as status,
        email.created_at::text as "createdAt",
        campaign.send_time::text as "sendTime",
        coalesce(campaign.sent_count, 0)::int as "sentCount",
        coalesce(campaign.total_send_count, 0)::int as "totalSendCount"
      from public.newsletter_emails email
      left join public.newsletter_campaigns campaign
        on campaign.newsletter_email_id = email.id
       and campaign.profile_id = email.profile_id
      where email.profile_id = $1::uuid
      order by coalesce(campaign.send_time, campaign.created_at, email.created_at) desc,
        email.id desc
    `,
    [profileId],
  );
  return result.rows;
}

export const createNewsletterCampaignSchema = z.object({
  emailId: z.string().uuid(),
  audienceIds: z.array(z.string().uuid()).min(1).max(100),
  subjectLine: z.string().trim().min(1).max(998),
  previewText: z.string().trim().max(200).default(""),
  fromName: z.string().trim().min(1).max(200),
});

export type CreateNewsletterCampaignInput = z.infer<
  typeof createNewsletterCampaignSchema
>;

export async function createOrReuseNewsletterCampaign(input: {
  profileId: string;
  campaign: CreateNewsletterCampaignInput;
}) {
  const client = await getDbPool().connect();
  try {
    await client.query("begin");
    const emailResult = await client.query<{
      id: string;
      newsletterCampaignId: string | null;
      content: unknown;
    }>(
      `
        select
          id,
          newsletter_campaign_id as "newsletterCampaignId",
          content
        from public.newsletter_emails
        where id = $1::uuid and profile_id = $2::uuid
        for update
      `,
      [input.campaign.emailId, input.profileId],
    );
    const email = emailResult.rows[0];
    if (!email) throw new Error("NEWSLETTER_EMAIL_NOT_FOUND");

    if (email.newsletterCampaignId) {
      const existing = await client.query<{ id: string; dispatchStatus: string }>(
        `select id, dispatch_status as "dispatchStatus" from public.newsletter_campaigns where id = $1::uuid and profile_id = $2::uuid`,
        [email.newsletterCampaignId, input.profileId],
      );
      if (!existing.rows[0]) throw new Error("NEWSLETTER_CAMPAIGN_NOT_FOUND");
      await client.query("commit");
      return {
        campaignId: existing.rows[0].id,
        reused: true,
        dispatchStatus: existing.rows[0].dispatchStatus,
      };
    }

    if (email.content == null) throw new Error("NEWSLETTER_EMAIL_EMPTY");

    const senderResult = await client.query<{
      identityId: string;
      tenantId: string;
      fromEmail: string;
    }>(
      `
        select
          identity.id as "identityId",
          tenant.id as "tenantId",
          identity.from_email as "fromEmail"
        from public.newsletter_sending_identities identity
        join public.newsletter_ses_tenants tenant
          on tenant.profile_id = identity.profile_id
        where identity.profile_id = $1::uuid
          and identity.status = 'ready'
          and identity.verification_status = 'SUCCESS'
          and identity.reply_to_verified_at is not null
          and tenant.status = 'ready'
        for share of identity, tenant
      `,
      [input.profileId],
    );
    const sender = senderResult.rows[0];
    if (!sender) throw new Error("NEWSLETTER_SENDER_NOT_READY");

    const audienceIds = [...new Set(input.campaign.audienceIds)];
    const audiences = await client.query<{ id: string }>(
      `
        select id
        from public.newsletter_audiences
        where profile_id = $1::uuid and id = any($2::uuid[])
      `,
      [input.profileId, audienceIds],
    );
    if (audiences.rowCount !== audienceIds.length) {
      throw new Error("NEWSLETTER_AUDIENCE_NOT_FOUND");
    }

    // Selecting an audience is the send-time intent for contacts whose email
    // status has not been classified yet. Preserve every explicit opt-out.
    await client.query(
      `
        update public.crm_contacts c
        set email_marketing_status = 'subscribed',
            email_marketing_status_changed_at = now()
        where c.profile_id = $1::uuid
          and c.email_marketing_status = 'unknown'
          and c.email is not null
          and btrim(c.email) <> ''
          and exists (
            select 1
            from public.newsletter_audience_contact_connections acc
            join public.newsletter_audiences audience
              on audience.id = acc.newsletter_audience_id
             and audience.profile_id = c.profile_id
            where acc.crm_contact_id = c.id
              and audience.id = any($2::uuid[])
          )
      `,
      [input.profileId, audienceIds],
    );

    const campaignResult = await client.query<{ id: string }>(
      `
        insert into public.newsletter_campaigns (
          profile_id,
          newsletter_email_id,
          subject_line,
          preview_text,
          from_name,
          from_email,
          newsletter_sending_identity_id,
          newsletter_ses_tenant_id,
          send_time,
          status,
          dispatch_status,
          recipient_preparation_status
        ) values ($1::uuid, $2::uuid, $3, $4, $5, $6, $7::uuid, $8::uuid, now(), 'queued', 'not_queued', 'not_started')
        returning id
      `,
      [
        input.profileId,
        input.campaign.emailId,
        input.campaign.subjectLine,
        input.campaign.previewText,
        input.campaign.fromName,
        sender.fromEmail,
        sender.identityId,
        sender.tenantId,
      ],
    );
    const campaignId = campaignResult.rows[0]?.id;
    if (!campaignId) throw new Error("NEWSLETTER_CAMPAIGN_INSERT_FAILED");

    await client.query(
      `
        insert into public.newsletter_campaign_audience_connections (
          newsletter_campaign_id,
          newsletter_audience_id
        )
        select $1::uuid, audience_id
        from unnest($2::uuid[]) as audience_id
        on conflict do nothing
      `,
      [campaignId, audienceIds],
    );
    await client.query(
      `
        update public.newsletter_emails
        set newsletter_campaign_id = $2::uuid
        where id = $1::uuid and profile_id = $3::uuid
      `,
      [input.campaign.emailId, campaignId, input.profileId],
    );
    await client.query("commit");
    return { campaignId, reused: false, dispatchStatus: "not_queued" };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function getOwnedNewsletterCampaign(
  campaignId: string,
  profileId: string,
) {
  const result = await getDbPool().query<{
    id: string;
    status: string;
    dispatchStatus: string;
  }>(
    `
      select id, status, dispatch_status as "dispatchStatus"
      from public.newsletter_campaigns
      where id = $1::uuid and profile_id = $2::uuid
      limit 1
    `,
    [campaignId, profileId],
  );
  return result.rows[0] ?? null;
}

export async function recordNewsletterCampaignQueued(
  campaignId: string,
  sqsMessageId: string,
) {
  await getDbPool().query(
    `
      update public.newsletter_campaigns
      set dispatch_status = 'queued',
          dispatch_queued_at = now(),
          sqs_message_id = $2,
          last_error = null,
          status = case when status = 'draft' then 'queued' else status end
      where id = $1::uuid and status <> 'cancelled'
    `,
    [campaignId, sqsMessageId],
  );
}

export async function recordNewsletterCampaignQueueFailure(campaignId: string) {
  await getDbPool().query(
    `
      update public.newsletter_campaigns
      set dispatch_status = 'queue_failed',
          last_error = 'AWS did not confirm campaign dispatch; retry is safe.'
      where id = $1::uuid and status <> 'cancelled'
    `,
    [campaignId],
  );
}
