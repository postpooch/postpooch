"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { crmFetch, jsonBody, useCrmData } from "@/components/dashboard/crm/api";
import { EntityAvatar } from "@/components/dashboard/crm/ui";
import type {
  CrmContact,
  CrmContactRelationship,
  CrmListResponse,
  CrmRelationshipType,
} from "@/lib/crm/types";

const TONES = [
  { bg: "#fdecea", fg: "#b71c1c" },
  { bg: "#f3e5f5", fg: "#6a1b9a" },
  { bg: "#e3f2fd", fg: "#0d47a1" },
  { bg: "#e0f2f1", fg: "#00695c" },
  { bg: "#fff8e1", fg: "#f57f17" },
  { bg: "#e8f5e9", fg: "#1b5e20" },
  { bg: "#fce4ec", fg: "#880e4f" },
  { bg: "#efebe9", fg: "#4e342e" },
] as const;

const optionRowClass =
  "mx-1 flex w-[calc(100%-0.5rem)] items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-left transition-colors duration-100 hover:bg-[#eceef2] focus-visible:bg-[#eceef2] focus-visible:outline-none";

function hashTone(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) hash = value.charCodeAt(index) + ((hash << 5) - hash);
  return TONES[Math.abs(hash) % TONES.length]!;
}

function TypePill({ label, toneKey = label }: { label: string; toneKey?: string }) {
  const tone = hashTone(toneKey);
  return (
    <span
      className="inline-flex max-w-full items-center truncate rounded-[4px] px-1.5 py-0.5 text-[12px] font-medium"
      style={{ backgroundColor: tone.bg, color: tone.fg }}
    >
      {label}
    </span>
  );
}

type TypeOption = {
  key: string;
  relationshipTypeId: string;
  label: string;
  relatedAs: "type1" | "type2";
  type1: string;
  type2: string | null;
  profileId: string | null;
};

function expandTypeOptions(types: CrmRelationshipType[]): TypeOption[] {
  const options: TypeOption[] = [];
  for (const type of types) {
    if (type.type2) {
      options.push({
        key: `${type.id}:type2`,
        relationshipTypeId: type.id,
        label: type.type2,
        relatedAs: "type2",
        type1: type.type1,
        type2: type.type2,
        profileId: type.profileId,
      });
      options.push({
        key: `${type.id}:type1`,
        relationshipTypeId: type.id,
        label: type.type1,
        relatedAs: "type1",
        type1: type.type1,
        type2: type.type2,
        profileId: type.profileId,
      });
    } else {
      options.push({
        key: `${type.id}:type1`,
        relationshipTypeId: type.id,
        label: type.type1,
        relatedAs: "type1",
        type1: type.type1,
        type2: null,
        profileId: type.profileId,
      });
    }
  }
  return options;
}

export function RelationshipsCell({
  contactId,
  relationships,
  onChanged,
  compact = true,
}: {
  contactId: string;
  relationships: CrmContactRelationship[];
  onChanged: () => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonId = useId();
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;
    function place() {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = 280;
      const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8);
      const top = Math.min(rect.bottom + 4, window.innerHeight - 24);
      setCoords({ top, left });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        const portal = document.getElementById(`relationships-popover-${contactId}`);
        if (portal?.contains(event.target as Node)) return;
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [contactId, open]);

  const visible = relationships.slice(0, compact ? 2 : 8);
  const overflow = relationships.length - visible.length;

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="flex min-h-8 w-full min-w-0 items-center gap-1 overflow-hidden rounded-[4px] px-0.5 text-left hover:bg-[var(--crm-hover)]"
      >
        {relationships.length ? (
          <>
            {visible.map((item) => (
              <span key={item.id} className="inline-flex min-w-0 max-w-[9.5rem] items-center gap-1">
                <EntityAvatar name={item.relatedContactName} size={14} />
                <TypePill label={item.label} toneKey={item.relationshipTypeId + item.label} />
              </span>
            ))}
            {overflow > 0 ? <span className="text-[12px] text-[var(--crm-muted)]">+{overflow}</span> : null}
          </>
        ) : (
          <span className="text-[13px] text-[var(--crm-muted)]">—</span>
        )}
      </button>
      {open && coords
        ? createPortal(
            <RelationshipsPopover
              contactId={contactId}
              relationships={relationships}
              coords={coords}
              onChanged={onChanged}
              onClose={() => setOpen(false)}
            />,
            document.body,
          )
        : null}
    </div>
  );
}

