"use client";

import Link from "next/link";
import { useId, useMemo, useState, type ReactNode } from "react";

import { AudienceEditorDialog } from "@/components/dashboard/newsletter/audience-editor-dialog";
import type {
  NewsletterAudience,
  NewsletterContactOption,
} from "@/lib/newsletter-audiences/types";
import { newsletterEditorHref } from "./flow-config";
import { ComposeEmailPreview } from "./email-preview";
import { ComposeFlowShell } from "./flow-shell";

type ChecklistId = "to" | "from" | "subject" | "timing" | "content";
type ChecklistStatus = "complete" | "incomplete" | "error";
type SendTiming = "now" | "later";

const PREVIEW_LIMIT = 90;

export function ComposeReviewPage({
  emailId,
  audiences,
  contacts,
  senderEmail,
  senderReady,
  contentReady,
}: {
  emailId: string;
  audiences: NewsletterAudience[];
  contacts: NewsletterContactOption[];
  senderEmail: string;
  senderReady: boolean;
  contentReady: boolean;
}) {
  const previewHintId = useId();
  const [openSection, setOpenSection] = useState<ChecklistId | null>("to");
  const [fromName, setFromName] = useState("Alex");
  const [fromEmail] = useState(senderEmail);
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [audienceOptions, setAudienceOptions] = useState(audiences);
  const [selectedAudienceIds, setSelectedAudienceIds] = useState<string[]>([]);
  const [audienceDialogOpen, setAudienceDialogOpen] = useState(false);
  const [timing, setTiming] = useState<SendTiming>("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [sendNotice, setSendNotice] = useState<string | null>(null);
  const [testNotice, setTestNotice] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [queued, setQueued] = useState(false);
  const [retryCampaignId, setRetryCampaignId] = useState<string | null>(null);

  const selectedRecipientCount = audienceOptions
    .filter((audience) => selectedAudienceIds.includes(audience.id))
    .reduce((total, audience) => total + audience.contactCount, 0);
  const fromReady =
    senderReady && fromName.trim().length > 0 && fromEmail.trim().length > 0;
  const subjectReady = subject.trim().length > 0;
  const recipientsReady =
    selectedAudienceIds.length > 0 && selectedRecipientCount > 0;
  const timingReady = timing === "now" || scheduledAt.trim().length > 0;

  const statuses = useMemo<Record<ChecklistId, ChecklistStatus>>(
    () => ({
      to: recipientsReady ? "complete" : "incomplete",
      from: fromReady ? "complete" : "incomplete",
      subject: subjectReady ? "complete" : "incomplete",
      timing: timingReady ? "complete" : "error",
      content: contentReady ? "complete" : "incomplete",
    }),
    [contentReady, fromReady, recipientsReady, subjectReady, timingReady],
  );

  const items: { id: ChecklistId; ready: boolean }[] = [
    { id: "to", ready: recipientsReady },
    { id: "from", ready: fromReady },
    { id: "subject", ready: subjectReady },
    { id: "timing", ready: timingReady },
    { id: "content", ready: contentReady },
  ];
  const completeCount = items.filter((item) => item.ready).length;
  const allReady = completeCount === items.length;
  const firstIncomplete = items.find((item) => !item.ready)?.id ?? null;

  const recipientSummary = selectedAudienceIds.length > 0
    ? `${selectedAudienceIds.length} audience${selectedAudienceIds.length === 1 ? "" : "s"} · ${selectedRecipientCount} eligible contacts before deduplication`
    : null;
  const fromSummary = fromReady
    ? `${fromName.trim()} · ${fromEmail.trim()}`
    : "Who is this coming from?";
  const subjectSummary = subjectReady
    ? subject.trim()
    : "What will they see in the inbox?";
  const timingSummary =
    timing === "now"
      ? "Send now"
      : scheduledAt
        ? formatScheduledLabel(scheduledAt)
        : "Choose a send time";

  function toggleSection(id: ChecklistId) {
    setOpenSection((current) => (current === id ? null : id));
    setSendNotice(null);
  }

  async function handlePrimaryAction() {
    if (!allReady) {
      setOpenSection(firstIncomplete);
      setSendNotice(
        firstIncomplete
          ? missingCopy(firstIncomplete)
          : "A few details still need attention.",
      );
      if (firstIncomplete) {
        document
          .getElementById(`compose-section-${firstIncomplete}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (timing === "later") {
      setSendNotice("Scheduled delivery is not part of this pipeline yet. Choose Send now.");
      return;
    }

    setSending(true);
    setSendNotice(null);
    try {
      const response = await fetch("/api/newsletter_campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          emailId,
          audienceIds: selectedAudienceIds,
          subjectLine: subject,
          previewText,
          fromName,
          fromEmail,
        }),
      });
      const body = (await response.json()) as {
        campaignId?: string;
        error?: string;
        retryable?: boolean;
      };
      if (!response.ok) {
        if (body.retryable && body.campaignId) setRetryCampaignId(body.campaignId);
        throw new Error(body.error ?? "Unable to start this campaign.");
      }
      setRetryCampaignId(null);
      setQueued(true);
      setSendNotice("Campaign queued. Recipient preparation and delivery will continue in the background.");
    } catch (error) {
      setSendNotice(error instanceof Error ? error.message : "Unable to start this campaign.");
    } finally {
      setSending(false);
    }
  }

  async function handleRetry() {
    if (!retryCampaignId || sending) return;
    setSending(true);
    setSendNotice(null);
    try {
      const response = await fetch(
        `/api/newsletter_campaigns/${encodeURIComponent(retryCampaignId)}/dispatch`,
        { method: "POST", headers: { Accept: "application/json" } },
      );
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Unable to retry this campaign.");
      setRetryCampaignId(null);
      setQueued(true);
      setSendNotice("Campaign queued. Sending will continue in the background.");
    } catch (error) {
      setSendNotice(error instanceof Error ? error.message : "Unable to retry this campaign.");
    } finally {
      setSending(false);
    }
  }

  function handleSendTest() {
    setTestNotice("Test sends aren’t connected yet.");
  }

  function handleAudienceCreated(audience: NewsletterAudience) {
    setAudienceOptions((current) =>
      [...current, audience].sort((left, right) =>
        left.name.localeCompare(right.name),
      ),
    );
    if (audience.contactCount > 0) {
      setSelectedAudienceIds((current) => [...current, audience.id]);
      setSendNotice(`${audience.name} was created and selected.`);
    } else {
      setSendNotice(
        `${audience.name} was created. Add a contact with a valid email before sending.`,
      );
    }
  }

  const primaryLabel = sending ? "Starting…" : queued ? "Queued" : "Send";

  return (
    <>
      <ComposeFlowShell
      emailId={emailId}
      primaryAction={
        <button
          type="button"
          onClick={() => void handlePrimaryAction()}
          disabled={sending || queued}
          aria-describedby={allReady ? undefined : "compose-send-hint"}
          className={[
            "inline-flex cursor-pointer items-center justify-center rounded-[10px] px-4 py-2",
            "text-[13px] font-semibold tracking-[-0.01em]",
            "transition-[background-color,transform,opacity] duration-200 ease-out",
            "active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal disabled:cursor-not-allowed disabled:opacity-65",
            allReady
              ? "bg-pp-teal text-pp-white hover:bg-pp-teal-dark"
              : "bg-pp-mist text-pp-stone hover:bg-pp-sand/80",
          ].join(" ")}
        >
          {primaryLabel}
        </button>
      }
    >
      <section className="min-w-0">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-pp-ink sm:text-[30px]">
                Review and send
              </h1>
              <span className="rounded-full border border-pp-sand bg-pp-white px-2 py-0.5 text-[11px] font-medium tracking-[-0.01em] text-pp-stone">
                Draft
              </span>
            </div>
            <p className="mt-2 max-w-xl text-[14px] leading-6 tracking-[-0.01em] text-pp-stone">
              Confirm who it’s from, who receives it, and when it should go out.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-pp-sand/80 bg-pp-white shadow-[0_20px_70px_rgba(36,25,20,0.08)]">
          <div className="px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <p
                className="text-[12px] font-medium tracking-[-0.01em] text-pp-stone"
                aria-live="polite"
              >
                {completeCount} of {items.length} ready
              </p>
              {!allReady ? (
                <p
                  id="compose-send-hint"
                  className="text-[12px] tracking-[-0.01em] text-pp-stone"
                >
                  Finish the remaining items to send.
                </p>
              ) : null}
            </div>
            <div
              className="mt-3 h-1 overflow-hidden rounded-full bg-pp-sand/80"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={items.length}
              aria-valuenow={completeCount}
              aria-label="Campaign readiness"
            >
              <div
                className="h-full rounded-full bg-pp-teal transition-[width] duration-300 ease-out"
                style={{ width: `${(completeCount / items.length) * 100}%` }}
              />
            </div>
          </div>

          <ChecklistRow
            id="to"
            title="To"
            summary={recipientSummary ?? "Who should receive this?"}
            status={statuses.to}
            open={openSection === "to"}
            onToggle={() => toggleSection("to")}
          >
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[12px] leading-5 tracking-[0.036em] text-[#5f6368]">
                  Select saved groups. Duplicate contacts are only sent once.
                </p>
                <button
                  type="button"
                  onClick={() => setAudienceDialogOpen(true)}
                  className="inline-flex h-9 items-center justify-center rounded-full border border-[#dadce0] bg-white px-4 text-[13px] font-medium text-[#1a73e8] transition hover:border-[#1a73e8] hover:bg-[#f8f9fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8]"
                >
                  + Create audience
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {audienceOptions.length === 0 ? (
                  <div className="rounded-lg bg-[#f8f9fa] px-5 py-6 text-center">
                    <p className="text-[14px] font-medium text-[#202124]">
                      No saved audiences yet
                    </p>
                    <p className="mt-1 text-[12px] leading-5 tracking-[0.036em] text-[#5f6368]">
                      Create one here by choosing people from your CRM.
                    </p>
                  </div>
                ) : (
                  audienceOptions.map((audience) => {
                    const selected = selectedAudienceIds.includes(audience.id);
                    return (
                      <button
                        key={audience.id}
                        type="button"
                        onClick={() =>
                          setSelectedAudienceIds((current) =>
                            current.includes(audience.id)
                              ? current.filter((id) => id !== audience.id)
                              : [...current, audience.id],
                          )
                        }
                        aria-pressed={selected}
                        className={[
                          "flex w-full cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition",
                          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8]",
                          "active:scale-[0.99]",
                          selected
                            ? "border-[#1a73e8] bg-[#e8f0fe]"
                            : "border-[#dadce0] bg-white hover:border-[#1a73e8] hover:bg-[#f8f9fa]",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                            selected
                              ? "bg-[#1a73e8] text-white"
                              : "bg-[#e8f0fe] text-[#1a73e8]",
                          ].join(" ")}
                        >
                          {selected ? (
                            <CheckIcon className="size-4" />
                          ) : (
                            <ActionIcon type="segments" className="size-4" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14px] font-medium tracking-[0.017em] text-[#202124]">
                            {audience.name}
                          </span>
                          <span className="mt-0.5 block text-[12px] leading-5 tracking-[0.036em] text-[#5f6368]">
                            {audience.contactCount} ready to receive · {audience.memberCount} total member{audience.memberCount === 1 ? "" : "s"}
                          </span>
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
              {selectedAudienceIds.length > 0 && selectedRecipientCount === 0 ? (
                <p
                  role="status"
                  className="mt-3 rounded-lg bg-[#fef7e0] px-3 py-2 text-[12px] leading-5 tracking-[0.036em] text-[#7a5d00]"
                >
                  This audience is selected, but none of its members currently has
                  a valid email address that can receive this campaign.
                </p>
              ) : null}
              <Link
                href="/dashboard/newsletter/audience"
                className="mt-4 inline-block rounded text-[12px] tracking-[0.036em] text-[#1a73e8] underline decoration-[#1a73e8]/35 underline-offset-2 hover:text-[#1967d2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a73e8]"
              >
                Manage all audiences
              </Link>
            </div>
          </ChecklistRow>

          <ChecklistRow
            id="from"
            title="From"
            summary={fromSummary}
            status={statuses.from}
            open={openSection === "from"}
            onToggle={() => toggleSection("from")}
          >
            <div className="space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-medium tracking-[-0.01em] text-pp-stone">
                  From name
                </span>
                <input
                  type="text"
                  value={fromName}
                  onChange={(event) => setFromName(event.target.value)}
                  autoComplete="name"
                  className="h-11 w-full rounded-[10px] border border-pp-sand bg-pp-white px-3.5 text-[14px] tracking-[-0.01em] text-pp-ink outline-none transition focus:border-pp-teal focus:ring-4 focus:ring-pp-teal/10"
                />
                <span className="mt-1.5 block text-[12px] leading-5 tracking-[-0.01em] text-pp-stone">
                  Use something recognizable, like your name or team.
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[12px] font-medium tracking-[-0.01em] text-pp-stone">
                  From email
                </span>
                <div className="relative">
                  <select
                    value={fromEmail}
                    disabled
                    className="h-11 w-full appearance-none rounded-[10px] border border-pp-sand bg-pp-white px-3.5 pr-10 text-[14px] tracking-[-0.01em] text-pp-ink outline-none transition focus:border-pp-teal focus:ring-4 focus:ring-pp-teal/10"
                  >
                    <option value={fromEmail}>
                      {fromEmail || "Sending address is being prepared"}
                    </option>
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-pp-stone" />
                </div>
              </label>

              {!senderReady ? (
                <p className="text-[12px] leading-5 tracking-[-0.01em] text-pp-stone">
                  Your private sending address is being verified. Sending will unlock automatically when it is ready.
                </p>
              ) : null}

              <p className="text-[12px] leading-5 tracking-[-0.01em] text-pp-stone">
                Prefer a different address?{" "}
                <Link
                  href="/dashboard/newsletter/audience"
                  className="font-medium text-pp-teal underline decoration-pp-teal/30 underline-offset-2 transition hover:decoration-pp-teal"
                >
                  Manage senders
                </Link>
                .
              </p>
            </div>
          </ChecklistRow>

          <ChecklistRow
            id="subject"
            title="Subject"
            summary={subjectSummary}
            status={statuses.subject}
            open={openSection === "subject"}
            onToggle={() => toggleSection("subject")}
          >
            <div className="space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-medium tracking-[-0.01em] text-pp-stone">
                  Subject line
                </span>
                <div className="relative">
                  <input
                    type="text"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    placeholder="Something your clients will open…"
                    className="h-11 w-full rounded-[10px] border border-pp-sand bg-pp-white py-2.5 pr-11 pl-3.5 text-[14px] tracking-[-0.01em] text-pp-ink outline-none transition placeholder:text-pp-stone/55 focus:border-pp-teal focus:ring-4 focus:ring-pp-teal/10"
                  />
                  <span
                    className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-pp-stone/60"
                    aria-hidden
                  >
                    <EmojiHintIcon className="size-4" />
                  </span>
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 inline-flex items-center gap-1.5 text-[12px] font-medium tracking-[-0.01em] text-pp-stone">
                  Preview text
                  <span
                    title="Shown next to the subject in most inboxes"
                    aria-describedby={previewHintId}
                    className="inline-flex size-4 items-center justify-center rounded-full border border-pp-sand text-[9px] font-semibold text-pp-stone"
                  >
                    i
                  </span>
                </span>
                <span id={previewHintId} className="sr-only">
                  Shown next to the subject in most inboxes.
                </span>
                <div className="relative">
                  <textarea
                    value={previewText}
                    onChange={(event) =>
                      setPreviewText(event.target.value.slice(0, PREVIEW_LIMIT))
                    }
                    rows={3}
                    maxLength={PREVIEW_LIMIT}
                    placeholder="A short line that appears beside the subject…"
                    className="w-full resize-none rounded-[10px] border border-pp-sand bg-pp-white px-3.5 py-2.5 pb-8 text-[14px] leading-5 tracking-[-0.01em] text-pp-ink outline-none transition placeholder:text-pp-stone/55 focus:border-pp-teal focus:ring-4 focus:ring-pp-teal/10"
                  />
                  <span className="pointer-events-none absolute right-3 bottom-2.5 text-[11px] font-medium tabular-nums text-pp-stone">
                    {previewText.length} / {PREVIEW_LIMIT}
                  </span>
                </div>
              </label>
            </div>
          </ChecklistRow>

          <ChecklistRow
            id="timing"
            title="Send time"
            summary={timingSummary}
            status={statuses.timing}
            open={openSection === "timing"}
            onToggle={() => toggleSection("timing")}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(
                [
                  {
                    id: "now" as const,
                    label: "Send now",
                    detail: "Start sending as soon as you confirm.",
                  },
                  {
                    id: "later" as const,
                    label: "Schedule",
                    detail: "Coming later. This pipeline currently supports Send now.",
                  },
                ] as const
              ).map((option) => {
                const selected = timing === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => option.id === "now" && setTiming(option.id)}
                    disabled={option.id === "later"}
                    aria-pressed={selected}
                    className={[
                      "cursor-pointer rounded-[12px] border px-4 py-3.5 text-left transition",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
                      "active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55",
                      selected
                        ? "border-pp-teal bg-pp-cream/60 shadow-card-sm"
                        : "border-pp-sand bg-pp-white hover:border-pp-stone/40",
                    ].join(" ")}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-semibold tracking-[-0.01em] text-pp-ink">
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="flex size-5 items-center justify-center rounded-full bg-pp-teal text-pp-white">
                          <CheckIcon className="size-3" />
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-[12px] leading-5 tracking-[-0.01em] text-pp-stone">
                      {option.detail}
                    </span>
                  </button>
                );
              })}
            </div>

            {timing === "later" ? (
              <label className="mt-5 block">
                <span className="mb-1.5 block text-[12px] font-medium tracking-[-0.01em] text-pp-stone">
                  Send date & time
                </span>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(event) => setScheduledAt(event.target.value)}
                  className="h-11 w-full rounded-[10px] border border-pp-sand bg-pp-white px-3.5 text-[14px] tracking-[-0.01em] text-pp-ink outline-none transition focus:border-pp-teal focus:ring-4 focus:ring-pp-teal/10"
                />
                {!scheduledAt ? (
                  <span className="mt-1.5 block text-[12px] leading-5 tracking-[-0.01em] text-pp-coral">
                    Choose when this should go out.
                  </span>
                ) : null}
              </label>
            ) : (
              <p className="mt-4 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                Your email will begin sending{" "}
                <span className="font-semibold text-pp-ink">right away</span>{" "}
                after you confirm.
              </p>
            )}
          </ChecklistRow>

          <ChecklistRow
            id="content"
            title="Content"
            summary="Your design is ready"
            status={statuses.content}
            open={false}
            expandable={false}
            action={
              <Link
                href={newsletterEditorHref(emailId)}
                className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-pp-sand bg-pp-white px-3 py-2 text-[13px] font-semibold tracking-[-0.01em] text-pp-ink transition hover:bg-pp-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
              >
                Edit design
              </Link>
            }
          />
        </div>

        {sendNotice ? (
          <p
            role="status"
            className="mt-4 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone"
          >
            {sendNotice}
          </p>
        ) : null}
        {retryCampaignId ? (
          <button
            type="button"
            onClick={() => void handleRetry()}
            disabled={sending}
            className="mt-3 inline-flex h-9 items-center justify-center rounded-[10px] bg-pp-teal px-4 text-xs font-semibold text-white disabled:opacity-65"
          >
            {sending ? "Retrying…" : "Retry sending"}
          </button>
        ) : null}
      </section>

      <aside className="mx-auto w-full min-w-0 max-w-[340px] lg:sticky lg:top-8 lg:mx-0 lg:max-w-none">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-pp-stone">
            Preview
          </p>
          <button
            type="button"
            onClick={handleSendTest}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-1 text-[13px] font-medium tracking-[-0.01em] text-pp-teal transition hover:text-pp-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
          >
            <PaperPlaneIcon className="size-3.5" />
            Send a test
          </button>
        </div>
        <ComposeEmailPreview
          fromName={fromName}
          fromEmail={fromEmail}
          subjectPreview={subject}
          previewText={previewText}
        />
        {testNotice ? (
          <p
            role="status"
            className="mt-3 text-[12px] leading-5 tracking-[-0.01em] text-pp-stone"
          >
            {testNotice}
          </p>
        ) : null}
      </aside>
      </ComposeFlowShell>
      <AudienceEditorDialog
        key={audienceDialogOpen ? "new-open" : "closed"}
        open={audienceDialogOpen}
        onOpenChange={setAudienceDialogOpen}
        contacts={contacts}
        onSaved={handleAudienceCreated}
      />
    </>
  );
}

function ChecklistRow({
  id,
  title,
  summary,
  status,
  open,
  onToggle,
  expandable = true,
  action,
  children,
}: {
  id: ChecklistId;
  title: string;
  summary: string;
  status: ChecklistStatus;
  open: boolean;
  onToggle?: () => void;
  expandable?: boolean;
  action?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      id={`compose-section-${id}`}
      className="border-t border-pp-sand/70"
    >
      <div className="flex items-start gap-3 px-5 py-4 sm:gap-4 sm:px-6 sm:py-5">
        <StatusMark status={status} />
        <div className="min-w-0 flex-1">
          {expandable ? (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={open}
              aria-controls={`compose-section-${id}-panel`}
              className="flex w-full cursor-pointer items-start justify-between gap-3 rounded-sm text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
            >
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
                  {title}
                </span>
                <span className="mt-0.5 block truncate text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                  {summary}
                </span>
              </span>
              <ChevronDownIcon
                className={[
                  "mt-1 size-4 shrink-0 text-pp-stone transition-transform duration-200",
                  open ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
                  {title}
                </p>
                <p className="mt-0.5 truncate text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                  {summary}
                </p>
              </div>
              {action}
            </div>
          )}

          {expandable && open && children ? (
            <div id={`compose-section-${id}-panel`} className="pt-5">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatusMark({ status }: { status: ChecklistStatus }) {
  if (status === "complete") {
    return (
      <span
        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-pp-teal text-pp-white"
        aria-label="Complete"
      >
        <CheckIcon className="size-3.5" />
      </span>
    );
  }

  if (status === "error") {
    return (
      <span
        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-pp-coral text-pp-white"
        aria-label="Needs attention"
      >
        <AlertIcon className="size-3.5" />
      </span>
    );
  }

  return (
    <span
      className="mt-0.5 size-6 shrink-0 rounded-full border-[1.5px] border-pp-sand"
      aria-label="Incomplete"
    />
  );
}

function missingCopy(id: ChecklistId) {
  switch (id) {
    case "to":
      return "Choose who should receive this email.";
    case "from":
      return "Add a sender name and email.";
    case "subject":
      return "Add a subject line before sending.";
    case "timing":
      return "Choose when this should go out.";
    case "content":
      return "Open the editor to finish the design.";
  }
}

function formatScheduledLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Scheduled";
  return `Scheduled for ${date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 12 4 4 8-8" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 8v5" />
      <circle cx="12" cy="16.2" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function EmojiHintIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <path d="M9.5 14.5s1.2 1.5 2.5 1.5 2.5-1.5 2.5-1.5" />
    </svg>
  );
}

function PaperPlaneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m4 11 15.5-6.5L15 20l-3.5-6L4 11Z" />
      <path d="m11.5 14 3.5-8.5" />
    </svg>
  );
}

function ActionIcon({
  type,
  className,
}: {
  type: "segments" | "people" | "upload";
  className?: string;
}) {
  if (type === "segments") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="16" r="3" />
        <path d="M14.5 9.5 9.5 14.5" />
      </svg>
    );
  }

  if (type === "people") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 18.5c.8-2.6 2.8-4 5.5-4s4.7 1.4 5.5 4" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M20.5 18.5c-.5-1.8-1.7-3-3.5-3.4" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V9l-5-6Z" />
      <path d="M14 3v5h5" />
      <path d="M12 12v5" />
      <path d="m9.5 14.5 2.5-2.5 2.5 2.5" />
    </svg>
  );
}
