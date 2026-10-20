import { z } from "zod";

import { GOOGLE_BUSINESS_CLOCK_TIME, googleBusinessClockTime } from "@/lib/google-business/hours";
import {
  GOOGLE_BUSINESS_DAYS,
  GOOGLE_BUSINESS_MEDIA_CATEGORIES,
  GOOGLE_BUSINESS_OPEN_STATUSES,
  GOOGLE_BUSINESS_PLACE_ACTION_TYPES,
  GOOGLE_BUSINESS_SERVICE_AREA_TYPES,
} from "@/lib/google-business/types";

const clockTimeSchema = z.preprocess(
  (value) => googleBusinessClockTime(value) ?? value,
  z.string({ error: "Use a 24-hour time such as 09:00." }).regex(GOOGLE_BUSINESS_CLOCK_TIME, "Use a 24-hour time such as 09:00."),
);

const periodSchema = z.object({
  openDay: z.enum(GOOGLE_BUSINESS_DAYS),
  openTime: clockTimeSchema,
  closeDay: z.enum(GOOGLE_BUSINESS_DAYS),
  closeTime: clockTimeSchema,
});

const calendarDateSchema = z.object({
  year: z.number().int().min(1).max(9999),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
});

const storefrontAddressSchema = z.object({
    regionCode: z.string().trim().regex(/^[A-Za-z]{2}$/, "Use a 2-letter country code.").transform((value) => value.toUpperCase()),
  languageCode: z.string().trim().min(2).max(16).optional(),
  postalCode: z.string().trim().max(20).optional(),
  administrativeArea: z.string().trim().max(80).optional(),
  locality: z.string().trim().max(80).optional(),
  sublocality: z.string().trim().max(80).optional(),
  addressLines: z.array(z.string().trim().min(1).max(200)).max(5),
});

const serviceItemSchema = z.object({
  structuredServiceItem: z.object({
    serviceTypeId: z.string().trim().min(1).max(200),
    description: z.string().trim().max(300).optional(),
  }).optional(),
  freeFormServiceItem: z.object({
    category: z.string().trim().min(1).max(200),
    label: z.object({
      displayName: z.string().trim().min(1).max(120),
      description: z.string().trim().max(300).optional(),
      languageCode: z.string().trim().min(2).max(16).optional(),
    }),
  }).optional(),
  price: z.object({
    currencyCode: z.string().trim().regex(/^[A-Za-z]{3}$/, "Use a 3-letter currency code.").transform((value) => value.toUpperCase()),
    units: z.string().trim().max(20),
    nanos: z.number().int().optional(),
  }).optional(),
}).refine(
  (value) => Boolean(value.structuredServiceItem || value.freeFormServiceItem),
  "Each service needs a name.",
);

const attributeSchema = z.object({
  name: z.string().trim().min(1).max(120),
  valueType: z.string().trim().min(1).max(40),
  values: z.array(z.unknown()),
  displayName: z.string().trim().max(120).nullable(),
  groupDisplayName: z.string().trim().max(120).nullable(),
  repeatedEnumValue: z.object({
    setValues: z.array(z.string()),
    unsetValues: z.array(z.string()),
  }).optional(),
});

export const googleBusinessLocationPatchSchema = z
  .object({
    title: z.string().trim().min(1).max(300).optional(),
    storefrontAddress: z.union([storefrontAddressSchema, z.null()]).optional(),
    description: z.string().trim().max(750).optional(),
    websiteUri: z.union([z.literal(""), z.url().max(2048)]).optional(),
    primaryPhone: z.string().trim().max(30).optional(),
    additionalPhones: z.array(z.string().trim().min(1).max(30)).max(2).optional(),
    regularHours: z.object({ periods: z.array(periodSchema).max(28) }).optional(),
    specialHours: z.object({
      specialHourPeriods: z.array(z.object({
        startDate: calendarDateSchema,
        endDate: calendarDateSchema.optional(),
        openTime: clockTimeSchema.optional(),
        closeTime: clockTimeSchema.optional(),
        closed: z.boolean(),
      }).refine(
        (period) => period.closed || Boolean(period.openTime && period.closeTime),
        "Open special hours need an opening and closing time.",
      )).max(50),
    }).optional(),
    services: z.array(serviceItemSchema).max(50).optional(),
    openInfo: z.object({
      status: z.enum(GOOGLE_BUSINESS_OPEN_STATUSES),
    }).optional(),
    serviceArea: z.object({
      businessType: z.enum(GOOGLE_BUSINESS_SERVICE_AREA_TYPES).optional(),
      regionCode: z.string().trim().regex(/^[A-Za-z]{2}$/, "Use a 2-letter country code.").transform((value) => value.toUpperCase()).optional(),
      places: z.object({
        placeInfos: z.array(z.object({
          placeName: z.string().trim().min(1).max(200),
          placeId: z.string().trim().min(1).max(200),
        })).max(20),
      }).optional(),
    }).optional(),
    attributes: z.array(attributeSchema).max(200).optional(),
    placeActions: z.array(z.object({
      name: z.string().trim().min(1).max(300).nullable(),
      uri: z.url().max(2048),
      placeActionType: z.enum(GOOGLE_BUSINESS_PLACE_ACTION_TYPES),
    })).max(10).optional(),
    photos: z.array(z.object({
      id: z.uuid().nullable().optional(),
      providerMediaId: z.string().trim().max(500).nullable().optional(),
      url: z.url().max(8192),
      category: z.enum(GOOGLE_BUSINESS_MEDIA_CATEGORIES),
    })).max(100).optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, "Choose at least one field to update.")
  .refine((value) => {
    if (!value.photos) return true;
    return (["COVER", "PROFILE", "LOGO"] as const).every(
      (category) => value.photos!.filter((photo) => photo.category === category).length <= 1,
    );
  }, "Only one cover, profile, and logo photo can be set.");

const FIELD_LABELS: Record<string, string> = {
  title: "Business name",
  storefrontAddress: "Address",
  description: "Business description",
  websiteUri: "Website",
  primaryPhone: "Primary phone",
  additionalPhones: "Additional phone",
  regularHours: "Regular hours",
  specialHours: "Special hours",
  services: "Services",
  openInfo: "Open status",
  serviceArea: "Service area",
  attributes: "Profile attributes",
  placeActions: "Action buttons",
  photos: "Photos",
  openTime: "opening time",
  closeTime: "closing time",
  openDay: "opening day",
  closeDay: "closing day",
  regionCode: "country",
  locality: "city",
  startDate: "date",
};

export function formatValidationError(error: z.ZodError) {
  const issue = error.issues[0];
  if (!issue) return "Check the fields and try again.";
  const field = [...issue.path]
    .reverse()
    .find((segment): segment is string => typeof segment === "string" && segment in FIELD_LABELS);
  return field ? `${FIELD_LABELS[field]}: ${issue.message}` : issue.message;
}
