import { CalendarCheckIcon, MapPinIcon, PaletteIcon } from "./icons";

const STEPS = [
  {
    icon: PaletteIcon,
    step: "Step 1",
    title: "Connect your brand",
    copy: "Add your headshot, colors, brokerage details, and service area once. Every post carries them from then on.",
  },
  {
    icon: MapPinIcon,
    step: "Step 2",
    title: "Add listings and local knowledge",
    copy: "Import listing details and share the neighborhood insight only a local would know. That's the raw material.",
  },
  {
    icon: CalendarCheckIcon,
    step: "Step 3",
    title: "Review and schedule",
    copy: "Your next week of posts is ready before you think about it. Review, tweak, or schedule all in one sitting.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pp-teal-dark/90">
            How it works
          </p>
          <h2 className="mt-3 text-[31px] font-semibold leading-[1.05] tracking-[-0.03em] text-pp-ink sm:text-[45px]">
            Prepared, not pushy
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-7 tracking-[-0.01em] text-pp-stone">
            postpooch works like an assistant who has already done the work and
            is waiting for your approval. Three steps, then it just keeps up.
          </p>
        </div>

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((item, index) => (
            <li
              key={item.title}
              className="relative rounded-[18px] bg-white p-6 ring-1 ring-pp-sand/70 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(36,25,20,0.1)] sm:p-7"
            >
              <span
                aria-hidden
                className="absolute top-5 right-5 text-[40px] font-semibold leading-none tracking-[-0.04em] text-pp-mist"
              >
                {index + 1}
              </span>
              <span className="relative flex size-11 items-center justify-center rounded-[10px] bg-pp-mist text-pp-teal ring-1 ring-pp-sand/80">
                <item.icon className="size-5" />
              </span>
              <p className="relative mt-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-pp-stone">
                {item.step}
              </p>
              <h3 className="relative mt-2 text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
                {item.title}
              </h3>
              <p className="relative mt-2 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                {item.copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
