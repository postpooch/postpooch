export type CrmTag = {
  id: string;
  name: string;
  color: string;
};

export type CrmStage = {
  id: string;
  profileId: string | null;
  name: string;
  color: string;
  position: number;
  isClosed: boolean;
  isWon: boolean;
};

export type CrmRelationshipType = {
  id: string;
  profileId: string | null;
  type1: string;
  type2: string | null;
};

/** A relationship as seen from one contact's perspective. */
export type CrmContactRelationship = {
  id: string;
  relatedContactId: string;
  relatedContactName: string;
  relationshipTypeId: string;
  /** Label for the related person from this contact's point of view (e.g. "Child", "Spouse"). */
  label: string;
  type1: string;
  type2: string | null;
  /** True when this contact is person_1 (holds type1). */
  isPerson1: boolean;
};

export type CrmContact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  contactTypes: string[];
  leadStatus: string;
  leadSource: string | null;
  priority: string;
  priceMin: number | null;
  priceMax: number | null;
  preferredLocations: string[];
  preapproved: boolean;
  lastContactedAt: string | null;
  nextFollowUpAt: string | null;
  notes: string | null;
  /** Contact pipeline stage (Follow Up Boss–style). */
  stage: CrmStage | null;
  tags: CrmTag[];
  relationships: CrmContactRelationship[];
  createdAt: string;
  updatedAt: string;
};

export type CrmProperty = {
  id: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  propertyType: string;
  listingStatus: string;
  mlsNumber: string | null;
  listingPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFeet: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CrmTransaction = {
  id: string;
  title: string;
  contactId: string | null;
  contactName: string | null;
  propertyId: string | null;
  propertyAddress: string | null;
  partnerId: string | null;
  side: string;
  status: string;
  estimatedValue: number | null;
  offerAmount: number | null;
  expectedClosingDate: string | null;
  actualClosingDate: string | null;
  estimatedCommission: number | null;
  actualCommission: number | null;
  leadSource: string | null;
  description: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type CrmTask = {
  id: string;
  contactId: string | null;
  contactName: string | null;
  propertyId: string | null;
  transactionId: string | null;
  transactionTitle: string | null;
  title: string;
  taskType: string;
  priority: string;
  dueAt: string | null;
  completedAt: string | null;
  details: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CrmNote = {
  id: string;
  contactId: string | null;
  propertyId: string | null;
  transactionId: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type CrmPartner = {
  id: string;
  name: string;
  partnerType: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CrmActivity = {
  id: string;
  activityType: string;
  summary: string;
  contactId: string | null;
  propertyId: string | null;
  transactionId: string | null;
  taskId: string | null;
  createdAt: string;
};

export type CrmListResponse<T> = {
  data: T[];
  meta: { page: number; pageSize: number; total: number };
};

export type CrmDealClientType = "buyer" | "seller";

export type CrmDealStage = {
  id: string;
  profileId: string;
  name: string;
  clientType: CrmDealClientType;
  color: string;
  position: number;
};

export type CrmDealLinkedContact = {
  connectionId: number | string;
  id: string;
  name: string;
};

export type CrmDealLinkedPartner = {
  connectionId: string;
  id: string;
  name: string;
  partnerType: string;
};

export type CrmDeal = {
  id: string;
  name: string;
  price: number | null;
  commission: number | null;
  closeDate: string | null;
  earnestMoneyDue: string | null;
  mutualAcceptance: string | null;
  dueDiligence: string | null;
  finalWalkThrough: string | null;
  possession: string | null;
  propertyAddress: string | null;
  description: string | null;
  clientType: CrmDealClientType;
  stageId: string | null;
  stage: Pick<CrmDealStage, "id" | "name" | "color" | "clientType" | "position"> | null;
  contacts: CrmDealLinkedContact[];
  partners: CrmDealLinkedPartner[];
  position: number;
  createdAt: string;
  updatedAt: string;
};

export type CrmDealBoardStage = CrmDealStage & {
  dealCount: number;
  totalPrice: number;
  deals: CrmDeal[];
};

export type CrmDealBoard = {
  clientType: CrmDealClientType;
  stages: CrmDealBoardStage[];
};

