import { googleBusinessClockTime, onePeriodPerDay } from "@/lib/google-business/hours";
import {
  GOOGLE_BUSINESS_MEDIA_CATEGORIES,
  GOOGLE_BUSINESS_OPEN_STATUSES,
  GOOGLE_BUSINESS_PLACE_ACTION_TYPES,
  GOOGLE_BUSINESS_SERVICE_AREA_TYPES,
  type GoogleBusinessAttribute,
  type GoogleBusinessMediaCategory,
  type GoogleBusinessPhoto,
  type GoogleBusinessPhotoPatch,
  type GoogleBusinessCalendarDate,
  type GoogleBusinessCategories,
  type GoogleBusinessLocation,
  type GoogleBusinessLocationPatch,
  type GoogleBusinessOpenInfo,
  type GoogleBusinessOpenStatus,
  type GoogleBusinessPlaceAction,
  type GoogleBusinessPlaceActionType,
  type GoogleBusinessServiceArea,
  type GoogleBusinessServiceAreaType,
  type GoogleBusinessServiceItem,
  type GoogleBusinessSpecialHourPeriod,
  type GoogleBusinessSpecialHours,
  type GoogleBusinessStorefrontAddress,
} from "@/lib/google-business/types";

export type GoogleBusinessAddressForm = {
  line1: string;
  line2: string;
  locality: string;
  administrativeArea: string;
  postalCode: string;
  regionCode: string;
};

export type GoogleBusinessSpecialHoursFormRow = {
  startDate: string;
  closed: boolean;
  open: string;
  close: string;
};

