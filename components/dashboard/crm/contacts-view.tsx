"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { crmFetch, jsonBody, useCrmData } from "@/components/dashboard/crm/api";
import { RelationshipsCell } from "@/components/dashboard/crm/relationships-cell";
import { StageCell } from "@/components/dashboard/crm/stage-cell";
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
  RelativeTime,
  SearchBar,
  SubmitEvent,
  inputClass,
  isoFromLocal,
  money,
  nullableNumber,
  nullableText,
  toolbarSelectClass,
} from "@/components/dashboard/crm/ui";
import { CRM_CONTACT_PRIORITIES, CRM_CONTACT_TYPES, CRM_LEAD_STATUSES } from "@/lib/crm/constants";
import type { CrmContact, CrmListResponse, CrmStage, CrmTag } from "@/lib/crm/types";

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function ContactsView() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [stageId, setStageId] = useState(searchParams.get("stageId") ?? "");
  const [open, setOpen] = useState(false);
  const stages = useCrmData<CrmStage[]>("/api/crm/stages");
  const path = useMemo(
    () => `/api/crm/contacts?${new URLSearchParams({ ...(search ? { q: search } : {}), ...(status ? { status } : {}), ...(priority ? { priority } : {}), ...(stageId ? { stageId } : {}), pageSize: "100" })}`,
    [search, status, priority, stageId],
  );
  const { data, error, loading, reload } = useCrmData<CrmListResponse<CrmContact>>(path);
  const rows = data?.data ?? [];
  return (
    <CrmPage contain>
      <PageHeader title="Contacts" action={<PrimaryButton onClick={() => setOpen(true)}>+ New Contact</PrimaryButton>} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search name, email, or phone…" viewLabel="All Contacts" count={loading ? undefined : rows.length}>
        <select aria-label="Lead status" className={toolbarSelectClass} value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          {CRM_LEAD_STATUSES.map((value) => (
            <option key={value} value={value}>{label(value)}</option>
          ))}
        </select>
        <select aria-label="Priority" className={toolbarSelectClass} value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="">All priorities</option>
          {CRM_CONTACT_PRIORITIES.map((value) => (
            <option key={value} value={value}>{label(value)}</option>
          ))}
        </select>
        <select aria-label="Stage" className={toolbarSelectClass} value={stageId} onChange={(event) => setStageId(event.target.value)}>
          <option value="">All stages</option>
          {(stages.data ?? []).map((stage) => (
            <option key={stage.id} value={stage.id}>{stage.name}</option>
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
              id: "name",
              header: "Name",
              icon: <ColIcon name="people" />,
              width: 200,
              render: (contact) => <EntityName name={`${contact.firstName} ${contact.lastName}`.trim()} />,
            },
            {
              id: "email",
              header: "Email",
              icon: <ColIcon name="mail" />,
              width: 180,
              interactive: true,
              render: (contact) => contact.email ? <Chip href={`mailto:${contact.email}`}>{contact.email}</Chip> : <span className="text-[var(--crm-muted)]">—</span>,
            },
            {
              id: "phone",
              header: "Phone",
              icon: <ColIcon name="phone" />,
              width: 140,
              interactive: true,
              render: (contact) => contact.phone ? <Chip href={`tel:${contact.phone}`}>{contact.phone}</Chip> : <span className="text-[var(--crm-muted)]">—</span>,
            },
            {
              id: "stage",
              header: "Stage",
              icon: <ColIcon name="tag" />,
              width: 160,
              interactive: true,
              render: (contact) => (
                <StageCell
                  contactId={contact.id}
                  stage={contact.stage ?? null}
                  onChanged={reload}
                />
              ),
            },
            {
              id: "role",
              header: "Role",
              icon: <ColIcon name="tag" />,
              width: 160,
              render: (contact) =>
                contact.contactTypes.length ? (
                  <span className="flex flex-wrap gap-1">
                    {contact.contactTypes.slice(0, 2).map((type) => (
                      <Pill key={type} tone="blue">{label(type)}</Pill>
                    ))}
                  </span>
                ) : (
                  <span className="text-[var(--crm-muted)]">—</span>
                ),
            },
            {
              id: "relationships",
              header: "Relationships",
              icon: <ColIcon name="people" />,
              width: 220,
              interactive: true,
              render: (contact) => (
                <RelationshipsCell
                  contactId={contact.id}
                  relationships={contact.relationships ?? []}
                  onChanged={reload}
                />
              ),
            },
            {
              id: "status",
              header: "Status",
              width: 120,
              render: (contact) => <span className="text-[var(--crm-secondary)]">{label(contact.leadStatus)}</span>,
            },
            {
              id: "priority",
              header: "Priority",
              width: 110,
              render: (contact) => (
                <Pill tone={contact.priority === "hot" ? "coral" : contact.priority === "cold" ? "blue" : "teal"}>
                  {label(contact.priority)}
                </Pill>
              ),
            },
            {
              id: "followup",
              header: "Follow-up",
              icon: <ColIcon name="calendar" />,
              width: 130,
              render: (contact) => <span className="text-[var(--crm-secondary)]"><RelativeTime value={contact.nextFollowUpAt} /></span>,
            },
            {
              id: "range",
              header: "Range",
              icon: <ColIcon name="dollar" />,
              width: 160,
              render: (contact) => (
                <span className="tabular-nums">
                  {contact.priceMin || contact.priceMax ? `${money(contact.priceMin)}–${money(contact.priceMax)}` : "—"}
                </span>
              ),
            },
          ]}
          rows={rows}
          getHref={(contact) => `/dashboard/crm/contacts/${contact.id}`}
          onAdd={() => setOpen(true)}
          addLabel="New"
          emptyMessage={search || status || priority || stageId ? "Try clearing a filter or broadening your search." : "Add a lead or client to begin building your relationship history."}
        />
      )}
      <ContactForm open={open} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); void reload(); }} />
    </CrmPage>
  );
}

