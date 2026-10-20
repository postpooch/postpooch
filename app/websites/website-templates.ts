/**
 * Catalog of agent website templates available in the dashboard picker.
 * Preview images live on Cloudflare R2 at:
 *   {CLOUDFLARE_R2_PUBLIC_BASE_URL}/websites/websites_preview/{previewFile}
 *
 * Keep `id` in sync with template folders under
 * `app/websites/[subdomain]/[[...path]]/templates/` and the tenant registry.
 */

export type WebsiteTemplate = {
  /** Folder / registry key (e.g. "elena"). */
  id: string;
  /** Display name shown under the preview. */
  name: string;
  /** One-line mood line — Airbnb-style secondary meta. */
  mood: string;
  /** Short supporting sentence for the selected state. */
  blurb: string;
  /** Filename in R2 websites_preview/ (and local images/ dummy). */
  previewFile: string;
};

export const WEBSITE_TEMPLATES: readonly WebsiteTemplate[] = [
  {
    id: "arden",
    name: "Arden",
    mood: "Wine Country · Editorial",
    blurb: "Quiet luxury for Napa and Sonoma advisors who lead with land, architecture, and restraint.",
    previewFile: "arden.webp",
  },
  {
    id: "atelier",
    name: "Atelier",
    mood: "Editorial · Hill Country",
    blurb: "Quiet luxury for Austin advisors who lead with architecture and taste.",
    previewFile: "atelier.webp",
  },
  {
    id: "aurelia",
    name: "Aurelia",
    mood: "Editorial · Los Angeles luxury",
    blurb: "Quiet luxury for advisors who lead with architecture, privacy, and restraint.",
    previewFile: "aurelia.webp",
  },
  {
    id: "avery",
    name: "Avery",
    mood: "Editorial · New York",
    blurb: "Quiet luxury for advisors who lead with judgment, design, and a considered New York practice.",
    previewFile: "avery.webp",
  },
  {
    id: "coastal",
    name: "Coastal",
    mood: "Coastal luxury · Southern California",
    blurb: "A full coastal practice site with listings, communities, and buyer-seller guides.",
    previewFile: "coastal.webp",
  },
  {
    id: "elena",
    name: "Elena",
    mood: "Editorial · Private client",
    blurb: "Quiet luxury for advisors who lead with taste and restraint.",
    previewFile: "elena.webp",
  },
  {
    id: "harbor",
    name: "Harbor",
    mood: "Warm · Neighborhood-first",
    blurb: "A lived-in residential site built around buy, sell, and local trust.",
    previewFile: "harbor.webp",
  },
  {
    id: "luxury",
    name: "Luxury",
    mood: "Full brokerage · Premium",
    blurb: "A complete luxury practice site—listings, neighborhoods, and press.",
    previewFile: "luxury.webp",
  },
  {
    id: "mara",
    name: "Mara",
    mood: "City & waterfront · Modern",
    blurb: "Confident urban marketing with neighborhoods and condo depth.",
    previewFile: "mara.webp",
  },
  {
    id: "mila",
    name: "Mila",
    mood: "European · Property-led",
    blurb: "Clean property storytelling with areas, services, and journal.",
    previewFile: "mila.webp",
  },
  {
    id: "nathan",
    name: "Nathan",
    mood: "Market authority · Sold focus",
    blurb: "Results-forward presence with neighborhoods, insights, and press.",
    previewFile: "nathan.webp",
  },
  {
    id: "northpine",
    name: "Northpine",
    mood: "Mountain · Lake & land",
    blurb: "A full mountain-market site with communities, guides, and lifestyle pages.",
    previewFile: "northpine.webp",
  },
  {
    id: "rey",
    name: "Rey",
    mood: "Editorial · California estates",
    blurb: "Quiet luxury for advisors who lead with team, communities, and press.",
    previewFile: "rey.webp",
  },
  {
    id: "rowan",
    name: "Rowan",
    mood: "Estates · Project showcase",
    blurb: "Bold project and listing pages for agents with signature inventory.",
    previewFile: "rowan.webp",
  },
  {
    id: "rowe",
    name: "Rowe",
    mood: "Advisory · Service-led",
    blurb: "A calm practice site that elevates services, listings, and journal.",
    previewFile: "rowe.webp",
  },
  {
    id: "sloane",
    name: "Sloane",
    mood: "Editorial · Los Angeles luxury",
    blurb: "A refined LA practice site with listings, neighborhoods, press, and journal.",
    previewFile: "sloane.webp",
  },
  {
    id: "vale",
    name: "Vale",
    mood: "Estate · Serene",
    blurb: "Spacious residential pages with a soft editorial journal.",
    previewFile: "vale.webp",
  },
  {
    id: "voss",
    name: "Voss",
    mood: "Urban luxury · Editorial",
    blurb: "High-contrast city luxury with neighborhoods and new developments.",
    previewFile: "voss.webp",
  },
] as const;

const PREVIEW_PREFIX = "websites/websites_preview";
/** Bump when replacing preview objects in place so browsers and next/image skip stale immutable cache. */
const PREVIEW_CACHE_VERSION = "2";

/** R2 object key for a template preview file. */
export function websiteTemplatePreviewKey(previewFile: string): string {
  return `${PREVIEW_PREFIX}/${previewFile}`;
}

/**
 * Absolute public URL for a template preview image.
 * `publicBaseUrl` should be `CLOUDFLARE_R2_PUBLIC_BASE_URL` (no trailing slash required).
 */
export function websiteTemplatePreviewUrl(
  publicBaseUrl: string,
  previewFile: string,
): string {
  const base = publicBaseUrl.replace(/\/+$/, "");
  const key = websiteTemplatePreviewKey(previewFile)
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${base}/${key}?v=${PREVIEW_CACHE_VERSION}`;
}

export function getWebsiteTemplate(id: string): WebsiteTemplate | undefined {
  return WEBSITE_TEMPLATES.find((template) => template.id === id);
}
