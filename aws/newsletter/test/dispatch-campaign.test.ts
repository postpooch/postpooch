import { SendMessageBatchCommand, SendMessageCommand, type SQSClient } from "@aws-sdk/client-sqs";
import type { Pool } from "pg";

import {
  NEWSLETTER_SEND_PAGE_SIZE,
  processCampaignDispatch,
  sendBatchWithPartialRetry,
  type Dependencies,
} from "../functions/dispatch-campaign";
import { newsletterCampaignDispatchMessageSchema } from "../../../shared/newsletter/messages";

const campaignId = "11111111-1111-4111-8111-111111111111";

function row(index: number) {
  return {
    id: `${String(index).padStart(8, "0")}-1111-4111-8111-111111111111`,
    createdAt: `2026-10-09T12:${String(Math.floor(index / 60) % 60).padStart(2, "0")}:${String(index % 60).padStart(2, "0")}.000Z`,
  };
}

function dependencies(rows: ReturnType<typeof row>[]) {
  const query = jest.fn(async (sql: string, _values?: unknown[]) => {
    if (sql.includes("newsletter_prepare_campaign")) return { rows: [{ prepared: true, send_count: rows.length }] };
    if (sql.includes("recipient_preparation_status")) return { rows: [{ preparationStatus: "prepared" }] };
    if (sql.includes("from public.newsletter_sends")) return { rows };
    return { rows: [] };
  });
  const send = jest.fn(async (command: unknown) => {
    if (command instanceof SendMessageBatchCommand) {
      return { Successful: command.input.Entries?.map((entry) => ({ Id: entry.Id })) };
    }
    return { MessageId: "continuation-id" };
  });
  return {
    value: {
      database: { query } as unknown as Pool,
      sqs: { send } as unknown as SQSClient,
      campaignQueueUrl: "https://sqs.us-east-1.amazonaws.com/1/campaigns",
      sendQueueUrl: "https://sqs.us-east-1.amazonaws.com/1/sends",
    } satisfies Dependencies,
    query,
    send,
  };
}

const firstMessage = newsletterCampaignDispatchMessageSchema.parse({
  version: 1,
  type: "newsletter.campaign.dispatch",
  campaignId,
  firstTime: true,
  cursor: null,
});

test("dispatches fewer than 1,000 sends without a continuation", async () => {
  const deps = dependencies([row(1), row(2)]);
  await processCampaignDispatch(firstMessage, deps.value);
  const commands = deps.send.mock.calls.map(([command]) => command);
  expect(commands.filter((command) => command instanceof SendMessageBatchCommand)).toHaveLength(1);
  expect(commands.filter((command) => command instanceof SendMessageCommand)).toHaveLength(0);
});

test("dispatches one 1,000-row page and uses its final row as the continuation cursor", async () => {
  const rows = Array.from({ length: NEWSLETTER_SEND_PAGE_SIZE + 1 }, (_, index) => row(index));
  const deps = dependencies(rows);
  await processCampaignDispatch(firstMessage, deps.value);
  const batchCommands = deps.send.mock.calls
    .map(([command]) => command)
    .filter((command): command is SendMessageBatchCommand => command instanceof SendMessageBatchCommand);
  expect(batchCommands).toHaveLength(100);
  expect(batchCommands.flatMap((command) => command.input.Entries ?? [])).toHaveLength(1_000);
  const continuation = deps.send.mock.calls
    .map(([command]) => command)
    .find((command): command is SendMessageCommand => command instanceof SendMessageCommand);
  expect(JSON.parse(continuation!.input.MessageBody!)).toMatchObject({
    firstTime: false,
    cursor: { id: rows[999]!.id, createdAt: rows[999]!.createdAt },
  });
});

test("uses an exact timestamp and id keyset cursor without OFFSET pagination", async () => {
  const cursor = {
    createdAt: "2026-10-09T12:34:56.123456Z",
    id: row(999).id,
  };
  const deps = dependencies([]);
  await processCampaignDispatch(
    newsletterCampaignDispatchMessageSchema.parse({
      version: 1,
      type: "newsletter.campaign.dispatch",
      campaignId,
      firstTime: false,
      cursor,
    }),
    deps.value,
  );
  const pageCall = deps.query.mock.calls.find(([sql]) => String(sql).includes("select\n        id"));
  expect(String(pageCall?.[0])).toContain("(created_at, id) >");
  expect(String(pageCall?.[0])).toContain("to_char");
  expect(String(pageCall?.[0]).toLowerCase()).not.toContain("offset");
  expect(pageCall?.[1]).toEqual([campaignId, NEWSLETTER_SEND_PAGE_SIZE + 1, cursor.createdAt, cursor.id]);
});

test("retries only failed SendMessageBatch entries", async () => {
  const send = jest
    .fn()
    .mockResolvedValueOnce({ Failed: [{ Id: "b", Code: "InternalError" }], Successful: [{ Id: "a" }] })
    .mockResolvedValueOnce({ Successful: [{ Id: "b" }] });
  await sendBatchWithPartialRetry(
    { send } as unknown as SQSClient,
    "queue-url",
    [
      { Id: "a", MessageBody: "a" },
      { Id: "b", MessageBody: "b" },
    ],
  );
  expect((send.mock.calls[1]![0] as SendMessageBatchCommand).input.Entries).toEqual([
    { Id: "b", MessageBody: "b" },
  ]);
});

test("rejects an invalid campaign message", () => {
  expect(() => newsletterCampaignDispatchMessageSchema.parse({ campaignId })).toThrow();
});

test("a duplicate first delivery is safe to fan out again", async () => {
  const deps = dependencies([row(1)]);
  await processCampaignDispatch(firstMessage, deps.value);
  await processCampaignDispatch(firstMessage, deps.value);
  expect(deps.send).toHaveBeenCalledTimes(2);
  expect(deps.query.mock.calls.filter(([sql]) => String(sql).includes("newsletter_prepare_campaign"))).toHaveLength(2);
});
