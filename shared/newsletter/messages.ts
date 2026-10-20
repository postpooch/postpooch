import { z } from "zod";

const uuid = z.string().uuid();

export const newsletterDispatchCursorSchema = z.object({
  createdAt: z.string().datetime({ offset: true }),
  id: uuid,
});

export const newsletterCampaignDispatchMessageSchema = z
  .object({
    version: z.literal(1),
    type: z.literal("newsletter.campaign.dispatch"),
    campaignId: uuid,
    firstTime: z.boolean(),
    cursor: newsletterDispatchCursorSchema.nullable(),
  })
  .superRefine((message, context) => {
    if (message.firstTime && message.cursor !== null) {
      context.addIssue({
        code: "custom",
        path: ["cursor"],
        message: "The first dispatch must start without a cursor.",
      });
    }
    if (!message.firstTime && message.cursor === null) {
      context.addIssue({
        code: "custom",
        path: ["cursor"],
        message: "A continuation dispatch requires a cursor.",
      });
    }
  });

export const newsletterSendMessageSchema = z.object({
  version: z.literal(1),
  type: z.literal("newsletter.send"),
  campaignId: uuid,
  newsletterSendId: uuid,
});

export const newsletterSenderSetupMessageSchema = z.object({
  version: z.literal(1),
  type: z.literal("newsletter.sender.setup"),
  profileId: uuid,
});

export type NewsletterCampaignDispatchMessage = z.infer<
  typeof newsletterCampaignDispatchMessageSchema
>;

export type NewsletterSendMessage = z.infer<typeof newsletterSendMessageSchema>;
export type NewsletterSenderSetupMessage = z.infer<
  typeof newsletterSenderSetupMessageSchema
>;

export function newsletterSenderSetupMessage(
  profileId: string,
): NewsletterSenderSetupMessage {
  return newsletterSenderSetupMessageSchema.parse({
    version: 1,
    type: "newsletter.sender.setup",
    profileId,
  });
}

export function parseNewsletterCampaignDispatchMessage(
  body: string,
): NewsletterCampaignDispatchMessage {
  return newsletterCampaignDispatchMessageSchema.parse(JSON.parse(body));
}

export function parseNewsletterSendMessage(body: string): NewsletterSendMessage {
  return newsletterSendMessageSchema.parse(JSON.parse(body));
}

export function firstNewsletterCampaignDispatchMessage(
  campaignId: string,
): NewsletterCampaignDispatchMessage {
  return newsletterCampaignDispatchMessageSchema.parse({
    version: 1,
    type: "newsletter.campaign.dispatch",
    campaignId,
    firstTime: true,
    cursor: null,
  });
}
