import {
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  MessageIcon,
  PencilIcon,
  ShieldIcon,
  TemplateIcon,
} from "./icons";

const FEATURES = [
  {
    icon: TemplateIcon,
    title: "Premade template library",
    copy: "A dozen real-estate templates across listings, market updates, education, and community. Never start from a blank screen.",
  },
  {
    icon: PencilIcon,
    title: "Make your own posts",
    copy: "Prefer to create from scratch? The editor gives you the same brand-safe canvas for one-off posts and campaigns.",
  },
  {
    icon: CheckCircleIcon,
    title: "Prepared weekly queue",
    copy: "Posts are drafted before you ask. Your queue shows what's ready, what's scheduled, and what needs one quick detail.",
  },
  {
    icon: MessageIcon,
    title: "Your voice, kept",
    copy: "Tone, phrasing, and local references that read like you wrote them on a good day — not like a generic content tool.",
  },
  {
    icon: ShieldIcon,
    title: "Compliance-safe zones",
    copy: "Brokerage name, license info, and listing attribution have a protected home in every template, every time.",
  },
  {
    icon: MapPinIcon,
    title: "Local market moments",
    copy: "Market updates and neighborhood content tied to your actual service area, with the source noted on every stat.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pp-teal-dark/90">
            Features
          </p>
          <h2 className="mt-3 text-[31px] font-semibold leading-[1.05] tracking-[-0.03em] text-pp-ink sm:text-[45px]">
            Everything prepared. Nothing generic.
          </h2>
          <p className="mt-4 text-[16px] leading-7 tracking-[-0.01em] text-pp-stone">
            More useful posts, less time in design tools. Spend that time with
            clients, not captions.
          </p>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="group">
              <span className="flex size-11 items-center justify-center rounded-[10px] bg-pp-mist text-pp-teal ring-1 ring-pp-sand/80 transition group-hover:bg-white group-hover:text-pp-teal-dark">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                {feature.copy}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3.5 rounded-[18px] bg-white px-5 py-4 ring-1 ring-pp-sand/70 sm:px-6">
          <ClockIcon className="size-5 shrink-0 text-pp-caramel" />
          <p className="text-[13px] leading-5 tracking-[-0.01em] text-pp-ink">
            Most agents review a full week of posts in about fifteen minutes.
            That’s the point.
          </p>
        </div>
      </div>
    </section>
  );
}
