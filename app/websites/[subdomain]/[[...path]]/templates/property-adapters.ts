import {
  formatPropertyArea,
  formatPropertyPrice,
  propertyLocation,
  propertyPrimaryImage,
  propertyStatusLabel,
  propertyTitle,
  type WebsiteProperty,
} from "@/lib/websites/property";

import type { ArdenProperty } from "./arden/settings";
import type { AtelierProperty } from "./atelier/settings";
import type { AureliaProperty } from "./aurelia/settings";
import type { AveryProperty } from "./avery/settings";
import type { CoastalProperty } from "./coastal/settings";
import type { HarborListing } from "./harbor/settings";
import type { LuxuryProperty } from "./luxury/settings";
import type { MaraProperty } from "./mara/settings";
import type { MilaProperty } from "./mila/settings";
import type { NathanProperty } from "./nathan/settings";
import type { NorthpineProperty } from "./northpine/settings";
import type { ReyProperty } from "./rey/settings";
import type { RowanListing } from "./rowan/settings";
import type { RoweCatalogProperty } from "./rowe/settings";
import type { SloaneProperty } from "./sloane/settings";
import type { ValeProperty } from "./vale/settings";
import type { VossProperty } from "./voss/settings";

export const PROPERTY_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 1000'%3E%3Crect width='1600' height='1000' fill='%23e8e5df'/%3E%3Cpath d='M600 640 800 430l200 210M690 640l-90-95-155 165h710l-155-165-90 95' fill='none' stroke='%23b8b2a8' stroke-width='18'/%3E%3C/svg%3E";

/** Card cover only — never invent extra gallery frames from stock photos. */
function cover(property: WebsiteProperty): string {
  return propertyPrimaryImage(property, PROPERTY_IMAGE_PLACEHOLDER);
}

function gallery(property: WebsiteProperty): string[] {
  return property.images.filter(Boolean);
}

function extra(property: WebsiteProperty, index: number): string {
  return property.images[index] ?? "";
}

function paragraphs(property: WebsiteProperty): string[] {
  return property.description.split(/\n\s*\n/).filter(Boolean).length
    ? property.description.split(/\n\s*\n/).filter(Boolean)
    : [property.description || "Property details available on request."];
}

function count(value: number | null): number {
  return value ?? 0;
}

function countLabel(value: number | null): string {
  return value === null ? "—" : String(value);
}

export function toAureliaProperty(property: WebsiteProperty): AureliaProperty {
  const type =
    property.status === "for_rent" || property.status === "rented"
      ? "lease"
      : property.status === "sold"
        ? "sold"
        : "sale";
  const lot =
    property.lotSize === null
      ? "—"
      : property.areaUnit === "sqft"
        ? `${(property.lotSize / 43_560).toLocaleString("en-US", { maximumFractionDigits: 2 })} Acres`
        : `${property.lotSize.toLocaleString("en-US")} m²`;
  const garage =
    property.features.find((feature) => /car|garage/i.test(feature)) || "—";
  return {
    slug: property.slug,
    status: propertyStatusLabel(property.status),
    address: property.address || propertyTitle(property),
    city:
      [property.city, property.region].filter(Boolean).join(", ") ||
      propertyLocation(property),
    price: formatPropertyPrice(property),
    beds: countLabel(property.bedrooms),
    baths: countLabel(property.bathrooms),
    sqft:
      property.livingArea === null
        ? "—"
        : property.livingArea.toLocaleString("en-US"),
    image: cover(property),
    image2: extra(property, 1),
    image3: extra(property, 2),
    featured: property.featured,
    type,
    description: property.description,
    lot,
    year: property.yearBuilt ? String(property.yearBuilt) : "—",
    garage,
  };
}