function RelationshipsPopover({
  contactId,
  relationships,
  coords,
  onChanged,
  onClose,
}: {
  contactId: string;
  relationships: CrmContactRelationship[];
  coords: { top: number; left: number };
  onChanged: () => void;
  onClose: () => void;
}) {
  const types = useCrmData<CrmRelationshipType[]>("/api/crm/relationship-types");
  const [query, setQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<{ id: string; name: string } | null>(null);
  const [addingContact, setAddingContact] = useState(false);
  const [addingType, setAddingType] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const contactSearchPath = useMemo(() => {
    const params = new URLSearchParams({ pageSize: "20" });
    if (query.trim() && !selectedContact && !addingContact) params.set("q", query.trim());
    return `/api/crm/contacts?${params}`;
  }, [addingContact, query, selectedContact]);

  const contacts = useCrmData<CrmListResponse<CrmContact>>(contactSearchPath);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedContact, addingContact, addingType]);

  const typeOptions = useMemo(() => expandTypeOptions(types.data ?? []), [types.data]);
  const filteredTypes = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle || !selectedContact || addingType) return typeOptions;
    return typeOptions.filter((option) => option.label.toLowerCase().includes(needle));
  }, [addingType, query, selectedContact, typeOptions]);

  const exactTypeMatch = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return typeOptions.some((option) => option.label.toLowerCase() === needle);
  }, [query, typeOptions]);

  const contactChoices = useMemo(() => {
    const rows = contacts.data?.data ?? [];
    return rows.filter((contact) => contact.id !== contactId).slice(0, 8);
  }, [contactId, contacts.data]);

  const exactContactMatch = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return contactChoices.some((contact) => {
      const name = `${contact.firstName} ${contact.lastName}`.trim().toLowerCase();
      return name === needle;
    });
  }, [contactChoices, query]);

  function splitContactName(fullName: string) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    return {
      firstName: parts[0] ?? "Contact",
      lastName: parts.slice(1).join(" "),
    };
  }

  async function removeRelationship(id: string) {
    setBusy(true);
    setError(null);
    try {
      await crmFetch(`/api/crm/relationships/${id}`, { method: "DELETE" });
      onChanged();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to remove relationship.");
    } finally {
      setBusy(false);
    }
  }

  async function addRelationship(option: TypeOption) {
    if (!selectedContact) return;
    setBusy(true);
    setError(null);
    try {
      await crmFetch("/api/crm/relationships", {
        method: "POST",
        ...jsonBody({
          contactId,
          relatedContactId: selectedContact.id,
          relationshipTypeId: option.relationshipTypeId,
          relatedAs: option.relatedAs,
        }),
      });
      setSelectedContact(null);
      setAddingContact(false);
      setAddingType(false);
      setQuery("");
      onChanged();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to add relationship.");
    } finally {
      setBusy(false);
    }
  }

  async function createContactAndSelect(nameOverride?: string) {
    const fullName = (nameOverride ?? query).trim();
    if (!fullName) {
      setAddingContact(true);
      setError(null);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { firstName, lastName } = splitContactName(fullName);
      const created = await crmFetch<CrmContact>("/api/crm/contacts", {
        method: "POST",
        ...jsonBody({ firstName, lastName }),
      });
      const name = `${created.firstName} ${created.lastName}`.trim();
      setSelectedContact({ id: created.id, name });
      setAddingContact(false);
      setAddingType(false);
      setQuery("");
      onChanged();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to create contact.");
    } finally {
      setBusy(false);
    }
  }

  function startAddContactToOptions() {
    const name = query.trim();
    if (name && !exactContactMatch) {
      void createContactAndSelect(name);
      return;
    }
    setAddingContact(true);
    setQuery("");
    setError(null);
  }

  async function createTypeAndSelect(labelOverride?: string) {
    const label = (labelOverride ?? query).trim();
    if (!selectedContact) return;
    if (!label) {
      setAddingType(true);
      setError(null);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const created = await crmFetch<CrmRelationshipType>("/api/crm/relationship-types", {
        method: "POST",
        ...jsonBody({ type1: label, type2: null }),
      });
      await crmFetch("/api/crm/relationships", {
        method: "POST",
        ...jsonBody({
          contactId,
          relatedContactId: selectedContact.id,
          relationshipTypeId: created.id,
          relatedAs: "type1",
        }),
      });
      setSelectedContact(null);
      setAddingContact(false);
      setAddingType(false);
      setQuery("");
      void types.reload();
      onChanged();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to create relationship type.");
    } finally {
      setBusy(false);
    }
  }

  function startAddTypeToOptions() {
    const label = query.trim();
    if (label && !exactTypeMatch) {
      void createTypeAndSelect(label);
      return;
    }
    setAddingType(true);
    setQuery("");
    setError(null);
  }

  return (
    <div
      id={`relationships-popover-${contactId}`}
      role="dialog"
      aria-label="Edit relationships"
      style={{ top: coords.top, left: coords.left }}
      className="fixed z-[80] w-[280px] overflow-hidden rounded-[8px] border border-[var(--crm-border)] bg-white/95 shadow-[0_8px_28px_rgba(0,0,0,0.12)] backdrop-blur-md"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div className="border-b border-[var(--crm-border)] px-2 py-1.5">
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;
            if (addingContact) {
              event.preventDefault();
              void createContactAndSelect();
            } else if (selectedContact && addingType) {
              event.preventDefault();
              void createTypeAndSelect();
            }
          }}
          placeholder={
            addingContact
              ? "New contact name…"
              : addingType
                ? "New relationship type…"
                : selectedContact
                  ? "Search"
                  : "Search contacts…"
          }
          className="h-8 w-full rounded-[4px] border-0 bg-transparent px-1.5 text-[13px] outline-none placeholder:text-[var(--crm-muted)]"
        />
      </div>

      {relationships.length && !addingContact && !addingType ? (
        <div className="max-h-36 overflow-y-auto border-b border-[var(--crm-border)] py-1">
          {relationships.map((item) => (
            <div key={item.id} className={`${optionRowClass} group`}>
              <EntityAvatar name={item.relatedContactName} size={18} />
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <TypePill label={item.label} toneKey={item.relationshipTypeId + item.label} />
                  <Link
                    href={`/dashboard/crm/contacts/${item.relatedContactId}`}
                    className="truncate text-[12px] text-[var(--crm-secondary)] hover:text-[var(--crm-accent)]"
                    onClick={onClose}
                  >
                    {item.relatedContactName}
                  </Link>
                </div>
              </div>
              <button
                type="button"
                aria-label={`Remove ${item.label} relationship`}
                disabled={busy}
                onClick={() => void removeRelationship(item.id)}
                className="grid size-5 place-items-center rounded text-[12px] text-[var(--crm-muted)] transition-colors hover:bg-white hover:text-[var(--crm-text)] group-hover:text-[var(--crm-text)]"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="max-h-56 overflow-y-auto py-1">
        {addingContact ? (
          <>
            <p className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[var(--crm-muted)]">
              New contact
            </p>
            <button
              type="button"
              disabled={busy || !query.trim()}
              onClick={() => void createContactAndSelect()}
              className={`${optionRowClass} text-[13px] text-[var(--crm-accent)]`}
            >
              {query.trim() ? <>+ Add contact &lsquo;{query.trim()}&rsquo;…</> : "+ Add new contact…"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setAddingContact(false);
                setQuery("");
                setError(null);
              }}
              className={`${optionRowClass} text-[13px] text-[var(--crm-muted)]`}
            >
              Cancel
            </button>
          </>
        ) : !selectedContact ? (
          <>
            <p className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[var(--crm-muted)]">Add contact</p>
            {contacts.loading ? (
              <div className="flex items-center justify-center gap-2 px-2.5 py-6 text-[13px] text-[var(--crm-muted)]">
                <span
                  aria-hidden
                  className="size-4 shrink-0 animate-spin rounded-full border-2 border-pp-ink/15 border-t-pp-teal"
                />
                Searching…
              </div>
            ) : (
              <>
                {contactChoices.map((contact) => {
                  const name = `${contact.firstName} ${contact.lastName}`.trim();
                  return (
                    <button
                      key={contact.id}
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setSelectedContact({ id: contact.id, name });
                        setAddingType(false);
                        setQuery("");
                      }}
                      className={optionRowClass}
                    >
                      <EntityAvatar name={name} size={18} />
                      <span className="truncate text-[13px]">{name}</span>
                    </button>
                  );
                })}
                {!contactChoices.length ? (
                  <p className="px-2.5 py-2 text-[13px] text-[var(--crm-muted)]">No other contacts found.</p>
                ) : null}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => startAddContactToOptions()}
                  className={`${optionRowClass} text-[13px] text-[var(--crm-accent)]`}
                >
                  {query.trim() && !exactContactMatch ? (
                    <>+ Add contact &lsquo;{query.trim()}&rsquo;…</>
                  ) : (
                    "+ Add new contact…"
                  )}
                </button>
              </>
            )}
          </>
        ) : addingType ? (
          <>
            <div className="flex items-center gap-2 border-b border-[var(--crm-border)] px-2.5 py-1.5">
              <EntityAvatar name={selectedContact.name} size={18} />
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{selectedContact.name}</span>
            </div>
            <p className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[var(--crm-muted)]">
              New relationship type
            </p>
            <button
              type="button"
              disabled={busy || !query.trim()}
              onClick={() => void createTypeAndSelect()}
              className={`${optionRowClass} text-[13px] text-[var(--crm-accent)]`}
            >
              {query.trim() ? <>+ Add &lsquo;{query.trim()}&rsquo; to options…</> : "+ Add to options…"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setAddingType(false);
                setQuery("");
                setError(null);
              }}
              className={`${optionRowClass} text-[13px] text-[var(--crm-muted)]`}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 border-b border-[var(--crm-border)] px-2.5 py-1.5">
              <EntityAvatar name={selectedContact.name} size={18} />
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{selectedContact.name}</span>
              <button
                type="button"
                className="rounded px-1 text-[12px] text-[var(--crm-muted)] transition-colors hover:bg-[#eceef2] hover:text-[var(--crm-text)]"
                onClick={() => {
                  setSelectedContact(null);
                  setAddingContact(false);
                  setAddingType(false);
                  setQuery("");
                }}
              >
                Change
              </button>
            </div>
            <p className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-[var(--crm-muted)]">
              How are they related?
            </p>
            {types.loading ? (
              <div className="flex items-center justify-center gap-2 px-2.5 py-6 text-[13px] text-[var(--crm-muted)]">
                <span
                  aria-hidden
                  className="size-4 shrink-0 animate-spin rounded-full border-2 border-pp-ink/15 border-t-pp-teal"
                />
                Loading types…
              </div>
            ) : (
              <>
                {filteredTypes.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    disabled={busy}
                    onClick={() => void addRelationship(option)}
                    className={`${optionRowClass} justify-between`}
                  >
                    <TypePill label={option.label} toneKey={option.relationshipTypeId + option.label} />
                    <span className="truncate text-[11px] text-[var(--crm-muted)]">
                      {option.type2 ? `${option.type1} / ${option.type2}` : "Symmetric"}
                    </span>
                  </button>
                ))}
                {!filteredTypes.length && exactTypeMatch ? (
                  <p className="px-2.5 py-2 text-[13px] text-[var(--crm-muted)]">No matching types.</p>
                ) : null}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => startAddTypeToOptions()}
                  className={`${optionRowClass} text-[13px] text-[var(--crm-accent)]`}
                >
                  {query.trim() && !exactTypeMatch ? (
                    <>+ Add &lsquo;{query.trim()}&rsquo; to options…</>
                  ) : (
                    "+ Add to options…"
                  )}
                </button>
              </>
            )}
          </>
        )}
      </div>

      {error ? <p className="border-t border-[var(--crm-border)] px-2.5 py-2 text-[12px] text-[#b71c1c]">{error}</p> : null}
    </div>
  );
}

export function RelationshipsPanel({
  contactId,
  relationships,
  onChanged,
}: {
  contactId: string;
  relationships: CrmContactRelationship[];
  onChanged: () => void;
}) {
  return (
    <div className="mt-4 border-t border-[var(--crm-border)] pt-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[12px] text-[var(--crm-muted)]">Relationships</p>
      </div>
      <RelationshipsCell contactId={contactId} relationships={relationships} onChanged={onChanged} compact={false} />
      {!relationships.length ? (
        <p className="mt-1 text-[12px] text-[var(--crm-muted)]">Link spouses, family, or referral partners.</p>
      ) : null}
    </div>
  );
}
