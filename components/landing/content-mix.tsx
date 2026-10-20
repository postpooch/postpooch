const MIX = [
  {
    label: "Expertise",
    share: 40,
    color: "bg-pp-teal",
    barText: "text-white",
    text: "text-pp-teal",
    examples: "Buyer tips, market context, checklists",
  },
  {
    label: "Property",
    share: 30,
    color: "bg-pp-caramel",
    barText: "text-pp-ink",
    text: "text-pp-cocoa",
    examples: "Just listed, open houses, just sold",
  },
  {
    label: "Community",
    share: 20,
    color: "bg-pp-blue",
    barText: "text-white",
    text: "text-pp-blue",
    examples: "Neighborhood spotlights, local events",
  },
  {
    label: "Proof & invites",
    share: 10,
    color: "bg-pp-peach",
    barText: "text-pp-ink",
    text: "text-pp-bark",
    examples: "Testimonials, consultations, results",
  },
];

export function ContentMix() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-[30px] border border-pp-sand/70 bg-gradient-to-br from-pp-white via-pp-white to-pp-mist/65 px-6 py-10 shadow-[0_20px_70px_rgba(36,25,20,0.08)] sm:px-9 sm:py-12">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pp-teal-dark/90">
                The content mix
              </p>
              <h2 className="mt-3 text-[31px] font-semibold leading-[1.05] tracking-[-0.03em] text-pp-ink sm:text-[45px]">
                Promote your listings without posting only listings
              </h2>
              <p className="mt-4 text-[16px] leading-7 tracking-[-0.01em] text-pp-stone">
                People follow agents who are useful between transactions. postpooch
                plans a balanced feed that shows up like the local expert you
                already are — and keeps the listings coming.
              </p>
            </div>

            <div className="rounded-[18px] bg-pp-cream/80 p-6 ring-1 ring-pp-sand/70 sm:p-8">
              <div
                className="flex h-10 w-full overflow-hidden rounded-[10px]"
                role="img"
                aria-label="Content mix: 40 percent expertise, 30 percent property, 20 percent community, 10 percent proof and invites"
              >
                {MIX.map((segment) => (
                  <div
                    key={segment.label}
                    className={`${segment.color} flex items-center justify-center`}
                    style={{ width: `${segment.share}%` }}
                  >
                    <span
                      className={`hidden text-[11px] font-semibold tracking-[-0.01em] sm:block ${segment.barText}`}
                    >
                      {segment.share}%
                    </span>
                  </div>
                ))}
              </div>

              <ul className="mt-8 space-y-4">
                {MIX.map((segment) => (
                  <li key={segment.label} className="flex items-start gap-3.5">
                    <span
                      aria-hidden
                      className={`mt-1.5 size-2.5 shrink-0 rounded-full ${segment.color}`}
                    />
                    <div>
                      <p className="text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
                        {segment.label}
                        <span className={`ml-2 font-semibold ${segment.text}`}>
                          {segment.share}%
                        </span>
                      </p>
                      <p className="mt-0.5 text-[13px] tracking-[-0.01em] text-pp-stone">
                        {segment.examples}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
