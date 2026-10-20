import {
  SendMessageBatchCommand,
  SendMessageCommand,
  SQSClient,
  type SendMessageBatchRequestEntry,
} from "@aws-sdk/client-sqs";
import type { SQSEvent } from "aws-lambda";
import type { Pool } from "pg";

import {
  newsletterCampaignDispatchMessageSchema,
  type NewsletterCampaignDispatchMessage,
  type NewsletterSendMessage,
} from "../../../../shared/newsletter/messages";
import { getDatabasePool, log, safeError } from "../shared/database";
import { mapWithConcurrency, wait } from "../shared/timing";

export const NEWSLETTER_SEND_PAGE_SIZE = 1_000;
export const SQS_BATCH_SIZE = 10;
export const SQS_BATCH_CONCURRENCY = 4;
export const SQS_BATCH_MAX_ATTEMPTS = 3;

type SendRow = { id: string; createdAt: string };

export type Dependencies = {
  database: Pool;
  sqs: SQSClient;
  campaignQueueUrl: string;
  sendQueueUrl: string;
};

const sqs = new SQSClient({ maxAttempts: 3 });

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function prepareOrVerifyCampaign(
  database: Pool,
  message: NewsletterCampaignDispatchMessage,
) {
  if (message.firstTime) {
    const result = await database.query<{ prepared: boolean; send_count: number }>(
      "select * from public.newsletter_prepare_campaign($1::uuid)",
      [message.campaignId],
    );
    if (!result.rows[0]?.prepared) throw new Error("Campaign recipient preparation did not complete");
    return result.rows[0].send_count;
  }

  const result = await database.query<{ preparationStatus: string }>(
    `
      select recipient_preparation_status as "preparationStatus"
      from public.newsletter_campaigns
      where id = $1::uuid
    `,
    [message.campaignId],
  );
  if (result.rows[0]?.preparationStatus !== "prepared") {
    throw new Error("Campaign recipient preparation is not complete");
  }
  return undefined;
}

async function readPage(database: Pool, message: NewsletterCampaignDispatchMessage) {
  const values: unknown[] = [message.campaignId, NEWSLETTER_SEND_PAGE_SIZE + 1];
  let cursorSql = "";
  if (message.cursor) {
    values.push(message.cursor.createdAt, message.cursor.id);
    cursorSql = "and (created_at, id) > ($3::timestamptz, $4::uuid)";
  }
  const result = await database.query<SendRow>(
    `
      select
        id,
        to_char(
          created_at at time zone 'UTC',
          'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'
        ) as "createdAt"
      from public.newsletter_sends
      where newsletter_campaign_id = $1::uuid
        ${cursorSql}
      order by created_at asc, id asc
      limit $2::int
    `,
    values,
  );
  return result.rows;
}

function toEntries(campaignId: string, rows: readonly SendRow[]): SendMessageBatchRequestEntry[] {
  return rows.map((row, index) => {
    const message: NewsletterSendMessage = {
      version: 1,
      type: "newsletter.send",
      campaignId,
      newsletterSendId: row.id,
    };
    return { Id: `${index}-${row.id}`, MessageBody: JSON.stringify(message) };
  });
}

export async function sendBatchWithPartialRetry(
  client: SQSClient,
  queueUrl: string,
  entries: readonly SendMessageBatchRequestEntry[],
) {
  let pending = [...entries];
  for (let attempt = 1; attempt <= SQS_BATCH_MAX_ATTEMPTS; attempt += 1) {
    try {
      const result = await client.send(
        new SendMessageBatchCommand({ QueueUrl: queueUrl, Entries: pending }),
      );
      const failedIds = new Set((result.Failed ?? []).map((item) => item.Id));
      pending = pending.filter((entry) => failedIds.has(entry.Id!));
    } catch (error) {
      if (attempt === SQS_BATCH_MAX_ATTEMPTS) throw error;
    }
    if (pending.length === 0) return;
    if (attempt < SQS_BATCH_MAX_ATTEMPTS) await wait(100 * 2 ** (attempt - 1));
  }
  throw new Error(`SQS rejected ${pending.length} newsletter send message(s)`);
}

export async function processCampaignDispatch(
  message: NewsletterCampaignDispatchMessage,
  dependencies: Dependencies,
) {
  const started = Date.now();
  const preparedCount = await prepareOrVerifyCampaign(dependencies.database, message);
  const rows = await readPage(dependencies.database, message);
  const page = rows.slice(0, NEWSLETTER_SEND_PAGE_SIZE);
  const hasMore = rows.length > NEWSLETTER_SEND_PAGE_SIZE;
  const entries = toEntries(message.campaignId, page);
  const batches: SendMessageBatchRequestEntry[][] = [];
  for (let index = 0; index < entries.length; index += SQS_BATCH_SIZE) {
    batches.push(entries.slice(index, index + SQS_BATCH_SIZE));
  }

  await mapWithConcurrency(batches, SQS_BATCH_CONCURRENCY, (batch) =>
    sendBatchWithPartialRetry(dependencies.sqs, dependencies.sendQueueUrl, batch),
  );

  if (page.length > 0) {
    await dependencies.database.query(
      `
        update public.newsletter_sends
        set queued_at = coalesce(queued_at, now())
        where id = any($1::uuid[])
      `,
      [page.map((row) => row.id)],
    );
  }

  let continuationCreated = false;
  if (hasMore) {
    const last = page.at(-1)!;
    const continuation: NewsletterCampaignDispatchMessage = {
      version: 1,
      type: "newsletter.campaign.dispatch",
      campaignId: message.campaignId,
      firstTime: false,
      cursor: { createdAt: last.createdAt, id: last.id },
    };
    await dependencies.sqs.send(
      new SendMessageCommand({
        QueueUrl: dependencies.campaignQueueUrl,
        MessageBody: JSON.stringify(continuation),
      }),
    );
    continuationCreated = true;
  } else {
    await dependencies.database.query(
      `
        update public.newsletter_campaigns
        set dispatch_status = 'fanout_complete',
            fanout_completed_at = coalesce(fanout_completed_at, now()),
            status = case when total_send_count = 0 then 'completed' else 'sending' end,
            completed_at = case when total_send_count = 0 then coalesce(completed_at, now()) else completed_at end
        where id = $1::uuid and status <> 'cancelled'
      `,
      [message.campaignId],
    );
  }

  log("info", "campaign_page_dispatched", {
    campaignId: message.campaignId,
    cursor: message.cursor,
    firstTime: message.firstTime,
    preparedCount,
    pageSize: page.length,
    messagesAttempted: entries.length,
    messagesQueued: entries.length,
    continuationCreated,
    durationMs: Date.now() - started,
  });
}

export async function handler(event: SQSEvent) {
  const database = await getDatabasePool();
  const dependencies: Dependencies = {
    database,
    sqs,
    campaignQueueUrl: required("CAMPAIGN_QUEUE_URL"),
    sendQueueUrl: required("SEND_QUEUE_URL"),
  };
  for (const record of event.Records) {
    try {
      const parsedBody: unknown = JSON.parse(record.body);
      const message = newsletterCampaignDispatchMessageSchema.parse(parsedBody);
      await processCampaignDispatch(message, dependencies);
    } catch (error) {
      log("error", "campaign_dispatch_failed", {
        sqsMessageId: record.messageId,
        receiveCount: record.attributes.ApproximateReceiveCount,
        ...safeError(error),
      });
      throw error;
    }
  }
}