export type GoogleBusinessServiceFormRow = {
  displayName: string;
  description: string;
  price: string;
  structuredServiceTypeId: string | null;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function clean(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asInt(value: unknown): number | null {
  const result = Number(value);
  return Number.isInteger(result) ? result : null;
}

export function sameJson(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function calendarDateFromIso(value: string): GoogleBusinessCalendarDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

export function calendarDateToIso(value: GoogleBusinessCalendarDate | undefined): string {
  if (!value) return "";
  return `${String(value.year).padStart(4, "0")}-${padDatePart(value.month)}-${padDatePart(value.day)}`;
}

export function normalizeCalendarDate(value: unknown): GoogleBusinessCalendarDate | null {
  const record = asRecord(value);
  if (!record) {
    return typeof value === "string" ? calendarDateFromIso(value) : null;
  }
  const year = asInt(record.year);
  const month = asInt(record.month);
  const day = asInt(record.day);
  if (year === null || month === null || day === null) return null;
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

export function formatStorefrontAddress(address: GoogleBusinessStorefrontAddress | null | undefined): string | null {
  if (!address) return null;
  const parts = [
    ...address.addressLines,
    address.locality,
    address.administrativeArea,
    address.postalCode,
  ].filter((part): part is string => Boolean(part?.trim()));
  return parts.length ? parts.join(", ") : null;
}

export function normalizeStorefrontAddress(value: unknown): GoogleBusinessStorefrontAddress | null {
  const record = asRecord(value);
  if (!record) return null;
  const addressLines = Array.isArray(record.addressLines)
    ? record.addressLines.map(clean).filter((line): line is string => Boolean(line)).slice(0, 5)
    : [];
  const regionCode = (clean(record.regionCode) ?? "US").toUpperCase();
  const address: GoogleBusinessStorefrontAddress = {
    regionCode,
    addressLines,
  };
  const languageCode = clean(record.languageCode);
  const postalCode = clean(record.postalCode);
  const administrativeArea = clean(record.administrativeArea);
  const locality = clean(record.locality);
  const sublocality = clean(record.sublocality);
  if (languageCode) address.languageCode = languageCode;
  if (postalCode) address.postalCode = postalCode;
  if (administrativeArea) address.administrativeArea = administrativeArea;
  if (locality) address.locality = locality;
  if (sublocality) address.sublocality = sublocality;
  if (!addressLines.length && !postalCode && !administrativeArea && !locality) return null;
  return address;
}

export function addressFormFrom(address: GoogleBusinessStorefrontAddress | null | undefined): GoogleBusinessAddressForm {
  return {
    line1: address?.addressLines[0] ?? "",
    line2: address?.addressLines[1] ?? "",
    locality: address?.locality ?? "",
    administrativeArea: address?.administrativeArea ?? "",
    postalCode: address?.postalCode ?? "",
    regionCode: (address?.regionCode ?? "US").toUpperCase(),
  };
}

export function addressFormToPayload(form: GoogleBusinessAddressForm): GoogleBusinessStorefrontAddress | null {
  const addressLines = [form.line1, form.line2].map((line) => line.trim()).filter(Boolean).slice(0, 5);
  const payload: GoogleBusinessStorefrontAddress = {
    regionCode: form.regionCode.trim().toUpperCase() || "US",
    addressLines,
  };
  if (form.locality.trim()) payload.locality = form.locality.trim();
  if (form.administrativeArea.trim()) payload.administrativeArea = form.administrativeArea.trim();
  if (form.postalCode.trim()) payload.postalCode = form.postalCode.trim();
  if (!addressLines.length && !payload.locality && !payload.administrativeArea && !payload.postalCode) return null;
  return payload;
}

export function normalizeSpecialHours(value: unknown): GoogleBusinessSpecialHours {
  const record = asRecord(value);
  const rawPeriods = Array.isArray(value)
    ? value
    : Array.isArray(record?.specialHourPeriods) ? record.specialHourPeriods : [];
  const specialHourPeriods: GoogleBusinessSpecialHourPeriod[] = [];
  for (const period of rawPeriods) {
    const item = asRecord(period);
    if (!item) continue;
    const startDate = normalizeCalendarDate(item.startDate);
    if (!startDate) continue;
    const closed = Boolean(item.closed);
    const next: GoogleBusinessSpecialHourPeriod = { startDate, closed };
    const endDate = normalizeCalendarDate(item.endDate);
    if (endDate) next.endDate = endDate;
    if (!closed) {
      const openTime = googleBusinessClockTime(item.openTime) ?? clean(item.openTime) ?? undefined;
      const closeTime = googleBusinessClockTime(item.closeTime) ?? clean(item.closeTime) ?? undefined;
      if (openTime) next.openTime = openTime;
      if (closeTime) next.closeTime = closeTime;
    }
    specialHourPeriods.push(next);
  }
  return { specialHourPeriods };
}

export function specialHoursFormFrom(hours: GoogleBusinessSpecialHours | null | undefined): GoogleBusinessSpecialHoursFormRow[] {
  return normalizeSpecialHours(hours).specialHourPeriods.map((period) => ({
    startDate: calendarDateToIso(period.startDate),
    closed: period.closed,
    open: period.openTime ?? "09:00",
    close: period.closeTime ?? "17:00",
  }));
}

export function specialHoursFormToPayload(rows: GoogleBusinessSpecialHoursFormRow[]): GoogleBusinessSpecialHours {
  const specialHourPeriods: GoogleBusinessSpecialHourPeriod[] = [];
  for (const row of rows) {
    const startDate = calendarDateFromIso(row.startDate);
    if (!startDate) continue;
    if (row.closed) {
      specialHourPeriods.push({ startDate, closed: true });
      continue;
    }
    specialHourPeriods.push({
      startDate,
      closed: false,
      openTime: googleBusinessClockTime(row.open) ?? row.open,
      closeTime: googleBusinessClockTime(row.close) ?? row.close,
    });
  }
  return { specialHourPeriods };
}

export function normalizeAdditionalPhones(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const phones: string[] = [];
  for (const item of value) {
    const phone = clean(item);
    if (phone && !phones.includes(phone)) phones.push(phone);
    if (phones.length === 2) break;
  }
  return phones;
}

export function normalizeCategories(value: unknown): GoogleBusinessCategories {
  const record = asRecord(value);
  if (!record) return {};
  const primary = asRecord(record.primaryCategory);
  const additional = Array.isArray(record.additionalCategories) ? record.additionalCategories : [];
  const categories: GoogleBusinessCategories = {};
  if (primary) {
    const name = clean(primary.name) ?? undefined;
    const displayName = clean(primary.displayName) ?? undefined;
    if (name || displayName) categories.primaryCategory = { name, displayName };
  }
  const additionalCategories = additional.flatMap((item) => {
    const category = asRecord(item);
    if (!category) return [];
    const name = clean(category.name) ?? undefined;
    const displayName = clean(category.displayName) ?? undefined;
    return name || displayName ? [{ name, displayName }] : [];
  });
  if (additionalCategories.length) categories.additionalCategories = additionalCategories;
  return categories;
}

function normalizePrice(value: unknown): GoogleBusinessServiceItem["price"] | undefined {
  const record = asRecord(value);
  if (!record) return undefined;
  const currencyCode = clean(record.currencyCode)?.toUpperCase();
  const units = record.units === undefined || record.units === null ? null : String(record.units).trim();
  if (!currencyCode || !units) return undefined;
  const price: NonNullable<GoogleBusinessServiceItem["price"]> = { currencyCode, units };
  const nanos = asInt(record.nanos);
  if (nanos !== null) price.nanos = nanos;
  return price;
}

export function normalizeServices(value: unknown): GoogleBusinessServiceItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const record = asRecord(item);
    if (!record) return [];
    const structured = asRecord(record.structuredServiceItem);
    const freeForm = asRecord(record.freeFormServiceItem);
    const next: GoogleBusinessServiceItem = {};
    if (structured) {
      const serviceTypeId = clean(structured.serviceTypeId);
      if (serviceTypeId) {
        next.structuredServiceItem = {
          serviceTypeId,
          description: clean(structured.description) ?? undefined,
        };
      }
    }
    if (freeForm) {
      const category = clean(freeForm.category);
      const label = asRecord(freeForm.label);
      const displayName = clean(label?.displayName);
      if (category && displayName) {
        next.freeFormServiceItem = {
          category,
          label: {
            displayName,
            description: clean(label?.description) ?? undefined,
            languageCode: clean(label?.languageCode) ?? undefined,
          },
        };
      }
    }
    const price = normalizePrice(record.price);
    if (price) next.price = price;
    return next.structuredServiceItem || next.freeFormServiceItem ? [next] : [];
  });
}

export function serviceLabel(service: GoogleBusinessServiceItem) {
  return service.freeFormServiceItem?.label.displayName
    ?? service.structuredServiceItem?.description
    ?? service.structuredServiceItem?.serviceTypeId
    ?? "Service";
}

export function serviceFormFrom(services: GoogleBusinessServiceItem[]): GoogleBusinessServiceFormRow[] {
  return normalizeServices(services).map((service) => ({
    displayName: service.freeFormServiceItem?.label.displayName
      ?? service.structuredServiceItem?.description
      ?? "",
    description: service.freeFormServiceItem?.label.description
      ?? service.structuredServiceItem?.description
      ?? "",
    price: service.price?.units ?? "",
    structuredServiceTypeId: service.structuredServiceItem?.serviceTypeId ?? null,
  }));
}

export function serviceFormToPayload(
  rows: GoogleBusinessServiceFormRow[],
  categoryName: string | null,
  currencyCode = "USD",
): GoogleBusinessServiceItem[] {
  return rows.flatMap((row) => {
    const displayName = row.displayName.trim();
    const description = row.description.trim() || undefined;
    const priceUnits = row.price.trim();
    if (row.structuredServiceTypeId) {
      const item: GoogleBusinessServiceItem = {
        structuredServiceItem: {
          serviceTypeId: row.structuredServiceTypeId,
          description: description || displayName || undefined,
        },
      };
      if (priceUnits) item.price = { currencyCode, units: priceUnits };
      return [item];
    }
    if (!displayName || !categoryName) return [];
    const item: GoogleBusinessServiceItem = {
      freeFormServiceItem: {
        category: categoryName,
        label: { displayName, description, languageCode: "en" },
      },
    };
    if (priceUnits) item.price = { currencyCode, units: priceUnits };
    return [item];
  });
}

export function normalizeOpenInfo(value: unknown): GoogleBusinessOpenInfo {
  const record = asRecord(value);
  const status = typeof record?.status === "string" && (GOOGLE_BUSINESS_OPEN_STATUSES as readonly string[]).includes(record.status)
    ? record.status as GoogleBusinessOpenStatus
    : "OPEN";
  const info: GoogleBusinessOpenInfo = { status };
  if (typeof record?.canReopen === "boolean") info.canReopen = record.canReopen;
  const openingDate = normalizeCalendarDate(record?.openingDate);
  if (openingDate) info.openingDate = openingDate;
  return info;
}

export function normalizeServiceArea(value: unknown): GoogleBusinessServiceArea {
  const record = asRecord(value);
  if (!record) return {};
  const area: GoogleBusinessServiceArea = {};
  if (typeof record.businessType === "string" && (GOOGLE_BUSINESS_SERVICE_AREA_TYPES as readonly string[]).includes(record.businessType)) {
    area.businessType = record.businessType as GoogleBusinessServiceAreaType;
  }
  const regionCode = clean(record.regionCode);
  if (regionCode) area.regionCode = regionCode.toUpperCase();
  const places = asRecord(record.places);
  const placeInfos = Array.isArray(places?.placeInfos) ? places.placeInfos.flatMap((item) => {
    const place = asRecord(item);
    const placeName = clean(place?.placeName);
    const placeId = clean(place?.placeId);
    return placeName && placeId ? [{ placeName, placeId }] : [];
  }) : [];
  if (placeInfos.length) area.places = { placeInfos: placeInfos.slice(0, 20) };
  return area;
}

export function attributeKey(name: string) {
  return name.replace(/^attributes\//, "");
}

export function normalizeAttributes(value: unknown): GoogleBusinessAttribute[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const record = asRecord(item);
    const name = clean(record?.name) ?? clean(record?.parent);
    if (!name) return [];
    const values = Array.isArray(record?.values) ? record.values : [];
    const repeated = asRecord(record?.repeatedEnumValue);
    return [{
      name: attributeKey(name),
      valueType: clean(record?.valueType) ?? "BOOL",
      values,
      displayName: clean(record?.displayName),
      groupDisplayName: clean(record?.groupDisplayName),
      repeatedEnumValue: repeated ? {
        setValues: Array.isArray(repeated.setValues) ? repeated.setValues.map(String) : [],
        unsetValues: Array.isArray(repeated.unsetValues) ? repeated.unsetValues.map(String) : [],
      } : undefined,
    }];
  });
}

