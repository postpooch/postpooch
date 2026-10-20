import { GetAccountCommand, SendEmailCommand, type SESv2Client } from "@aws-sdk/client-sesv2";
import type { SQSRecord } from "aws-lambda";
import type { Pool } from "pg";

import { processEmailBatch, type Dependencies } from "../functions/send-email";

const campaignId = "11111111-1111-4111-8111-111111111111";

function record(index: number, receiveCount = 1): SQSRecord {
  const sendId = `${String(index).padStart(8, "0")}-2222-4222-8222-222222222222`;
  return {
    messageId: `message-${index}`,
    receiptHandle: `receipt-${index}`,
    body: JSON.stringify({
      version: 1,
      type: "newsletter.send",
      campaignId,
      newsletterSendId: sendId,
    }),
    attributes: {
      ApproximateReceiveCount: String(receiveCount),
      SentTimestamp: "0",
      SenderId: "sender",
      ApproximateFirstReceiveTimestamp: "0",
    },
    messageAttributes: {},
    md5OfBody: "md5",
    eventSource: "aws:sqs",
    eventSourceARN: "arn:aws:sqs:us-east-1:1:queue",
    awsRegion: "us-east-1",
  };
}

function claimed(records: SQSRecord[]) {
  return records.map((item, index) => {
    const body = JSON.parse(item.body) as { newsletterSendId: string };
    return {
      disposition: "claimed",
      sendId: body.newsletterSendId,
      campaignId,
      emailAddress: `recipient${index}@example.com`,
      subjectLine: "Market update",
      previewText: "Preview",
      fromName: "PostPooch",
      fromEmail: "untrusted-browser-value@example.org",
      emailContent: {},
      unsubscribeToken: `${String(index + 100).padStart(8, "0")}-3333-4333-8333-333333333333`,
      attemptCount: 1,
    };
  });
}

function setup(records: SQSRecord[], sendBehavior?: (command: unknown) => Promise<unknown>) {
  const completions: unknown[] = [];
  const query = jest.fn(async (sql: string, values?: unknown[]) => {
    if (sql.includes("newsletter_claim_sends")) return { rows: claimed(records) };
    if (sql.includes("newsletter_campaign_sending_context")) {
      return {
        rows: [
          {
            campaignId,
            fromEmail: "sender-abc@mail-abc.postpoochmail.com",
            replyToEmail: "owner@example.com",
            tenantName: "pp-abc",
            configurationSetName: "my-first-configuration-set",
          },
        ],
      };
    }
    if (sql.includes("newsletter_mark_ses_request_started")) return { rows: [{ started: true }] };
    if (sql.includes("newsletter_complete_sends")) {
      completions.push(JSON.parse(String(values?.[0])));
      return { rows: [] };
    }
    return { rows: [] };
  });
  let sentCount = 0;
  const send = jest.fn(async (command: unknown): Promise<unknown> => {
    if (command instanceof GetAccountCommand) {
      return { SendQuota: { Max24HourSend: 50_000, SentLast24Hours: 10, MaxSendRate: 14 } };
    }
    if (sendBehavior) return sendBehavior(command);
    sentCount += 1;
    return { MessageId: `ses-${sentCount}` };
  });
  const dependencies: Dependencies = {
    database: { query } as unknown as Pool,
    ses: { send } as unknown as SESv2Client,
    unsubscribeBaseUrl: "https://postpooch.com/api/newsletter/unsubscribe",
    sendsPerSecond: 10_000,
    dailyQuotaSafetyMargin: 100,
  };
  return { dependencies, query, send, completions };
}

test("sends one SQS record to exactly one SES recipient", async () => {
  const records = [record(1)];
  const test = setup(records);
  const response = await processEmailBatch(records, test.dependencies);
  expect(response.batchItemFailures).toEqual([]);
  const sends = test.send.mock.calls.map(([command]) => command).filter((command) => command instanceof SendEmailCommand);
  expect(sends).toHaveLength(1);
  expect((sends[0] as SendEmailCommand).input.Destination?.ToAddresses).toHaveLength(1);
  expect((sends[0] as SendEmailCommand).input).toEqual(
    expect.objectContaining({
      FromEmailAddress: '"PostPooch" <sender-abc@mail-abc.postpoochmail.com>',
      ReplyToAddresses: ["owner@example.com"],
      TenantName: "pp-abc",
      ConfigurationSetName: "my-first-configuration-set",
    }),
  );
  expect(test.completions[0]).toEqual([expect.objectContaining({ outcome: "sent" })]);
});

test("iterates several records and finalizes them in one database request", async () => {
  const records = [record(1), record(2), record(3)];
  const test = setup(records);
  await processEmailBatch(records, test.dependencies);
  expect(test.send.mock.calls.filter(([command]) => command instanceof SendEmailCommand)).toHaveLength(3);
  expect(test.query.mock.calls.filter(([sql]) => String(sql).includes("newsletter_complete_sends"))).toHaveLength(1);
});

test("returns only a failed SES record in the partial batch response", async () => {
  const records = [record(1), record(2)];
  let emailCall = 0;
  const test = setup(records, async (command) => {
    if (!(command instanceof SendEmailCommand)) return {};
    emailCall += 1;
    if (emailCall === 2) {
      const error = new Error("SES rejected the request") as Error & { $metadata: { httpStatusCode: number } };
      error.$metadata = { httpStatusCode: 500 };
      throw error;
    }
    return { MessageId: "ses-ok" };
  });
  const response = await processEmailBatch(records, test.dependencies);
  expect(response.batchItemFailures).toEqual([{ itemIdentifier: "message-2" }]);
});

test("lets a database failure fail the invocation so SQS retries the batch", async () => {
  const records = [record(1)];
  const test = setup(records);
  test.query.mockRejectedValueOnce(new Error("database unavailable"));
  await expect(processEmailBatch(records, test.dependencies)).rejects.toThrow("database unavailable");
});

test.each(["sent", "cancelled", "suppressed"])(
  "acknowledges an already-terminal %s send without SES",
  async () => {
    const records = [record(1)];
    const test = setup(records);
    test.query.mockResolvedValueOnce({
      rows: [{ ...claimed(records)[0], disposition: "terminal" }],
    });
    const response = await processEmailBatch(records, test.dependencies);
    expect(response.batchItemFailures).toEqual([]);
    expect(test.send.mock.calls.filter(([command]) => command instanceof SendEmailCommand)).toHaveLength(0);
  },
);

test("marks an ambiguous network failure uncertain and does not automatically resend", async () => {
  const records = [record(1)];
  const test = setup(records, async () => {
    throw new Error("socket closed after request write");
  });
  const response = await processEmailBatch(records, test.dependencies);
  expect(response.batchItemFailures).toEqual([]);
  expect(test.completions[0]).toEqual([expect.objectContaining({ outcome: "uncertain" })]);
});

test("rejects an invalid individual-send message", async () => {
  const bad = { ...record(1), body: "{}" };
  const test = setup([]);
  const response = await processEmailBatch([bad], test.dependencies);
  expect(response.batchItemFailures).toEqual([{ itemIdentifier: "message-1" }]);
});
