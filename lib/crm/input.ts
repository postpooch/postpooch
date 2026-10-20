import { z } from "zod";

import {
  CRM_CONTACT_PRIORITIES,
  CRM_CONTACT_TYPES,
  CRM_DEAL_CLIENT_TYPES,
  CRM_LEAD_STATUSES,
  CRM_LISTING_STATUSES,
  CRM_PARTNER_TYPES,
  CRM_PROPERTY_TYPES,
  CRM_TASK_PRIORITIES,
  CRM_TASK_TYPES,
  CRM_TRANSACTION_SIDES,
  CRM_TRANSACTION_STATUSES,
} from "@/lib/crm/constants";

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();
const optionalUuid = z.string().uuid().nullable().optional();
const optionalMoney = z.number().finite().min(0).max(999_999_999_999.99).nullable().optional();
const optionalDateTime = z.string().datetime({ offset: true }).nullable().optional();
const optionalDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional();

const contactFields = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().max(100).default(""),
  email: z.string().trim().email().max(320).nullable().optional(),
  phone: optionalText(50),
  contactTypes: z.array(z.enum(CRM_CONTACT_TYPES)).max(8).default([]),
  leadStatus: z.enum(CRM_LEAD_STATUSES).default("new"),
  leadSource: optionalText(100),
  priority: z.enum(CRM_CONTACT_PRIORITIES).default("warm"),
  priceMin: optionalMoney,
  priceMax: optionalMoney,
  preferredLocations: z.array(z.string().trim().min(1).max(120)).max(20).default([]),
  preapproved: z.boolean().default(false),
  lastContactedAt: optionalDateTime,
  nextFollowUpAt: optionalDateTime,
  notes: optionalText(10_000),
  stageId: optionalUuid,
  tagIds: z.array(z.string().uuid()).max(50).default([]),
}).strict();

export const contactInput = contactFields.refine((value) => value.priceMin == null || value.priceMax == null || value.priceMax >= value.priceMin, {
  message: "Maximum price must be greater than or equal to minimum price.",
  path: ["priceMax"],
});

export const contactPatchInput = contactFields.partial().strict().refine((value) => value.priceMin == null || value.priceMax == null || value.priceMax >= value.priceMin, {
  message: "Maximum price must be greater than or equal to minimum price.",
  path: ["priceMax"],
});

export const propertyInput = z.object({
  addressLine1: z.string().trim().min(1).max(250),
  addressLine2: optionalText(250),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().min(1).max(100),
  postalCode: z.string().trim().min(1).max(30),
  country: z.string().trim().length(2).transform((value) => value.toUpperCase()).default("US"),
  propertyType: z.enum(CRM_PROPERTY_TYPES).default("single_family"),
  listingStatus: z.enum(CRM_LISTING_STATUSES).default("prospect"),
  mlsNumber: optionalText(100),
  listingPrice: optionalMoney,
  bedrooms: z.number().finite().min(0).max(100).nullable().optional(),
  bathrooms: z.number().finite().min(0).max(100).nullable().optional(),
  squareFeet: z.number().int().min(0).max(100_000_000).nullable().optional(),
  notes: optionalText(10_000),
}).strict();

export const propertyPatchInput = propertyInput.partial().strict();

export const transactionInput = z.object({
  title: z.string().trim().min(1).max(250),
  contactId: optionalUuid,
  propertyId: optionalUuid,
  partnerId: optionalUuid,
  side: z.enum(CRM_TRANSACTION_SIDES).default("buyer"),
  status: z.enum(CRM_TRANSACTION_STATUSES).default("active"),
  estimatedValue: optionalMoney,
  offerAmount: optionalMoney,
  expectedClosingDate: optionalDate,
  actualClosingDate: optionalDate,
  estimatedCommission: optionalMoney,
  actualCommission: optionalMoney,
  leadSource: optionalText(100),
  description: optionalText(10_000),
  position: z.number().int().min(0).max(1_000_000).default(0),
}).strict();

export const transactionPatchInput = transactionInput.partial().strict();

export const taskInput = z.object({
  contactId: optionalUuid,
  propertyId: optionalUuid,
  transactionId: optionalUuid,
  title: z.string().trim().min(1).max(250),
  taskType: z.enum(CRM_TASK_TYPES).default("follow_up"),
  priority: z.enum(CRM_TASK_PRIORITIES).default("normal"),
  dueAt: optionalDateTime,
  completedAt: optionalDateTime,
  details: optionalText(10_000),
}).strict();

export const taskPatchInput = taskInput.partial().strict();

const noteFields = z.object({
  contactId: optionalUuid,
  propertyId: optionalUuid,
  transactionId: optionalUuid,
  body: z.string().trim().min(1).max(20_000),
}).strict();