export function toArdenProperty(property: WebsiteProperty): ArdenProperty {
  const frames = gallery(property);
  const status: ArdenProperty["status"] =
    property.status === "for_rent" || property.status === "rented"
      ? "For Lease"
      : property.status === "sold"
        ? "Sold"
        : property.status === "off_market" || property.status === "coming_soon"
          ? "Private"
          : "For Sale";
  const acres =
    property.lotSize === null
      ? undefined
      : property.areaUnit === "sqft"
        ? (property.lotSize / 43_560).toLocaleString("en-US", {
            maximumFractionDigits: 1,
          })
        : (property.lotSize / 4_046.856).toLocaleString("en-US", {
            maximumFractionDigits: 1,
          });
  const paragraphs = property.description.split(/\n\s*\n/).filter(Boolean);
  return {
    slug: property.slug,
    title: propertyTitle(property),
    location: propertyLocation(property) || property.address || propertyTitle(property),
    price: formatPropertyPrice(property),
    status,
    beds: property.bedrooms ?? undefined,
    baths: property.bathrooms ?? undefined,
    sqft:
      property.livingArea === null
        ? undefined
        : property.livingArea.toLocaleString("en-US"),
    acres,
    image: cover(property),
    gallery: frames,
    excerpt:
      property.description.split(".")[0] ||
      propertyTitle(property),
    description: paragraphs.length ? paragraphs : [property.description || "Property details available on request."],
    features: property.features,
  };
}

export function toAtelierProperty(property: WebsiteProperty): AtelierProperty {
  const living = formatPropertyArea(property);
  const acres =
    property.lotSize === null
      ? ""
      : property.areaUnit === "sqft"
        ? `${(property.lotSize / 43_560).toLocaleString("en-US", { maximumFractionDigits: 1 })} Acres`
        : `${property.lotSize.toLocaleString("en-US")} m²`;
  const place = [property.city, property.region].filter(Boolean).join(", ");
  return {
    slug: property.slug,
    title: propertyTitle(property),
    location:
      [property.neighborhood, place].filter(Boolean).join(" · ") ||
      property.address ||
      propertyTitle(property),
    price: formatPropertyPrice(property),
    beds: property.bedrooms === null ? "" : `${property.bedrooms} Beds`,
    baths: property.bathrooms === null ? "" : `${property.bathrooms} Baths`,
    area: living || acres,
    status: propertyStatusLabel(property.status),
    image: cover(property),
    image2: extra(property, 1),
    image3: extra(property, 2),
    description: property.description,
  };
}

export function toAveryProperty(property: WebsiteProperty): AveryProperty {
  const status =
    property.status === "pending"
      ? "In Contract"
      : property.status === "coming_soon" || property.status === "off_market"
        ? "Private Exclusive"
        : propertyStatusLabel(property.status);
  return {
    slug: property.slug,
    status,
    price: formatPropertyPrice(property),
    address: property.address || propertyTitle(property),
    city:
      [property.neighborhood, property.city].filter(Boolean).join(", ") ||
      propertyLocation(property),
    beds: count(property.bedrooms),
    baths: count(property.bathrooms),
    sqft:
      property.livingArea === null
        ? "—"
        : property.livingArea.toLocaleString("en-US"),
    image: cover(property),
    image2: extra(property, 1),
    image3: extra(property, 2),
    blurb: property.description.split(".")[0] || propertyTitle(property),
    description: property.description,
    featured: property.featured,
  };
}

export function toCoastalProperty(property: WebsiteProperty): CoastalProperty {
  return {
    slug: property.slug,
    price: formatPropertyPrice(property),
    address: property.address || propertyTitle(property),
    city:
      [property.city, property.region].filter(Boolean).join(", ") ||
      propertyLocation(property),
    beds: count(property.bedrooms),
    baths: count(property.bathrooms),
    sqft:
      property.livingArea === null
        ? "—"
        : property.livingArea.toLocaleString("en-US"),
    status: propertyStatusLabel(property.status),
    image: cover(property),
    blurb: property.description,
  };
}

function harborStatus(status: WebsiteProperty["status"]): HarborListing["status"] {
  if (status === "sold" || status === "rented") return "Sold";
  if (status === "coming_soon" || status === "off_market") return "Coming Soon";
  if (status === "for_rent") return "For Rent";
  if (status === "pending") return "Pending";
  return "For Sale";
}

export function toHarborListing(property: WebsiteProperty): HarborListing {
  return {
    slug: property.slug,
    status: harborStatus(property.status),
    eyebrow: property.propertyType || "Residence",
    address: property.address || propertyTitle(property),
    neighbourhood: propertyLocation(property),
    price: formatPropertyPrice(property),
    beds: countLabel(property.bedrooms),
    baths: countLabel(property.bathrooms),
    image: cover(property),
    alt: propertyTitle(property),
    blurb: property.description,
    gallery: gallery(property),
  };
}