function ContactForm({ open, onClose, onSaved, contact }: { open: boolean; onClose: () => void; onSaved: () => void; contact?: CrmContact }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: tags } = useCrmData<CrmTag[]>("/api/crm/tags");
  const { data: stages } = useCrmData<CrmStage[]>("/api/crm/stages");
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const stageValue = String(form.get("stageId") ?? "");
    const payload = {
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      email: nullableText(form.get("email")),
      phone: nullableText(form.get("phone")),
      contactTypes: form.getAll("contactTypes").map(String),
      leadStatus: String(form.get("leadStatus")),
      leadSource: nullableText(form.get("leadSource")),
      priority: String(form.get("priority")),
      priceMin: nullableNumber(form.get("priceMin")),
      priceMax: nullableNumber(form.get("priceMax")),
      preferredLocations: String(form.get("preferredLocations") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
      preapproved: form.get("preapproved") === "on",
      nextFollowUpAt: isoFromLocal(form.get("nextFollowUpAt")),
      notes: nullableText(form.get("notes")),
      stageId: stageValue || null,
      tagIds: form.getAll("tagIds").map(String),
    };
    try {
      await crmFetch(`/api/crm/contacts${contact ? `/${contact.id}` : ""}`, { method: contact ? "PATCH" : "POST", ...jsonBody(payload) });
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save contact.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal open={open} title={contact ? "Edit contact" : "Add a contact"} description="Keep the essentials useful. You can add notes and tasks after saving." onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="First name"><input name="firstName" required maxLength={100} defaultValue={contact?.firstName} className={inputClass} /></Field>
        <Field label="Last name"><input name="lastName" maxLength={100} defaultValue={contact?.lastName} className={inputClass} /></Field>
        <Field label="Email"><input name="email" type="email" defaultValue={contact?.email ?? ""} className={inputClass} /></Field>
        <Field label="Phone"><input name="phone" type="tel" defaultValue={contact?.phone ?? ""} className={inputClass} /></Field>
        <Field label="Stage">
          <select name="stageId" defaultValue={contact?.stage?.id ?? ""} className={inputClass}>
            <option value="">No stage</option>
            {(stages ?? []).map((stage) => (
              <option key={stage.id} value={stage.id}>{stage.name}{stage.profileId ? " (custom)" : ""}</option>
            ))}
          </select>
        </Field>
        <Field label="Lead status">
          <select name="leadStatus" defaultValue={contact?.leadStatus ?? "new"} className={inputClass}>
            {CRM_LEAD_STATUSES.map((value) => <option key={value} value={value}>{label(value)}</option>)}
          </select>
        </Field>
        <Field label="Priority">
          <select name="priority" defaultValue={contact?.priority ?? "warm"} className={inputClass}>
            {CRM_CONTACT_PRIORITIES.map((value) => <option key={value} value={value}>{label(value)}</option>)}
          </select>
        </Field>
        <Field label="Lead source"><input name="leadSource" defaultValue={contact?.leadSource ?? ""} placeholder="Referral, portal, open house…" className={inputClass} /></Field>
        <Field label="Next follow-up"><input name="nextFollowUpAt" type="datetime-local" defaultValue={contact?.nextFollowUpAt?.slice(0, 16)} className={inputClass} /></Field>
        <Field label="Price minimum"><input name="priceMin" type="number" min="0" step="1000" defaultValue={contact?.priceMin ?? ""} className={inputClass} /></Field>
        <Field label="Price maximum"><input name="priceMax" type="number" min="0" step="1000" defaultValue={contact?.priceMax ?? ""} className={inputClass} /></Field>
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-[13px] font-medium text-[var(--crm-secondary)]">Contact roles</legend>
          <div className="flex flex-wrap gap-2">
            {CRM_CONTACT_TYPES.map((value) => (
              <label key={value} className="flex items-center gap-2 rounded-full border border-[var(--crm-border)] bg-white px-3 py-1.5 text-[13px]">
                <input type="checkbox" name="contactTypes" value={value} defaultChecked={contact?.contactTypes.includes(value)} />
                {label(value)}
              </label>
            ))}
          </div>
        </fieldset>
        <Field label="Preferred locations" className="sm:col-span-2">
          <input name="preferredLocations" defaultValue={contact?.preferredLocations.join(", ")} placeholder="Arcadia, Scottsdale, North Phoenix" className={inputClass} />
          <span className="text-[12px] font-normal text-[var(--crm-muted)]">Separate areas with commas.</span>
        </Field>
        {tags?.length ? (
          <fieldset className="sm:col-span-2">
            <legend className="mb-2 text-[13px] font-medium text-[var(--crm-secondary)]">Tags</legend>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2 rounded-full border border-[var(--crm-border)] bg-white px-3 py-1.5 text-[13px]">
                  <input type="checkbox" name="tagIds" value={tag.id} defaultChecked={contact?.tags.some((item) => item.id === tag.id)} />
                  <span className="size-2 rounded-full" style={{ backgroundColor: tag.color }} />
                  {tag.name}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
        <label className="flex items-center gap-2 text-[13px] font-medium sm:col-span-2">
          <input name="preapproved" type="checkbox" defaultChecked={contact?.preapproved} />
          Mortgage pre-approved
        </label>
        <Field label="Relationship notes" className="sm:col-span-2">
          <textarea name="notes" rows={3} defaultValue={contact?.notes ?? ""} className={`${inputClass} h-auto py-2`} />
        </Field>
        <div className="sm:col-span-2">
          <FormActions busy={busy} error={error} onCancel={onClose} submitLabel={contact ? "Save changes" : "Add contact"} />
        </div>
      </form>
    </Modal>
  );
}

export { ContactForm };
