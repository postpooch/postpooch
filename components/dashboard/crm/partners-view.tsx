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
  nullableText,
  toolbarSelectClass,
} from "@/components/dashboard/crm/ui";
import { CRM_PARTNER_TYPES } from "@/lib/crm/constants";
import type { CrmListResponse, CrmPartner } from "@/lib/crm/types";

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function PartnersView() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);
  const path = useMemo(
    () => `/api/crm/partners?${new URLSearchParams({ ...(search ? { q: search } : {}), ...(type ? { type } : {}), pageSize: "100" })}`,
    [search, type],
  );
  const partners = useCrmData<CrmListResponse<CrmPartner>>(path);
  const rows = partners.data?.data ?? [];
  return (
    <CrmPage contain>
      <PageHeader title="Partners" action={<PrimaryButton onClick={() => setOpen(true)}>+ New Partner</PrimaryButton>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search partners…" viewLabel="All Partners" count={partners.loading ? undefined : rows.length}>
        <select value={type} onChange={(event) => setType(event.target.value)} className={toolbarSelectClass}>
          <option value="">All partner types</option>
          {CRM_PARTNER_TYPES.map((value) => (
            <option key={value} value={value}>{label(value)}</option>
          ))}
        </select>
      </SearchBar>
      {partners.loading ? (
        <LoadingState />
      ) : partners.error ? (
        <ErrorState message={partners.error} retry={partners.reload} />
      ) : (
        <DataTable
          columns={[
            {
              id: "name",
              header: "Name",
              icon: <ColIcon name="building" />,
              width: 200,
              render: (partner) => <EntityName name={partner.name} />,
            },
            {
              id: "type",
              header: "Type",
              icon: <ColIcon name="tag" />,
              width: 140,
              render: (partner) => <Pill tone="blue">{label(partner.partnerType)}</Pill>,
            },
            {
              id: "contact",
              header: "Contact",
              icon: <ColIcon name="user" />,
              width: 160,
              render: (partner) => <span className="text-[var(--crm-secondary)]">{partner.contactName || "—"}</span>,
            },
            {
              id: "email",
              header: "Email",
              icon: <ColIcon name="mail" />,
              width: 180,
              interactive: true,
              render: (partner) => partner.email ? <Chip href={`mailto:${partner.email}`}>{partner.email}</Chip> : <span className="text-[var(--crm-muted)]">—</span>,
            },
            {
              id: "phone",
              header: "Phone",
              icon: <ColIcon name="phone" />,
              width: 140,
              interactive: true,
              render: (partner) => partner.phone ? <Chip href={`tel:${partner.phone}`}>{partner.phone}</Chip> : <span className="text-[var(--crm-muted)]">—</span>,
            },
            {
              id: "website",
              header: "Website",
              icon: <ColIcon name="link" />,
              width: 180,
              interactive: true,
              render: (partner) => partner.website ? <Chip href={partner.website} external>{partner.website.replace(/^https?:\/\//, "")}</Chip> : <span className="text-[var(--crm-muted)]">—</span>,
            },
            {
              id: "notes",
              header: "Notes",
              width: 220,
              render: (partner) => <span className="truncate text-[var(--crm-secondary)]">{partner.notes || "—"}</span>,
            },
          ]}
          rows={rows}
          onAdd={() => setOpen(true)}
          addLabel="New"
          emptyMessage="Add the partners who help your transactions run smoothly."
        />
      )}
      <PartnerForm open={open} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); void partners.reload(); }} />
    </CrmPage>
  );
}

function PartnerForm({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      partnerType: String(form.get("partnerType")),
      contactName: nullableText(form.get("contactName")),
      email: nullableText(form.get("email")),
      phone: nullableText(form.get("phone")),
      website: nullableText(form.get("website")),
      notes: nullableText(form.get("notes")),
    };
    try {
      await crmFetch("/api/crm/partners", { method: "POST", ...jsonBody(payload) });
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save partner.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal open={open} title="Add a partner" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Business name" className="sm:col-span-2"><input name="name" required className={inputClass} /></Field>
        <Field label="Partner type">
          <select name="partnerType" className={inputClass}>
            {CRM_PARTNER_TYPES.map((value) => <option key={value} value={value}>{label(value)}</option>)}
          </select>
        </Field>
        <Field label="Primary contact"><input name="contactName" className={inputClass} /></Field>
        <Field label="Email"><input name="email" type="email" className={inputClass} /></Field>
        <Field label="Phone"><input name="phone" type="tel" className={inputClass} /></Field>
        <Field label="Website" className="sm:col-span-2"><input name="website" type="url" placeholder="https://" className={inputClass} /></Field>
        <Field label="Notes" className="sm:col-span-2"><textarea name="notes" rows={3} className={`${inputClass} h-auto py-2`} /></Field>
        <div className="sm:col-span-2"><FormActions busy={busy} error={error} onCancel={onClose} submitLabel="Add partner" /></div>
      </form>
    </Modal>
  );
}
