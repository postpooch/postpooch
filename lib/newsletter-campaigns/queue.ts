import "server-only";

import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

import { firstNewsletterCampaignDispatchMessage } from "@/shared/newsletter/messages";

const region = process.env.NEWSLETTER_AWS_REGION?.trim() || "us-east-1";
const sqs = new SQSClient({ region, maxAttempts: 3 });

export async function queueNewsletterCampaign(campaignId: string) {
  const queueUrl = process.env.NEWSLETTER_CAMPAIGN_QUEUE_URL?.trim();
  if (!queueUrl) {
    throw new Error("Newsletter campaign queue is not configured.");
  }

  const message = firstNewsletterCampaignDispatchMessage(campaignId);
  const response = await sqs.send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    }),
  );

  if (!response.MessageId) {
    throw new Error("AWS did not confirm the newsletter dispatch message.");
  }
  return response.MessageId;
}

