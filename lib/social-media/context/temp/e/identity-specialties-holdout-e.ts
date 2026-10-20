/**
 * POSTPOOCH — CANDIDATE E SPECIALTIES HOLDOUT (EXPERIMENT ONLY)
 *
 * Compare D (unchanged baseline) with E (only specialties prompt revised).
 * 36 FRESH notes + 6 named DIAGNOSTIC REPLAYS. Keep scores separate.
 *
 * Expected answers are offline ground truth, not Jev inputs.
 * Send ONLY { note: testCase.note } as model state.
 * No production, routing, threshold, database, or planner changes.
 */

export const SPECIALTIES_CANDIDATE_E_CASES = [
  { id: "S01", group: "fresh_specialty", note: "My real estate practice concentrates on inherited-property listings.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S02", group: "fresh_specialty", note: "I handle mostly commercial lease negotiations now.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S03", group: "fresh_specialty", note: "My specialty has shifted from vacation rentals to new-build contracts.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S04", group: "fresh_specialty", note: "My primary line of work is distressed property sales.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S05", group: "fresh_specialty", note: "I mainly work on agricultural land deals as a real estate agent.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S06", group: "fresh_specialty", note: "Foreclosure purchases are now my area of professional expertise.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S07", group: "fresh_specialty", note: "I focus on townhouse resales in my real estate business.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "S08", group: "fresh_specialty", note: "I regularly handle probate property transfers as a major part of my real estate practice.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "R01", group: "fresh_removal", note: "I no longer handle vacation-rental property sales for clients.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "R02", group: "fresh_removal", note: "I've stopped specializing in short-sale negotiations.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "R03", group: "fresh_removal", note: "Remove acreage purchases from my professional specialties.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "R04", group: "fresh_removal", note: "Historic renovations are no longer a focus of my real estate practice.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "R05", group: "fresh_removal", note: "I have stopped taking on foreclosure listings as part of my business.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "R06", group: "fresh_removal", note: "I don't work on commercial leases anymore.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "R07", group: "fresh_removal", note: "Estate-sale transactions used to be my niche, but not anymore.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "R08", group: "fresh_removal", note: "I no longer focus professionally on lakefront property deals.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "J01", group: "fresh_title", note: "My new job title is Senior Property Consultant.", expectedCategories: ["identity"], expectedIdentityFields: ["professional_title"], expectedTemporaryType: null },
  { id: "J02", group: "fresh_title", note: "I'm now the Director of Residential Sales at my brokerage.", expectedCategories: ["identity"], expectedIdentityFields: ["professional_title"], expectedTemporaryType: null },
  { id: "J03", group: "fresh_title", note: "Update my professional title to Relocation Specialist.", expectedCategories: ["identity"], expectedIdentityFields: ["professional_title"], expectedTemporaryType: null },
  { id: "J04", group: "fresh_title", note: "My professional designation is Luxury Home Advisor.", expectedCategories: ["identity"], expectedIdentityFields: ["professional_title"], expectedTemporaryType: null },
  { id: "J05", group: "fresh_title", note: "I was promoted to Head of Investment Properties.", expectedCategories: ["identity"], expectedIdentityFields: ["professional_title"], expectedTemporaryType: null },
  { id: "A01", group: "fresh_audience", note: "Most of my customers are single parents purchasing starter homes.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A02", group: "fresh_audience", note: "I now work mainly with buyers relocating for new jobs.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A03", group: "fresh_audience", note: "My clients tend to be seniors selling family residences.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A04", group: "fresh_audience", note: "I no longer work primarily with college students buying condos.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A05", group: "fresh_audience", note: "Change my target clients to small-business owners buying their first home.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "F01", group: "fresh_nonidentity", note: "Feature probate-sales explanations in more of my posts.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "F02", group: "fresh_nonidentity", note: "Make fewer posts about lakefront houses.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "P01", group: "fresh_nonidentity", note: "When I discuss short sales in captions, avoid financial jargon.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "T01", group: "fresh_nonidentity", note: "For the next five posts, discuss commercial leases.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "T02", group: "fresh_nonidentity", note: "Until December 1, feature new-construction home tours.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "date_range" },
  { id: "N01", group: "fresh_nonidentity", note: "Am I still listed as a foreclosure specialist on my profile?", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "M01", group: "fresh_mixed", note: "I stopped offering commercial leasing services; please write more posts about negotiating offers.", expectedCategories: ["identity", "frequency"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "M02", group: "fresh_mixed", note: "My title is Regional Brokerage Director, and I no longer handle probate listings.", expectedCategories: ["identity"], expectedIdentityFields: ["professional_title", "specialties"], expectedTemporaryType: null },
  { id: "M03", group: "fresh_mixed", note: "Most of my customers are recent graduates, and for the next two posts highlight closing costs.", expectedCategories: ["identity", "temporary"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: "counter" },
  { id: "M04", group: "fresh_mixed", note: "I no longer focus on equestrian properties, and from now on use shorter captions.", expectedCategories: ["identity", "preference"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "D01", group: "diagnostic_replay", note: "I am no longer focused on investment duplexes in my business.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "D02", group: "diagnostic_replay", note: "I stopped handling probate real estate cases.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "D03", group: "diagnostic_replay", note: "My title is Residential Sales Director.", expectedCategories: ["identity"], expectedIdentityFields: ["professional_title"], expectedTemporaryType: null },
  { id: "D04", group: "diagnostic_replay", note: "I primarily help newly married couples looking for a house.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "D05", group: "diagnostic_replay", note: "I specialize in short-sale negotiations, but make the next two posts about starter homes.", expectedCategories: ["identity", "temporary"], expectedIdentityFields: ["specialties"], expectedTemporaryType: "counter" },
  { id: "D06", group: "diagnostic_replay", note: "I spent ten years working in construction before becoming an agent; I now handle mostly waterfront estate transactions.", expectedCategories: ["identity"], expectedIdentityFields: ["personal_context", "specialties"], expectedTemporaryType: null },
] as const;

export const SPECIALTIES_E_FRESH_COUNT = 36;
export const SPECIALTIES_E_REPLAY_COUNT = 6;
export const SPECIALTIES_E_TOTAL_COUNT = 42;
