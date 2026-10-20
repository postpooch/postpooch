/**
 * POSTPOOCH — SPECIALTIES PRECISION HOLDOUT (EXPERIMENT ONLY)
 *
 * Three-way comparison: Candidate B (original), Candidate C (strict),
 * Candidate D (revised Specials only). No production edits.
 *
 * 36 never-before-tested fresh cases plus 5 explicitly labeled diagnostic
 * replays (from the previous experiment). Keep their metrics SEPARATE.
 *
 * Ground truth fields/categories are for OFFLINE EVALUATION ONLY.
 * Pass ONLY { note: testCase.note } to Jev. Never include expectations in state.
 */

export const SPECIALTIES_PRECISION_CASES = [
  { id: "S01", group: "fresh_specialty", note: "My main real estate niche is helping homeowners navigate probate listings.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S02", group: "fresh_specialty", note: "I focus my real estate practice on rural land purchases.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S03", group: "fresh_specialty", note: "Luxury condo resales are my professional specialty.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S04", group: "fresh_specialty", note: "I handle short-sale transactions as my primary line of real estate work.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S05", group: "fresh_specialty", note: "I am no longer focused on investment duplexes in my business.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S06", group: "fresh_specialty", note: "I have shifted my practice from vacation homes to foreclosure properties.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S07", group: "fresh_specialty", note: "Most of my real estate work involves historic houses.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S08", group: "fresh_specialty", note: "My expertise is waterfront property transactions.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S09", group: "fresh_specialty", note: "I work mainly in estate-sale listings.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S10", group: "fresh_specialty", note: "Downsizing-home sale transactions are the niche I have built my practice around.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S11", group: "fresh_specialty", note: "I now specialize in negotiating land leases.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S12", group: "fresh_specialty", note: "I stopped handling probate real estate cases.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "A01", group: "fresh_audience", note: "Most of my clients are parents purchasing their first home.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A02", group: "fresh_audience", note: "I mainly represent firefighters relocating to Scottsdale.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A03", group: "fresh_audience", note: "My customer base is mostly retirees selling their primary residences.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A04", group: "fresh_audience", note: "I work with nurses who are looking to buy in Mesa.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A05", group: "fresh_audience", note: "I primarily help newly married couples looking for a house.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A06", group: "fresh_audience", note: "I represent military veterans shopping for accessible homes.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A07", group: "fresh_audience", note: "I usually represent people moving from other states.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A08", group: "fresh_audience", note: "My clients are mostly investors buying their very first property.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "I01", group: "fresh_other_identity", note: "I serve buyers and sellers in Fountain Hills.", expectedCategories: ["identity"], expectedIdentityFields: ["markets"], expectedTemporaryType: null },
  { id: "I02", group: "fresh_other_identity", note: "I earned a degree in finance before I became an agent.", expectedCategories: ["identity"], expectedIdentityFields: ["personal_context"], expectedTemporaryType: null },
  { id: "I03", group: "fresh_other_identity", note: "I just joined Saguaro Gate Brokerage.", expectedCategories: ["identity"], expectedIdentityFields: ["brokerage_name"], expectedTemporaryType: null },
  { id: "I04", group: "fresh_other_identity", note: "My title is Residential Sales Director.", expectedCategories: ["identity"], expectedIdentityFields: ["professional_title"], expectedTemporaryType: null },
  { id: "X01", group: "fresh_nonidentity", note: "Use estate-sale homes as examples in every other post.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "X02", group: "fresh_nonidentity", note: "Make more posts about luxury condos.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "X03", group: "fresh_nonidentity", note: "For the next three posts, highlight lakefront properties.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "X04", group: "fresh_nonidentity", note: "Next month, cover probate basics in all posts.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "date_range" },
  { id: "X05", group: "fresh_nonidentity", note: "Keep captions simple when explaining short sales.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "X06", group: "fresh_nonidentity", note: "Whenever you write about rural acreage, avoid industry jargon.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "X07", group: "fresh_nonidentity", note: "Would you recommend focusing on vacation rentals?", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "X08", group: "fresh_nonidentity", note: "Does my profile say I handle foreclosure transactions?", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "M01", group: "fresh_mixed", note: "I now focus on historic renovations, and I want fewer posts about luxury rentals.", expectedCategories: ["identity", "frequency"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "M02", group: "fresh_mixed", note: "My clients are mostly teachers moving to Arizona, and for the next two posts explain bridge loans.", expectedCategories: ["identity", "temporary"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: "counter" },
  { id: "M03", group: "fresh_mixed", note: "I am switching my niche to probate sales and have started serving Chandler too.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties", "markets"], expectedTemporaryType: null },
  { id: "M04", group: "fresh_mixed", note: "I spent ten years working in construction before becoming an agent; I now handle mostly waterfront estate transactions.", expectedCategories: ["identity"], expectedIdentityFields: ["personal_context", "specialties"], expectedTemporaryType: null },
  { id: "R01", group: "diagnostic_replay", note: "My professional niche is rural acreage transactions.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "R02", group: "diagnostic_replay", note: "I focus my real estate practice on short sales.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "R03", group: "diagnostic_replay", note: "I specialize in short-sale negotiations, but make the next two posts about starter homes.", expectedCategories: ["identity", "temporary"], expectedIdentityFields: ["specialties"], expectedTemporaryType: "counter" },
  { id: "R04", group: "diagnostic_replay", note: "I primarily represent first-time buyers moving to Prescott.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "R05", group: "diagnostic_replay", note: "I mainly help divorced homeowners who need to sell.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
] as const;

export const SPECIALTIES_PRECISION_FRESH_COUNT = 36;
export const SPECIALTIES_PRECISION_REPLAY_COUNT = 5;
export const SPECIALTIES_PRECISION_TOTAL_COUNT = 41;
