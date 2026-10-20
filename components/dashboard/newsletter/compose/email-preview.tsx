/**
 * Static email preview stand-in for the compose review hub.
 * Keeps design context visible without needing live MJML export yet.
 */
export function ComposeEmailPreview({
  fromName,
  fromEmail,
  subjectPreview,
  previewText,
}: {
  fromName?: string;
  fromEmail?: string;
  subjectPreview?: string;
  previewText?: string;
}) {
  const fromLine = [fromName?.trim(), fromEmail?.trim()]
    .filter(Boolean)
    .join(" · ");
  const subject = subjectPreview?.trim();
  const snippet = previewText?.trim();

  return (
    <div className="overflow-hidden rounded-[18px] bg-pp-white shadow-[0_18px_50px_rgba(36,25,20,0.12)] ring-1 ring-pp-sand/80">
      <div className="space-y-1 border-b border-pp-sand/70 bg-pp-mist/80 px-3.5 py-2.5">
        <p className="truncate text-[11px] font-medium tracking-[-0.01em] text-pp-stone">
          {fromLine || "Your sender"}
        </p>
        <p className="truncate text-[12px] font-semibold tracking-[-0.015em] text-pp-ink">
          {subject || "Your newsletter preview"}
        </p>
        {snippet ? (
          <p className="truncate text-[11px] tracking-[-0.01em] text-pp-stone">
            {snippet}
          </p>
        ) : null}
      </div>

      <div className="bg-gradient-to-b from-pp-teal to-pp-teal-dark px-5 pb-8 pt-7 text-pp-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-pp-white/70">
          Market note
        </p>
        <p className="mt-3 font-display text-[26px] font-bold leading-[1.1] tracking-tight">
          This week in your neighborhood
        </p>
        <p className="mt-3 text-[12px] leading-5 text-pp-white/85">
          A calm roundup of listings, local shifts, and what buyers are asking.
        </p>
      </div>

      <div className="space-y-4 bg-pp-cream/60 px-4 py-5">
        <div className="overflow-hidden rounded-[12px] bg-pp-white ring-1 ring-pp-sand/70">
          <div className="flex aspect-[5/3] items-center justify-center bg-pp-mist">
            <ImagePlaceholder className="size-8 text-pp-sand" />
          </div>
          <div className="space-y-2 px-3.5 py-3">
            <div className="h-2.5 w-[72%] rounded-full bg-pp-sand/80" />
            <div className="h-2 w-full rounded-full bg-pp-mist" />
            <div className="h-2 w-[84%] rounded-full bg-pp-mist" />
          </div>
        </div>

        <div className="flex justify-center">
          <span className="inline-flex rounded-[9px] bg-pp-teal px-3.5 py-2 text-[11px] font-semibold tracking-[-0.01em] text-pp-white">
            View listings
          </span>
        </div>
      </div>
    </div>
  );
}

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="9" cy="10.5" r="1.5" />
      <path d="m7 16 3.5-3.5L14 16l2-2 3 3" />
    </svg>
  );
}
