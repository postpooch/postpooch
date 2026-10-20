/**
 * PostPooch — candidate Identity-field precision experiment (NEW notes).
 * Comparison: existing nine-field candidate versus targeted revision of
 * markets, specialties, personal_context. NOT a production source file.
 *
 * Expected fields/categories are OFFLINE LABELS; DO NOT put them in Jev state.
 * Pass only { note: testCase.note } to either experiment variant.
 */

export const IDENTITY_PRECISION_CASES = [
  { id: "S01", group: "markets_positive", note: "I have started representing home sellers in Tolleson.", expectedCategories: ["identity"], expectedIdentityFields: ["markets"], expectedTemporaryType: null },
  { id: "S02", group: "markets_positive", note: "Please take Anthem off my real estate service-area list.", expectedCategories: ["identity"], expectedIdentityFields: ["markets"], expectedTemporaryType: null },
  { id: "S03", group: "markets_positive", note: "I also take buyers and sellers in Wickenburg.", expectedCategories: ["identity"], expectedIdentityFields: ["markets"], expectedTemporaryType: null },
  { id: "S04", group: "markets_positive", note: "My coverage territory now includes Apache Junction.", expectedCategories: ["identity"], expectedIdentityFields: ["markets"], expectedTemporaryType: null },
  { id: "E01", group: "specialties_positive", note: "Probate home sales are now my main real estate specialty.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "E02", group: "specialties_positive", note: "My professional niche is rural acreage transactions.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "E03", group: "specialties_positive", note: "I focus my real estate practice on short sales.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "E04", group: "specialties_positive", note: "I no longer specialize in vacation-rental investments.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties"], expectedTemporaryType: null },
  { id: "H01", group: "personal_positive", note: "I spent my teenage years in Yuma.", expectedCategories: ["identity"], expectedIdentityFields: ["personal_context"], expectedTemporaryType: null },
  { id: "H02", group: "personal_positive", note: "Before real estate, I operated a bakery for six years.", expectedCategories: ["identity"], expectedIdentityFields: ["personal_context"], expectedTemporaryType: null },
  { id: "H03", group: "personal_positive", note: "I earned my architecture degree at Arizona State University.", expectedCategories: ["identity"], expectedIdentityFields: ["personal_context"], expectedTemporaryType: null },
  { id: "H04", group: "personal_positive", note: "Outside of work I restore old bicycles.", expectedCategories: ["identity"], expectedIdentityFields: ["personal_context"], expectedTemporaryType: null },
  { id: "A01", group: "audience_positive", note: "Most of my clients are pilots who are relocating to Mesa.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A02", group: "audience_positive", note: "I primarily represent first-time buyers moving to Prescott.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A03", group: "audience_positive", note: "I mainly help divorced homeowners who need to sell.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "A04", group: "audience_positive", note: "I usually work with families caring for aging parents.", expectedCategories: ["identity"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "O01", group: "other_identity", note: "My new professional title is Associate Designated Broker.", expectedCategories: ["identity"], expectedIdentityFields: ["professional_title"], expectedTemporaryType: null },
  { id: "O02", group: "other_identity", note: "My real estate team is called Agave Properties.", expectedCategories: ["identity"], expectedIdentityFields: ["brokerage_name"], expectedTemporaryType: null },
  { id: "O03", group: "other_identity", note: "Use Morgan Bell as my professional display name.", expectedCategories: ["identity"], expectedIdentityFields: ["display_name"], expectedTemporaryType: null },
  { id: "O04", group: "other_identity", note: "My secondary brand color is cobalt blue, #264A9C.", expectedCategories: ["identity"], expectedIdentityFields: ["secondary_brand_color"], expectedTemporaryType: null },
  { id: "X01", group: "nonidentity_control", note: "Make more posts explaining the housing market in Tolleson.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "X02", group: "nonidentity_control", note: "Highlight historic property renovations in fewer posts.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "X03", group: "nonidentity_control", note: "Discuss probate questions more often in my content.", expectedCategories: ["frequency"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "X04", group: "nonidentity_control", note: "Make each caption sound welcoming when speaking to flight attendants.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "X05", group: "nonidentity_control", note: "Put our team logo in the bottom-left corner of each graphic.", expectedCategories: ["preference"], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "X06", group: "nonidentity_control", note: "For the next week, focus on Wickenburg house tours.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "date_range" },
  { id: "X07", group: "nonidentity_control", note: "For the next two posts, include photographs of bakeries.", expectedCategories: ["temporary"], expectedIdentityFields: [], expectedTemporaryType: "counter" },
  { id: "X08", group: "nonidentity_control", note: "Which cities are in my saved real estate service area?", expectedCategories: [], expectedIdentityFields: [], expectedTemporaryType: null },
  { id: "M01", group: "mixed", note: "Most of my clients are nurses moving to Surprise, and I want more Surprise neighborhood explainer posts.", expectedCategories: ["identity", "frequency"], expectedIdentityFields: ["target_audience"], expectedTemporaryType: null },
  { id: "M02", group: "mixed", note: "I grew up in Kingman; for the next three posts focus on Wickenburg homes.", expectedCategories: ["identity", "temporary"], expectedIdentityFields: ["personal_context"], expectedTemporaryType: "counter" },
  { id: "M03", group: "mixed", note: "I now serve Avondale, and I want every caption to avoid slang.", expectedCategories: ["identity", "preference"], expectedIdentityFields: ["markets"], expectedTemporaryType: null },
  { id: "M04", group: "mixed", note: "I specialize in short-sale negotiations, but make the next two posts about starter homes.", expectedCategories: ["identity", "temporary"], expectedIdentityFields: ["specialties"], expectedTemporaryType: "counter" },
  { id: "M05", group: "mixed", note: "My new professional title is Associate Broker, and I grew up in Nogales.", expectedCategories: ["identity"], expectedIdentityFields: ["professional_title", "personal_context"], expectedTemporaryType: null },
  { id: "M06", group: "mixed", note: "I specialize in estate-sale properties and mainly represent seniors who are downsizing.", expectedCategories: ["identity"], expectedIdentityFields: ["specialties", "target_audience"], expectedTemporaryType: null },
] as const;

export const IDENTITY_PRECISION_EXPECTED_COUNT = 34;
