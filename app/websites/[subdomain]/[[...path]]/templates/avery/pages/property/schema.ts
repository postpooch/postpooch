import { z } from "zod";

export const AveryPropertyContentSchema = z.object({
  residenceKicker: z.string(),
  residenceTitle: z.string(),
  residenceBody: z.array(z.string()).min(1),
  inquiryLabel: z.string(),
  neighborhoodKicker: z.string(),
  neighborhoodBody: z.string(),
  neighborhoodCtaLabel: z.string(),
  interiorAmenities: z.array(z.string()).min(1),
  buildingAmenities: z.array(z.string()).min(1),
});

export type AveryPropertyContent = z.infer<typeof AveryPropertyContentSchema>;

export const averyPropertyDefaultContent: AveryPropertyContent = {
  residenceKicker: "The residence",
  residenceTitle: "Designed to feel effortless.",
  residenceBody: [
    "Thoughtful proportions, natural light, and a refined material palette define this residence. The living spaces are designed for both quiet daily life and generous entertaining, with custom details that reveal themselves gradually rather than compete for attention.",
    "The kitchen is tailored and architectural, balancing integrated storage with durable natural surfaces. Private quarters are calm and well separated, with considered lighting, substantial closets, and spa-like baths.",
    "Throughout, the home pairs New York character with a more contemporary sense of ease.",
  ],
  inquiryLabel: "Schedule a private showing",
  neighborhoodKicker: "The neighborhood",
  neighborhoodBody:
    "Architecture, daily rituals, restaurants, parks, and the small details that make a block feel like home.",
  neighborhoodCtaLabel: "Explore the area",
  interiorAmenities: [
    "Custom millwork",
    "Wide-plank flooring",
    "Integrated appliances",
    "Central climate control",
    "In-unit laundry",
  ],
  buildingAmenities: [
    "Full-time attended lobby",
    "Private storage",
    "Fitness room",
    "Resident lounge",
    "Pet friendly",
  ],
};
