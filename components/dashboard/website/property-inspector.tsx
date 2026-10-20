"use client";

import { type ChangeEvent, useState } from "react";

import {
  PROPERTY_AREA_UNITS,
  PROPERTY_STATUSES,
  formatPropertyPrice,
  propertyLocation,
  propertyPrimaryImage,
  propertyStatusLabel,
  propertyTitle,
  type WebsiteProperty,
} from "@/lib/websites/property";
import { LoadingIndicator } from "@/components/dashboard/website/loading-indicator";

type PropertyInspectorProps = {
  websiteId: string;
  enabled: boolean;
  properties: WebsiteProperty[];
  onEnabledChange: (enabled: boolean) => void;
  onChange: (id: string, property: WebsiteProperty) => void;
  onAdd: () => string;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
};

const inputClass =
  "h-10 w-full rounded-[10px] border border-pp-sand bg-white px-3 text-[13px] text-pp-ink outline-none transition focus:border-pp-teal focus:ring-2 focus:ring-pp-teal/10";

function Toggle({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description?: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-pp-ink">{label}</span>
        {description ? <span className="mt-0.5 block text-[11px] leading-4 text-pp-stone">{description}</span> : null}
      </span>
      <span className={`relative h-[26px] w-[44px] shrink-0 rounded-full transition ${checked ? "bg-pp-teal" : "bg-[#d8d5d0]"}`}>
        <input className="sr-only" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span className={`absolute top-[3px] size-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[21px]" : "translate-x-[3px]"}`} />
      </span>
    </label>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-[12px] font-medium text-pp-stone">{label}</span>
      {children}
    </label>
  );
}

function numericValue(value: number | null): string {
  return value === null ? "" : String(value);
}

