import { randomUUID } from "node:crypto";

import {
  GetAccountCommand,
  SendEmailCommand,
  SESv2Client,
  type SendEmailCommandInput,
} from "@aws-sdk/client-sesv2";
import { renderToMjml } from "@templatical/renderer";
import { isRenderableTemplateContent } from "@templatical/types";
import type { SQSBatchResponse, SQSEvent, SQSRecord } from "aws-lambda";
import mjml2html from "mjml";
import type { Pool } from "pg";

import {
  newsletterSendMessageSchema,
  type NewsletterSendMessage,
} from "../../../../shared/newsletter/messages";
import { getDatabasePool, log, safeError } from "../shared/database";
import { wait } from "../shared/timing";

type ClaimRow = {
  disposition: "claimed" | "terminal" | "busy" | "not_found" | "campaign_mismatch";
  sendId: string;
  campaignId: string;
  emailAddress: string | null;
  subjectLine: string | null;
  previewText: string | null;
  fromName: string | null;
  fromEmail: string | null;
  replyToEmail: string | null;
  tenantName: string | null;
  configurationSetName: string | null;
  emailContent: unknown;
  unsubscribeToken: string | null;
  attemptCount: number | null;
};

type Completion = {
  newsletterSendId: string;
  outcome: "sent" | "retry" | "failed" | "uncertain";
  sesMessageId?: string;
  error?: string;
};

type ParsedRecord = {
  record: SQSRecord;
  message: NewsletterSendMessage;
};

export type Dependencies = {
  database: Pool;
  ses: SESv2Client;
  unsubscribeBaseUrl: string;
  sendsPerSecond: number;
  dailyQuotaSafetyMargin: number;
};

