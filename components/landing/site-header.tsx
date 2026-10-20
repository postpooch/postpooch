import Link from "next/link";
import { Wordmark } from "./wordmark";

const NAV_ITEMS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Templates", href: "#templates" },
  { label: "Product", href: "#product" },
  { label: "Pricing", href: "#pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-pp-sand/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Wordmark />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-2.5 py-1.5 text-sm font-medium tracking-[-0.01em] text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-lg px-2.5 py-1.5 text-sm font-medium tracking-[-0.01em] text-pp-stone transition hover:bg-pp-mist hover:text-pp-ink sm:block"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center rounded-[10px] bg-pp-teal px-4 text-xs font-semibold tracking-[-0.01em] text-white transition hover:bg-pp-teal-dark"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
