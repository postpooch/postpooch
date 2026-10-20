/**
 * PostPooch — fresh Identity-granularity boundary holdout (evaluation only).
 *
 * Compare the existing Version 7 broad Identity Noul (A) against the previously
 * supplied nine-field candidate in identity-jev-ab-candidate.ts / the_file.ts (B).
 *
 * These labels are OFFLINE GROUND TRUTH. Send ONLY { note: testCase.note } to Jev.
 * Never include IDs, groups, field labels, expected categories, or comments in
 * the model state or question definitions.
 *
 * No classification prompts, thresholds, or production files are defined here.
 * This fixture is intentionally independent of the project import aliases.
 *
 * IMPORTANT: 'expectedIdentityFields' names the fields explicitly supplied or
 * changed by the realtor. An unrelated field's high score is a field-level
 * false activation even if the broad Identity category is correctly included.
 */

export const HOLDOUT_IDENTITY_FIELDS = [
  "display_name",
  "professional_title",
  "brokerage_name",
  "markets",
  "target_audience",
  "specialties",
  "personal_context",
  "primary_brand_color",
  "secondary_brand_color",
] as const;

export type HoldoutIdentityField = (typeof HOLDOUT_IDENTITY_FIELDS)[number];
export type HoldoutCategory = "identity" | "preference" | "frequency" | "temporary";
export type HoldoutTemporaryType = "counter" | "date_range";
export type HoldoutGroup =
  | "identity_positive"
  | "preference_hard_negative"
  | "frequency_hard_negative"
  | "temporary_hard_negative"
  | "mixed"
  | "no_change";

export type IdentityBoundaryCase = {
  readonly id: string;
  readonly group: HoldoutGroup;
  readonly note: string;
  readonly expectedCategories: readonly HoldoutCategory[];
  readonly expectedIdentityFields: readonly HoldoutIdentityField[];
  readonly expectedTemporaryType: HoldoutTemporaryType | null;
};

