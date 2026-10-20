export const CRM_CONTACT_TYPES = [
  "buyer",
  "seller",
  "renter",
  "landlord",
  "investor",
  "vendor",
] as const;

export const CRM_LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "nurturing",
  "active_client",
  "past_client",
  "inactive",
] as const;

export const CRM_CONTACT_PRIORITIES = ["hot", "warm", "cold"] as const;
export const CRM_PROPERTY_TYPES = [
  "single_family",
  "condo",
  "townhome",
  "multi_family",
  "land",
  "commercial",
  "other",
] as const;
export const CRM_LISTING_STATUSES = [
  "prospect",
  "coming_soon",
  "active",
  "pending",
  "sold",
  "leased",
  "off_market",
] as const;
export const CRM_TRANSACTION_SIDES = [
  "buyer",
  "seller",
  "landlord",
  "tenant",
  "referral",
  "other",
] as const;
export const CRM_TRANSACTION_STATUSES = ["active", "won", "lost", "on_hold"] as const;
export const CRM_TASK_TYPES = [
  "follow_up",
  "call",
  "email",
  "showing",
  "open_house",
  "inspection",
  "appraisal",
  "documents",
  "closing",
  "other",
] as const;
export const CRM_TASK_PRIORITIES = ["low", "normal", "high"] as const;
export const CRM_PARTNER_TYPES = [
  "brokerage",
  "lender",
  "title",
  "inspector",
  "contractor",
  "photographer",
  "attorney",
  "vendor",
  "other",
] as const;

export const CRM_DEAL_CLIENT_TYPES = ["buyer", "seller"] as const;

export const CRM_DEFAULT_DEAL_STAGES = {
  buyer: [
    { name: "Buyer Contract", color: "#ea580c", position: 0 },
    { name: "Offer", color: "#1961ed", position: 1 },
    { name: "Pending", color: "#ca8a04", position: 2 },
    { name: "Closed", color: "#16a34a", position: 3 },
  ],
  seller: [
    { name: "Listed", color: "#ea580c", position: 0 },
    { name: "Offer", color: "#1961ed", position: 1 },
    { name: "Pending", color: "#ca8a04", position: 2 },
    { name: "Closed", color: "#16a34a", position: 3 },
  ],
} as const;

export const CRM_DEFAULT_PAGE_SIZE = 25;
export const CRM_MAX_PAGE_SIZE = 100;