export function isAttributeEnabled(attribute: GoogleBusinessAttribute) {
  if (attribute.valueType === "REPEATED_ENUM") return Boolean(attribute.repeatedEnumValue?.setValues.length);
  return attribute.values.some((value) => value === true || value === "true");
}

export function attributeLabel(attribute: GoogleBusinessAttribute) {
  if (attribute.displayName) return attribute.displayName;
  return attributeKey(attribute.name).replace(/^has_/, "").replace(/_/g, " ");
}

export function googleBusinessMediaId(value: string) {
  const parts = value.trim().split("/").filter(Boolean);
  return parts.at(-1) ?? value.trim();
}

export function normalizeMediaCategory(value: unknown): GoogleBusinessMediaCategory | null {
  return typeof value === "string" && (GOOGLE_BUSINESS_MEDIA_CATEGORIES as readonly string[]).includes(value)
    ? value as GoogleBusinessMediaCategory
    : null;
}

export function normalizePhotos(value: unknown): GoogleBusinessPhoto[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    const record = asRecord(item);
    const url = clean(record?.url) ?? clean(record?.path);
    if (!url) return [];
    const providerMediaId = clean(record?.providerMediaId) ?? clean(record?.provider_media_id);
    return [{
      id: clean(record?.id) ?? `photo-${index}`,
      providerMediaId: providerMediaId ? googleBusinessMediaId(providerMediaId) : null,
      url,
      category: normalizeMediaCategory(record?.category ?? record?.media_category),
    }];
  });
}