export const IDENTITY_BOUNDARY_HOLDOUT: readonly IdentityBoundaryCase[] = [
  // 12 fresh positives: all nine current identity fields, including indirect
  // factual statements and fields that could resemble posting preferences.
  { id: "I01", group: "identity_positive", note: "For my agent profile, use the display name Avery Jordan.", expectedCategories: ["identity"], expectedIdentityFields: ["display_name"], expectedTemporaryType: null },
  { id: "I02", group: "identity_positive", note: "Clients know me professionally as Samira Cole.", expectedCategories: ["identity"], expectedIdentityFields: ["display_name"], expectedTemporaryType: null },
  { id: "I03", group: "identity_positive", note: "I was recently promoted to Designated Broker.", expectedCategories: ["identity"], expectedIdentityFields: ["professional_title"], expectedTemporaryType: null },
  { id: "I04", group: "identity_positive", note: "I've moved from Cactus Key Realty to Mesa Vista Partners.", expectedCategories: ["identity"], expectedIdentityFields: ["brokerage_name"], expectedTemporaryType: null },
  { id: "I05", group: "identity_positive", note: "I take clients in Verrado and Litchfield Park now.", expectedCategories: ["identity"], expectedIdentityFields: ["markets"], expectedTemporaryType: null },
  { id: "I06", group: "identity_positive", note: "Most of my clients are retirees who are downsizing.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "I07", group: "identity_positive", note: "I work primarily with airline employees relocating to Phoenix.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "I08", group: "identity_positive", note: "My real estate niche is probate transactions.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "I09", group: "identity_positive", note: "I specialize in equestrian properties.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "I10", group: "identity_positive", note: "Before becoming an agent, I spent a decade teaching biology.", expectedCategories: ["identity"], expectedIdentityFields: ["personal_context"], expectedTemporaryType: null },
  { id: "I11", group: "identity_positive", note: "Our official primary brand color is cedar green, #245B45.", expectedCategories: ["identity"], expectedIdentityFields: ["primary_brand_color"], expectedTemporaryType: null },
  { id: "I12", group: "identity_positive", note: "The secondary color in my brand guidelines is ivory, #FFF5DF.", expectedCategories: ["identity"], expectedIdentityFields: ["secondary_brand_color"], expectedTemporaryType: null },

  // 6 lasting per-post preferences. These reference possible identity topics
  // or profile attributes without supplying/changing the identity fact.
  { id: "P01", group: "preference_hard_negative", note: "When explaining VA loans, speak directly to military families.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P02", group: "preference_hard_negative", note: "Add more neighborhood detail inside each caption.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P03", group: "preference_hard_negative", note: "Use sage-green backgrounds for my social graphics.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P04", group: "preference_hard_negative", note: "Mention my brokerage only when it's relevant to the caption.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P05", group: "preference_hard_negative", note: "Do not talk about my hometown in the captions.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P06", group: "preference_hard_negative", note: "Keep posts about downsizing focused on practical steps, not motivational slogans.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },

  // 7 ongoing content-mix rules. The subjects do not establish realtor facts.
  { id: "F01", group: "frequency_hard_negative", note: "Publish more probate-sale explainer posts.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F02", group: "frequency_hard_negative", note: "Feature Chandler neighborhood guides less often.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F03", group: "frequency_hard_negative", note: "Talk about relocating military families more frequently.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F04", group: "frequency_hard_negative", note: "Make teacher home-buying tips a more common post topic.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F05", group: "frequency_hard_negative", note: "Use green-accented images in only some posts, not all of them.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F06", group: "frequency_hard_negative", note: "Make more agent-introduction posts.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F07", group: "frequency_hard_negative", note: "Post less about waterfront estates.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },

  // 7 bounded instructions. Their topic/style is not a lasting identity fact,
  // preference, or ongoing post-distribution rule.
  { id: "T01", group: "temporary_hard_negative", note: "For the next two posts, write directly to first-time buyers.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "T02", group: "temporary_hard_negative", note: "Through November, use teal backgrounds in my graphics.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "date_range" },
  { id: "T03", group: "temporary_hard_negative", note: "Use the next three posts to spotlight Flagstaff hiking trails.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "T04", group: "temporary_hard_negative", note: "For the next four posts, explain probate sales.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "T05", group: "temporary_hard_negative", note: "Tomorrow's post should tell a story about changing careers.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "date_range" },
  { id: "T06", group: "temporary_hard_negative", note: "For the next two weeks, put the brokerage logo at the bottom of each graphic.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "date_range" },
  { id: "T07", group: "temporary_hard_negative", note: "In my next five posts, make the captions more conversational.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },

  // 10 mixed notes: distinguish genuine identity facts from adjacent posting
  // instructions. M07 has TWO identity fields; M10 has NO identity field.
  { id: "M01", group: "mixed", note: "I joined Copper Mesa Group, and I want every caption to have a clear call to action.", expectedCategories: ["identity", "preference"], expectedIdentityFields: ["brokerage_name"], expectedTemporaryType: null },
  { id: "M02", group: "mixed", note: "I mainly represent downsizing retirees; give renovation advice a larger share of my posts.", expectedCategories: ["identity", "frequency"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "M03", group: "mixed", note: "I now serve Ahwatukee; cover storm-proofing in the next two posts.", expectedCategories: ["identity", "temporary"], expectedIdentityFields: ["markets"], expectedTemporaryType: "counter" },
  { id: "M04", group: "mixed", note: "I used to be a paramedic before real estate; feature pool-safety tips through November.", expectedCategories: ["identity", "temporary"], expectedIdentityFields: ["personal_context"], expectedTemporaryType: "date_range" },
  { id: "M05", group: "mixed", note: "My primary brand color is navy, #123B68; use high-contrast lettering on every graphic.", expectedCategories: ["identity", "preference"], expectedIdentityFields: ["primary_brand_color"], expectedTemporaryType: null },
  { id: "M06", group: "mixed", note: "I specialize in land purchases; use plain English instead of industry jargon.", expectedCategories: ["identity", "preference"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "M07", group: "mixed", note: "My new team is Vista Trail Realty, and my professional title is now Associate Broker.", expectedCategories: ["identity"], expectedIdentityFields: ["brokerage_name", "professional_title"], expectedTemporaryType: null },
  { id: "M08", group: "mixed", note: "I mainly serve teachers moving to Arizona; keep captions upbeat and make HOA explainers more common.", expectedCategories: ["identity", "preference", "frequency"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "M09", group: "mixed", note: "Our secondary brand color is #E7C9A0; include more home-inspection advice posts, and make the next two posts about walk-through checklists.", expectedCategories: ["identity", "frequency", "temporary"], expectedIdentityFields: ["secondary_brand_color"], expectedTemporaryType: "counter" },
  { id: "M10", group: "mixed", note: "Use natural-light photos as my general style, talk about local design trends more often, and spend the next three posts on moving checklists.", expectedCategories: ["preference", "frequency", "temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },

  // 6 statements/questions with no requested update to any standing category.
  { id: "N01", group: "no_change", note: "What's the difference between a principal broker and an associate broker?", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "N02", group: "no_change", note: "Could you explain the history of Sun City?", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "N03", group: "no_change", note: "A client named Mia Torres bought a home in Glendale.", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "N04", group: "no_change", note: "Which neighborhoods did we post about last month?", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "N05", group: "no_change", note: "Is my current primary brand color blue?", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "N06", group: "no_change", note: "I liked the copy in yesterday's post.", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },
] as const;

// The experiment is balanced for diagnosis, not sampled to reflect the actual
// distribution of notes users will submit. Do not extrapolate observed error
// percentages to production prevalence.
export const IDENTITY_HOLDOUT_EXPECTED_COUNT = 48;