export function toLuxuryProperty(property: WebsiteProperty): LuxuryProperty {
  const acres = property.lotSize === null
    ? null
    : property.areaUnit === "sqft"
      ? (property.lotSize / 43_560).toLocaleString("en-US", { maximumFractionDigits: 2 })
      : (property.lotSize / 4_046.856).toLocaleString("en-US", { maximumFractionDigits: 2 });
  return {
    slug: property.slug,
    status: propertyStatusLabel(property.status),
    price: formatPropertyPrice(property),
    name: propertyTitle(property),
    address: [property.address, propertyLocation(property)].filter(Boolean).join(" · "),
    beds: count(property.bedrooms),
    baths: count(property.bathrooms),
    sqft: property.livingArea === null ? "" : property.livingArea.toLocaleString("en-US"),
    acres,
    description: property.description,
    image: cover(property),
    gallery: gallery(property),
  };
}

export function toMaraProperty(property: WebsiteProperty): MaraProperty {
  return {
    slug: property.slug,
    status: propertyStatusLabel(property.status),
    address: property.address || propertyTitle(property),
    neighborhood: propertyLocation(property),
    price: formatPropertyPrice(property, property.country === "CA" ? "en-CA" : "en-US"),
    beds: count(property.bedrooms),
    baths: count(property.bathrooms),
    sqft: formatPropertyArea(property),
    image: cover(property),
    summary: property.description,
    gallery: gallery(property),
  };
}

export function toMilaProperty(property: WebsiteProperty): MilaProperty {
  return {
    slug: property.slug,
    address: property.address || propertyTitle(property),
    city: property.city,
    area: property.neighborhood || property.region,
    price: formatPropertyPrice(property, "nl-NL"),
    status: propertyStatusLabel(property.status),
    type: property.propertyType,
    year: property.yearBuilt ?? 0,
    living: count(property.livingArea),
    plot: count(property.lotSize),
    bedrooms: count(property.bedrooms),
    energy: property.features.find((feature) => /^energy\b/i.test(feature))?.replace(/^energy\s*:?\s*/i, "") || "—",
    hero: cover(property),
    images: gallery(property),
    blurb: property.description.split(".")[0] || propertyTitle(property),
    description: property.description,
    features: property.features,
  };
}

export function toNorthpineProperty(property: WebsiteProperty): NorthpineProperty {
  const living = formatPropertyArea(property).replace(/ sq ft$/i, "") || "—";
  return {
    slug: property.slug,
    title: propertyTitle(property),
    city:
      [property.city, property.region].filter(Boolean).join(", ") ||
      propertyLocation(property),
    price: formatPropertyPrice(property),
    beds: count(property.bedrooms),
    baths: countLabel(property.bathrooms),
    sqft: living,
    status: propertyStatusLabel(property.status),
    tag: property.propertyType || property.neighborhood || "Residence",
    image: cover(property),
    description: property.description,
  };
}

export function toNathanProperty(property: WebsiteProperty): NathanProperty {
  return {
    slug: property.slug,
    status: propertyStatusLabel(property.status),
    price: formatPropertyPrice(property),
    address: property.address || propertyTitle(property),
    neighborhood: propertyLocation(property),
    type: property.propertyType,
    beds: countLabel(property.bedrooms),
    baths: countLabel(property.bathrooms),
    sqft: formatPropertyArea(property),
    image: cover(property),
    image2: extra(property, 1),
    image3: extra(property, 2),
    blurb: property.description.split(".")[0] || propertyTitle(property),
    description: property.description,
  };
}

