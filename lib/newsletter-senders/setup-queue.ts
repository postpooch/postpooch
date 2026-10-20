import "server-only";

import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

import { newsletterSenderSetupMessage } from "@/shared/newsletter/messages";

const region = process.env.NEWSLETTER_AWS_REGION?.trim() || "us-east-1";
const sqs = new SQSClient({ region, maxAttempts: 3 });

export async function queueNewsletterSenderSetup(profileId: string) {
  const queueUrl = process.env.NEWSLETTER_SENDER_SETUP_QUEUE_URL?.trim();
  if (!queueUrl) throw new Error("Newsletter sender setup queue is not configured.");
  const response = await sqs.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(newsletterSenderSetupMessage(profileId)),
    }),
  );
  if (!response.MessageId) throw new Error("AWS did not confirm the sender setup message.");
  return response.MessageId;
}
