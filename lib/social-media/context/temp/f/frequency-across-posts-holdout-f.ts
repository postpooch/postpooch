/**
 * POSTPOOCH — FREQUENCY 'ACROSS POSTS' HOLDOUT (EXPERIMENT ONLY)
 *
 * Compare:
 *   Baseline: Verified Version 7 CLASSIFICATION_QUESTIONS.frequency
 *   Candidate F: FREQUENCY_QUESTION_CANDIDATE_F
 *
 * Identity in BOTH arms is the unchanged Candidate E nine-field question set.
 * Every other category question, temporary_type, aggregation, thresholds,
 * classifier settings, and routing are identical in both arms.
 *
 * 42 newly written cases and 8 explicitly marked diagnostic replays.
 * Ground truth is for LOCAL SCORING ONLY: the Jev request state must contain
 * ONLY { note: testCase.note }. Never give Jev these expected labels/IDs.
 */

export const FREQUENCY_HOLDOUT_F_CASES = [
  // 10 ongoing changes to the distribution of content across DIFFERENT posts.
  { id: "F01", group: "fresh_frequency", note: "Make neighborhood restaurant guides a bigger share of my posts.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F02", group: "fresh_frequency", note: "Talk more about first-time buyer closing costs.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F03", group: "fresh_frequency", note: "Mix in client testimonials once in a while.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F04", group: "fresh_frequency", note: "Have roughly one in five posts focus on home maintenance.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F05", group: "fresh_frequency", note: "I want fewer posts about home decor and more about local parks.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F06", group: "fresh_frequency", note: "Stop creating posts about luxury yachts.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F07", group: "fresh_frequency", note: "Occasionally add a mortgage myth-busting post to the lineup.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F08", group: "fresh_frequency", note: "I'd like seller checklists to show up more often in our feed.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F09", group: "fresh_frequency", note: "Don't feature rental listings as often.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F10", group: "fresh_frequency", note: "Include a poll in some posts, not every single one.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },

  // 10 lasting rules about what is INSIDE each post, not its content mix.
  { id: "P01", group: "fresh_within_post", note: "Use more emojis in each caption.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P02", group: "fresh_within_post", note: "Talk more about closing costs within each educational post.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P03", group: "fresh_within_post", note: "Make every caption shorter from now on.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P04", group: "fresh_within_post", note: "Place a question at the end of every post.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P05", group: "fresh_within_post", note: "Use fewer exclamation marks in the text of each post.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P06", group: "fresh_within_post", note: "When a post covers inspections, explain contingencies in more detail within that post.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P07", group: "fresh_within_post", note: "Keep the tone more playful in all posts.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P08", group: "fresh_within_post", note: "Always show my logo on the graphic.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P09", group: "fresh_within_post", note: "Use less text per graphic.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P10", group: "fresh_within_post", note: "I prefer practical seller advice over celebrity-home gossip.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },

  // 7 limited-duration instructions, even when repeated across the bounded posts.
  { id: "T01", group: "fresh_temporary", note: "For the next four posts, feature neighborhood coffee shops.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "T02", group: "fresh_temporary", note: "During the first week of November, make property-tax tips the main topic.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "date_range" },
  { id: "T03", group: "fresh_temporary", note: "For the next two posts, include a question at the end.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "T04", group: "fresh_temporary", note: "Tomorrow's post should focus on inspection red flags.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "date_range" },
  { id: "T05", group: "fresh_temporary", note: "For two weeks, make posts about mortgage preapproval more common.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "date_range" },
  { id: "T06", group: "fresh_temporary", note: "Make the next three posts longer and more detailed.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "T07", group: "fresh_temporary", note: "Through October 31, publish only fall home-prep tips.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "date_range" },

  // 6 realtor profile facts with no ongoing content-distribution instruction.
  { id: "I01", group: "fresh_identity", note: "I focus my business on representing probate sellers.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "I02", group: "fresh_identity", note: "Most of my clients are relocating teachers.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "I03", group: "fresh_identity", note: "My service area now includes Buckeye.", expectedCategories: ["identity"], expectedIdentityFields: ["markets"], expectedTemporaryType: null },
  { id: "I04", group: "fresh_identity", note: "My official title is Senior Buyer Representative.", expectedCategories: ["identity"], expectedIdentityFields: ["professional_title"], expectedTemporaryType: null },
  { id: "I05", group: "fresh_identity", note: "I worked as a landscape architect before entering real estate.", expectedCategories: ["identity"], expectedIdentityFields: ["personal_context"], expectedTemporaryType: null },
  { id: "I06", group: "fresh_identity", note: "My primary brand color is #1F6B70.", expectedCategories: ["identity"], expectedIdentityFields: ["primary_brand_color"], expectedTemporaryType: null },

  // 6 compound notes: Frequency must remain independent of other categories.
  { id: "M01", group: "fresh_mixed", note: "I mainly represent retired teachers, and make seller testimonials a bigger part of my feed.", expectedCategories: ["identity", "frequency"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "M02", group: "fresh_mixed", note: "Keep captions punchy, but make neighborhood market reports less frequent.", expectedCategories: ["preference", "frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "M03", group: "fresh_mixed", note: "I specialize in condo conversions; cover HOA fee increases more often.", expectedCategories: ["identity", "frequency"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "M04", group: "fresh_mixed", note: "Feature property walkthroughs in more posts, but for the next three posts use only exterior photos.", expectedCategories: ["frequency", "temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "M05", group: "fresh_mixed", note: "My new title is Listing Advisor; use fewer emojis in each caption; and include relocation guides once in a while.", expectedCategories: ["identity", "preference", "frequency"], expectedIdentityFields: ["professional_title"], expectedTemporaryType: null },
  { id: "M06", group: "fresh_mixed", note: "Write more about financing in each post about first-time buyers, and make posts about renovation loans more common.", expectedCategories: ["preference", "frequency"], expectedIdentityFields: [], expectedTemporaryType: null },

  // 3 non-actionable notes.
  { id: "N01", group: "fresh_nonactionable", note: "Would posting more local business spotlights help engagement?", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "N02", group: "fresh_nonactionable", note: "What does frequency mean in my posting settings?", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "N03", group: "fresh_nonactionable", note: "I liked yesterday's kitchen-design post.", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },

  // 8 diagnostic REPLAYS from earlier evaluations (never count as fresh).
  { id: "R01", group: "diagnostic_replay", note: "For the next five posts, discuss commercial leases.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "R02", group: "diagnostic_replay", note: "I no longer focus on equestrian properties, and from now on use shorter captions.", expectedCategories: ["identity", "preference"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "R03", group: "diagnostic_replay", note: "Mix in a client success story once in a while.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "R04", group: "diagnostic_replay", note: "For the next four posts, highlight curb appeal.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "R05", group: "diagnostic_replay", note: "Throughout November, feature holiday hosting tips.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "date_range" },
  { id: "R06", group: "diagnostic_replay", note: "Use fewer hashtags per post.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "R07", group: "diagnostic_replay", note: "For the next six posts, add a question at the end.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "R08", group: "diagnostic_replay", note: "Increase the share of renter-to-owner tips going forward, and make the next two posts about down-payment assistance.", expectedCategories: ["frequency", "temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
] as const;

export const FREQUENCY_HOLDOUT_F_FRESH_COUNT = 42;
export const FREQUENCY_HOLDOUT_F_REPLAY_COUNT = 8;
export const FREQUENCY_HOLDOUT_F_TOTAL_COUNT = 50;
