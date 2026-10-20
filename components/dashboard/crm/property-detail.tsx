"use client";

import { useState } from "react";

import { useCrmData } from "@/components/dashboard/crm/api";
import { PropertyForm } from "@/components/dashboard/crm/properties-view";
import {
  BackLink,
  CrmPage,
  EntityAvatar,
  ErrorState,
  LoadingState,
  MetaGrid,
  PageHeader,
  Pill,
  PrimaryButton,
  money,
} from "@/components/dashboard/crm/ui";
import type { CrmProperty } from "@/lib/crm/types";

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function PropertyDetail({ id }: { id: string }) {
  const property = useCrmData<CrmProperty>(`/api/crm/properties/${id}`);
  const [edit, setEdit] = useState(false);
  if (property.loading) return <CrmPage><LoadingState /></CrmPage>;
  if (property.error || !property.data) return <CrmPage><ErrorState message={property.error ?? "Property not found."} retry={property.reload} /></CrmPage>;
  const item = property.data;
  return (
    <CrmPage>
      <PageHeader title={item.addressLine1} description={`${item.city}, ${item.state} ${item.postalCode}`} action={<PrimaryButton onClick={() => setEdit(true)}>Edit</PrimaryButton>} />
      <div className="border-b border-[var(--crm-border)] px-3 py-2">
        <BackLink href="/dashboard/crm/properties">Back to Properties</BackLink>
      </div>
      <div className="p-4">
        <div className="mb-4 flex items-center gap-3">
          <EntityAvatar name={item.addressLine1} size={32} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-medium">{item.addressLine1}</h2>
              <Pill tone={item.listingStatus === "active" ? "teal" : "sand"}>{label(item.listingStatus)}</Pill>
            </div>
            <address className="mt-0.5 text-[13px] not-italic text-[var(--crm-secondary)]">
              {item.addressLine2 ? `${item.addressLine2}, ` : ""}{item.city}, {item.state} {item.postalCode} {item.country}
            </address>
          </div>
        </div>
        <MetaGrid
          items={[
            { label: "Price", value: money(item.listingPrice) },
            { label: "Type", value: label(item.propertyType) },
            { label: "MLS", value: item.mlsNumber || "—" },
            { label: "Bedrooms", value: item.bedrooms ?? "—" },
            { label: "Bathrooms", value: item.bathrooms ?? "—" },
            { label: "Square feet", value: item.squareFeet?.toLocaleString() ?? "—" },
          ]}
        />
        {item.notes ? <p className="mt-4 whitespace-pre-wrap border-t border-[var(--crm-border)] pt-4 text-[13px] leading-5">{item.notes}</p> : null}
      </div>
      <PropertyForm open={edit} property={item} onClose={() => setEdit(false)} onSaved={() => { setEdit(false); void property.reload(); }} />
    </CrmPage>
  );
}