export function photosToPatch(photos: GoogleBusinessPhoto[]): GoogleBusinessPhotoPatch[] {
  return normalizePhotos(photos).map((photo) => ({
    ...(photo.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i) ? { id: photo.id } : {}),
    providerMediaId: photo.providerMediaId,
    url: photo.url,
    category: photo.category ?? "ADDITIONAL",
  }));
}

export function photoSignature(photos: GoogleBusinessPhoto[] | GoogleBusinessPhotoPatch[]) {
  return normalizePhotos(photos).map((photo) => ({
    providerMediaId: photo.providerMediaId,
    url: photo.url,
    category: photo.category ?? "ADDITIONAL",
  }));
}

export function listingHeroUrl(photos: GoogleBusinessPhoto[]) {
  const cover = photos.find((photo) => photo.category === "COVER");
  return cover?.url ?? photos[0]?.url ?? null;
}

export function normalizePlaceActions(value: unknown): GoogleBusinessPlaceAction[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const record = asRecord(item);
    const uri = clean(record?.uri);
    const placeActionType = typeof record?.placeActionType === "string"
      && (GOOGLE_BUSINESS_PLACE_ACTION_TYPES as readonly string[]).includes(record.placeActionType)
      ? record.placeActionType as GoogleBusinessPlaceActionType
      : null;
    if (!uri || !placeActionType) return [];
    return [{ name: clean(record?.name), uri, placeActionType }];
  });
}