function parseOptionalNumber(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function PropertyImages({
  websiteId,
  property,
  onChange,
}: {
  websiteId: string;
  property: WebsiteProperty;
  onChange: (property: WebsiteProperty) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    setUploading(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of files.slice(0, Math.max(0, 24 - property.images.length))) {
        const form = new FormData();
        form.set("image", file);
        const response = await fetch(`/api/websites/${websiteId}/images`, {
          method: "POST",
          body: form,
        });
        const payload = (await response.json()) as { image?: { url?: string }; error?: string };
        if (!response.ok || !payload.image?.url) {
          throw new Error(payload.error || "Upload failed.");
        }
        urls.push(payload.image.url);
      }
      onChange({ ...property, images: [...property.images, ...urls] });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-pp-stone">Photos</span>
        <span className="text-[10px] text-pp-stone">First photo is the cover</span>
      </div>
      {property.images.length ? (
        <div className="grid grid-cols-2 gap-2">
          {property.images.map((image, index) => (
            <div key={`${image}-${index}`} className={`group relative overflow-hidden rounded-xl bg-pp-mist ring-1 ring-pp-sand ${index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-square"}`}>
              {/* Uploaded R2 images are immutable and already publicly cached. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="size-full object-cover" />
              {index === 0 ? <span className="absolute left-2 top-2 rounded-md bg-white/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-pp-ink backdrop-blur">Cover</span> : null}
              <button
                type="button"
                aria-label={`Remove photo ${index + 1}`}
                onClick={() => onChange({ ...property, images: property.images.filter((_, itemIndex) => itemIndex !== index) })}
                className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/55 text-sm text-white opacity-0 backdrop-blur transition group-hover:opacity-100 focus:opacity-100"
              >
                ×
              </button>
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
        {uploading ? <LoadingIndicator label="Uploading…" className="gap-1.5" spinnerClassName="size-3.5" /> : property.images.length ? "Add photos" : "Choose photos"}
        <input multiple type="file" accept="image/jpeg,image/png,image/gif,image/webp,image/avif" onChange={upload} disabled={uploading} className="sr-only" />
      </label>
      {error ? <p role="alert" className="text-xs leading-5 text-pp-coral">{error}</p> : null}
    </div>
  );
}

export function PropertyInspector({
  websiteId,
  enabled,
  properties,
  onEnabledChange,
  onChange,
  onAdd,
  onDelete,
  onMove,
}: PropertyInspectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = properties.find((property) => property.id === selectedId) ?? null;

  function update(patch: Partial<WebsiteProperty>) {
    if (!selected) return;
    onChange(selected.id, { ...selected, ...patch });
  }

  if (selected) {
    return (
      <div className="space-y-5 p-4">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => setSelectedId(null)} className="rounded-lg px-2 py-1.5 text-xs font-semibold text-pp-teal transition hover:bg-pp-mist">← All properties</button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete ${propertyTitle(selected)}? This is applied when you publish.`)) onDelete(selected.id);
            }}
            className="rounded-lg px-2 py-1.5 text-xs font-medium text-pp-coral transition hover:bg-pp-coral/5"
          >
            Delete
          </button>
        </div>

        <PropertyImages websiteId={websiteId} property={selected} onChange={(property) => onChange(selected.id, property)} />

        <div className="space-y-4">
          <Field label="Property title"><input className={inputClass} value={selected.title} placeholder="e.g. Desert Modern Retreat" onChange={(event) => update({ title: event.target.value })} /></Field>
          <Field label="Website URL"><div className="flex items-center rounded-[10px] border border-pp-sand bg-white focus-within:border-pp-teal focus-within:ring-2 focus-within:ring-pp-teal/10"><span className="pl-3 text-xs text-pp-stone">/</span><input className="h-[38px] min-w-0 flex-1 border-0 bg-transparent px-1.5 pr-3 text-[13px] outline-none" value={selected.slug} onChange={(event) => update({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-/, "") })} /></div></Field>
          <Field label="Status"><select className={inputClass} value={selected.status} onChange={(event) => update({ status: event.target.value as WebsiteProperty["status"] })}>{PROPERTY_STATUSES.map((status) => <option key={status} value={status}>{propertyStatusLabel(status)}</option>)}</select></Field>
          <Field label="Property type"><input className={inputClass} value={selected.propertyType} placeholder="Condo, townhouse, estate…" onChange={(event) => update({ propertyType: event.target.value })} /></Field>
          <Field label="Street address"><input className={inputClass} value={selected.address} autoComplete="street-address" onChange={(event) => update({ address: event.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Neighborhood"><input className={inputClass} value={selected.neighborhood} onChange={(event) => update({ neighborhood: event.target.value })} /></Field>
            <Field label="City"><input className={inputClass} value={selected.city} onChange={(event) => update({ city: event.target.value })} /></Field>
            <Field label="State / region"><input className={inputClass} value={selected.region} onChange={(event) => update({ region: event.target.value })} /></Field>
            <Field label="Postal code"><input className={inputClass} value={selected.postalCode} autoComplete="postal-code" onChange={(event) => update({ postalCode: event.target.value })} /></Field>
          </div>
          <Field label="Country code"><input className={inputClass} maxLength={2} value={selected.country} placeholder="US" onChange={(event) => update({ country: event.target.value.toUpperCase().replace(/[^A-Z]/g, "") })} /></Field>

          <div className="rounded-xl bg-pp-mist/60 p-3 ring-1 ring-pp-sand/80">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[.1em] text-pp-stone">Price & details</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price"><input type="number" min="0" step="1" className={inputClass} value={numericValue(selected.priceAmount)} placeholder="On request" onChange={(event) => update({ priceAmount: parseOptionalNumber(event.target.value) })} /></Field>
              <Field label="Currency"><input className={inputClass} maxLength={3} value={selected.currency} onChange={(event) => update({ currency: event.target.value.toUpperCase().replace(/[^A-Z]/g, "") })} /></Field>
              <Field label="Bedrooms"><input type="number" min="0" step="1" className={inputClass} value={numericValue(selected.bedrooms)} onChange={(event) => update({ bedrooms: parseOptionalNumber(event.target.value) })} /></Field>
              <Field label="Bathrooms"><input type="number" min="0" step="0.5" className={inputClass} value={numericValue(selected.bathrooms)} onChange={(event) => update({ bathrooms: parseOptionalNumber(event.target.value) })} /></Field>
              <Field label="Living area"><input type="number" min="0" step="1" className={inputClass} value={numericValue(selected.livingArea)} onChange={(event) => update({ livingArea: parseOptionalNumber(event.target.value) })} /></Field>
              <Field label="Area unit"><select className={inputClass} value={selected.areaUnit} onChange={(event) => update({ areaUnit: event.target.value as WebsiteProperty["areaUnit"] })}>{PROPERTY_AREA_UNITS.map((unit) => <option key={unit} value={unit}>{unit === "sqm" ? "Square metres" : "Square feet"}</option>)}</select></Field>
              <Field label="Lot size"><input type="number" min="0" step="1" className={inputClass} value={numericValue(selected.lotSize)} onChange={(event) => update({ lotSize: parseOptionalNumber(event.target.value) })} /></Field>
              <Field label="Year built"><input type="number" min="1000" max="3000" step="1" className={inputClass} value={numericValue(selected.yearBuilt)} onChange={(event) => update({ yearBuilt: parseOptionalNumber(event.target.value) })} /></Field>
            </div>
          </div>

          <Field label="Description"><textarea className="min-h-28 w-full resize-y rounded-[10px] border border-pp-sand bg-white px-3 py-2.5 text-[13px] leading-5 text-pp-ink outline-none transition focus:border-pp-teal focus:ring-2 focus:ring-pp-teal/10" value={selected.description} onChange={(event) => update({ description: event.target.value })} /></Field>
          <Field label="Features"><textarea className="min-h-24 w-full resize-y rounded-[10px] border border-pp-sand bg-white px-3 py-2.5 text-[13px] leading-5 text-pp-ink outline-none transition focus:border-pp-teal focus:ring-2 focus:ring-pp-teal/10" value={selected.features.join("\n")} placeholder="One feature per line" onChange={(event) => update({ features: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} /></Field>

          <div className="space-y-4 rounded-xl bg-pp-mist/60 p-3 ring-1 ring-pp-sand/80">
            <Toggle checked={selected.isVisible} label="Show this property" description="Hidden properties stay saved but do not appear publicly." onChange={(isVisible) => update({ isVisible })} />
            <div className="h-px bg-pp-sand" />
            <Toggle checked={selected.featured} label="Feature prominently" description="Featured properties appear first in template highlights." onChange={(featured) => update({ featured })} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl bg-pp-mist/65 p-4 ring-1 ring-pp-sand/80">
        <Toggle checked={enabled} label="Show properties" description="Controls every property section and listing page on your website." onChange={onEnabledChange} />
      </div>

      <button
        type="button"
        onClick={() => setSelectedId(onAdd())}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[11px] bg-pp-teal text-xs font-semibold text-white shadow-sm transition hover:bg-pp-teal-dark"
      >
        <span className="text-base font-normal leading-none">＋</span> Add property
      </button>

      {properties.length ? (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-pp-sand/90">
          {properties.map((property, index) => {
            const image = propertyPrimaryImage(property);
            return (
              <div key={property.id} className="group flex items-center gap-3 border-b border-pp-sand/70 p-2.5 last:border-0">
                <button type="button" onClick={() => setSelectedId(property.id)} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-pp-teal/30">
                  <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-pp-mist text-[10px] text-pp-stone">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {image ? <img src={image} alt="" className="size-full object-cover" /> : "No photo"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-pp-ink">{propertyTitle(property)}</span>
                    <span className="mt-0.5 block truncate text-[11px] text-pp-stone">{propertyLocation(property) || propertyStatusLabel(property.status)}{property.priceAmount !== null ? ` · ${formatPropertyPrice(property)}` : ""}</span>
                    {!property.isVisible ? <span className="mt-1 inline-block rounded bg-pp-mist px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-pp-stone">Hidden</span> : null}
                  </span>
                </button>
                <span className="flex shrink-0 flex-col opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                  <button type="button" disabled={index === 0} onClick={() => onMove(property.id, -1)} aria-label="Move property up" className="grid size-6 place-items-center rounded text-xs text-pp-stone hover:bg-pp-mist disabled:opacity-25">↑</button>
                  <button type="button" disabled={index === properties.length - 1} onClick={() => onMove(property.id, 1)} aria-label="Move property down" className="grid size-6 place-items-center rounded text-xs text-pp-stone hover:bg-pp-mist disabled:opacity-25">↓</button>
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-pp-sand px-5 py-9 text-center">
          <div className="mx-auto grid size-10 place-items-center rounded-full bg-pp-mist text-lg">⌂</div>
          <h2 className="mt-3 text-sm font-semibold text-pp-ink">No properties yet</h2>
          <p className="mt-1 text-xs leading-5 text-pp-stone">Add a listing once and every template can present it in its own style.</p>
        </div>
      )}
    </div>
  );
}
