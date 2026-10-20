export const GOOGLE_BUSINESS_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export type GoogleBusinessDay = (typeof GOOGLE_BUSINESS_DAYS)[number];

export type GoogleBusinessHoursPeriod = {
  openDay: GoogleBusinessDay;
  openTime: string;
  closeDay: GoogleBusinessDay;
  closeTime: string;
};

export type GoogleBusinessRegularHours = {
  periods: GoogleBusinessHoursPeriod[];
};

export type GoogleBusinessCalendarDate = {
  year: number;
  month: number;
  day: number;
};

export type GoogleBusinessSpecialHourPeriod = {
  startDate: GoogleBusinessCalendarDate;
  endDate?: GoogleBusinessCalendarDate;
  openTime?: string;
  closeTime?: string;
  closed: boolean;
};

export type GoogleBusinessSpecialHours = {
  specialHourPeriods: GoogleBusinessSpecialHourPeriod[];
};

export type GoogleBusinessStorefrontAddress = {
  regionCode: string;
  languageCode?: string;
  postalCode?: string;
  administrativeArea?: string;
  locality?: string;
  sublocality?: string;
  addressLines: string[];
};

export type GoogleBusinessCategories = {
  primaryCategory?: { name?: string; displayName?: string };
  additionalCategories?: Array<{ name?: string; displayName?: string }>;
};

export type GoogleBusinessServicePrice = {
  currencyCode: string;
  units: string;
  nanos?: number;
};

export type GoogleBusinessServiceItem = {
  structuredServiceItem?: {
    serviceTypeId: string;
    description?: string;
  };
  freeFormServiceItem?: {
    category: string;
    label: {
      displayName: string;
      description?: string;
      languageCode?: string;
    };
  };
  price?: GoogleBusinessServicePrice;
};

export const GOOGLE_BUSINESS_OPEN_STATUSES = [
  "OPEN",
  "CLOSED_TEMPORARILY",
  "CLOSED_PERMANENTLY",
] as const;

export type GoogleBusinessOpenStatus = (typeof GOOGLE_BUSINESS_OPEN_STATUSES)[number];

export type GoogleBusinessOpenInfo = {
  status: GoogleBusinessOpenStatus;
  canReopen?: boolean;
  openingDate?: GoogleBusinessCalendarDate;
};

export const GOOGLE_BUSINESS_SERVICE_AREA_TYPES = [
  "CUSTOMER_AND_BUSINESS_LOCATION",
  "CUSTOMER_LOCATION_ONLY",
] as const;

export type GoogleBusinessServiceAreaType = (typeof GOOGLE_BUSINESS_SERVICE_AREA_TYPES)[number];

export type GoogleBusinessPlaceInfo = {
  placeName: string;
  placeId: string;
};

export type GoogleBusinessServiceArea = {
  businessType?: GoogleBusinessServiceAreaType;
  regionCode?: string;
  places?: { placeInfos: GoogleBusinessPlaceInfo[] };
};

export type GoogleBusinessAttribute = {
  name: string;
  valueType: string;
  values: unknown[];
  displayName: string | null;
  groupDisplayName: string | null;
  repeatedEnumValue?: {
    setValues: string[];
    unsetValues: string[];
  };
};

export const GOOGLE_BUSINESS_PLACE_ACTION_TYPES = [
  "APPOINTMENT",
  "ONLINE_APPOINTMENT",
  "DINING_RESERVATION",
  "FOOD_ORDERING",
  "FOOD_DELIVERY",
  "FOOD_TAKEOUT",
  "SHOP_ONLINE",
] as const;

export type GoogleBusinessPlaceActionType = (typeof GOOGLE_BUSINESS_PLACE_ACTION_TYPES)[number];

export type GoogleBusinessPlaceAction = {
  name: string | null;
  uri: string;
  placeActionType: GoogleBusinessPlaceActionType;
};

export const GOOGLE_BUSINESS_MEDIA_CATEGORIES = [
  "COVER",
  "PROFILE",
  "LOGO",
  "EXTERIOR",
  "INTERIOR",
  "PRODUCT",
  "FOOD_AND_DRINK",
  "MENU",
  "COMMON_AREA",
  "ROOMS",
  "TEAMS",
  "AT_WORK",
  "ADDITIONAL",
  "CATEGORY_UNSPECIFIED",
] as const;

export type GoogleBusinessMediaCategory = (typeof GOOGLE_BUSINESS_MEDIA_CATEGORIES)[number];

export type GoogleBusinessPhoto = {
  id: string;
  providerMediaId: string | null;
  url: string;
  category: GoogleBusinessMediaCategory | null;
};

export type GoogleBusinessPhotoPatch = {
  id?: string | null;
  providerMediaId?: string | null;
  url: string;
  category: GoogleBusinessMediaCategory;
};

