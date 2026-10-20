"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Edit3, Plus, Search, Trash2, UsersRound, X } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

import type {
  NewsletterAudience,
  NewsletterContactOption,
} from "@/lib/newsletter-audiences/types";
import { AudienceEditorDialog } from "./audience-editor-dialog";

export function NewsletterAudiencePanel({
  initialAudiences,
  contacts,
  embedded = false,
  onAudiencesChange,
}: {
  initialAudiences: NewsletterAudience[];
  contacts: NewsletterContactOption[];
  embedded?: boolean;
  onAudiencesChange?: (audiences: NewsletterAudience[]) => void;
}) {
  const [audiences, setAudiences] = useState(initialAudiences);
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingAudience, setEditingAudience] =
    useState<NewsletterAudience | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<NewsletterAudience | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [notice, setNotice] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visibleAudiences = useMemo(
    () =>
      audiences.filter((audience) =>
        audience.name.toLowerCase().includes(deferredQuery),
      ),
    [audiences, deferredQuery],
  );
  const readyMemberships = audiences.reduce(
    (total, audience) => total + audience.contactCount,
    0,
  );

  function openCreate() {
    setEditingAudience(null);
    setEditorOpen(true);
    setNotice("");
  }

  function openEdit(audience: NewsletterAudience) {
    setEditingAudience(audience);
    setEditorOpen(true);
    setNotice("");
  }

  function handleSaved(saved: NewsletterAudience) {
    const exists = audiences.some((audience) => audience.id === saved.id);
    const next = (
      exists
        ? audiences.map((audience) =>
            audience.id === saved.id ? saved : audience,
          )
        : [...audiences, saved]
    ).sort((left, right) => left.name.localeCompare(right.name));
    setAudiences(next);
    onAudiencesChange?.(next);
    setNotice(
      editingAudience
        ? `${saved.name} was updated.`
        : `${saved.name} is ready to use.`,
    );
  }

  async function confirmDelete() {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setDeleteError("");
    setNotice("");
    try {
      const response = await fetch(
        `/api/newsletter_audiences/${encodeURIComponent(deleteTarget.id)}`,
        { method: "DELETE", headers: { Accept: "application/json" } },
      );
      if (!response.ok) {
        const result = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(result.error ?? "Unable to delete that audience.");
      }
      const deletedName = deleteTarget.name;
      const next = audiences.filter(
        (audience) => audience.id !== deleteTarget.id,
      );
      setAudiences(next);
      onAudiencesChange?.(next);
      setDeleteTarget(null);
      setDeleteError("");
      setNotice(`${deletedName} was deleted.`);
    } catch (reason) {
      setDeleteError(
        reason instanceof Error
          ? reason.message
          : "Unable to delete that audience.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="font-sans text-[#202124]">
      {embedded ? (
        <section className="flex flex-col justify-between gap-4 rounded-[18px] bg-[#f8f9fa] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-[#e8f0fe] text-[#1a73e8]">
              <UsersRound className="size-5" strokeWidth={1.7} />
            </span>
            <div>
              <p className="text-[15px] font-medium text-[#202124]">
                {audiences.length} saved audience{audiences.length === 1 ? "" : "s"}
              </p>
              <p className="mt-0.5 text-[12px] text-[#5f6368]">
                {readyMemberships.toLocaleString()} ready-to-send membership{readyMemberships === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#1a73e8] px-6 text-[14px] font-medium text-white transition hover:bg-[#1967d2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8] sm:self-auto"
          >
            <Plus className="size-4" strokeWidth={1.9} />
            Create audience
          </button>
        </section>
      ) : (
      <section className="rounded-[28px] bg-[#f8f9fa] px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-[15px] font-medium text-[#3c4043]">
              <span className="grid size-8 place-items-center rounded-lg bg-[#e8f0fe] text-[#1a73e8]">
                <UsersRound className="size-[18px]" strokeWidth={1.7} />
              </span>
              Contact groups
            </div>
            <h2 className="mt-5 text-[28px] font-medium leading-[1.2] tracking-[-0.006em] text-[#202124]">
              Build audiences from your CRM
            </h2>
            <p className="mt-3 max-w-xl text-[16px] leading-[1.56] tracking-[0.017em] text-[#5f6368]">
              Create reusable groups for past clients, buyers, sellers, or any
              community you speak to regularly.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#1a73e8] px-6 text-[14px] font-medium text-white transition hover:bg-[#1967d2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8]"
          >
            <Plus className="size-4" strokeWidth={1.9} />
            Create audience
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <MetricCard label="Saved audiences" value={audiences.length} />
          <MetricCard
            label="Ready-to-send memberships"
            value={readyMemberships}
            detail="Subscribed contacts across your audiences"
          />
        </div>
      </section>
      )}

      <section className={embedded ? "mt-8" : "mt-12"}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-[22px] font-medium leading-[1.29] tracking-[-0.006em] text-[#202124]">
              Saved audiences
            </h2>
            <p className="mt-2 text-[14px] leading-6 tracking-[0.017em] text-[#5f6368]">
              Edit membership at any time. Explicit opt-outs are always excluded.
            </p>
          </div>
          {audiences.length ? (
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">Search audiences</span>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#5f6368]" strokeWidth={1.7} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search audiences"
                className="h-10 w-full rounded-full border border-[#dadce0] bg-white pr-4 pl-10 text-[14px] tracking-[0.017em] outline-none placeholder:text-[#5f6368] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#c4c6c7]/60 [&::-webkit-search-cancel-button]:hidden"
              />
            </label>
          ) : null}
        </div>

        {notice ? (
          <p
            role="status"
            className="mt-4 rounded-lg bg-[#f8f9fa] px-4 py-3 text-[13px] leading-5 tracking-[0.017em] text-[#3c4043]"
          >
            {notice}
          </p>
        ) : null}

        {audiences.length === 0 ? (
          <div className="mt-6 rounded-[24px] bg-white px-6 py-14 text-center ring-1 ring-[#dadce0]">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#e8f0fe] text-[#1a73e8]">
              <UsersRound className="size-6" strokeWidth={1.6} />
            </span>
            <h3 className="mt-5 text-[18px] font-medium text-[#202124]">
              Create your first audience
            </h3>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-6 tracking-[0.017em] text-[#5f6368]">
              Choose people already in your CRM and save them as a reusable group.
            </p>
            <button
              type="button"
              onClick={openCreate}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-[#dadce0] px-6 text-[14px] font-medium text-[#1a73e8] transition hover:border-[#1a73e8] hover:bg-[#f8f9fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8]"
            >
              Choose contacts
            </button>
          </div>
        ) : visibleAudiences.length === 0 ? (
          <div className="mt-6 rounded-[24px] bg-[#f8f9fa] px-6 py-12 text-center">
            <h3 className="text-[16px] font-medium text-[#202124]">
              No matching audiences
            </h3>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 rounded text-[14px] text-[#1a73e8] underline decoration-[#1a73e8]/35 underline-offset-2 hover:text-[#1967d2]"
            >
              Clear search
            </button>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 lg:grid-cols-2">
            {visibleAudiences.map((audience) => (
              <li
                key={audience.id}
                className="rounded-[24px] bg-white p-6 ring-1 ring-[#dadce0]"
              >
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e8f0fe] text-[#1a73e8]">
                    <UsersRound className="size-5" strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[18px] font-medium leading-7 text-[#202124]">
                      {audience.name}
                    </h3>
                    <p className="mt-1 text-[12px] leading-5 tracking-[0.036em] text-[#5f6368]">
                      {audience.memberCount} member{audience.memberCount === 1 ? "" : "s"}
                      {" · "}
                      {audience.contactCount} ready to receive
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(audience)}
                      aria-label={`Edit ${audience.name}`}
                      className="grid size-10 place-items-center rounded-full text-[#5f6368] transition hover:bg-[#f8f9fa] hover:text-[#1a73e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8]"
                    >
                      <Edit3 className="size-[18px]" strokeWidth={1.6} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteTarget(audience);
                        setDeleteError("");
                        setNotice("");
                      }}
                      aria-label={`Delete ${audience.name}`}
                      className="grid size-10 place-items-center rounded-full text-[#5f6368] transition hover:bg-[#fce8e6] hover:text-[#b3261e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8]"
                    >
                      <Trash2 className="size-[18px]" strokeWidth={1.6} />
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span
                    className={[
                      "rounded-full px-3 py-1.5 text-[11px] tracking-[0.036em]",
                      audience.contactCount
                        ? "bg-[#e6f4ea] text-[#137333]"
                        : "bg-[#fef7e0] text-[#7a5d00]",
                    ].join(" ")}
                  >
                    {audience.contactCount ? "Ready for campaigns" : "Needs a valid email contact"}
                  </span>
                  <button
                    type="button"
                    onClick={() => openEdit(audience)}
                    className="rounded text-[13px] font-medium text-[#1a73e8] underline decoration-[#1a73e8]/35 underline-offset-2 hover:text-[#1967d2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8]"
                  >
                    Manage members
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AudienceEditorDialog
        key={editorOpen ? (editingAudience?.id ?? "new-open") : "closed"}
        open={editorOpen}
        onOpenChange={(open) => {
          setEditorOpen(open);
          if (!open) setEditingAudience(null);
        }}
        audience={editingAudience}
        contacts={contacts}
        onSaved={handleSaved}
      />

      <DeleteAudienceDialog
        audience={deleteTarget}
        deleting={deleting}
        error={deleteError}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
        onDelete={() => void confirmDelete()}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail?: string;
}) {
  return (
    <div className="rounded-[24px] bg-white px-6 py-5">
      <p className="text-[12px] tracking-[0.036em] text-[#5f6368]">{label}</p>
      <p className="mt-2 text-[28px] font-medium leading-none tracking-[-0.006em] text-[#202124]">
        {value.toLocaleString()}
      </p>
      {detail ? (
        <p className="mt-2 text-[12px] leading-5 tracking-[0.036em] text-[#5f6368]">
          {detail}
        </p>
      ) : null}
    </div>
  );
}

function DeleteAudienceDialog({
  audience,
  deleting,
  error,
  onOpenChange,
  onDelete,
}: {
  audience: NewsletterAudience | null;
  deleting: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}) {
  return (
    <Dialog.Root open={Boolean(audience)} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-[#202124]/50 data-[state=closed]:animate-[pp-dialog-overlay-out_160ms_ease-in_both] data-[state=open]:animate-[pp-dialog-overlay-in_180ms_ease-out_both]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[81] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 font-sans text-[#202124] outline-none sm:p-8">
          <div className="flex items-start justify-between gap-5">
            <div>
              <Dialog.Title className="text-[22px] font-medium leading-[1.29] tracking-[-0.006em]">
                Delete {audience?.name}?
              </Dialog.Title>
              <Dialog.Description className="mt-3 text-[14px] leading-6 tracking-[0.017em] text-[#5f6368]">
                The group will be removed, but its CRM contacts will stay in your account.
                Audiences used by a campaign are protected from deletion.
              </Dialog.Description>
              {error ? (
                <p role="alert" className="mt-3 text-[13px] leading-5 text-[#b3261e]">
                  {error}
                </p>
              ) : null}
            </div>
            <Dialog.Close
              disabled={deleting}
              className="grid size-10 shrink-0 place-items-center rounded-full text-[#5f6368] transition hover:bg-[#f8f9fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8] disabled:opacity-50"
            >
              <X className="size-5" strokeWidth={1.7} />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>
          <div className="mt-7 flex justify-end gap-3">
            <Dialog.Close
              disabled={deleting}
              className="inline-flex h-10 items-center rounded-full border border-[#dadce0] px-6 text-[14px] font-medium text-[#1a73e8] hover:border-[#1a73e8] hover:bg-[#f8f9fa] disabled:opacity-50"
            >
              Keep audience
            </Dialog.Close>
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex h-10 items-center rounded-full bg-[#b3261e] px-6 text-[14px] font-medium text-white transition hover:bg-[#8c1d18] disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
