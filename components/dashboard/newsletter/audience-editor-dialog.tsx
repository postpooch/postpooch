"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import {
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";

import type {
  NewsletterAudience,
  NewsletterContactOption,
} from "@/lib/newsletter-audiences/types";
import { isNewsletterContactSendable } from "@/lib/newsletter-audiences/eligibility";

type ContactFilter = "all" | "sendable" | "selected";

export function AudienceEditorDialog({
  open,
  onOpenChange,
  contacts,
  audience,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contacts: NewsletterContactOption[];
  audience?: NewsletterAudience | null;
  onSaved: (audience: NewsletterAudience) => void;
}) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(audience?.name ?? "");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(audience?.contactIds ?? []),
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ContactFilter>("all");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visibleContacts = useMemo(() => {
    return contacts.filter((contact) => {
      if (filter === "selected" && !selectedIds.has(contact.id)) return false;
      if (
        filter === "sendable" &&
        !isNewsletterContactSendable(contact)
      ) {
        return false;
      }
      if (!deferredQuery) return true;
      const haystack = [
        contact.firstName,
        contact.lastName,
        contact.email ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(deferredQuery);
    });
  }, [contacts, deferredQuery, filter, selectedIds]);

  const sendableSelectedCount = contacts.filter(
    (contact) =>
      selectedIds.has(contact.id) &&
      isNewsletterContactSendable(contact),
  ).length;

  function setDialogOpen(nextOpen: boolean) {
    if (!saving) onOpenChange(nextOpen);
  }

  function toggleContact(contactId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(contactId)) next.delete(contactId);
      else next.add(contactId);
      return next;
    });
    setError("");
  }

  function selectSendable() {
    setSelectedIds(
      new Set(
        contacts
          .filter(isNewsletterContactSendable)
          .map((contact) => contact.id),
      ),
    );
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Give this audience a name.");
      nameInputRef.current?.focus();
      return;
    }
    if (selectedIds.size === 0) {
      setError("Choose at least one CRM contact.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const endpoint = audience
        ? `/api/newsletter_audiences/${encodeURIComponent(audience.id)}`
        : "/api/newsletter_audiences";
      const response = await fetch(endpoint, {
        method: audience ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          contactIds: [...selectedIds],
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        audience?: NewsletterAudience;
        error?: string;
      };
      if (!response.ok || !result.audience) {
        throw new Error(result.error ?? "Unable to save this audience.");
      }
      onSaved(result.audience);
      onOpenChange(false);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to save this audience.",
      );
    } finally {
      setSaving(false);
    }
  }

  const title = audience ? "Edit audience" : "Create an audience";

  return (
    <Dialog.Root open={open} onOpenChange={setDialogOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-[#202124]/50 data-[state=closed]:animate-[pp-dialog-overlay-out_160ms_ease-in_both] data-[state=open]:animate-[pp-dialog-overlay-in_180ms_ease-out_both]" />
        <Dialog.Content
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            nameInputRef.current?.focus();
          }}
          className="fixed top-1/2 left-1/2 z-[81] flex max-h-[min(760px,calc(100dvh-2rem))] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-[#dadce0] bg-white font-sans text-[#202124] outline-none data-[state=closed]:animate-[pp-dialog-out_160ms_ease-in_both] data-[state=open]:animate-[pp-dialog-in_200ms_ease-out_both]"
        >
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <header className="flex items-start justify-between gap-6 px-6 pt-6 sm:px-8 sm:pt-8">
              <div>
                <div className="flex items-center gap-3 text-[15px] font-medium text-[#3c4043]">
                  <span className="grid size-8 place-items-center rounded-lg bg-[#e8f0fe] text-[#1a73e8]">
                    <UsersRound className="size-[18px]" strokeWidth={1.7} />
                  </span>
                  Newsletter audience
                </div>
                <Dialog.Title className="mt-5 text-[28px] font-medium leading-[1.2] tracking-[-0.006em] text-[#202124]">
                  {title}
                </Dialog.Title>
                <Dialog.Description className="mt-2 max-w-xl text-[14px] leading-6 tracking-[0.017em] text-[#5f6368]">
                  Group CRM contacts for one-click campaign targeting. Explicitly
                  unsubscribed, suppressed, and invalid contacts are always excluded.
                </Dialog.Description>
              </div>
              <Dialog.Close
                disabled={saving}
                className="grid size-10 shrink-0 place-items-center rounded-full text-[#5f6368] transition hover:bg-[#f8f9fa] hover:text-[#202124] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8] disabled:opacity-50"
              >
                <X className="size-5" strokeWidth={1.7} />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              <label className="block">
                <span className="mb-2 block text-[12px] font-medium tracking-[0.036em] text-[#3c4043]">
                  Audience name
                </span>
                <input
                  ref={nameInputRef}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                  }}
                  maxLength={80}
                  placeholder="For example, Past clients"
                  className="h-11 w-full rounded border border-[#dadce0] bg-white px-3 text-[14px] tracking-[0.017em] outline-none transition placeholder:text-[#5f6368]/70 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#c4c6c7]/60"
                />
              </label>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-medium leading-7 text-[#202124]">
                    Choose contacts
                  </h3>
                  <p className="mt-0.5 text-[12px] tracking-[0.036em] text-[#5f6368]">
                    {selectedIds.size} selected · {sendableSelectedCount} ready to receive
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[12px] tracking-[0.036em]">
                  <button
                    type="button"
                    onClick={selectSendable}
                    className="rounded text-[#1a73e8] underline decoration-[#1a73e8]/35 underline-offset-2 hover:text-[#1967d2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8]"
                  >
                    Select all sendable
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIds(new Set())}
                    className="rounded text-[#5f6368] hover:text-[#202124] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8]"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#5f6368]" strokeWidth={1.7} />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search CRM contacts"
                    className="h-10 w-full rounded-full border border-[#dadce0] bg-white pr-4 pl-10 text-[14px] tracking-[0.017em] outline-none placeholder:text-[#5f6368] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#c4c6c7]/60 [&::-webkit-search-cancel-button]:hidden"
                  />
                </div>
                <div className="inline-flex w-fit rounded-full border border-[#dadce0] bg-white p-1">
                  {(
                    [
                      ["all", "All"],
                      ["sendable", "Sendable"],
                      ["selected", "Selected"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilter(value)}
                      className={[
                        "rounded-full px-3 py-1.5 text-[12px] tracking-[0.036em] transition focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1a73e8]",
                        filter === value
                          ? "bg-[#f8f9fa] font-medium text-[#202124]"
                          : "text-[#5f6368] hover:text-[#202124]",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-lg border border-[#dadce0]">
                <div className="max-h-[300px] overflow-y-auto">
                  {visibleContacts.length ? (
                    <ul className="divide-y divide-[#dadce0]">
                      {visibleContacts.map((contact) => {
                        const selected = selectedIds.has(contact.id);
                        const name = contactName(contact);
                        return (
                          <li key={contact.id}>
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={selected}
                              onClick={() => toggleContact(contact.id)}
                              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[#f8f9fa] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1a73e8]"
                            >
                              <span
                                className={[
                                  "grid size-5 shrink-0 place-items-center rounded border transition",
                                  selected
                                    ? "border-[#1a73e8] bg-[#1a73e8] text-white"
                                    : "border-[#9aa0a6] bg-white text-transparent",
                                ].join(" ")}
                              >
                                <Check className="size-3.5" strokeWidth={2.3} />
                              </span>
                              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e8f0fe] text-[12px] font-medium text-[#1967d2]">
                                {contactInitials(contact)}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[14px] font-medium tracking-[0.017em] text-[#202124]">
                                  {name}
                                </span>
                                <span className="mt-0.5 block truncate text-[12px] tracking-[0.036em] text-[#5f6368]">
                                  {contact.email ?? "No email address"}
                                </span>
                              </span>
                              <ContactStatus contact={contact} />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="px-5 py-10 text-center">
                      <p className="text-[14px] font-medium text-[#3c4043]">
                        {contacts.length
                          ? "No contacts match this view"
                          : "No CRM contacts yet"}
                      </p>
                      <p className="mt-1 text-[12px] leading-5 tracking-[0.036em] text-[#5f6368]">
                        {contacts.length
                          ? "Try another search or filter."
                          : "Add contacts in CRM, then come back to build an audience."}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {error ? (
                <p role="alert" className="mt-4 text-[13px] leading-5 text-[#b3261e]">
                  {error}
                </p>
              ) : null}
            </div>

            <footer className="flex items-center justify-end gap-3 border-t border-[#dadce0] px-6 py-4 sm:px-8">
              <Dialog.Close
                disabled={saving}
                className="inline-flex h-10 items-center justify-center rounded-full border border-[#dadce0] bg-transparent px-6 text-[14px] font-medium text-[#1a73e8] transition hover:border-[#1a73e8] hover:bg-[#f8f9fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8] disabled:opacity-50"
              >
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                disabled={saving || !name.trim() || selectedIds.size === 0}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#1a73e8] px-6 text-[14px] font-medium text-white transition hover:bg-[#1967d2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {saving ? "Saving…" : audience ? "Save audience" : "Create audience"}
              </button>
            </footer>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function ContactStatus({ contact }: { contact: NewsletterContactOption }) {
  if (!contact.email?.trim()) {
    return (
      <span className="hidden shrink-0 rounded-full bg-[#f1f3f4] px-2.5 py-1 text-[11px] tracking-[0.036em] text-[#5f6368] sm:inline">
        No email
      </span>
    );
  }
  if (contact.emailMarketingStatus === "subscribed") {
    return (
      <span className="hidden shrink-0 rounded-full bg-[#e6f4ea] px-2.5 py-1 text-[11px] tracking-[0.036em] text-[#137333] sm:inline">
        Subscribed
      </span>
    );
  }
  const label = statusLabel(contact.emailMarketingStatus);
  return (
    <span className="hidden shrink-0 rounded-full bg-[#fef7e0] px-2.5 py-1 text-[11px] tracking-[0.036em] text-[#7a5d00] sm:inline">
      {label}
    </span>
  );
}

function contactName(contact: NewsletterContactOption) {
  return (
    `${contact.firstName} ${contact.lastName}`.trim() ||
    contact.email ||
    "Unnamed contact"
  );
}

function contactInitials(contact: NewsletterContactOption) {
  const initials = `${contact.firstName[0] ?? ""}${contact.lastName[0] ?? ""}`;
  return initials.toUpperCase() || "?";
}

function statusLabel(status: string) {
  if (!status || status === "unknown") return "Ready on send";
  return status[0].toUpperCase() + status.slice(1);
}
