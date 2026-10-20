"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import { PanelCollapseIcon, PanelExpandIcon } from "@/components/dashboard/icons";
import { LoadingIndicator } from "@/components/dashboard/website/loading-indicator";

import {
  hoursFormFrom,
  hoursFormToPayload,
  type GoogleBusinessHoursForm,
} from "@/lib/google-business/hours";
import {
  addressFormFrom,
  addressFormToPayload,
  attributeLabel,
  buildLocationPatch,
  formatStorefrontAddress,
  isAttributeEnabled,
  listingHeroUrl,
  locationPatchFormFrom,
  serviceFormFrom,
  serviceFormToPayload,
  specialHoursFormFrom,
  specialHoursFormToPayload,
  type GoogleBusinessAddressForm,
  type GoogleBusinessServiceFormRow,
  type GoogleBusinessSpecialHoursFormRow,
} from "@/lib/google-business/profile";
import {
  GOOGLE_BUSINESS_DAYS,
  GOOGLE_BUSINESS_MEDIA_CATEGORIES,
  GOOGLE_BUSINESS_PLACE_ACTION_TYPES,
  type GoogleBusinessAttribute,
  type GoogleBusinessDashboard,
  type GoogleBusinessDay,
  type GoogleBusinessLocation,
  type GoogleBusinessMediaCategory,
  type GoogleBusinessOpenStatus,
  type GoogleBusinessPhoto,
  type GoogleBusinessPlaceAction,
  type GoogleBusinessPlaceActionType,
  type GoogleBusinessServiceAreaType,
} from "@/lib/google-business/types";

const DAY_LABELS: Record<GoogleBusinessDay, string> = {
  MONDAY: "Monday", TUESDAY: "Tuesday", WEDNESDAY: "Wednesday", THURSDAY: "Thursday",
  FRIDAY: "Friday", SATURDAY: "Saturday", SUNDAY: "Sunday",
};

const OPEN_STATUS_LABELS: Record<GoogleBusinessOpenStatus, string> = {
  OPEN: "Open",
  CLOSED_TEMPORARILY: "Temporarily closed",
  CLOSED_PERMANENTLY: "Permanently closed",
};

const PLACE_ACTION_LABELS: Record<GoogleBusinessPlaceActionType, string> = {
  APPOINTMENT: "Book",
  ONLINE_APPOINTMENT: "Book online",
  DINING_RESERVATION: "Reserve",
  FOOD_ORDERING: "Order",
  FOOD_DELIVERY: "Delivery",
  FOOD_TAKEOUT: "Takeout",
  SHOP_ONLINE: "Shop",
};

const MEDIA_CATEGORY_LABELS: Record<GoogleBusinessMediaCategory, string> = {
  COVER: "Cover",
  PROFILE: "Profile",
  LOGO: "Logo",
  EXTERIOR: "Exterior",
  INTERIOR: "Interior",
  PRODUCT: "Product",
  FOOD_AND_DRINK: "Food and drink",
  MENU: "Menu",
  COMMON_AREA: "Common area",
  ROOMS: "Rooms",
  TEAMS: "Team",
  AT_WORK: "At work",
  ADDITIONAL: "Additional",
  CATEGORY_UNSPECIFIED: "Unspecified",
};

const UNIQUE_MEDIA_CATEGORIES = new Set<GoogleBusinessMediaCategory>(["COVER", "PROFILE", "LOGO"]);

function primaryCategory(location: GoogleBusinessLocation) {
  return location.categories.primaryCategory?.displayName ?? "Real estate agent";
}

function formatUpdated(value: string | null) {
  if (!value) return "Waiting for first sync";
  return `Synced ${new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value))}`;
}

