import { z } from "zod";

const StepSchema = z.object({
  num: z.string(),
  title: z.string(),
  body: z.string(),
});

export const SloaneGuideContentSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  intro: z.string(),
  steps: z.array(StepSchema).min(1),
  guideTitle: z.string(),
  guideBody: z.string(),
  formTitle: z.string(),
});

export type SloaneGuideContent = z.infer<typeof SloaneGuideContentSchema>;

export const sloaneBuyingDefaultContent: SloaneGuideContent = {
  eyebrow: "For buyers",
  title: "Buy with context, not urgency.",
  intro:
    "In competitive markets, the best buyers are prepared before they fall in love with a property. Sloane’s process combines market education, financial readiness, private-network sourcing, and property-level diligence so decisions can be fast without being rushed.",
  steps: [
    {
      num: "01",
      title: "Define the brief",
      body: "Clarify location, architecture, timing, budget, non-negotiables, and the tradeoffs you are actually willing to make.",
    },
    {
      num: "02",
      title: "Prepare financially",
      body: "Confirm liquidity, financing, proof of funds, and decision-makers before the right home appears.",
    },
    {
      num: "03",
      title: "Search beyond portals",
      body: "Combine public inventory with agent networks, coming-soon opportunities, and targeted outreach.",
    },
    {
      num: "04",
      title: "Evaluate value",
      body: "Read the property against recent sales, land, condition, replacement cost, and the specific micro-market.",
    },
    {
      num: "05",
      title: "Negotiate the whole deal",
      body: "Price matters, but so do timing, contingencies, credits, certainty, and the seller’s priorities.",
    },
  ],
  guideTitle: "The Buyer Brief",
  guideBody: "A concise worksheet for defining your search and preparing your team before touring seriously.",
  formTitle: "Request the guide",
};

export const sloaneSellingDefaultContent: SloaneGuideContent = {
  eyebrow: "For sellers",
  title: "A better launch starts before photography.",
  intro:
    "The most effective marketing plan begins with preparation. Sloane develops a property-specific strategy around architecture, condition, audience, timing, and competition, then builds the campaign from that point of view.",
  steps: [
    {
      num: "01",
      title: "Position",
      body: "Understand the property’s strongest story, likely buyer, competitive set, and best timing.",
    },
    {
      num: "02",
      title: "Prepare",
      body: "Edit, repair, stage, landscape, and photograph only where the work improves perception or removes friction.",
    },
    {
      num: "03",
      title: "Launch",
      body: "Create anticipation across broker networks, private clients, editorial channels, and the public market.",
    },
    {
      num: "04",
      title: "Show well",
      body: "Control access and presentation so every showing feels intentional and every buyer gets the right information.",
    },
    {
      num: "05",
      title: "Negotiate",
      body: "Evaluate certainty, terms, timing, and leverage—not simply the headline number.",
    },
  ],
  guideTitle: "The Seller Edit",
  guideBody: "A room-by-room preparation checklist focused on the improvements buyers actually notice.",
  formTitle: "Request the guide",
};

export const sloaneFinancingDefaultContent: SloaneGuideContent = {
  eyebrow: "Preparation",
  title: "Make the financial structure part of the strategy.",
  intro:
    "Luxury purchases often involve more than a conventional pre-approval. The earlier financing, liquidity, ownership structure, and advisory teams are aligned, the more flexible a buyer can be when a time-sensitive opportunity appears.",
  steps: [
    {
      num: "01",
      title: "Build the team",
      body: "Line up a lender or private banker, CPA, wealth advisor, and real estate counsel as appropriate.",
    },
    {
      num: "02",
      title: "Know your structure",
      body: "Understand cash, leverage, reserves, entity ownership, and how each option affects speed and privacy.",
    },
    {
      num: "03",
      title: "Document early",
      body: "Prepare statements, letters, approvals, and proof of funds before you need to submit them.",
    },
    {
      num: "04",
      title: "Model scenarios",
      body: "Compare monthly carry, taxes, insurance, liquidity, renovation cost, and opportunity cost—not just purchase price.",
    },
  ],
  guideTitle: "Financial Readiness Checklist",
  guideBody: "A simple pre-search checklist to help buyers organize documentation and advisory relationships.",
  formTitle: "Request the checklist",
};
