import { z } from "zod";

export const PROPERTY_STATUSES = [
  "for_sale",
  "coming_soon",
  "pending",
  "sold",
  "for_rent",
  "rented",
  "off_market",
] as const;

export const PROPERTY_AREA_UNITS = ["sqft", "sqm"] as const;

const optionalNumber = z.number().finite().nonnegative().nullable();

/**
 * The portable property contract used by storage, the editor, and every
 * website template. Template-specific presentation must be derived from this
 * shape rather than adding listing data back to template settings.
 */
export const WebsitePropertySchema = z.object({
  id: z.uuid(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  status: z.enum(PROPERTY_STATUSES),
  propertyType: z.string().trim().max(80),
  title: z.string().trim().max(160),
  address: z.string().trim().max(240),
  neighborhood: z.string().trim().max(120),
  city: z.string().trim().max(120),
  region: z.string().trim().max(120),
  postalCode: z.string().trim().max(32),
  country: z.string().trim().max(2).regex(/^$|^[A-Z]{2}$/, "Use a two-letter country code."),
  priceAmount: optionalNumber,
  currency: z.string().trim().length(3).regex(/^[A-Z]{3}$/, "Use a three-letter currency code."),
  bedrooms: optionalNumber,
  bathrooms: optionalNumber,
  livingArea: optionalNumber,
  lotSize: optionalNumber,
  areaUnit: z.enum(PROPERTY_AREA_UNITS),
  yearBuilt: z.number().int().min(1000).max(3000).nullable(),
  description: z.string().trim().max(10_000),
  features: z.array(z.string().trim().min(1).max(160)).max(50),
  images: z.array(z.url()).max(24),
  featured: z.boolean(),
  isVisible: z.boolean(),
  displayOrder: z.number().int().nonnegative(),
}).superRefine((property, context) => {
  if (property.isVisible && !property.title && !property.address) {
    context.addIssue({
      code: "custom",
      message: "A visible property needs a title or street address.",
      path: ["title"],
    });
  }
});

export type WebsiteProperty = z.infer<typeof WebsitePropertySchema>;

export const WebsitePropertiesSchema = z
  .array(WebsitePropertySchema)
  .max(250)
  .superRefine((properties, context) => {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    properties.forEach((property, index) => {
      if (ids.has(property.id)) {
        context.addIssue({
          code: "custom",
          message: "Property IDs must be unique.",
          path: [index, "id"],
        });
      }
      if (slugs.has(property.slug)) {
        context.addIssue({
          code: "custom",
          message: "Property URLs must be unique.",
          path: [index, "slug"],
        });
      }
      ids.add(property.id);
      slugs.add(property.slug);
    });
  });

const STATUS_LABELS: Record<WebsiteProperty["status"], string> = {
  for_sale: "For Sale",
  coming_soon: "Coming Soon",
  pending: "Pending",
  sold: "Sold",
  for_rent: "For Rent",
  rented: "Rented",
  off_market: "Off Market",
};

export function propertyStatusLabel(status: WebsiteProperty["status"]): string {
  return STATUS_LABELS[status];
}

export function propertyTitle(property: WebsiteProperty): string {
  return property.title || property.address || "Untitled property";
}

export function propertyLocation(property: WebsiteProperty): string {
  if (property.neighborhood) return property.neighborhood;
  return [property.city, property.region].filter(Boolean).join(", ");
}

export function propertyPrimaryImage(
  property: WebsiteProperty,
  fallback = "",
): string {
  return property.images[0] ?? fallback;
}

export function formatPropertyPrice(
  property: WebsiteProperty,
  locale = "en-US",
): string {
  if (property.priceAmount === null) return "Price on request";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: property.currency,
      maximumFractionDigits: 0,
    }).format(property.priceAmount);
  } catch {
    return `${property.currency} ${property.priceAmount.toLocaleString(locale)}`;
  }
}

export function formatPropertyArea(
  property: WebsiteProperty,
  locale = "en-US",
): string {
  if (property.livingArea === null) return "";
  const value = property.livingArea.toLocaleString(locale, {
    maximumFractionDigits: 1,
  });
  return property.areaUnit === "sqm" ? `${value} m²` : `${value} sq ft`;
}

export function orderWebsiteProperties(
  properties: readonly WebsiteProperty[],
): WebsiteProperty[] {
  return [...properties].sort(
    (left, right) =>
      Number(right.featured) - Number(left.featured) ||
      left.displayOrder - right.displayOrder,
  );
}

export function isSaleListing(property: WebsiteProperty): boolean {
  return (
    property.status === "for_sale" ||
    property.status === "coming_soon" ||
    property.status === "pending"
  );
}

export function isLeaseListing(property: WebsiteProperty): boolean {
  return property.status === "for_rent";
}

export function isSoldListing(property: WebsiteProperty): boolean {
  return property.status === "sold" || property.status === "rented";
}

/** Current inventory — not sold or rented. */
export function isAvailableListing(property: WebsiteProperty): boolean {
  return !isSoldListing(property);
}

/** Featured, coming-soon, or off-market homes — the “exclusive / private” collection. */
export function isExclusiveListing(property: WebsiteProperty): boolean {
  return (
    property.featured ||
    property.status === "coming_soon" ||
    property.status === "off_market"
  );
}

/**
 * Exclusive inventory: curated if the agent marked any, otherwise current sale listings.
 * Never mixes in sold or lease homes to fill the page.
 */
export function exclusiveListings(
  properties: readonly WebsiteProperty[],
): WebsiteProperty[] {
  const curated = properties.filter(isExclusiveListing);
  return curated.length ? curated : properties.filter(isSaleListing);
}

export function propertyMatchesPlace(
  property: WebsiteProperty,
  place: string,
): boolean {
  const needle = place.trim().toLowerCase();
  if (!needle) return false;
  return [property.neighborhood, property.city, property.region, property.address, property.title]
    .some((value) => value.toLowerCase().includes(needle));
}

export function propertiesInPlace(
  properties: readonly WebsiteProperty[],
  place: string,
): WebsiteProperty[] {
  return properties.filter((property) => propertyMatchesPlace(property, place));
}

/**
 * Worldwide / global collections: international homes when the agent has any,
 * otherwise current sale and lease inventory. Never pads with dummy catalogs
 * or mixes sold homes in as if they were available abroad.
 */
export function worldwideListings(
  properties: readonly WebsiteProperty[],
  homeCountry = "US",
): WebsiteProperty[] {
  const international = properties.filter(
    (property) => property.country && property.country !== homeCountry,
  );
  if (international.length) return international;
  return properties.filter(
    (property) => isSaleListing(property) || isLeaseListing(property),
  );
}

export function newWebsiteProperty(index: number): WebsiteProperty {
  return {
    id: crypto.randomUUID(),
    slug: `property-${Date.now().toString(36)}-${index + 1}`,
    status: "for_sale",
    propertyType: "Residence",
    title: "",
    address: "",
    neighborhood: "",
    city: "",
    region: "",
    postalCode: "",
    country: "US",
    priceAmount: null,
    currency: "USD",
    bedrooms: null,
    bathrooms: null,
    livingArea: null,
    lotSize: null,
    areaUnit: "sqft",
    yearBuilt: null,
    description: "",
    features: [],
    images: [],
    featured: false,
    isVisible: false,
    displayOrder: index,
  };
}