export const noteInput = noteFields.refine((value) => Boolean(value.contactId || value.propertyId || value.transactionId), {
  message: "A note must belong to a contact, property, or transaction.",
});

export const notePatchInput = noteFields.partial().strict();

export const tagInput = z.object({
  name: z.string().trim().min(1).max(80),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).default("#256f68"),
}).strict();
export const tagPatchInput = tagInput.partial().strict();

const stageFields = z.object({
  name: z.string().trim().min(1).max(100),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).default("#256f68"),
  position: z.number().int().min(0).max(1000).optional(),
  isClosed: z.boolean().default(false),
  isWon: z.boolean().default(false),
}).strict();
export const stageInput = stageFields.refine((value) => !value.isWon || value.isClosed, { message: "A won stage must be closed." });
export const stagePatchInput = stageFields.partial().strict().refine((value) => value.isWon !== true || value.isClosed !== false, { message: "A won stage must be closed." });

export const partnerInput = z.object({
  name: z.string().trim().min(1).max(200),
  partnerType: z.enum(CRM_PARTNER_TYPES).default("vendor"),
  contactName: optionalText(200),
  email: z.string().trim().email().max(320).nullable().optional(),
  phone: optionalText(50),
  website: z.string().trim().url().max(500).nullable().optional(),
  notes: optionalText(10_000),
}).strict();
export const partnerPatchInput = partnerInput.partial().strict();

const relationshipTypeFields = z.object({
  type1: z.string().trim().min(1).max(80),
  type2: z.string().trim().min(1).max(80).nullable().optional(),
}).strict();

export const relationshipTypeInput = relationshipTypeFields.refine(
  (value) => !value.type2 || value.type2.toLowerCase() !== value.type1.toLowerCase(),
  { message: "The two relationship labels must be different.", path: ["type2"] },
);

export const relationshipTypePatchInput = relationshipTypeFields.partial().strict().refine(
  (value) => !value.type1 || !value.type2 || value.type2.toLowerCase() !== value.type1.toLowerCase(),
  { message: "The two relationship labels must be different.", path: ["type2"] },
);

export const relationshipInput = z.object({
  contactId: z.string().uuid(),
  relatedContactId: z.string().uuid(),
  relationshipTypeId: z.string().uuid(),
  /**
   * Which side the related contact occupies from contactId's perspective.
   * "type1" → related is type_1 (e.g. Parent); contact becomes person_2.
   * "type2" → related is type_2 (e.g. Child); contact becomes person_1.
   * For symmetric types (type_2 null), always use "type1".
   */
  relatedAs: z.enum(["type1", "type2"]).default("type1"),
}).strict().refine((value) => value.contactId !== value.relatedContactId, {
  message: "A contact cannot be related to themselves.",
  path: ["relatedContactId"],
});

const dealFields = z.object({
  name: z.string().trim().min(1).max(250),
  price: z.number().int().min(0).max(9_999_999_999_999).nullable().optional(),
  commission: optionalMoney,
  closeDate: optionalDate,
  earnestMoneyDue: optionalDate,
  mutualAcceptance: optionalDate,
  dueDiligence: optionalDate,
  finalWalkThrough: optionalDate,
  possession: optionalDate,
  propertyAddress: optionalText(500),
  description: optionalText(10_000),
  clientType: z.enum(CRM_DEAL_CLIENT_TYPES),
  stageId: z.string().uuid(),
  position: z.number().int().min(0).max(1_000_000).optional(),
  contactIds: z.array(z.string().uuid()).max(50).default([]),
  partnerIds: z.array(z.string().uuid()).max(50).default([]),
}).strict();

export const dealInput = dealFields;
export const dealPatchInput = dealFields.partial().strict();

const dealStageFields = z.object({
  name: z.string().trim().min(1).max(100),
  color: z.string().regex(/^#[0-9a-f]{6}$/i).default("#256f68"),
  clientType: z.enum(CRM_DEAL_CLIENT_TYPES),
  position: z.number().int().min(0).max(1000).optional(),
}).strict();

export const dealStageInput = dealStageFields;
export const dealStagePatchInput = dealStageFields.partial().omit({ clientType: true }).strict();

export type ContactInput = z.infer<typeof contactInput>;
export type PropertyInput = z.infer<typeof propertyInput>;
export type TransactionInput = z.infer<typeof transactionInput>;
export type TaskInput = z.infer<typeof taskInput>;
export type NoteInput = z.infer<typeof noteInput>;
export type TagInput = z.infer<typeof tagInput>;
export type StageInput = z.infer<typeof stageInput>;
export type PartnerInput = z.infer<typeof partnerInput>;
export type RelationshipTypeInput = z.infer<typeof relationshipTypeInput>;
export type RelationshipInput = z.infer<typeof relationshipInput>;
export type DealInput = z.infer<typeof dealInput>;
export type DealStageInput = z.infer<typeof dealStageInput>;