const ses = new SESv2Client({ maxAttempts: 2 });

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function positiveNumber(name: string, fallback: number) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be positive`);
  return value;
}

function receiveCount(record: SQSRecord) {
  return Math.max(1, Number(record.attributes.ApproximateReceiveCount || "1"));
}

function groupKey(message: NewsletterSendMessage) {
  return `${message.campaignId}:${message.newsletterSendId}`;
}

function truncateError(error: unknown) {
  const details = safeError(error);
  return `${details.errorName}: ${details.errorMessage}`.slice(0, 2_000);
}

function isDefiniteSesRejection(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "$metadata" in error &&
      (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode,
  );
}

function isTemporaryQuotaError(error: unknown) {
  const name = error instanceof Error ? error.name : "";
  return [
    "TooManyRequestsException",
    "ThrottlingException",
    "LimitExceededException",
    "AccountSuspendedException",
  ].includes(name);
}

function escapeFromName(value: string) {
  return value.replace(/[\r\n"]/g, " ").trim().slice(0, 200);
}

function withUnsubscribeFooter(html: string, unsubscribeUrl: string) {
  const footer = `<div style="margin:24px auto 8px;text-align:center;font-size:12px;color:#6b625d"><a href="${unsubscribeUrl}" style="color:#6b625d">Unsubscribe</a></div>`;
  return html.includes("</body>") ? html.replace("</body>", `${footer}</body>`) : `${html}${footer}`;
}

async function renderHtml(content: unknown) {
  if (!isRenderableTemplateContent(content)) {
    throw new Error("Newsletter content is not renderable Templatical JSON");
  }
  const mjml = await renderToMjml(content);
  const output = await mjml2html(mjml, { validationLevel: "strict", minify: false });
  if (output.errors.length > 0) {
    throw new Error(`MJML validation failed: ${output.errors[0]?.message ?? "unknown error"}`);
  }
  return output.html;
}

async function claimSends(
  database: Pool,
  messages: NewsletterSendMessage[],
  claimToken: string,
) {
  const result = await database.query<ClaimRow>(
    `
      select
        disposition,
        send_id as "sendId",
        campaign_id as "campaignId",
        email_address as "emailAddress",
        subject_line as "subjectLine",
        preview_text as "previewText",
        from_name as "fromName",
        from_email as "fromEmail",
        email_content as "emailContent",
        unsubscribe_token as "unsubscribeToken",
        attempt_count as "attemptCount"
      from public.newsletter_claim_sends($1::jsonb, $2::uuid, $3::integer)
    `,
    [JSON.stringify(messages), claimToken, 300],
  );
  const campaignIds = [
    ...new Set(
      result.rows
        .filter((row) => row.disposition === "claimed")
        .map((row) => row.campaignId),
    ),
  ];
  if (campaignIds.length === 0) return result.rows;
  const contexts = await database.query<{
    campaignId: string;
    fromEmail: string;
    replyToEmail: string;
    tenantName: string;
    configurationSetName: string;
  }>(
    `
      select
        campaign_id as "campaignId",
        from_email as "fromEmail",
        reply_to_email as "replyToEmail",
        tenant_name as "tenantName",
        configuration_set_name as "configurationSetName"
      from public.newsletter_campaign_sending_context($1::uuid[])
    `,
    [campaignIds],
  );
  const byCampaign = new Map(contexts.rows.map((row) => [row.campaignId, row]));
  return result.rows.map((row) => ({ ...row, ...byCampaign.get(row.campaignId) }));
}

async function markSesRequestStarted(database: Pool, sendId: string, claimToken: string) {
  const result = await database.query<{ started: boolean }>(
    `select public.newsletter_mark_ses_request_started($1::uuid, $2::uuid) as started`,
    [sendId, claimToken],
  );
  return result.rows[0]?.started === true;
}

async function completeSends(database: Pool, completions: Completion[], claimToken: string) {
  if (completions.length === 0) return;
  await database.query(
    "select public.newsletter_complete_sends($1::jsonb, $2::uuid)",
    [JSON.stringify(completions), claimToken],
  );
}

async function availableDailyCapacity(client: SESv2Client, safetyMargin: number) {
  const account = await client.send(new GetAccountCommand({}));
  const quota = account.SendQuota;
  if (!quota || quota.Max24HourSend == null || quota.SentLast24Hours == null) {
    throw new Error("SES did not return the rolling 24-hour quota");
  }
  return Math.max(0, quota.Max24HourSend - quota.SentLast24Hours - safetyMargin);
}

function createSendInput(row: ClaimRow, dependencies: Dependencies, html: string): SendEmailCommandInput {
  if (
    !row.emailAddress ||
    !row.subjectLine ||
    !row.fromName ||
    !row.fromEmail ||
    !row.replyToEmail ||
    !row.tenantName ||
    !row.configurationSetName ||
    !row.unsubscribeToken
  ) {
    throw new Error("Newsletter send is missing required snapshot or campaign data");
  }
  const unsubscribeUrl = `${dependencies.unsubscribeBaseUrl.replace(/\/$/, "")}/${encodeURIComponent(row.unsubscribeToken)}`;
  return {
    FromEmailAddress: `"${escapeFromName(row.fromName)}" <${row.fromEmail}>`,
    ReplyToAddresses: [row.replyToEmail],
    TenantName: row.tenantName,
    Destination: { ToAddresses: [row.emailAddress] },
    Content: {
      Simple: {
        Subject: { Data: row.subjectLine, Charset: "UTF-8" },
        Body: {
          Html: { Data: withUnsubscribeFooter(html, unsubscribeUrl), Charset: "UTF-8" },
          Text: { Data: row.previewText?.trim() || row.subjectLine, Charset: "UTF-8" },
        },
        Headers: [
          { Name: "List-Unsubscribe", Value: `<${unsubscribeUrl}>` },
          { Name: "List-Unsubscribe-Post", Value: "List-Unsubscribe=One-Click" },
        ],
      },
    },
    ConfigurationSetName: row.configurationSetName,
    EmailTags: [
      { Name: "campaign_id", Value: row.campaignId },
      { Name: "newsletter_send_id", Value: row.sendId },
    ],
  };
}

export async function processEmailBatch(
  records: SQSRecord[],
  dependencies: Dependencies,
): Promise<SQSBatchResponse> {
  const started = Date.now();
  const failures = new Set<string>();
  const parsed: ParsedRecord[] = [];

  for (const record of records) {
    try {
      const body: unknown = JSON.parse(record.body);
      parsed.push({ record, message: newsletterSendMessageSchema.parse(body) });
    } catch (error) {
      failures.add(record.messageId);
      log("error", "send_message_invalid", {
        sqsMessageId: record.messageId,
        receiveCount: receiveCount(record),
        ...safeError(error),
      });
    }
  }

  const groups = new Map<string, ParsedRecord[]>();
  for (const item of parsed) {
    const key = groupKey(item.message);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const unique = [...groups.values()].map((items) => items[0]!.message);
  if (unique.length === 0) {
    return { batchItemFailures: [...failures].map((itemIdentifier) => ({ itemIdentifier })) };
  }

  const claimToken = randomUUID();
  const claims = await claimSends(dependencies.database, unique, claimToken);
  const claimByKey = new Map(claims.map((claim) => [`${claim.campaignId}:${claim.sendId}`, claim]));
  const completions: Completion[] = [];
  const renderedCampaigns = new Map<string, string>();

  let dailyCapacity: number;
  try {
    dailyCapacity = await availableDailyCapacity(dependencies.ses, dependencies.dailyQuotaSafetyMargin);
  } catch (error) {
    dailyCapacity = 0;
    log("error", "ses_quota_check_failed", safeError(error));
  }

  let lastSendStartedAt = 0;
  const minimumIntervalMs = Math.ceil(1_000 / dependencies.sendsPerSecond);

  for (const [key, items] of groups) {
    const claim = claimByKey.get(key);
    if (!claim || claim.disposition === "not_found" || claim.disposition === "campaign_mismatch" || claim.disposition === "busy") {
      for (const item of items) failures.add(item.record.messageId);
      continue;
    }
    if (claim.disposition === "terminal") continue;

    const maxReceiveCount = Math.max(...items.map((item) => receiveCount(item.record)));
    const itemStarted = Date.now();
    if (dailyCapacity <= 0) {
      completions.push({
        newsletterSendId: claim.sendId,
        outcome: "retry",
        error: "SES rolling 24-hour quota has no safe remaining capacity",
      });
      for (const item of items) failures.add(item.record.messageId);
      continue;
    }

    let sesRequestStarted = false;
    try {
      let baseHtml = renderedCampaigns.get(claim.campaignId);
      if (!baseHtml) {
        baseHtml = await renderHtml(claim.emailContent);
        renderedCampaigns.set(claim.campaignId, baseHtml);
      }
      const input = createSendInput(claim, dependencies, baseHtml);
      const marked = await markSesRequestStarted(dependencies.database, claim.sendId, claimToken);
      if (!marked) throw new Error("Newsletter send claim expired before SES request");
      sesRequestStarted = true;

      const delay = minimumIntervalMs - (Date.now() - lastSendStartedAt);
      if (delay > 0) await wait(delay);
      lastSendStartedAt = Date.now();
      const response = await dependencies.ses.send(new SendEmailCommand(input));
      if (!response.MessageId) throw new Error("SES accepted no message identifier");
      dailyCapacity -= 1;
      completions.push({
        newsletterSendId: claim.sendId,
        outcome: "sent",
        sesMessageId: response.MessageId,
      });
      log("info", "newsletter_email_sent", {
        campaignId: claim.campaignId,
        newsletterSendId: claim.sendId,
        sqsMessageId: items[0]!.record.messageId,
        attempt: claim.attemptCount,
        sesMessageId: response.MessageId,
        status: "sent",
        durationMs: Date.now() - itemStarted,
      });
    } catch (error) {
      const definiteRejection = isDefiniteSesRejection(error);
      const temporaryQuota = isTemporaryQuotaError(error);
      const outcome: Completion["outcome"] =
        sesRequestStarted && !definiteRejection
          ? "uncertain"
          : temporaryQuota || maxReceiveCount < 5
            ? "retry"
            : "failed";
      completions.push({
        newsletterSendId: claim.sendId,
        outcome,
        error: truncateError(error),
      });
      if (outcome === "retry" || outcome === "failed") {
        for (const item of items) failures.add(item.record.messageId);
      }
      log("error", "newsletter_email_send_failed", {
        campaignId: claim.campaignId,
        newsletterSendId: claim.sendId,
        sqsMessageId: items[0]!.record.messageId,
        attempt: claim.attemptCount,
        receiveCount: maxReceiveCount,
        status: outcome,
        durationMs: Date.now() - itemStarted,
        ...safeError(error),
      });
    }
  }

  await completeSends(dependencies.database, completions, claimToken);
  log("info", "newsletter_email_batch_complete", {
    recordCount: records.length,
    claimedCount: claims.filter((row) => row.disposition === "claimed").length,
    failureCount: failures.size,
    durationMs: Date.now() - started,
  });
  return { batchItemFailures: [...failures].map((itemIdentifier) => ({ itemIdentifier })) };
}

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  const database = await getDatabasePool();
  return processEmailBatch(event.Records, {
    database,
    ses,
    unsubscribeBaseUrl: required("UNSUBSCRIBE_BASE_URL"),
    sendsPerSecond: positiveNumber("SES_SEND_RATE_PER_EXECUTION", 4),
    dailyQuotaSafetyMargin: positiveNumber("SES_DAILY_QUOTA_SAFETY_MARGIN", 100),
  });
}
