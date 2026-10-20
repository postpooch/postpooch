import { describe, expect, it } from "vitest";

import {
  WebsitePropertiesSchema,
  WebsitePropertySchema,
  exclusiveListings,
  formatPropertyArea,
  formatPropertyPrice,
  isAvailableListing,
  isLeaseListing,
  isSaleListing,
  isSoldListing,
  orderWebsiteProperties,
  propertiesInPlace,
  propertyStatusLabel,
  worldwideListings,
  type WebsiteProperty,
} from "./property";

function property(overrides: Partial<WebsiteProperty> = {}): WebsiteProperty {
  return WebsitePropertySchema.parse({
    id: "00000000-0000-4000-8000-000000000001",
    slug: "desert-modern-retreat",
    status: "for_sale",
    propertyType: "Single-family home",
    title: "Desert Modern Retreat",
    address: "1201 Palm Lane",
    neighborhood: "Old Town",
    city: "Scottsdale",
    region: "AZ",
    postalCode: "85251",
    country: "US",
    priceAmount: 1_250_000,
    currency: "USD",
    bedrooms: 4,
    bathrooms: 3.5,
    livingArea: 2850,
    lotSize: 9000,
    areaUnit: "sqft",
    yearBuilt: 2022,
    description: "A quiet modern residence.",
    features: ["Pool", "Mountain views"],
    images: ["https://cdn.example.com/property.webp"],
    featured: false,
    isVisible: true,
    displayOrder: 1,
    ...overrides,
  });
}

describe("website property contract", () => {
  it("validates and formats portable property data", () => {
    const value = property();
    expect(propertyStatusLabel(value.status)).toBe("For Sale");
    expect(formatPropertyPrice(value)).toBe("$1,250,000");
    expect(formatPropertyArea(value)).toBe("2,850 sq ft");
  });

  it("rejects duplicate tenant URLs", () => {
    const first = property();
    const second = property({
      id: "00000000-0000-4000-8000-000000000002",
    });
    expect(WebsitePropertiesSchema.safeParse([first, second]).success).toBe(false);
  });

  it("puts featured properties first and preserves explicit ordering", () => {
    const properties = [
      property({ id: "00000000-0000-4000-8000-000000000001", slug: "one", displayOrder: 2 }),
      property({ id: "00000000-0000-4000-8000-000000000002", slug: "two", displayOrder: 0 }),
      property({ id: "00000000-0000-4000-8000-000000000003", slug: "three", featured: true, displayOrder: 3 }),
    ];
    expect(orderWebsiteProperties(properties).map((item) => item.slug)).toEqual([
      "three",
      "two",
      "one",
    ]);
  });

  it("groups listings by sale, lease, and sold without mixing types", () => {
    const sale = property({ status: "for_sale" });
    const lease = property({
      id: "00000000-0000-4000-8000-000000000002",
      slug: "lease-home",
      status: "for_rent",
    });
    const sold = property({
      id: "00000000-0000-4000-8000-000000000003",
      slug: "sold-home",
      status: "sold",
    });
    expect(isSaleListing(sale)).toBe(true);
    expect(isLeaseListing(lease)).toBe(true);
    expect(isSoldListing(sold)).toBe(true);
    expect(exclusiveListings([sale, lease, sold]).map((item) => item.slug)).toEqual([
      "desert-modern-retreat",
    ]);
  });

  it("keeps exclusive pages on featured homes when any are marked", () => {
    const featured = property({ featured: true, status: "pending" });
    const other = property({
      id: "00000000-0000-4000-8000-000000000002",
      slug: "other-sale",
      status: "for_sale",
    });
    expect(exclusiveListings([featured, other]).map((item) => item.slug)).toEqual([
      "desert-modern-retreat",
    ]);
  });

  it("matches neighborhood strips to the place instead of padding unrelated homes", () => {
    const local = property({ neighborhood: "Beverly Hills", city: "Los Angeles" });
    const elsewhere = property({
      id: "00000000-0000-4000-8000-000000000002",
      slug: "malibu-house",
      neighborhood: "Malibu",
      city: "Malibu",
      title: "Carbon Beach",
    });
    expect(propertiesInPlace([local, elsewhere], "Beverly Hills")).toEqual([local]);
    expect(propertiesInPlace([local, elsewhere], "Malibu").map((item) => item.slug)).toEqual([
      "malibu-house",
    ]);
  });

  it("keeps worldwide pages on international homes, else current inventory", () => {
    const local = property({ status: "for_sale" });
    const sold = property({
      id: "00000000-0000-4000-8000-000000000002",
      slug: "sold-home",
      status: "sold",
    });
    const antibes = property({
      id: "00000000-0000-4000-8000-000000000003",
      slug: "cap-dantibes",
      country: "FR",
      status: "for_sale",
    });
    expect(isAvailableListing(sold)).toBe(false);
    expect(worldwideListings([local, sold]).map((item) => item.slug)).toEqual([
      "desert-modern-retreat",
    ]);
    expect(worldwideListings([local, sold, antibes]).map((item) => item.slug)).toEqual([
      "cap-dantibes",
    ]);
  });
});
