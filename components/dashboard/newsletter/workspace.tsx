"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import {
  Clock3,
  FileText,
  MailPlus,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UsersRound,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import type {
  NewsletterAudience,
  NewsletterContactOption,
} from "@/lib/newsletter-audiences/types";
import type { NewsletterCampaignListItem } from "@/lib/newsletter-campaigns/store";
import type { NewsletterTemplateCard } from "@/lib/newsletter-templates/types";
import { NewsletterAudiencePanel } from "./audience-panel";
import { NewsletterTemplatesGallery } from "./templates-gallery";

type NewsletterWorkspaceProps = {
  campaigns: NewsletterCampaignListItem[];
  audiences: NewsletterAudience[];
  contacts: NewsletterContactOption[];
  initialTemplates: NewsletterTemplateCard[];
  initialNextCursor: string | null;
  templatesError?: string;
};

function campaignStatus(status: NewsletterCampaignListItem["status"]) {
  if (status === "draft") return { label: "Draft", tone: "bg-pp-stone" };
  if (status === "completed") return { label: "Sent", tone: "bg-pp-teal" };
  if (status === "cancelled") return { label: "Cancelled", tone: "bg-pp-stone" };
  if (status === "failed") return { label: "Needs attention", tone: "bg-pp-coral" };
  return { label: "Sending", tone: "bg-pp-caramel" };
}

function formatCampaignDate(campaign: NewsletterCampaignListItem) {
  const date = new Date(campaign.sendTime ?? campaign.createdAt);
  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  }).format(date);
}

function CampaignEntry({ campaign }: { campaign: NewsletterCampaignListItem }) {
  const status = campaignStatus(campaign.status);
  const content = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-pp-stone">
          <span className={`size-1.5 rounded-full ${status.tone}`} />
          {status.label}
        </span>
        <time className="text-[10px] tabular-nums text-pp-stone">
          {formatCampaignDate(campaign)}
        </time>
      </div>
      <p className="mt-2 line-clamp-2 text-[13px] font-semibold leading-5 text-pp-ink">
        {campaign.subjectLine}
      </p>
      {campaign.status === "completed" && campaign.totalSendCount ? (
        <p className="mt-1 text-[10px] text-pp-stone">
          {campaign.sentCount.toLocaleString()} of {campaign.totalSendCount.toLocaleString()} delivered
        </p>
      ) : null}
    </>
  );

  if (campaign.status === "draft") {
    return (
      <Link
        href={`/dashboard/newsletter/editor?email=${encodeURIComponent(campaign.emailId)}`}
        className="block rounded-[12px] border border-transparent px-3 py-3 transition hover:border-pp-sand hover:bg-pp-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-pp-teal"
      >
        {content}
      </Link>
    );
  }

  return <div className="px-3 py-3">{content}</div>;
}

