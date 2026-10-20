"use client";

import { useMemo, useState } from "react";

import { crmFetch, jsonBody, useCrmData } from "@/components/dashboard/crm/api";
import {
  Chip,
  ColIcon,
  CrmPage,
  DataTable,
  EntityName,
  ErrorState,
  Field,
  FormActions,
  LoadingState,
  Modal,
  PageHeader,
  Pill,
  PrimaryButton,
  SearchBar,
  SubmitEvent,
  inputClass,
  money,
  nullableNumber,
  nullableText,
  toolbarSelectClass,
} from "@/components/dashboard/crm/ui";
import { CRM_LISTING_STATUSES, CRM_PROPERTY_TYPES } from "@/lib/crm/constants";
import type { CrmListResponse, CrmProperty } from "@/lib/crm/types";

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function PropertiesView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const path = useMemo(
    () => `/api/crm/properties?${new URLSearchParams({ ...(search ? { q: search } : {}), ...(status ? { status } : {}), pageSize: "100" })}`,
    [search, status],
  );
  const { data, error, loading, reload } = useCrmData<CrmListResponse<CrmProperty>>(path);
  const rows = data?.data ?? [];
  return (
    <CrmPage contain>
      <PageHeader title="Properties" action={<PrimaryButton onClick={() => setOpen(true)}>+ New Property</PrimaryButton>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search address, city, ZIP, or MLS…" viewLabel="All Properties" count={loading ? undefined : rows.length}>
        <select aria-label="Listing status" value={status} onChange={(event) => setStatus(event.target.value)} className={toolbarSelectClass}>
          <option value="">All statuses</option>
          {CRM_LISTING_STATUSES.map((value) => (
            <option key={value} value={value}>{label(value)}</option>
          ))}
        </select>
      </SearchBar>
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} retry={reload} />
      ) : (
        <DataTable
          columns={[
            {
              id: "address",
              header: "Address",
              icon: <ColIcon name="building" />,
              width: 220,
              render: (property) => <EntityName name={property.addressLine1} />,
            },
            {
              id: "city",
              header: "City",
              icon: <ColIcon name="pin" />,
              width: 160,
              render: (property) => <span className="text-[var(--crm-secondary)]">{property.city}, {property.state} {property.postalCode}</span>,
            },
            {
              id: "status",
              header: "Status",
              icon: <ColIcon name="tag" />,
              width: 120,
              render: (property) => <Pill tone={property.listingStatus === "active" ? "teal" : "sand"}>{label(property.listingStatus)}</Pill>,
            },
            {
              id: "type",
              header: "Type",
              width: 130,
              render: (property) => <span className="text-[var(--crm-secondary)]">{label(property.propertyType)}</span>,
            },
            {
              id: "price",
              header: "Price",
              icon: <ColIcon name="dollar" />,
              width: 120,
              render: (property) => <span className="tabular-nums">{money(property.listingPrice)}</span>,
            },
            {
              id: "beds",
              header: "Beds",
              width: 72,
              render: (property) => <span className="text-[var(--crm-secondary)]">{property.bedrooms ?? "—"}</span>,
            },
            {
              id: "baths",
              header: "Baths",
              width: 72,
              render: (property) => <span className="text-[var(--crm-secondary)]">{property.bathrooms ?? "—"}</span>,
            },
            {
              id: "sqft",
              header: "Sq ft",
              width: 96,
              render: (property) => <span className="tabular-nums text-[var(--crm-secondary)]">{property.squareFeet?.toLocaleString() ?? "—"}</span>,
            },
            {
              id: "mls",
              header: "MLS",
              icon: <ColIcon name="link" />,
              width: 120,
              render: (property) => property.mlsNumber ? <Chip>{property.mlsNumber}</Chip> : <span className="text-[var(--crm-muted)]">—</span>,
            },
          ]}
          rows={rows}
          getHref={(property) => `/dashboard/crm/properties/${property.id}`}
          onAdd={() => setOpen(true)}
          addLabel="New"
          emptyMessage={search || status ? "Try clearing the search or status filter." : "Add a listing, buyer target, or opportunity property."}
        />
      )}
      <PropertyForm open={open} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); void reload(); }} />
    </CrmPage>
  );
}

