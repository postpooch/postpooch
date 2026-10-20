import Link from "next/link";

/**
 * Campaigns starter panel — same quiet empty-state language as social projects.
 */
export function NewsletterCampaignsPanel() {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-[12px] font-medium tracking-[-0.01em] text-pp-stone">
        Newest first
      </p>

      <div className="rounded-2xl border border-dashed border-pp-sand px-5 py-14 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-[10px] bg-pp-mist text-pp-teal shadow-card-sm ring-1 ring-pp-sand/80">
          <CampaignIcon className="size-5" />
        </div>
        <h2 className="mt-5 text-sm font-semibold text-pp-ink">
          No campaigns yet
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
          Pick a template to start your first draft. Scheduled and sent emails
          will live here.
        </p>
        <Link
          href="/dashboard/newsletter"
          className="mt-6 inline-flex h-9 items-center justify-center rounded-[10px] bg-pp-teal px-4 text-xs font-semibold tracking-[-0.01em] text-pp-white transition hover:bg-pp-teal-dark active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pp-teal"
        >
          Browse templates
        </Link>
      </div>
    </div>
  );
}

function CampaignIcon({ className }: { className?: string }) {
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
      <path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5v-9Z" />
      <path d="M12 12v8" />
      <path d="M4 7.5 12 12l8-4.5" />
    </svg>
  );
}
