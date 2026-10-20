"use client";

import { useState } from "react";

import { crmFetch, jsonBody, useCrmData } from "@/components/dashboard/crm/api";
import { ContactForm } from "@/components/dashboard/crm/contacts-view";
import { RelationshipsPanel } from "@/components/dashboard/crm/relationships-cell";
import { StagePanel } from "@/components/dashboard/crm/stage-cell";
import {
  BackLink,
  Chip,
  CrmPage,
  EntityAvatar,
  ErrorState,
  Field,
  FormActions,
  LoadingState,
  MetaGrid,
  Modal,
  PageHeader,
  Pill,
  PrimaryButton,
  RelativeTime,
  SecondaryButton,
  SubmitEvent,
  dateTimeLocalValue,
  inputClass,
  isoFromLocal,
  money,
  nullableText,
} from "@/components/dashboard/crm/ui";
import { CRM_TASK_PRIORITIES, CRM_TASK_TYPES } from "@/lib/crm/constants";
import type { CrmContact, CrmListResponse, CrmNote, CrmTask } from "@/lib/crm/types";

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function ContactDetail({ id }: { id: string }) {
  const contact = useCrmData<CrmContact>(`/api/crm/contacts/${id}`);
  const notes = useCrmData<CrmListResponse<CrmNote>>(`/api/crm/notes?contactId=${id}&pageSize=100`);
  const tasks = useCrmData<CrmListResponse<CrmTask>>(`/api/crm/tasks?contactId=${id}&pageSize=100`);
  const [edit, setEdit] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  if (contact.loading) {
    return (
      <CrmPage>
        <div className="border-b border-[var(--crm-border)] px-3 py-2">
          <BackLink href="/dashboard/crm/contacts">Back to Contacts</BackLink>
        </div>
        <LoadingState />
      </CrmPage>
    );
  }
  if (contact.error || !contact.data) {
    return (
      <CrmPage>
        <div className="border-b border-[var(--crm-border)] px-3 py-2">
          <BackLink href="/dashboard/crm/contacts">Back to Contacts</BackLink>
        </div>
        <ErrorState message={contact.error ?? "Contact not found."} retry={contact.reload} />
      </CrmPage>
    );
  }
  const person = contact.data;
  const fullName = `${person.firstName} ${person.lastName}`.trim();
  return (
    <CrmPage>
      <div className="flex min-h-12 shrink-0 items-center justify-between gap-4 border-b border-[var(--crm-border)] bg-white px-3">
        <BackLink href="/dashboard/crm/contacts">Back to Contacts</BackLink>
        <div className="flex shrink-0 items-center gap-1.5">
          <SecondaryButton onClick={() => setTaskOpen(true)}>Add task</SecondaryButton>
          <PrimaryButton onClick={() => setEdit(true)}>Edit</PrimaryButton>
        </div>
      </div>
      <PageHeader
        title={fullName}
        description={[person.email, person.phone].filter(Boolean).join(" · ") || undefined}
      />
      <div className="grid gap-0 lg:grid-cols-[minmax(280px,1fr)_1.35fr]">
        <section className="border-b border-[var(--crm-border)] p-4 lg:border-r lg:border-b-0">
          <div className="mb-4 flex items-center gap-3">
            <EntityAvatar name={fullName} size={32} />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium">{fullName}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {person.email ? <Chip href={`mailto:${person.email}`}>{person.email}</Chip> : null}
                {person.phone ? <Chip href={`tel:${person.phone}`}>{person.phone}</Chip> : null}
              </div>
            </div>
          </div>
          <MetaGrid
            items={[
              { label: "Stage", value: person.stage?.name ?? "Not set" },
              { label: "Status", value: label(person.leadStatus) },
              { label: "Priority", value: <Pill tone={person.priority === "hot" ? "coral" : "teal"}>{label(person.priority)}</Pill> },
              { label: "Budget", value: person.priceMin || person.priceMax ? `${money(person.priceMin)} – ${money(person.priceMax)}` : "Not set" },
              { label: "Follow-up", value: <RelativeTime value={person.nextFollowUpAt} /> },
              { label: "Source", value: person.leadSource || "Not set" },
              { label: "Pre-approved", value: person.preapproved ? "Yes" : "Not yet" },
            ]}
          />
          <div className="mt-4 flex flex-wrap gap-1.5">
            {person.contactTypes.map((type) => <Pill key={type} tone="blue">{label(type)}</Pill>)}
            {person.tags.map((tag) => (
              <span key={tag.id} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--crm-border)] px-2 py-0.5 text-[12px]">
                <span className="size-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                {tag.name}
              </span>
            ))}
          </div>
          {person.preferredLocations.length ? (
            <div className="mt-4 border-t border-[var(--crm-border)] pt-3">
              <p className="text-[12px] text-[var(--crm-muted)]">Preferred areas</p>
              <p className="mt-1 text-[13px]">{person.preferredLocations.join(", ")}</p>
            </div>
          ) : null}
          <StagePanel
            contactId={person.id}
            stage={person.stage ?? null}
            onChanged={() => void contact.reload()}
          />
          <RelationshipsPanel
            contactId={person.id}
            relationships={person.relationships ?? []}
            onChanged={() => void contact.reload()}
          />
          {person.notes ? (
            <div className="mt-4 border-t border-[var(--crm-border)] pt-3">
              <p className="text-[12px] text-[var(--crm-muted)]">Relationship notes</p>
              <p className="mt-1 whitespace-pre-wrap text-[13px] leading-5">{person.notes}</p>
            </div>
          ) : null}
        </section>
        <div>
          <section className="border-b border-[var(--crm-border)]">
            <div className="flex h-10 items-center justify-between px-4">
              <h2 className="text-[13px] font-medium">Follow-ups</h2>
              <SecondaryButton onClick={() => setTaskOpen(true)}>New task</SecondaryButton>
            </div>
            <div className="divide-y divide-[var(--crm-border)]">
              {tasks.data?.data.length ? tasks.data.data.map((task) => (
                <div key={task.id} className="flex items-center gap-3 px-4 py-2.5">
                  <button
                    aria-label={task.completedAt ? "Reopen task" : "Complete task"}
                    className={`grid size-4 place-items-center rounded-[4px] border text-[9px] leading-none text-white ${task.completedAt ? "border-[var(--crm-accent)] bg-[var(--crm-accent)]" : "border-[#cfcfcf]"}`}
                    onClick={async () => {
                      await crmFetch(`/api/crm/tasks/${task.id}`, { method: "PATCH", ...jsonBody({ completedAt: task.completedAt ? null : new Date().toISOString() }) });
                      void tasks.reload();
                    }}
                  >
                    {task.completedAt ? "✓" : null}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-[13px] ${task.completedAt ? "text-[var(--crm-muted)] line-through" : "font-medium"}`}>{task.title}</p>
                    <p className="text-[12px] text-[var(--crm-muted)]">{label(task.taskType)} · <RelativeTime value={task.dueAt} /></p>
                  </div>
                </div>
              )) : <p className="px-4 py-5 text-[13px] text-[var(--crm-muted)]">No follow-ups yet.</p>}
            </div>
          </section>
          <section>
            <div className="flex h-10 items-center justify-between px-4">
              <h2 className="text-[13px] font-medium">Notes</h2>
              <SecondaryButton onClick={() => setNoteOpen(true)}>Add note</SecondaryButton>
            </div>
            <div className="divide-y divide-[var(--crm-border)]">
              {notes.data?.data.length ? notes.data.data.map((note) => (
                <article key={note.id} className="px-4 py-3">
                  <p className="whitespace-pre-wrap text-[13px] leading-5">{note.body}</p>
                  <p className="mt-1 text-[12px] text-[var(--crm-muted)]"><RelativeTime value={note.createdAt} /></p>
                </article>
              )) : <p className="px-4 py-5 text-[13px] text-[var(--crm-muted)]">No notes yet.</p>}
            </div>
          </section>
        </div>
      </div>
      <ContactForm open={edit} contact={person} onClose={() => setEdit(false)} onSaved={() => { setEdit(false); void contact.reload(); }} />
      <NoteForm open={noteOpen} contactId={id} onClose={() => setNoteOpen(false)} onSaved={() => { setNoteOpen(false); void notes.reload(); }} />
      <TaskForm open={taskOpen} contactId={id} onClose={() => setTaskOpen(false)} onSaved={() => { setTaskOpen(false); void tasks.reload(); }} />
    </CrmPage>
  );
}

function NoteForm({ open, contactId, onClose, onSaved }: { open: boolean; contactId: string; onClose: () => void; onSaved: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      await crmFetch("/api/crm/notes", { method: "POST", ...jsonBody({ contactId, body: String(form.get("body") ?? "") }) });
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to add note.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal open={open} title="Add an interaction note" onClose={onClose}>
      <form onSubmit={submit}>
        <Field label="What happened?">
          <textarea autoFocus name="body" required rows={6} maxLength={20_000} className={`${inputClass} h-auto py-2`} placeholder="Called about financing, toured three homes, discussed timing…" />
        </Field>
        <FormActions busy={busy} error={error} onCancel={onClose} submitLabel="Add note" />
      </form>
    </Modal>
  );
}

export function TaskForm({ open, contactId, transactionId, onClose, onSaved }: { open: boolean; contactId?: string; transactionId?: string; onClose: () => void; onSaved: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultDue] = useState(() => dateTimeLocalValue(new Date(Date.now() + 24 * 60 * 60 * 1000)));
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const payload = {
      contactId: contactId ?? null,
      transactionId: transactionId ?? null,
      title: String(form.get("title") ?? ""),
      taskType: String(form.get("taskType")),
      priority: String(form.get("priority")),
      dueAt: isoFromLocal(form.get("dueAt")),
      details: nullableText(form.get("details")),
    };
    try {
      await crmFetch("/api/crm/tasks", { method: "POST", ...jsonBody(payload) });
      onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to add task.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal open={open} title="Add a follow-up" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Task" className="sm:col-span-2">
          <input autoFocus name="title" required maxLength={250} className={inputClass} placeholder="Follow up about pre-approval" />
        </Field>
        <Field label="Type">
          <select name="taskType" className={inputClass}>
            {CRM_TASK_TYPES.map((value) => <option key={value} value={value}>{label(value)}</option>)}
          </select>
        </Field>
        <Field label="Priority">
          <select name="priority" defaultValue="normal" className={inputClass}>
            {CRM_TASK_PRIORITIES.map((value) => <option key={value} value={value}>{label(value)}</option>)}
          </select>
        </Field>
        <Field label="Due" className="sm:col-span-2">
          <input name="dueAt" type="datetime-local" defaultValue={defaultDue} className={inputClass} />
        </Field>
        <Field label="Details" className="sm:col-span-2">
          <textarea name="details" rows={3} className={`${inputClass} h-auto py-2`} />
        </Field>
        <div className="sm:col-span-2"><FormActions busy={busy} error={error} onCancel={onClose} submitLabel="Add task" /></div>
      </form>
    </Modal>
  );
}
