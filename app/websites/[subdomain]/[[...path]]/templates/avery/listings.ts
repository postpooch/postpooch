import type { WebsiteProperty } from "@/lib/websites/property";

import type { AveryProperty } from "./settings";
import { toAveryProperty } from "../property-adapters";

export function averyActiveProperties(
  properties: readonly WebsiteProperty[],
): AveryProperty[] {
  return properties
    .filter((property) => property.status !== "sold" && property.status !== "rented")
    .map(toAveryProperty);
}

export function averySoldProperties(
  properties: readonly WebsiteProperty[],
): AveryProperty[] {
  return properties
    .filter((property) => property.status === "sold" || property.status === "rented")
    .map(toAveryProperty);
}