function CampaignSidebar({
  campaigns,
  onCreate,
  onClose,
  onCollapse,
}: {
  campaigns: NewsletterCampaignListItem[];
  onCreate: () => void;
  onClose?: () => void;
  onCollapse?: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 w-[284px] flex-col bg-[#f7e9dd]">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div>
          <p className="text-[16px] font-semibold tracking-[-0.02em] text-pp-ink">
            Campaigns
          </p>
          <p className="mt-0.5 text-[11px] text-pp-stone">
            Drafts and recent sends
          </p>
        </div>
        <button
          type="button"
          onClick={onClose ?? onCollapse}
          className="inline-flex size-9 items-center justify-center rounded-[10px] text-pp-stone transition hover:bg-pp-white hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
        >
          {onClose ? (
            <X className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
          <span className="sr-only">
            {onClose ? "Close campaigns" : "Collapse campaigns"}
          </span>
        </button>
      </div>

      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={onCreate}
          className="flex h-11 w-full items-center gap-3 rounded-[11px] bg-pp-teal px-4 text-left text-[12px] font-semibold text-pp-white transition hover:bg-pp-teal-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
        >
          <MailPlus className="size-4" />
          Create a campaign
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-pp-sand/80">
        <p className="px-5 pt-5 pb-2 text-[11px] font-semibold text-pp-stone">
          Newest first
        </p>
        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4 [scrollbar-color:var(--pp-sand)_transparent] [scrollbar-width:thin]">
          {campaigns.length ? (
            <ol className="space-y-1">
              {campaigns.map((campaign) => (
                <li key={campaign.emailId}>
                  <CampaignEntry campaign={campaign} />
                </li>
              ))}
            </ol>
          ) : (
            <div className="px-3 py-6">
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-pp-white text-pp-teal ring-1 ring-pp-sand/70">
                <FileText className="size-4" />
              </span>
              <p className="mt-3 text-[13px] font-semibold text-pp-ink">
                No campaigns yet
              </p>
              <p className="mt-1 text-[11px] leading-4 text-pp-stone">
                Choose a template and your first draft will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-pp-sand/80 px-5 py-4">
        <div className="flex items-start gap-2.5 text-pp-stone">
          <Clock3 className="mt-0.5 size-3.5 shrink-0" />
          <p className="text-[10px] leading-4">
            Drafts stay here automatically when you finish later.
          </p>
        </div>
      </div>
    </div>
  );
}

function CampaignRail({
  onExpand,
  onCreate,
}: {
  onExpand: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="flex h-full w-[72px] flex-col items-center bg-[#f7e9dd] px-2 py-4">
      <button
        type="button"
        onClick={onExpand}
        className="inline-flex size-10 items-center justify-center rounded-[10px] text-pp-stone transition hover:bg-pp-white hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
      >
        <PanelLeftOpen className="size-[18px]" />
        <span className="sr-only">Expand campaigns</span>
      </button>

      <button
        type="button"
        onClick={onCreate}
        className="group mt-5 flex w-full flex-col items-center gap-1.5 rounded-[10px] px-1 py-2 text-[10px] font-medium leading-tight text-pp-stone transition hover:bg-pp-white hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-pp-teal text-pp-white transition group-hover:bg-pp-teal-dark">
          <MailPlus className="size-[17px]" />
        </span>
        Create
      </button>

      <div className="my-3 h-px w-8 bg-pp-sand" />

      <button
        type="button"
        onClick={onExpand}
        className="flex w-full flex-col items-center gap-1.5 rounded-[10px] bg-pp-teal/10 px-1 py-2 text-[10px] font-semibold leading-tight text-pp-teal transition hover:bg-pp-teal/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
      >
        <FileText className="size-[18px]" />
        Campaigns
      </button>
    </div>
  );
}

function WorkspaceDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-pp-ink/40 data-[state=closed]:animate-[pp-dialog-overlay-out_160ms_ease-in_both] data-[state=open]:animate-[pp-dialog-overlay-in_180ms_ease-out_both]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[71] flex max-h-[min(90dvh,900px)] w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[24px] bg-pp-white shadow-[0_24px_80px_rgba(36,25,20,0.2)] ring-1 ring-pp-sand outline-none data-[state=closed]:animate-[pp-dialog-out_160ms_ease-in_both] data-[state=open]:animate-[pp-dialog-in_220ms_cubic-bezier(0.22,1,0.36,1)_both]">
          <div className="flex shrink-0 items-start justify-between gap-5 border-b border-pp-sand/80 px-5 py-4 sm:px-7 sm:py-5">
            <div>
              <Dialog.Title className="text-[22px] font-semibold tracking-[-0.025em] text-pp-ink">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-[13px] leading-5 text-pp-stone">
                {description}
              </Dialog.Description>
            </div>
            <Dialog.Close className="inline-flex size-10 shrink-0 items-center justify-center rounded-[11px] text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function NewsletterWorkspace({
  campaigns,
  audiences,
  contacts,
  initialTemplates,
  initialNextCursor,
  templatesError,
}: NewsletterWorkspaceProps) {
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [workspaceAudiences, setWorkspaceAudiences] = useState(audiences);

  function focusTemplates() {
    setMobileSidebarOpen(false);
    const search = document.getElementById("newsletter-search");
    search?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => search?.focus(), 300);
  }

  function openSidebar() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setDesktopSidebarOpen(true);
    } else {
      setMobileSidebarOpen(true);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100dvh-3.75rem)] overflow-hidden bg-pp-cream lg:min-h-dvh">
      <aside
        className={[
          "hidden shrink-0 overflow-hidden transition-[width,border-color] duration-200 ease-out lg:block",
          desktopSidebarOpen
            ? "w-[284px] border-r border-pp-sand"
            : "w-[72px] border-r border-pp-sand",
        ].join(" ")}
      >
        {desktopSidebarOpen ? (
          <CampaignSidebar
            campaigns={campaigns}
            onCreate={focusTemplates}
            onCollapse={() => setDesktopSidebarOpen(false)}
          />
        ) : (
          <CampaignRail
            onCreate={focusTemplates}
            onExpand={() => setDesktopSidebarOpen(true)}
          />
        )}
      </aside>

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close campaigns"
            className="absolute inset-0 bg-pp-ink/30"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(88vw,320px)] border-r border-pp-sand">
            <CampaignSidebar
              campaigns={campaigns}
              onCreate={focusTemplates}
              onClose={() => setMobileSidebarOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-[68px] shrink-0 items-center justify-between gap-4 border-b border-pp-sand/80 bg-pp-white/70 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={openSidebar}
              className={[
                "size-10 shrink-0 items-center justify-center rounded-[10px] text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal",
                "inline-flex lg:hidden",
              ].join(" ")}
            >
              <Menu className="size-4" />
              <span className="sr-only">Open campaigns</span>
            </button>
            <div className="min-w-0">
              <p className="truncate text-[16px] font-semibold tracking-[-0.02em] text-pp-ink">
                Newsletter
              </p>
              <p className="hidden text-[11px] text-pp-stone sm:block">
                Choose a starting point for your next email
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAudienceOpen(true)}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[11px] border border-pp-sand bg-pp-white px-3 text-[12px] font-semibold text-pp-ink transition hover:border-pp-teal/40 hover:bg-pp-mist focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal sm:px-4"
          >
            <UsersRound className="size-4 text-pp-teal" />
            Audience
            <span className="text-[10px] font-medium text-pp-stone">
              {workspaceAudiences.length}
            </span>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1480px] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
            <NewsletterTemplatesGallery
              initialTemplates={initialTemplates}
              initialNextCursor={initialNextCursor}
              templatesError={templatesError}
            />
          </div>
        </div>
      </main>

      <WorkspaceDialog
        open={audienceOpen}
        onOpenChange={setAudienceOpen}
        title="Audience"
        description="Create and manage the contact groups you send newsletters to."
      >
        <NewsletterAudiencePanel
          initialAudiences={workspaceAudiences}
          contacts={contacts}
          embedded
          onAudiencesChange={setWorkspaceAudiences}
        />
      </WorkspaceDialog>
    </div>
  );
}