function Stars({ rating }: { rating: number }) {
  return <span aria-label={`${rating.toFixed(1)} out of 5 stars`} className="tracking-[.08em] text-[#f5a623]">{"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}</span>;
}

function KnowledgePreview({ location, dashboard, photos }: { location: GoogleBusinessLocation; dashboard: GoogleBusinessDashboard; photos: GoogleBusinessPhoto[] }) {
  const category = primaryCategory(location);
  const hero = listingHeroUrl(photos);
  const today = GOOGLE_BUSINESS_DAYS[(new Date().getDay() + 6) % 7];
  const period = location.regularHours.periods?.find((item) => item.openDay === today);
  const enabledAttributes = location.attributes.filter((item) => item.valueType === "BOOL" && isAttributeEnabled(item));
  const booking = location.placeActions.find((item) => item.placeActionType === "APPOINTMENT" || item.placeActionType === "ONLINE_APPOINTMENT");
  const address = location.formattedAddress ?? formatStorefrontAddress(location.storefrontAddress);
  const extraPhones = location.additionalPhones.filter(Boolean);
  const closed = location.openInfo.status !== "OPEN";
  return (
    <div className="pp-google-surface mx-auto w-full max-w-[650px]">
      <div className="mb-4 flex items-center justify-between gap-4 px-1">
        <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-pp-stone">Search preview</p><p className="mt-1 text-xs text-pp-stone">A PostPooch visual preview — not a live Google result</p></div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${location.isVerified ? "bg-pp-teal/10 text-pp-teal" : "bg-pp-mist text-pp-stone"}`}>{location.isVerified ? "✓ Verified" : "Verification pending"}</span>
      </div>
      <article className="overflow-hidden rounded-[28px] bg-white shadow-[0_22px_70px_rgba(36,25,20,.12)] ring-1 ring-black/5">
        {hero ? (
          <div className="h-52 overflow-hidden bg-pp-mist sm:h-64">
            {/* Zernio returns Google-hosted URLs from domains that are not known at build time. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero} alt="" className="size-full object-cover" />
          </div>
        ) : (
          <div className="grid h-40 place-items-center bg-[linear-gradient(135deg,#eef4f3,#fff7ef)] text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm">⌂</span><p className="mt-3 text-xs font-medium text-pp-stone">Add a cover photo to preview it here</p></div></div>
        )}
        <div className="p-6 sm:p-8">
          <h2 className="text-[28px] font-medium leading-tight tracking-[-.035em] text-[#202124] sm:text-[34px]">{location.title}</h2>
          <p className="mt-2 text-sm text-[#5f6368]">{category}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><strong className="font-medium text-[#3c4043]">{location.averageRating?.toFixed(1) ?? "New"}</strong>{location.averageRating ? <Stars rating={location.averageRating} /> : null}<span className="text-[#5f6368]">({location.reviewCount} reviews)</span></div>
          {closed ? <p className="mt-3 text-sm font-medium text-[#c5221f]">{OPEN_STATUS_LABELS[location.openInfo.status]}</p> : null}
          <div className="mt-6 grid grid-cols-4 gap-2 border-y border-[#ececec] py-5 text-center text-xs font-medium text-[#1a73e8]">
            {[{ icon: "⌖", label: "Directions" }, { icon: "⌕", label: "Website" }, { icon: "⌕", label: "Call" }, { icon: booking ? "◷" : "↗", label: booking ? PLACE_ACTION_LABELS[booking.placeActionType] : "Share" }].map((item) => <div key={item.label} className="space-y-2"><span className="mx-auto grid size-9 place-items-center rounded-full border border-[#dadce0] text-base">{item.icon}</span><span className="block">{item.label}</span></div>)}
          </div>
          <dl className="mt-6 space-y-4 text-[14px] leading-6 text-[#3c4043]">
            {address && location.serviceArea.businessType !== "CUSTOMER_LOCATION_ONLY" ? <div className="flex gap-3"><dt className="w-5 text-center">⌖</dt><dd>{address}</dd></div> : null}
            {location.serviceArea.places?.placeInfos.length ? <div className="flex gap-3"><dt className="w-5 text-center">◎</dt><dd>Serves {location.serviceArea.places.placeInfos.map((place) => place.placeName).join(", ")}</dd></div> : null}
            <div className="flex gap-3"><dt className="w-5 text-center">◷</dt><dd><span className="font-medium text-[#188038]">{period && !closed ? "Open today" : "Closed today"}</span>{period && !closed ? ` · ${period.openTime}–${period.closeTime}` : ""}</dd></div>
            {location.websiteUri ? <div className="flex gap-3"><dt className="w-5 text-center">◎</dt><dd className="break-all text-[#1a73e8]">{location.websiteUri.replace(/^https?:\/\//, "")}</dd></div> : null}
            {location.primaryPhone ? <div className="flex gap-3"><dt className="w-5 text-center">⌕</dt><dd>{location.primaryPhone}</dd></div> : null}
            {extraPhones.map((phone) => <div key={phone} className="flex gap-3"><dt className="w-5 text-center">⌕</dt><dd>{phone}</dd></div>)}
          </dl>
          {enabledAttributes.length ? <div className="mt-5 flex flex-wrap gap-2">{enabledAttributes.slice(0, 8).map((item) => <span key={item.name} className="rounded-full bg-[#f8f9fa] px-3 py-1 text-[11px] font-medium text-[#3c4043]">{attributeLabel(item)}</span>)}</div> : null}
          {location.description ? <div className="mt-7 border-t border-[#ececec] pt-6"><h3 className="text-lg font-medium text-[#202124]">From the business</h3><p className="mt-3 text-sm leading-6 text-[#5f6368]">{location.description}</p></div> : null}
          {location.services.length ? <div className="mt-7 border-t border-[#ececec] pt-6"><h3 className="text-lg font-medium text-[#202124]">Services</h3><ul className="mt-3 space-y-2 text-sm text-[#3c4043]">{location.services.slice(0, 6).map((service, index) => <li key={`${serviceLabelKey(service)}-${index}`}>{service.freeFormServiceItem?.label.displayName ?? service.structuredServiceItem?.description ?? "Service"}{service.price ? <span className="text-[#5f6368]"> · {service.price.currencyCode} {service.price.units}</span> : null}</li>)}</ul></div> : null}
          {location.specialHours.specialHourPeriods.length ? <div className="mt-7 border-t border-[#ececec] pt-6"><h3 className="text-lg font-medium text-[#202124]">Holiday hours</h3><ul className="mt-3 space-y-1 text-sm text-[#5f6368]">{location.specialHours.specialHourPeriods.slice(0, 5).map((period) => <li key={`${period.startDate.year}-${period.startDate.month}-${period.startDate.day}`}>{period.startDate.month}/{period.startDate.day}: {period.closed ? "Closed" : `${period.openTime}–${period.closeTime}`}</li>)}</ul></div> : null}
          {dashboard.reviews.length ? <div className="mt-7 border-t border-[#ececec] pt-6"><div className="flex items-center justify-between"><h3 className="text-lg font-medium text-[#202124]">Review spotlight</h3><span className="text-xs text-[#1a73e8]">Stored in PostPooch</span></div><blockquote className="mt-4 rounded-2xl bg-[#f8f9fa] p-4"><Stars rating={dashboard.reviews[0].rating} /><p className="mt-2 line-clamp-3 text-sm leading-6 text-[#3c4043]">{dashboard.reviews[0].comment || "A new rating was left for this business."}</p><footer className="mt-2 text-xs font-medium text-[#5f6368]">{dashboard.reviews[0].reviewerName}</footer></blockquote></div> : null}
        </div>
      </article>
    </div>
  );
}

function serviceLabelKey(service: GoogleBusinessLocation["services"][number]) {
  return service.freeFormServiceItem?.label.displayName ?? service.structuredServiceItem?.serviceTypeId ?? "service";
}

function metricTotal(dashboard: GoogleBusinessDashboard, names: string[]) {
  return dashboard.metrics.filter((item) => names.some((name) => item.name.includes(name))).reduce((sum, item) => sum + item.value, 0);
}

function AnalyticsView({ dashboard, location }: { dashboard: GoogleBusinessDashboard; location: GoogleBusinessLocation }) {
  const series = useMemo(() => {
    const grouped = new Map<string, number>();
    dashboard.metrics.filter((item) => item.name.includes("IMPRESSION")).forEach((item) => grouped.set(item.date, (grouped.get(item.date) ?? 0) + item.value));
    return [...grouped].slice(-14);
  }, [dashboard.metrics]);
  const max = Math.max(1, ...series.map(([, value]) => value));
  const cards = [
    ["Search views", metricTotal(dashboard, ["IMPRESSION"])],
    ["Website clicks", metricTotal(dashboard, ["WEBSITE_CLICKS"])],
    ["Calls", metricTotal(dashboard, ["CALL_CLICKS"])],
    ["Directions", metricTotal(dashboard, ["DIRECTION_REQUESTS"])],
  ] as const;
  return (
    <div className="pp-google-surface mx-auto w-full max-w-5xl space-y-5">
      <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-pp-teal">Local performance</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.035em] text-pp-ink">How people find {location.title}</h2><p className="mt-2 text-sm text-pp-stone">Stored analytics from the latest background sync. Google may delay performance data by 2–3 days.</p></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value]) => <div key={label} className="rounded-2xl bg-white p-5 shadow-card-sm ring-1 ring-pp-sand/70"><p className="text-xs font-medium text-pp-stone">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight text-pp-ink">{value.toLocaleString()}</p><p className="mt-2 text-[11px] text-pp-stone">Last 90 days</p></div>)}</div>
      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-[24px] bg-white p-5 shadow-card-sm ring-1 ring-pp-sand/70 sm:p-6"><h3 className="text-sm font-semibold text-pp-ink">Search visibility</h3>{series.length ? <div className="mt-8 flex h-52 items-end gap-2">{series.map(([date, value]) => <div key={date} className="group flex h-full min-w-0 flex-1 items-end"><div title={`${date}: ${value}`} className="w-full rounded-t-md bg-pp-teal/75 transition hover:bg-pp-teal" style={{ height: `${Math.max(5, value / max * 100)}%` }} /></div>)}</div> : <div className="mt-6 grid h-52 place-items-center rounded-2xl bg-pp-mist/70 text-center text-sm text-pp-stone">Performance history will appear after the first analytics sync.</div>}<div className="mt-3 flex justify-between text-[10px] text-pp-stone"><span>{series[0]?.[0] ?? ""}</span><span>{series.at(-1)?.[0] ?? ""}</span></div></section>
        <section className="rounded-[24px] bg-white p-5 shadow-card-sm ring-1 ring-pp-sand/70 sm:p-6"><h3 className="text-sm font-semibold text-pp-ink">Search terms</h3>{dashboard.keywords.length ? <ol className="mt-5 space-y-4">{dashboard.keywords.slice(0, 7).map((item, index) => <li key={`${item.month}-${item.keyword}`} className="flex items-center gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-pp-mist text-[11px] font-semibold text-pp-stone">{index + 1}</span><span className="min-w-0 flex-1 truncate text-sm text-pp-ink">{item.keyword}</span><strong className="text-xs font-semibold text-pp-teal">{item.impressions}</strong></li>)}</ol> : <p className="mt-5 rounded-2xl bg-pp-mist/70 p-5 text-sm leading-6 text-pp-stone">Search keywords appear monthly when the Zernio analytics add-on is available and Google’s privacy threshold is met.</p>}</section>
      </div>
    </div>
  );
}

const fieldClass = "h-10 w-full rounded-xl border border-pp-sand bg-white px-3 text-[13px] text-pp-ink outline-none transition focus:border-pp-teal focus:ring-2 focus:ring-pp-teal/10";
const iconButtonClass =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-control text-pp-stone transition-colors duration-200 ease-out hover:bg-white hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal";
const STUDIO_SIDEBAR_ID = "google-business-studio-sidebar";
const STUDIO_SIDEBAR_STORAGE_KEY = "pp-google-business-sidebar-collapsed";

function StudioViewTabs({
  view,
  onChange,
  className,
}: {
  view: "profile" | "analytics";
  onChange: (view: "profile" | "analytics") => void;
  className?: string;
}) {
  return (
    <div className={className} role="tablist" aria-label="Google Business view">
      {(["profile", "analytics"] as const).map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={view === item}
          onClick={() => onChange(item)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            view === item ? "bg-pp-mist text-pp-ink" : "text-pp-stone hover:text-pp-ink"
          }`}
        >
          {item === "profile" ? "Profile" : "Analytics"}
        </button>
      ))}
    </div>
  );
}

function emptySpecialHour(): GoogleBusinessSpecialHoursFormRow {
  return { startDate: "", closed: true, open: "09:00", close: "17:00" };
}

function emptyService(): GoogleBusinessServiceFormRow {
  return { displayName: "", description: "", price: "", structuredServiceTypeId: null };
}

function emptyPlaceAction(): GoogleBusinessPlaceAction {
  return { name: null, uri: "", placeActionType: "APPOINTMENT" };
}

function setPhotoCategory(photos: GoogleBusinessPhoto[], index: number, category: GoogleBusinessMediaCategory) {
  const unique = UNIQUE_MEDIA_CATEGORIES.has(category);
  const next = photos.map((photo, itemIndex) => {
    if (itemIndex === index) return { ...photo, category };
    if (unique && photo.category === category) return { ...photo, category: "ADDITIONAL" as const };
    return photo;
  });
  if (category !== "COVER") return next;
  const coverIndex = next.findIndex((photo) => photo.category === "COVER");
  if (coverIndex <= 0) return next;
  const cover = next[coverIndex];
  return [cover, ...next.filter((_, itemIndex) => itemIndex !== coverIndex)];
}

function GoogleBusinessPhotos({
  locationId,
  photos,
  uploading,
  onChange,
  onUploadingChange,
}: {
  locationId: string;
  photos: GoogleBusinessPhoto[];
  uploading: boolean;
  onChange: (photos: GoogleBusinessPhoto[]) => void;
  onUploadingChange: (value: boolean) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    onUploadingChange(true);
    setError(null);
    try {
      const added: GoogleBusinessPhoto[] = [];
      for (const file of files.slice(0, Math.max(0, 100 - photos.length))) {
        const form = new FormData();
        form.set("image", file);
        const response = await fetch(`/api/google_business/locations/${locationId}/photos`, { method: "POST", body: form });
        const payload = (await response.json()) as { image?: { url?: string }; error?: string };
        if (!response.ok || !payload.image?.url) throw new Error(payload.error || "Upload failed.");
        added.push({
          id: `local-${crypto.randomUUID()}`,
          providerMediaId: null,
          url: payload.image.url,
          category: photos.length + added.length === 0 ? "COVER" : "ADDITIONAL",
        });
      }
      onChange([...photos, ...added]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload failed.");
    } finally {
      onUploadingChange(false);
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-pp-stone">Photos</span>
        <span className="text-[10px] text-pp-stone">First photo is the cover</span>
      </div>
      {photos.length ? (
        <div className="grid grid-cols-2 gap-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`group relative overflow-hidden rounded-xl bg-pp-mist ring-1 ring-pp-sand ${index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}
            >
              {/* Zernio and R2 URLs are not known at build time. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" className="size-full object-cover" />
              {index === 0 ? (
                <span className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-pp-ink backdrop-blur">Cover</span>
              ) : null}
              <button
                type="button"
                aria-label={`Remove photo ${index + 1}`}
                onClick={() => {
                  const next = photos.filter((_, itemIndex) => itemIndex !== index);
                  if (!next.some((item) => item.category === "COVER") && next[0] && next[0].category !== "PROFILE" && next[0].category !== "LOGO") {
                    next[0] = { ...next[0], category: "COVER" };
                  }
                  onChange(next);
                }}
                className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/55 text-sm text-white opacity-0 backdrop-blur transition group-hover:opacity-100 focus:opacity-100"
              >
                ×
              </button>
              <label className="absolute inset-x-2 bottom-2 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                <span className="sr-only">Photo category</span>
                <select
                  value={photo.category ?? "ADDITIONAL"}
                  onChange={(event) => onChange(setPhotoCategory(photos, index, event.target.value as GoogleBusinessMediaCategory))}
                  className="h-8 w-full rounded-lg bg-white/95 px-2 text-[11px] font-medium text-pp-ink shadow-card-sm backdrop-blur outline-none"
                >
                  {GOOGLE_BUSINESS_MEDIA_CATEGORIES.map((category) => (
                    <option key={category} value={category}>{MEDIA_CATEGORY_LABELS[category]}</option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid aspect-[16/9] place-items-center rounded-xl bg-pp-mist text-xs text-pp-stone ring-1 ring-pp-sand">No photos yet</div>
      )}
      {uploading ? (
        <div className="grid place-items-center rounded-xl bg-white/80 py-2 text-xs font-semibold text-pp-ink ring-1 ring-pp-sand/80">
          <LoadingIndicator label="Uploading photos" />
        </div>
      ) : null}
      <label className="flex h-9 cursor-pointer items-center justify-center rounded-[10px] border border-pp-sand bg-white text-xs font-semibold text-pp-ink transition hover:bg-pp-mist">
        {uploading ? <LoadingIndicator label="Uploading…" className="gap-1.5" spinnerClassName="size-3.5" /> : photos.length ? "Add photos" : "Choose photos"}
        <input
          multiple
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
          onChange={upload}
          disabled={uploading || photos.length >= 100}
          className="sr-only"
        />
      </label>
      {error ? <p role="alert" className="text-xs leading-5 text-pp-coral">{error}</p> : null}
    </div>
  );
}

export function GoogleBusinessEditor({ dashboard }: { dashboard: GoogleBusinessDashboard }) {
  const router = useRouter();
  const location = dashboard.locations.find((item) => item.id === dashboard.selectedLocationId) ?? dashboard.locations[0];
  const [view, setView] = useState<"profile" | "analytics">("profile");
  const [title, setTitle] = useState(location.title);
  const [description, setDescription] = useState(location.description ?? "");
  const [website, setWebsite] = useState(location.websiteUri ?? "");
  const [phone, setPhone] = useState(location.primaryPhone ?? "");
  const [extraPhoneOne, setExtraPhoneOne] = useState(location.additionalPhones[0] ?? "");
  const [extraPhoneTwo, setExtraPhoneTwo] = useState(location.additionalPhones[1] ?? "");
  const [address, setAddress] = useState<GoogleBusinessAddressForm>(() => addressFormFrom(location.storefrontAddress));
  const [hours, setHours] = useState<GoogleBusinessHoursForm>(() => hoursFormFrom(location.regularHours));
  const [specialHours, setSpecialHours] = useState<GoogleBusinessSpecialHoursFormRow[]>(() => specialHoursFormFrom(location.specialHours));
  const [services, setServices] = useState<GoogleBusinessServiceFormRow[]>(() => serviceFormFrom(location.services));
  const [openStatus, setOpenStatus] = useState<GoogleBusinessOpenStatus>(location.openInfo.status);
  const [serviceAreaType, setServiceAreaType] = useState<GoogleBusinessServiceAreaType | "">(location.serviceArea.businessType ?? "");
  const [attributes, setAttributes] = useState<GoogleBusinessAttribute[]>(location.attributes);
  const [placeActions, setPlaceActions] = useState<GoogleBusinessPlaceAction[]>(location.placeActions);
  const [photos, setPhotos] = useState<GoogleBusinessPhoto[]>(dashboard.photos);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const categoryName = location.categories.primaryCategory?.name ?? null;
  const booleanAttributes = attributes.filter((item) => item.valueType === "BOOL" || item.values.some((value) => value === true || value === false));
  const previewLocation: GoogleBusinessLocation = {
    ...location,
    title,
    description,
    websiteUri: website,
    primaryPhone: phone,
    additionalPhones: [extraPhoneOne, extraPhoneTwo].map((item) => item.trim()).filter(Boolean),
    storefrontAddress: addressFormToPayload(address),
    formattedAddress: formatStorefrontAddress(addressFormToPayload(address)),
    regularHours: hoursFormToPayload(hours),
    specialHours: specialHoursFormToPayload(specialHours),
    services: serviceFormToPayload(services, categoryName),
    openInfo: { ...location.openInfo, status: openStatus },
    serviceArea: { ...location.serviceArea, businessType: serviceAreaType || undefined },
    attributes,
    placeActions: placeActions.filter((item) => item.uri.trim()),
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setSidebarCollapsed(window.localStorage.getItem(STUDIO_SIDEBAR_STORAGE_KEY) === "1");
      } catch {
        // Ignore storage access errors.
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleSidebar() {
    setSidebarCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STUDIO_SIDEBAR_STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Ignore storage access errors.
      }
      return next;
    });
  }

  async function save() {
    const patch = buildLocationPatch({ ...location, photos: dashboard.photos }, locationPatchFormFrom({ ...location, photos: dashboard.photos }, {
      title,
      description,
      websiteUri: website,
      primaryPhone: phone,
      additionalPhones: [extraPhoneOne, extraPhoneTwo],
      storefrontAddress: addressFormToPayload(address),
      regularHours: hoursFormToPayload(hours),
      specialHours: specialHoursFormToPayload(specialHours),
      services: serviceFormToPayload(services, categoryName),
      openInfo: { status: openStatus },
      serviceArea: { ...location.serviceArea, businessType: serviceAreaType || undefined },
      attributes,
      placeActions: placeActions.filter((item) => item.uri.trim()),
      photos,
    }));
    if (Object.keys(patch).length === 0) {
      setNotice({ type: "success", text: "No changes to save." });
      return;
    }
    setSaving(true); setNotice(null);
    try {
      const response = await fetch(`/api/google_business/locations/${location.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
      const payload = (await response.json()) as { error?: string; photos?: GoogleBusinessPhoto[] };
      if (!response.ok) throw new Error(payload.error || "Google did not accept the update.");
      if (payload.photos) setPhotos(payload.photos);
      setNotice({ type: "success", text: "Saved to Google Business." });
      router.refresh();
    } catch (reason) { setNotice({ type: "error", text: reason instanceof Error ? reason.message : "Unable to save changes." }); }
    finally { setSaving(false); }
  }

  async function switchLocation(id: string) {
    if (id === location.id) return;
    setSwitching(true); setNotice(null);
    try {
      const response = await fetch(`/api/google_business/locations/${id}/select`, { method: "POST" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to switch locations.");
      router.refresh();
    } catch (reason) { setNotice({ type: "error", text: reason instanceof Error ? reason.message : "Unable to switch locations." }); setSwitching(false); }
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.75rem)] flex-col bg-[#f3f1ee] lg:min-h-dvh lg:flex-row">
      <div
        id={STUDIO_SIDEBAR_ID}
        aria-hidden={sidebarCollapsed}
        inert={sidebarCollapsed || undefined}
        className={`min-h-0 overflow-hidden bg-pp-cream transition-[max-height,width] duration-300 ease-in-out motion-reduce:transition-none lg:flex lg:h-dvh lg:max-h-none lg:shrink-0 ${
          sidebarCollapsed
            ? "max-h-0 border-b-0 lg:w-0 lg:min-w-0 lg:border-r-0"
            : "max-h-[70dvh] border-b border-pp-sand lg:w-[370px] lg:border-b-0 lg:border-r"
        }`}
      >
      <aside className="flex h-full w-full shrink-0 flex-col lg:w-[370px] lg:min-w-[370px]">
        <div className="border-b border-pp-sand/80 px-5 pb-4 pt-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[.13em] text-pp-teal">Google Business</p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight text-pp-ink">Profile studio</h1>
            </div>
            <button
              type="button"
              onClick={toggleSidebar}
              aria-expanded={!sidebarCollapsed}
              aria-controls={STUDIO_SIDEBAR_ID}
              title="Hide Profile studio"
              className={iconButtonClass}
            >
              <PanelCollapseIcon className="size-[18px]" />
              <span className="sr-only">Hide Profile studio</span>
            </button>
          </div>
          {dashboard.locations.length > 1 ? <select aria-label="Business location" value={location.id} disabled={switching} onChange={(event) => void switchLocation(event.target.value)} className={`${fieldClass} mt-4 font-medium`} >{dashboard.locations.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select> : null}
          <p className={`mt-3 text-[11px] ${!switching && location.syncStatus === "failed" ? "text-pp-coral" : "text-pp-stone"}`}>
            {switching
              ? "Switching Google location…"
              : location.syncStatus === "failed"
                ? "Sync failed. Showing the last saved listing."
                : formatUpdated(location.lastSyncedAt)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1 border-b border-pp-sand/80 p-2"><button type="button" onClick={() => setView("profile")} className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition ${view === "profile" ? "bg-white text-pp-ink shadow-sm" : "text-pp-stone hover:text-pp-ink"}`}>Profile</button><button type="button" onClick={() => setView("analytics")} className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition ${view === "analytics" ? "bg-white text-pp-ink shadow-sm" : "text-pp-stone hover:text-pp-ink"}`}>Analytics</button></div>
        <div className="pp-schedule-scroll flex-1 overflow-y-auto">
          {view === "profile" ? <div className="space-y-6 p-5">
            <section>
              <GoogleBusinessPhotos
                locationId={location.id}
                photos={photos}
                uploading={uploadingPhoto}
                onChange={setPhotos}
                onUploadingChange={setUploadingPhoto}
              />
            </section>
            <section>
              <h2 className="text-xs font-semibold text-pp-ink">Business information</h2>
              <div className="mt-3 space-y-4">
              <label className="block text-xs font-medium text-pp-stone">Business name<input value={title} onChange={(event) => setTitle(event.target.value)} className={`${fieldClass} mt-1.5`} /></label>
              <label className="block text-xs font-medium text-pp-stone">Open status<select value={openStatus} onChange={(event) => setOpenStatus(event.target.value as GoogleBusinessOpenStatus)} className={`${fieldClass} mt-1.5`}>{Object.entries(OPEN_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="block text-xs font-medium text-pp-stone">How customers reach you<select value={serviceAreaType} onChange={(event) => setServiceAreaType(event.target.value as GoogleBusinessServiceAreaType | "")} className={`${fieldClass} mt-1.5`}><option value="">Storefront address</option><option value="CUSTOMER_AND_BUSINESS_LOCATION">Address and service area</option><option value="CUSTOMER_LOCATION_ONLY">Service area only</option></select></label>
              {serviceAreaType !== "CUSTOMER_LOCATION_ONLY" ? <div className="space-y-2"><p className="text-xs font-medium text-pp-stone">Address</p><input value={address.line1} onChange={(event) => setAddress((current) => ({ ...current, line1: event.target.value }))} placeholder="Street" className={fieldClass} /><input value={address.line2} onChange={(event) => setAddress((current) => ({ ...current, line2: event.target.value }))} placeholder="Suite or unit" className={fieldClass} /><div className="grid grid-cols-2 gap-2"><input value={address.locality} onChange={(event) => setAddress((current) => ({ ...current, locality: event.target.value }))} placeholder="City" className={fieldClass} /><input value={address.administrativeArea} onChange={(event) => setAddress((current) => ({ ...current, administrativeArea: event.target.value }))} placeholder="State" className={fieldClass} /></div><div className="grid grid-cols-2 gap-2"><input value={address.postalCode} onChange={(event) => setAddress((current) => ({ ...current, postalCode: event.target.value }))} placeholder="ZIP" className={fieldClass} /><input value={address.regionCode} onChange={(event) => setAddress((current) => ({ ...current, regionCode: event.target.value.toUpperCase() }))} placeholder="US" maxLength={2} className={fieldClass} /></div></div> : <p className="text-[11px] leading-5 text-pp-stone">Service-area only listings hide the street address on Google.</p>}
              {location.serviceArea.places?.placeInfos.length ? <p className="text-[11px] leading-5 text-pp-stone">Serves {location.serviceArea.places.placeInfos.map((place) => place.placeName).join(", ")}. Place coverage still comes from Google and is not edited here.</p> : null}
              <div><label htmlFor="gb-description" className="text-xs font-medium text-pp-stone">Business description</label><textarea id="gb-description" maxLength={750} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1.5 min-h-28 w-full resize-y rounded-xl border border-pp-sand bg-white px-3 py-2.5 text-[13px] leading-5 outline-none transition focus:border-pp-teal focus:ring-2 focus:ring-pp-teal/10" /><p className="mt-1 text-right text-[10px] text-pp-stone">{description.length}/750</p></div>
              <label className="block text-xs font-medium text-pp-stone">Website<input type="url" value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://yourwebsite.com" className={`${fieldClass} mt-1.5`} /></label>
              <label className="block text-xs font-medium text-pp-stone">Primary phone<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={`${fieldClass} mt-1.5`} /></label>
              <label className="block text-xs font-medium text-pp-stone">Additional phone<input type="tel" value={extraPhoneOne} onChange={(event) => setExtraPhoneOne(event.target.value)} className={`${fieldClass} mt-1.5`} /></label>
              <label className="block text-xs font-medium text-pp-stone">Second additional phone<input type="tel" value={extraPhoneTwo} onChange={(event) => setExtraPhoneTwo(event.target.value)} className={`${fieldClass} mt-1.5`} /></label>
              </div>
            </section>
            <section><div className="mb-3"><h2 className="text-xs font-semibold text-pp-ink">Regular hours</h2><p className="mt-1 text-[11px] leading-5 text-pp-stone">One opening period per day.</p></div><div className="overflow-hidden rounded-2xl bg-white ring-1 ring-pp-sand/80">{GOOGLE_BUSINESS_DAYS.map((day) => <div key={day} className="grid grid-cols-[74px_1fr] items-center gap-2 border-b border-pp-sand/60 px-3 py-2.5 last:border-0"><label className="flex items-center gap-2 text-[11px] font-medium text-pp-ink"><input type="checkbox" checked={hours[day].enabled} onChange={(event) => setHours((current) => ({ ...current, [day]: { ...current[day], enabled: event.target.checked } }))} className="accent-pp-teal" />{DAY_LABELS[day].slice(0, 3)}</label>{hours[day].enabled ? <div className="flex items-center gap-1.5"><input aria-label={`${DAY_LABELS[day]} opening time`} type="time" value={hours[day].open} onChange={(event) => setHours((current) => ({ ...current, [day]: { ...current[day], open: event.target.value } }))} className="h-8 min-w-0 flex-1 rounded-lg border border-pp-sand px-1.5 text-[11px] outline-none focus:border-pp-teal" /><span className="text-[10px] text-pp-stone">to</span><input aria-label={`${DAY_LABELS[day]} closing time`} type="time" value={hours[day].close} onChange={(event) => setHours((current) => ({ ...current, [day]: { ...current[day], close: event.target.value } }))} className="h-8 min-w-0 flex-1 rounded-lg border border-pp-sand px-1.5 text-[11px] outline-none focus:border-pp-teal" /></div> : <span className="text-[11px] text-pp-stone">Closed</span>}</div>)}</div></section>
            <section>
              <div className="mb-3 flex items-center justify-between gap-3"><div><h2 className="text-xs font-semibold text-pp-ink">Holiday and special hours</h2><p className="mt-1 text-[11px] leading-5 text-pp-stone">These override regular hours on specific dates.</p></div><button type="button" onClick={() => setSpecialHours((current) => [...current, emptySpecialHour()])} className="text-[11px] font-semibold text-pp-teal">Add date</button></div>
              <div className="space-y-2">{specialHours.length ? specialHours.map((row, index) => <div key={`${row.startDate}-${index}`} className="rounded-2xl bg-white p-3 ring-1 ring-pp-sand/80"><div className="flex items-center gap-2"><input type="date" value={row.startDate} onChange={(event) => setSpecialHours((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, startDate: event.target.value } : item))} className={`${fieldClass} flex-1`} /><button type="button" onClick={() => setSpecialHours((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-[11px] text-pp-coral">Remove</button></div><label className="mt-2 flex items-center gap-2 text-[11px] text-pp-ink"><input type="checkbox" checked={row.closed} onChange={(event) => setSpecialHours((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, closed: event.target.checked } : item))} className="accent-pp-teal" />Closed all day</label>{row.closed ? null : <div className="mt-2 flex items-center gap-1.5"><input type="time" value={row.open} onChange={(event) => setSpecialHours((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, open: event.target.value } : item))} className="h-8 min-w-0 flex-1 rounded-lg border border-pp-sand px-1.5 text-[11px]" /><span className="text-[10px] text-pp-stone">to</span><input type="time" value={row.close} onChange={(event) => setSpecialHours((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, close: event.target.value } : item))} className="h-8 min-w-0 flex-1 rounded-lg border border-pp-sand px-1.5 text-[11px]" /></div>}</div>) : <p className="rounded-2xl bg-white p-4 text-[11px] leading-5 text-pp-stone ring-1 ring-pp-sand/80">No holiday hours yet.</p>}</div>
            </section>
            <section>
              <div className="mb-3 flex items-center justify-between gap-3"><div><h2 className="text-xs font-semibold text-pp-ink">Services</h2><p className="mt-1 text-[11px] leading-5 text-pp-stone">Shown in the Knowledge Panel when Google supports services for this category.</p></div><button type="button" disabled={!categoryName} onClick={() => setServices((current) => [...current, emptyService()])} className="text-[11px] font-semibold text-pp-teal disabled:text-pp-stone">Add service</button></div>
              <div className="space-y-2">{services.length ? services.map((row, index) => <div key={`${row.structuredServiceTypeId ?? "free"}-${index}`} className="space-y-2 rounded-2xl bg-white p-3 ring-1 ring-pp-sand/80"><input value={row.displayName} onChange={(event) => setServices((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, displayName: event.target.value } : item))} placeholder="Service name" className={fieldClass} /><input value={row.price} onChange={(event) => setServices((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, price: event.target.value } : item))} placeholder="Price, optional" className={fieldClass} /><button type="button" onClick={() => setServices((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-[11px] text-pp-coral">Remove</button></div>) : <p className="rounded-2xl bg-white p-4 text-[11px] leading-5 text-pp-stone ring-1 ring-pp-sand/80">{categoryName ? "No services yet." : "Services can be added after Google returns a category ID."}</p>}</div>
            </section>
            <section>
              <div className="mb-3 flex items-center justify-between gap-3"><div><h2 className="text-xs font-semibold text-pp-ink">Action buttons</h2><p className="mt-1 text-[11px] leading-5 text-pp-stone">Booking and order links that can appear on the listing.</p></div><button type="button" onClick={() => setPlaceActions((current) => [...current, emptyPlaceAction()])} className="text-[11px] font-semibold text-pp-teal">Add link</button></div>
              <div className="space-y-2">{placeActions.length ? placeActions.map((action, index) => <div key={`${action.name ?? "new"}-${index}`} className="space-y-2 rounded-2xl bg-white p-3 ring-1 ring-pp-sand/80"><select value={action.placeActionType} onChange={(event) => setPlaceActions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, placeActionType: event.target.value as GoogleBusinessPlaceActionType } : item))} className={fieldClass}>{GOOGLE_BUSINESS_PLACE_ACTION_TYPES.map((type) => <option key={type} value={type}>{PLACE_ACTION_LABELS[type]}</option>)}</select><input type="url" value={action.uri} onChange={(event) => setPlaceActions((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, uri: event.target.value } : item))} placeholder="https://" className={fieldClass} /><button type="button" onClick={() => setPlaceActions((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-[11px] text-pp-coral">Remove</button></div>) : <p className="rounded-2xl bg-white p-4 text-[11px] leading-5 text-pp-stone ring-1 ring-pp-sand/80">No booking or order links yet.</p>}</div>
            </section>
            <section>
              <div className="mb-3"><h2 className="text-xs font-semibold text-pp-ink">Attributes</h2><p className="mt-1 text-[11px] leading-5 text-pp-stone">Amenities Google already returned for this category, such as wheelchair access.</p></div>
              {booleanAttributes.length ? <div className="space-y-2 rounded-2xl bg-white p-3 ring-1 ring-pp-sand/80">{booleanAttributes.map((attribute) => <label key={attribute.name} className="flex items-center gap-2 text-[12px] text-pp-ink"><input type="checkbox" checked={isAttributeEnabled(attribute)} onChange={(event) => setAttributes((current) => current.map((item) => item.name === attribute.name ? { ...item, values: [event.target.checked] } : item))} className="accent-pp-teal" />{attributeLabel(attribute)}</label>)}</div> : <p className="rounded-2xl bg-white p-4 text-[11px] leading-5 text-pp-stone ring-1 ring-pp-sand/80">Attributes appear after the next background sync.</p>}
            </section>
          </div> : <div className="space-y-4 p-5"><div className="rounded-2xl bg-white p-4 ring-1 ring-pp-sand/80"><p className="text-xs font-semibold text-pp-ink">Database-backed analytics</p><p className="mt-2 text-xs leading-5 text-pp-stone">Opening this view never calls Zernio. The preview uses the latest daily sync stored in Supabase.</p></div><div className="rounded-2xl bg-pp-teal/8 p-4"><p className="text-[11px] font-semibold uppercase tracking-[.1em] text-pp-teal">Snapshot</p><p className="mt-2 text-2xl font-semibold text-pp-ink">{metricTotal(dashboard, ["IMPRESSION"]).toLocaleString()}</p><p className="mt-1 text-xs text-pp-stone">Search and Maps views · 90 days</p></div><div className="rounded-2xl border border-dashed border-pp-sand p-4 text-xs leading-5 text-pp-stone">Search keyword reporting is monthly and excludes terms below Google’s privacy threshold.</div></div>}
        </div>
        {view === "profile" ? <div className="border-t border-pp-sand/80 bg-pp-cream/95 p-4 backdrop-blur"><button type="button" onClick={() => void save()} disabled={saving || uploadingPhoto} className="h-11 w-full rounded-xl bg-pp-teal text-sm font-semibold text-white shadow-sm transition hover:bg-pp-teal-dark disabled:cursor-wait disabled:opacity-65">{saving ? "Waiting for Google…" : "Save to Google"}</button>{notice ? <p role="status" className={`mt-2 text-center text-xs ${notice.type === "error" ? "text-pp-coral" : "text-pp-teal"}`}>{notice.text}</p> : null}</div> : null}
      </aside>
      </div>
      <main className="relative min-w-0 flex-1 overflow-y-auto lg:h-dvh">
        {sidebarCollapsed ? (
          <>
            <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-pp-sand/80 bg-[#f3f1ee]/95 px-3 py-2 backdrop-blur lg:hidden">
              <button
                type="button"
                onClick={toggleSidebar}
                aria-expanded={false}
                aria-controls={STUDIO_SIDEBAR_ID}
                title="Show Profile studio"
                className="flex min-h-10 items-center gap-2 rounded-control px-2.5 text-pp-ink transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
              >
                <PanelExpandIcon className="size-[18px]" />
                <span className="text-sm font-semibold">Profile studio</span>
              </button>
              <StudioViewTabs
                view={view}
                onChange={setView}
                className="ml-auto grid grid-cols-2 gap-1 rounded-xl bg-white p-1 ring-1 ring-pp-sand/80"
              />
            </div>
            <div className="absolute top-4 left-0 z-20 hidden rounded-r-2xl border border-l-0 border-pp-sand/80 bg-white shadow-card-sm lg:flex lg:items-center">
              <button
                type="button"
                onClick={toggleSidebar}
                aria-expanded={false}
                aria-controls={STUDIO_SIDEBAR_ID}
                title="Show Profile studio"
                className="flex items-center gap-2 py-2.5 pr-3 pl-2 text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
              >
                <PanelExpandIcon className="size-[18px]" />
                <span className="text-xs font-semibold">Profile studio</span>
              </button>
              <span className="h-6 w-px bg-pp-sand/80" aria-hidden />
              <StudioViewTabs view={view} onChange={setView} className="flex p-1" />
            </div>
          </>
        ) : null}
        <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-14">
          {view === "profile" ? <KnowledgePreview key={`profile-${location.id}`} location={previewLocation} dashboard={dashboard} photos={photos} /> : <AnalyticsView key={`analytics-${location.id}`} dashboard={dashboard} location={location} />}
        </div>
      </main>
    </div>
  );
}