export type GoogleBusinessLocation = {
  id: string;
  connectionId: string;
  zernioLocationId: string;
  googleAccountId: string | null;
  title: string;
  formattedAddress: string | null;
  storefrontAddress: GoogleBusinessStorefrontAddress | null;
  primaryPhone: string | null;
  additionalPhones: string[];
  websiteUri: string | null;
  description: string | null;
  categories: GoogleBusinessCategories;
  regularHours: GoogleBusinessRegularHours;
  specialHours: GoogleBusinessSpecialHours;
  services: GoogleBusinessServiceItem[];
  openInfo: GoogleBusinessOpenInfo;
  serviceArea: GoogleBusinessServiceArea;
  attributes: GoogleBusinessAttribute[];
  placeActions: GoogleBusinessPlaceAction[];
  placeId: string | null;
  mapsUri: string | null;
  reviewUrl: string | null;
  isVerified: boolean;
  averageRating: number | null;
  reviewCount: number;
  isSelected: boolean;
  syncStatus: "pending" | "syncing" | "synced" | "failed";
  syncError: string | null;
  lastSyncedAt: string | null;
};

export type GoogleBusinessReview = {
  id: string;
  providerReviewId: string;
  reviewerName: string;
  reviewerPhotoUrl: string | null;
  rating: number;
  comment: string | null;
  replyComment: string | null;
  providerCreatedAt: string | null;
};

export type GoogleBusinessMetricPoint = {
  date: string;
  name: string;
  value: number;
};

export type GoogleBusinessKeyword = {
  month: string;
  keyword: string;
  impressions: number;
};

export type GoogleBusinessDashboard = {
  connection: null | {
    id: string;
    status: string;
    needsReconnection: boolean;
    lastSyncedAt: string | null;
  };
  locations: GoogleBusinessLocation[];
  selectedLocationId: string | null;
  reviews: GoogleBusinessReview[];
  metrics: GoogleBusinessMetricPoint[];
  keywords: GoogleBusinessKeyword[];
  photos: GoogleBusinessPhoto[];
};

export type GoogleBusinessLocationPatch = {
  title?: string;
  storefrontAddress?: GoogleBusinessStorefrontAddress | null;
  description?: string;
  websiteUri?: string;
  primaryPhone?: string;
  additionalPhones?: string[];
  regularHours?: GoogleBusinessRegularHours;
  specialHours?: GoogleBusinessSpecialHours;
  services?: GoogleBusinessServiceItem[];
  openInfo?: GoogleBusinessOpenInfo;
  serviceArea?: GoogleBusinessServiceArea;
  attributes?: GoogleBusinessAttribute[];
  placeActions?: GoogleBusinessPlaceAction[];
  photos?: GoogleBusinessPhotoPatch[];
};

export type ProviderRateLimit = {
  limit: number | null;
  remaining: number | null;
  resetAt: number | null;
  retryAfterSeconds: number | null;
};

export type ProviderLocationSummary = {
  id: string;
  name: string;
  accountId: string | null;
  accountName: string | null;
  address: string | null;
  category: string | null;
  websiteUrl: string | null;
  storeCode: string | null;
  selected: boolean;
};

export type ProviderLocationDetails = {
  title: string;
  formattedAddress: string | null;
  storefrontAddress: GoogleBusinessStorefrontAddress | null;
  primaryPhone: string | null;
  additionalPhones: string[];
  websiteUri: string | null;
  description: string | null;
  categories: GoogleBusinessCategories;
  regularHours: GoogleBusinessRegularHours;
  specialHours: GoogleBusinessSpecialHours;
  services: GoogleBusinessServiceItem[];
  openInfo: GoogleBusinessOpenInfo;
  serviceArea: GoogleBusinessServiceArea;
  moreHours: unknown[];
  placeId: string | null;
  mapsUri: string | null;
  reviewUrl: string | null;
  isVerified: boolean;
};

export type ProviderReview = {
  id: string;
  resourceName: string | null;
  reviewerName: string;
  reviewerPhotoUrl: string | null;
  isAnonymous: boolean;
  rating: number;
  comment: string | null;
  replyComment: string | null;
  replyUpdatedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type ProviderMetric = { date: string; name: string; value: number };
export type ProviderKeyword = {
  periodStart: string;
  periodEnd: string;
  keyword: string;
  impressions: number;
};
export type ProviderMedia = {
  id: string;
  url: string;
  category: string | null;
  width: number | null;
  height: number | null;
};

export type ProviderSyncSnapshot = {
  details: ProviderLocationDetails;
  reviews: ProviderReview[];
  averageRating: number | null;
  reviewCount: number;
  metrics: ProviderMetric[];
  keywords: ProviderKeyword[];
  media: ProviderMedia[];
  mediaComplete: boolean;
  attributes: GoogleBusinessAttribute[];
  placeActions: GoogleBusinessPlaceAction[];
  analyticsAvailable: boolean;
};