export type PatchableLocation = Pick<
  GoogleBusinessLocation,
  "description" | "websiteUri" | "primaryPhone" | "regularHours"
> & Partial<GoogleBusinessLocation> & {
  photos?: GoogleBusinessPhoto[];
};

export type LocationPatchForm = {
  title: string;
  description: string;
  websiteUri: string;
  primaryPhone: string;
  additionalPhones: string[];
  storefrontAddress: GoogleBusinessStorefrontAddress | null;
  regularHours: GoogleBusinessLocation["regularHours"];
  specialHours: GoogleBusinessSpecialHours;
  services: GoogleBusinessServiceItem[];
  openInfo: GoogleBusinessOpenInfo;
  serviceArea: GoogleBusinessServiceArea;
  attributes: GoogleBusinessAttribute[];
  placeActions: GoogleBusinessPlaceAction[];
  photos: GoogleBusinessPhoto[];
};

export function locationDetailsFields(patch: GoogleBusinessLocationPatch) {
  return {
    title: patch.title,
    storefrontAddress: patch.storefrontAddress,
    description: patch.description,
    websiteUri: patch.websiteUri,
    primaryPhone: patch.primaryPhone,
    additionalPhones: patch.additionalPhones,
    regularHours: patch.regularHours,
    specialHours: patch.specialHours,
    services: patch.services,
    openInfo: patch.openInfo,
    serviceArea: patch.serviceArea,
  };
}

export function hasLocationDetailsPatch(patch: GoogleBusinessLocationPatch) {
  return Object.values(locationDetailsFields(patch)).some((value) => value !== undefined);
}

