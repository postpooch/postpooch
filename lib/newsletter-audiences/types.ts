export type EmailMarketingStatus =
  | "unknown"
  | "subscribed"
  | "unsubscribed"
  | "suppressed"
  | "invalid";

export type NewsletterAudience = {
  id: string;
  name: string;
  createdAt: string;
  /** Every CRM contact currently included in the audience. */
  memberCount: number;
  /** Members with a valid email who have not explicitly opted out. */
  contactCount: number;
  contactIds: string[];
};

export type NewsletterContactOption = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  emailMarketingStatus: EmailMarketingStatus;
};
