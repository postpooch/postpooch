export type TemplatePillar =
  | "property"
  | "market"
  | "education"
  | "community";

export type TemplateFormat = "square" | "portrait" | "story";

export type TemplatePreviewVariant =
  | "just-listed"
  | "open-house"
  | "just-sold"
  | "property-feature"
  | "market-update"
  | "one-stat"
  | "market-compare"
  | "what-this-means"
  | "agent-tip"
  | "checklist"
  | "myth-reality"
  | "steps"
  | "neighborhood"
  | "local-business"
  | "testimonial"
  | "consultation";

export type SocialTemplate = {
  id: string;
  name: string;
  description: string;
  pillar: TemplatePillar;
  format: TemplateFormat;
  preview: TemplatePreviewVariant;
};

export const TEMPLATE_PILLARS: {
  id: TemplatePillar | "all";
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "property", label: "Property" },
  { id: "market", label: "Market" },
  { id: "education", label: "Education" },
  { id: "community", label: "Community" },
];

export const PILLAR_LABELS: Record<TemplatePillar, string> = {
  property: "Property",
  market: "Market",
  education: "Education",
  community: "Community",
};

export const FORMAT_LABELS: Record<TemplateFormat, string> = {
  square: "Square",
  portrait: "Portrait",
  story: "Story",
};

/** Canvas stub catalog. The editor picker loads real rows from public.templates. */
export const SOCIAL_TEMPLATES: SocialTemplate[] = [
  {
    id: "just-listed",
    name: "Just listed",
    description: "Lead with the home and a clear status.",
    pillar: "property",
    format: "square",
    preview: "just-listed",
  },
  {
    id: "open-house",
    name: "Open house",
    description: "Date, time, and a simple invite to stop by.",
    pillar: "property",
    format: "portrait",
    preview: "open-house",
  },
  {
    id: "just-sold",
    name: "Just sold",
    description: "Celebrate the close without burying the photo.",
    pillar: "property",
    format: "square",
    preview: "just-sold",
  },
  {
    id: "property-feature",
    name: "Property feature",
    description: "One standout detail from the listing.",
    pillar: "property",
    format: "portrait",
    preview: "property-feature",
  },
  {
    id: "market-update",
    name: "Monthly market update",
    description: "One readable number with local context.",
    pillar: "market",
    format: "square",
    preview: "market-update",
  },
  {
    id: "one-stat",
    name: "One-stat insight",
    description: "A single figure clients can actually use.",
    pillar: "market",
    format: "story",
    preview: "one-stat",
  },
  {
    id: "market-compare",
    name: "Market comparison",
    description: "This month versus last, side by side.",
    pillar: "market",
    format: "square",
    preview: "market-compare",
  },
  {
    id: "what-this-means",
    name: "What this means",
    description: "Translate the number into plain language.",
    pillar: "market",
    format: "portrait",
    preview: "what-this-means",
  },
  {
    id: "agent-tip",
    name: "Agent tip",
    description: "One save-worthy idea from your expertise.",
    pillar: "education",
    format: "square",
    preview: "agent-tip",
  },
  {
    id: "checklist",
    name: "Checklist",
    description: "A short list buyers or sellers can keep.",
    pillar: "education",
    format: "portrait",
    preview: "checklist",
  },
  {
    id: "myth-reality",
    name: "Myth versus reality",
    description: "Correct a common market misconception.",
    pillar: "education",
    format: "square",
    preview: "myth-reality",
  },
  {
    id: "steps",
    name: "Step-by-step",
    description: "Walk through a process in three clear beats.",
    pillar: "education",
    format: "story",
    preview: "steps",
  },
  {
    id: "neighborhood",
    name: "Neighborhood spotlight",
    description: "Local context with a specific place in mind.",
    pillar: "community",
    format: "square",
    preview: "neighborhood",
  },
  {
    id: "local-business",
    name: "Local business",
    description: "Highlight a nearby spot your clients love.",
    pillar: "community",
    format: "portrait",
    preview: "local-business",
  },
  {
    id: "testimonial",
    name: "Client testimonial",
    description: "Let a real review carry the proof.",
    pillar: "community",
    format: "square",
    preview: "testimonial",
  },
  {
    id: "consultation",
    name: "Consultation invite",
    description: "A calm call to book a conversation.",
    pillar: "community",
    format: "story",
    preview: "consultation",
  },
];

export function getSocialTemplate(id: string): SocialTemplate | undefined {
  return SOCIAL_TEMPLATES.find((template) => template.id === id);
}