export function PropertyForm({ open, property, onClose, onSaved }: { open: boolean; property?: CrmProperty; onClose: () => void; onSaved: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      addressLine1: String(form.get("addressLine1") ?? ""),
      addressLine2: nullableText(form.get("addressLine2")),
      city: String(form.get("city") ?? ""),
      state: String(form.get("state") ?? ""),
      postalCode: String(form.get("postalCode") ?? ""),
      country: String(form.get("country") ?? "US"),
      propertyType: String(form.get("propertyType")),
      listingStatus: String(form.get("listingStatus")),
      mlsNumber: nullableText(form.get("mlsNumber")),
      listingPrice: nullableNumber(form.get("listingPrice")),
      bedrooms: nullableNumber(form.get("bedrooms")),
      bathrooms: nullableNumber(form.get("bathrooms")),
      squareFeet: nullableNumber(form.get("squareFeet")),
      notes: nullableText(form.get("notes")),
    };
    try {
      await crmFetch(`/api/crm/properties${property ? `/${property.id}` : ""}`, { method: property ? "PATCH" : "POST", ...jsonBody(payload) });
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save property.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal open={open} title={property ? "Edit property" : "Add a property"} description="Use this for any address you want to track in a relationship or transaction." onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Street address" className="sm:col-span-2"><input name="addressLine1" required defaultValue={property?.addressLine1} className={inputClass} /></Field>
        <Field label="Unit / suite" className="sm:col-span-2"><input name="addressLine2" defaultValue={property?.addressLine2 ?? ""} className={inputClass} /></Field>
        <Field label="City"><input name="city" required defaultValue={property?.city} className={inputClass} /></Field>
        <Field label="State"><input name="state" required defaultValue={property?.state} className={inputClass} /></Field>
        <Field label="Postal code"><input name="postalCode" required defaultValue={property?.postalCode} className={inputClass} /></Field>
        <Field label="Country"><input name="country" required maxLength={2} defaultValue={property?.country ?? "US"} className={inputClass} /></Field>
        <Field label="Property type">
          <select name="propertyType" defaultValue={property?.propertyType ?? "single_family"} className={inputClass}>
            {CRM_PROPERTY_TYPES.map((value) => <option key={value} value={value}>{label(value)}</option>)}
          </select>
        </Field>
        <Field label="Status">
          <select name="listingStatus" defaultValue={property?.listingStatus ?? "prospect"} className={inputClass}>
            {CRM_LISTING_STATUSES.map((value) => <option key={value} value={value}>{label(value)}</option>)}
          </select>
        </Field>
        <Field label="Listing price"><input name="listingPrice" type="number" min="0" step="1000" defaultValue={property?.listingPrice ?? ""} className={inputClass} /></Field>
        <Field label="MLS number"><input name="mlsNumber" defaultValue={property?.mlsNumber ?? ""} className={inputClass} /></Field>
        <Field label="Bedrooms"><input name="bedrooms" type="number" min="0" step="0.5" defaultValue={property?.bedrooms ?? ""} className={inputClass} /></Field>
        <Field label="Bathrooms"><input name="bathrooms" type="number" min="0" step="0.5" defaultValue={property?.bathrooms ?? ""} className={inputClass} /></Field>
        <Field label="Square feet"><input name="squareFeet" type="number" min="0" step="1" defaultValue={property?.squareFeet ?? ""} className={inputClass} /></Field>
        <Field label="Notes" className="sm:col-span-2"><textarea name="notes" rows={3} defaultValue={property?.notes ?? ""} className={`${inputClass} h-auto py-2`} /></Field>
        <div className="sm:col-span-2"><FormActions busy={busy} error={error} onCancel={onClose} submitLabel={property ? "Save changes" : "Add property"} /></div>
      </form>
    </Modal>
  );
}