export function locationPatchFormFrom(location: PatchableLocation, form: {
  title?: string;
  description: string;
  websiteUri: string;
  primaryPhone: string;
  additionalPhones?: string[];
  storefrontAddress?: GoogleBusinessStorefrontAddress | null;
  regularHours: GoogleBusinessLocation["regularHours"];
  specialHours?: GoogleBusinessSpecialHours;
  services?: GoogleBusinessServiceItem[];
  openInfo?: GoogleBusinessOpenInfo;
  serviceArea?: GoogleBusinessServiceArea;
  attributes?: GoogleBusinessAttribute[];
  placeActions?: GoogleBusinessPlaceAction[];
  photos?: GoogleBusinessPhoto[];
}): LocationPatchForm {
  return {
    title: form.title ?? location.title ?? "",
    description: form.description,
    websiteUri: form.websiteUri,
    primaryPhone: form.primaryPhone,
    additionalPhones: form.additionalPhones ?? location.additionalPhones ?? [],
    storefrontAddress: form.storefrontAddress ?? location.storefrontAddress ?? null,
    regularHours: form.regularHours,
    specialHours: form.specialHours ?? location.specialHours ?? { specialHourPeriods: [] },
    services: form.services ?? location.services ?? [],
    openInfo: form.openInfo ?? location.openInfo ?? { status: "OPEN" },
    serviceArea: form.serviceArea ?? location.serviceArea ?? {},
    attributes: form.attributes ?? location.attributes ?? [],
    placeActions: form.placeActions ?? location.placeActions ?? [],
    photos: form.photos ?? location.photos ?? [],
  };
}

export function buildLocationPatch(location: PatchableLocation, form: LocationPatchForm): GoogleBusinessLocationPatch {
  const patch: GoogleBusinessLocationPatch = {};
  if (form.title !== (location.title ?? "")) patch.title = form.title;
  if (form.description !== (location.description ?? "")) patch.description = form.description;
  if (form.websiteUri !== (location.websiteUri ?? "")) patch.websiteUri = form.websiteUri;
  const nextPhones = normalizeAdditionalPhones(form.additionalPhones);
  const originalPhones = normalizeAdditionalPhones(location.additionalPhones);
  if (form.primaryPhone !== (location.primaryPhone ?? "") || !sameJson(nextPhones, originalPhones)) {
    patch.primaryPhone = form.primaryPhone;
    patch.additionalPhones = nextPhones;
  }
  if (!sameJson(form.storefrontAddress, location.storefrontAddress ?? null)) {
    patch.storefrontAddress = form.storefrontAddress;
  }
  const nextHours = { periods: onePeriodPerDay(form.regularHours) };
  const originalHours = { periods: onePeriodPerDay(location.regularHours) };
  if (!sameJson(nextHours, originalHours)) patch.regularHours = nextHours;
  const nextSpecial = normalizeSpecialHours(form.specialHours);
  const originalSpecial = normalizeSpecialHours(location.specialHours);
  if (!sameJson(nextSpecial, originalSpecial)) patch.specialHours = nextSpecial;
  const nextServices = normalizeServices(form.services);
  const originalServices = normalizeServices(location.services);
  if (!sameJson(nextServices, originalServices)) patch.services = nextServices;
  const nextOpen = normalizeOpenInfo(form.openInfo);
  const originalOpen = normalizeOpenInfo(location.openInfo);
  if (nextOpen.status !== originalOpen.status) patch.openInfo = { status: nextOpen.status };
  const nextArea = normalizeServiceArea(form.serviceArea);
  const originalArea = normalizeServiceArea(location.serviceArea);
  if (nextArea.businessType !== originalArea.businessType) {
    patch.serviceArea = {
      ...originalArea,
      businessType: nextArea.businessType,
    };
    if (nextArea.businessType === "CUSTOMER_LOCATION_ONLY") {
      patch.storefrontAddress = null;
    }
  }
  const nextAttributes = normalizeAttributes(form.attributes);
  const originalAttributes = normalizeAttributes(location.attributes);
  if (!sameJson(nextAttributes, originalAttributes)) patch.attributes = nextAttributes;
  const nextActions = normalizePlaceActions(form.placeActions);
  const originalActions = normalizePlaceActions(location.placeActions);
  if (!sameJson(nextActions, originalActions)) patch.placeActions = nextActions;
  const nextPhotos = photosToPatch(form.photos);
  const originalPhotos = photosToPatch(location.photos ?? []);
  if (!sameJson(photoSignature(nextPhotos), photoSignature(originalPhotos))) patch.photos = nextPhotos;
  return patch;
}