export function toReyProperty(property: WebsiteProperty): ReyProperty {
  const lot =
    property.lotSize === null
      ? undefined
      : property.areaUnit === "sqft" && property.lotSize >= 4_000
        ? `${(property.lotSize / 43_560).toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })} ac`
        : formatPropertyArea({
            ...property,
            livingArea: property.lotSize,
          }) || undefined;
  return {
    slug: property.slug,
    address: property.address || propertyTitle(property),
    city:
      [property.city, property.region].filter(Boolean).join(", ") ||
      propertyLocation(property),
    price: formatPropertyPrice(property),
    status: propertyStatusLabel(property.status),
    beds: count(property.bedrooms),
    baths: count(property.bathrooms),
    sqft:
      property.livingArea === null
        ? "—"
        : property.livingArea.toLocaleString("en-US"),
    lot,
    image: cover(property),
    gallery: gallery(property),
    description: paragraphs(property),
  };
}

export function toRowanListing(property: WebsiteProperty): RowanListing {
  return {
    slug: property.slug,
    address: property.address || propertyTitle(property),
    location: propertyLocation(property),
    price: formatPropertyPrice(property),
    status: propertyStatusLabel(property.status),
    type: property.propertyType,
    image: propertyPrimaryImage(property, PROPERTY_IMAGE_PLACEHOLDER),
    beds: count(property.bedrooms),
    baths: count(property.bathrooms),
    sqft: formatPropertyArea(property),
    acres: property.lotSize === null ? "" : property.lotSize.toLocaleString("en-US"),
    intro: property.description,
  };
}

export function toRoweProperty(property: WebsiteProperty): RoweCatalogProperty {
  return {
    slug: property.slug,
    name: propertyTitle(property),
    location: [property.address, propertyLocation(property)].filter(Boolean).join(" · "),
    price: formatPropertyPrice(property),
    status: propertyStatusLabel(property.status),
    beds: countLabel(property.bedrooms),
    baths: countLabel(property.bathrooms),
    area: formatPropertyArea(property),
    summary: property.description.split(".")[0] || propertyTitle(property),
    description: paragraphs(property),
    image: cover(property),
    image2: extra(property, 1),
    image3: extra(property, 2),
    details: property.features,
  };
}

export function toValeProperty(property: WebsiteProperty): ValeProperty {
  return {
    slug: property.slug,
    title: propertyTitle(property),
    location: [property.address, propertyLocation(property)].filter(Boolean).join(" · "),
    price: formatPropertyPrice(property),
    beds: countLabel(property.bedrooms),
    baths: countLabel(property.bathrooms),
    sqft: formatPropertyArea(property),
    status: propertyStatusLabel(property.status),
    image: cover(property),
    gallery: gallery(property),
    intro: property.description.split(".")[0] || propertyTitle(property),
    details: property.description,
  };
}

export function toVossProperty(property: WebsiteProperty): VossProperty {
  return {
    slug: property.slug,
    address: property.address || propertyTitle(property),
    neighborhood: propertyLocation(property),
    price: formatPropertyPrice(property),
    beds: count(property.bedrooms),
    baths: count(property.bathrooms),
    sqft: formatPropertyArea(property),
    status: propertyStatusLabel(property.status),
    type: property.propertyType,
    image: cover(property),
    gallery: gallery(property),
    summary: property.description.split(".")[0] || propertyTitle(property),
    details: property.features,
  };
}

export function toSloaneProperty(property: WebsiteProperty): SloaneProperty {
  const lot =
    property.lotSize === null
      ? "—"
      : property.areaUnit === "sqft"
        ? `${(property.lotSize / 43_560).toLocaleString("en-US", { maximumFractionDigits: 2 })} Acres`
        : `${property.lotSize.toLocaleString("en-US")} ha`;
  const cityLine = [property.city, property.region].filter(Boolean).join(", ");
  const city = property.postalCode
    ? `${cityLine} ${property.postalCode}`.trim()
    : cityLine || propertyLocation(property);
  const firstSentence = property.description.split(".")[0];
  return {
    slug: property.slug,
    status: propertyStatusLabel(property.status),
    price: formatPropertyPrice(property),
    address: property.address || propertyTitle(property),
    city: city || propertyLocation(property),
    beds: count(property.bedrooms),
    baths: count(property.bathrooms),
    sqft:
      property.livingArea === null
        ? "—"
        : Math.round(property.livingArea).toLocaleString("en-US"),
    lot,
    year: property.yearBuilt ?? 0,
    image: cover(property),
    summary: firstSentence ? `${firstSentence}.` : property.description,
    description: property.description,
  };
}
