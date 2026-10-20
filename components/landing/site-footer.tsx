import { Wordmark } from "./wordmark";

const COLUMNS: { heading: string; links: string[] }[] = [
  {
    heading: "Product",
    links: ["How it works", "Templates", "Pricing", "Analytics"],
  },
  {
    heading: "Company",
    links: ["About", "Contact", "For brokerages", "Careers"],
  },
  {
    heading: "Resources",
    links: ["Help center", "Content ideas", "Market update guide", "Blog"],
  },
  {
    heading: "Legal",
    links: ["Privacy", "Terms", "Data security"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-pp-sand/80 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-xs">
            <Wordmark />
            <p className="mt-4 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
              The always-on social sidekick for real estate agents. Stay top of
              feed. Stay top of mind.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-pp-stone">
                  {column.heading}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[13px] tracking-[-0.01em] text-pp-ink/80 transition hover:text-pp-teal"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-pp-sand/70 pt-6 text-[12px] tracking-[-0.01em] text-pp-stone sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 postpooch. All rights reserved.</p>
          <p>Automated social content for real estate agents.</p>
        </div>
      </div>
    </footer>
  );
}
