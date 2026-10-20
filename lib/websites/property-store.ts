import "server-only";

import type { PoolClient } from "pg";

import { getDbPool } from "@/lib/db/client";
import {
  WebsitePropertiesSchema,
  type WebsiteProperty,
} from "@/lib/websites/property";

type PropertyRow = {
  id: string;
  slug: string;
  status: WebsiteProperty["status"];
  property_type: string;
  title: string;
  address: string;
  neighborhood: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  price_amount: string | number | null;
  currency: string;
  bedrooms: string | number | null;
  bathrooms: string | number | null;
  living_area: string | number | null;
  lot_size: string | number | null;
  area_unit: WebsiteProperty["areaUnit"];
  year_built: number | null;
  description: string;
  features: unknown;
  images: unknown;
  featured: boolean;
  is_visible: boolean;
  display_order: number;
};

const PROPERTY_COLUMNS = `
  id, slug, status, property_type, title, address, neighborhood, city, region,
  postal_code, country, price_amount, currency, bedrooms, bathrooms,
  living_area, lot_size, area_unit, year_built, description, features, images,
  featured, is_visible, display_order
`;

function nullableNumber(value: string | number | null): number | null {
  return value === null ? null : Number(value);
}

function rowToProperty(row: PropertyRow): WebsiteProperty {
  return WebsitePropertiesSchema.element.parse({
    id: row.id,
    slug: row.slug,
    status: row.status,
    propertyType: row.property_type,
    title: row.title,
    address: row.address,
    neighborhood: row.neighborhood,
    city: row.city,
    region: row.region,
    postalCode: row.postal_code,
    country: row.country,
    priceAmount: nullableNumber(row.price_amount),
    currency: row.currency,
    bedrooms: nullableNumber(row.bedrooms),
    bathrooms: nullableNumber(row.bathrooms),
    livingArea: nullableNumber(row.living_area),
    lotSize: nullableNumber(row.lot_size),
    areaUnit: row.area_unit,
    yearBuilt: row.year_built,
    description: row.description,
    features: row.features,
    images: row.images,
    featured: row.featured,
    isVisible: row.is_visible,
    displayOrder: row.display_order,
  });
}

export async function getWebsiteProperties(
  websiteId: string,
  options: { includeHidden?: boolean } = {},
): Promise<WebsiteProperty[]> {
  const result = await getDbPool().query<PropertyRow>(
    `select ${PROPERTY_COLUMNS}
       from public.properties
      where website_id = $1
        and ($2::boolean or is_visible)
      order by featured desc, display_order asc, created_at asc`,
    [websiteId, options.includeHidden ?? false],
  );
  return result.rows.map(rowToProperty);
}

export async function replaceWebsiteProperties(
  client: PoolClient,
  websiteId: string,
  input: unknown,
): Promise<WebsiteProperty[]> {
  const properties = WebsitePropertiesSchema.parse(input).map((property, index) => ({
    ...property,
    displayOrder: index,
  }));
  const ids = properties.map((property) => property.id);

  if (ids.length) {
    await client.query(
      `delete from public.properties
        where website_id = $1 and not (id = any($2::uuid[]))`,
      [websiteId, ids],
    );
  } else {
    await client.query("delete from public.properties where website_id = $1", [websiteId]);
  }

  for (const property of properties) {
    const result = await client.query(
      `insert into public.properties (
         id, website_id, slug, status, property_type, title, address,
         neighborhood, city, region, postal_code, country, price_amount,
         currency, bedrooms, bathrooms, living_area, lot_size, area_unit,
         year_built, description, features, images, featured, is_visible,
         display_order
       ) values (
         $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
         $14, $15, $16, $17, $18, $19, $20, $21, $22::jsonb, $23::jsonb,
         $24, $25, $26
       )
       on conflict (id) do update set
         slug = excluded.slug,
         status = excluded.status,
         property_type = excluded.property_type,
         title = excluded.title,
         address = excluded.address,
         neighborhood = excluded.neighborhood,
         city = excluded.city,
         region = excluded.region,
         postal_code = excluded.postal_code,
         country = excluded.country,
         price_amount = excluded.price_amount,
         currency = excluded.currency,
         bedrooms = excluded.bedrooms,
         bathrooms = excluded.bathrooms,
         living_area = excluded.living_area,
         lot_size = excluded.lot_size,
         area_unit = excluded.area_unit,
         year_built = excluded.year_built,
         description = excluded.description,
         features = excluded.features,
         images = excluded.images,
         featured = excluded.featured,
         is_visible = excluded.is_visible,
         display_order = excluded.display_order,
         updated_at = now()
       where public.properties.website_id = excluded.website_id`,
      [
        property.id,
        websiteId,
        property.slug,
        property.status,
        property.propertyType,
        property.title,
        property.address,
        property.neighborhood,
        property.city,
        property.region,
        property.postalCode,
        property.country,
        property.priceAmount,
        property.currency,
        property.bedrooms,
        property.bathrooms,
        property.livingArea,
        property.lotSize,
        property.areaUnit,
        property.yearBuilt,
        property.description,
        JSON.stringify(property.features),
        JSON.stringify(property.images),
        property.featured,
        property.isVisible,
        property.displayOrder,
      ],
    );
    if (result.rowCount !== 1) {
      throw new Error("A property identifier belongs to another website.");
    }
  }

  return properties;
}
