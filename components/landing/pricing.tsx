import Link from "next/link";
import { CheckIcon } from "./icons";

const PLANS = [
  {
    name: "Trial",
    price: 0,
    blurb: "Try for one week on free.",
    features: [
      "Everything in Standard",
      "7 days free",
     
    ],
    cta: "Start free trial",
    featured: false,
  },
  {
    name: "Standard",
    price: 97,
    blurb: "For the individual real estate.",
    features: [
      "Personalized social media",
      "Customizable website",
      "Premium CRM",
      "Email marketing platform",
      "Video editing center",
      "Google business editor",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Team",
    price: null,
    blurb: "For teams with over 20 agents.",
    features: [
      "Everything in Standard",
      "Ask about group pricing",
    
    ],
    cta: "Talk to us",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pp-teal-dark/90">
            Pricing
          </p>
          <h2 className="mt-3 text-[31px] font-semibold leading-[1.05] tracking-[-0.03em] text-pp-ink sm:text-[45px]">
            Simple plans, prepared posts
          </h2>
          <p className="mt-4 text-[16px] leading-7 tracking-[-0.01em] text-pp-stone">
            Try free today. 
            
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-[18px] bg-white p-6 sm:p-7 ${
                plan.featured
                  ? "ring-2 ring-pp-teal shadow-[0_12px_32px_rgba(36,25,20,0.1)]"
                  : "ring-1 ring-pp-sand/70"
              }`}
            >
              {plan.featured ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-[8px] bg-pp-teal px-3 py-1 text-[11px] font-semibold tracking-[-0.01em] text-white">
                  Most popular
                </span>
              ) : null}

              <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-pp-ink">
                {plan.name}
              </h3>
              <p className="mt-2 text-[13px] leading-5 tracking-[-0.01em] text-pp-stone">
                {plan.blurb}
              </p>

              <p className="mt-6 flex items-baseline gap-1.5">
                {plan.price === null ? (
                  <span className="text-[36px] font-semibold tracking-[-0.03em] text-pp-ink">
                    Custom
                  </span>
                ) : (
                  <>
                    <span className="text-[36px] font-semibold tabular-nums tracking-[-0.03em] text-pp-ink">
                      ${plan.price}
                    </span>
                    <span className="text-[12px] tracking-[-0.01em] text-pp-stone">
                        / month 
                    </span>
                  </>
                )}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[6px] bg-pp-mist text-pp-teal ring-1 ring-pp-sand/80">
                      <CheckIcon className="size-3" strokeWidth={2.5} />
                    </span>
                    <span className="text-[13px] leading-5 tracking-[-0.01em] text-pp-ink">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.price === null ? "/contact" : "/signup"}
                className={`mt-8 inline-flex h-10 items-center justify-center rounded-[12px] px-5 text-sm font-semibold tracking-[-0.01em] transition ${
                  plan.featured
                    ? "bg-pp-teal text-white hover:bg-pp-teal-dark"
                    : "border border-pp-sand bg-white text-pp-ink hover:bg-pp-mist"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
