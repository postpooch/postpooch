import Image from "next/image";
import {
  CalendarIcon,
  ChartIcon,
  ClockIcon,
  HouseIcon,
  PaletteIcon,
  PencilIcon,
  PhotoIcon,
  QueueIcon,
  CheckIcon,
} from "./icons";

const AVATAR_SRC =
  "/postpooch_web_mascot_assets/avatar/postpooch-avatar-cream-512.webp";

const SIDE_NAV = [
  { icon: HouseIcon, label: "Today", active: true },
  { icon: QueueIcon, label: "Queue", active: false },
  { icon: PencilIcon, label: "Create", active: false },
  { icon: PaletteIcon, label: "Brand", active: false },
  { icon: ChartIcon, label: "Analytics", active: false },
];

const STATS = [
  { value: "5", label: "scheduled", tone: "text-pp-teal" },
  { value: "2", label: "drafts", tone: "text-pp-ink" },
  { value: "2.4k", label: "reach this week", tone: "text-pp-teal" },
  { value: "1", label: "needs attention", tone: "text-pp-coral" },
];

type QueueItem = {
  title: string;
  meta: string;
  status: "Ready" | "Scheduled" | "Draft" | "Needs photo";
};

const QUEUE: QueueItem[] = [
  { title: "Just listed — 128 Maple Street", meta: "Instagram · Facebook", status: "Ready" },
  { title: "March market update", meta: "Thu 9:00 AM", status: "Scheduled" },
  { title: "Buyer tip checklist", meta: "Edited yesterday", status: "Draft" },
  { title: "Open house — 42 Birch Avenue", meta: "Add a photo to finish", status: "Needs photo" },
];

function StatusChip({ status }: { status: QueueItem["status"] }) {
  const styles: Record<QueueItem["status"], string> = {
    Ready: "bg-pp-teal/10 text-pp-teal",
    Scheduled: "bg-pp-mist text-pp-ink ring-1 ring-pp-sand/70",
    Draft: "bg-pp-mist text-pp-stone",
    "Needs photo": "bg-pp-coral/10 text-pp-coral",
  };
  const icons: Record<QueueItem["status"], React.ReactNode> = {
    Ready: <CheckIcon className="size-3" strokeWidth={2.5} />,
    Scheduled: <CalendarIcon className="size-3" strokeWidth={2.25} />,
    Draft: <PencilIcon className="size-3" strokeWidth={2.25} />,
    "Needs photo": <PhotoIcon className="size-3" strokeWidth={2.25} />,
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-[8px] px-2.5 py-1 text-[11px] font-medium tracking-[-0.01em] ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
}

export function ProductPreview() {
  return (
    <section id="product" className="scroll-mt-20">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[2fr_1.15fr] lg:gap-12 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_18px_55px_rgba(36,25,20,.12)] ring-1 ring-pp-sand/70">
          <div className="flex min-h-12 items-center gap-3 border-b border-pp-sand/80 bg-white px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-pp-coral/70" />
            <span className="size-2.5 rounded-full bg-pp-peach" />
            <span className="size-2.5 rounded-full bg-pp-teal/70" />
            <span className="ml-2 text-[11px] font-medium tracking-[-0.01em] text-pp-stone">
              app.postpooch.com
            </span>
          </div>

          <div className="grid sm:grid-cols-[170px_1fr]">
            <aside className="hidden border-r border-pp-sand/80 bg-[#fbfaf8] p-3 sm:block">
              <p className="px-2 pt-1 pb-2 text-[10px] font-semibold tracking-[.14em] text-pp-stone uppercase">
                Workspace
              </p>
              <ul className="space-y-0.5">
                {SIDE_NAV.map((item) => (
                  <li
                    key={item.label}
                    className={`flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-[13px] font-medium tracking-[-0.01em] ${
                      item.active
                        ? "bg-white text-pp-ink shadow-sm ring-1 ring-pp-sand/70"
                        : "text-pp-stone"
                    }`}
                  >
                    <item.icon className="size-4" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </aside>

            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Image
                  src={AVATAR_SRC}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 rounded-full"
                />
                <div>
                  <p className="text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
                    Good morning, Alex
                  </p>
                  <p className="text-[12px] tracking-[-0.01em] text-pp-stone">
                    Your next 5 posts are ready to review.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[12px] bg-pp-mist/65 px-3.5 py-3 ring-1 ring-pp-sand/80"
                  >
                    <p
                      className={`text-xl font-semibold tabular-nums leading-none tracking-[-0.03em] ${stat.tone}`}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-1.5 text-[11px] tracking-[-0.01em] text-pp-stone">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="mt-5 overflow-hidden rounded-2xl bg-white ring-1 ring-pp-sand/90">
                {QUEUE.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-center justify-between gap-3 border-b border-pp-sand/70 p-2.5 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-pp-ink">
                        {item.title}
                      </p>
                      <p className="text-[11px] tracking-[-0.01em] text-pp-stone">
                        {item.meta}
                      </p>
                    </div>
                    <StatusChip status={item.status} />
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                <span className="inline-flex h-9 items-center justify-center rounded-[10px] bg-pp-teal px-4 text-xs font-semibold tracking-[-0.01em] text-white">
                  Review all
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pp-teal-dark/90">
            The product
          </p>
          <h2 className="mt-3 text-[31px] font-semibold leading-[1.05] tracking-[-0.03em] text-pp-ink sm:text-[45px]">
            A calm control room for your content
          </h2>
          <p className="mt-4 text-[16px] leading-7 tracking-[-0.01em] text-pp-stone">
            No blank calendars, no guessing what to post. Open postpooch and
            see exactly what’s ready, what’s scheduled, and what needs one
            quick detail.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Review-and-schedule workflow — nothing posts without your approval",
              "Clear statuses: Ready, Scheduled, Draft, Needs attention",
              "Every account and every listing in one queue",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-[8px] bg-pp-mist text-pp-teal ring-1 ring-pp-sand/80">
                  <CheckIcon className="size-3.5" strokeWidth={2.5} />
                </span>
                <span className="text-[13px] leading-5 tracking-[-0.01em] text-pp-ink">
                  {point}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-8 flex items-center gap-2 text-[12px] tracking-[-0.01em] text-pp-stone">
            <ClockIcon className="size-4 text-pp-caramel" />
            Product preview — your queue will have your name on it.
          </p>
        </div>
      </div>
    </section>
  );
}
