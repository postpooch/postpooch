/**
 * POSTPOOCH — INTENT-AWARE JEV BENCHMARK L (EVALUATION ONLY)
 * 264 fresh labeled notes in 22 balanced groups + 24 diagnostic replays.
 * ONLY { note: case.note } goes into Jev. No gold labels, examples or group metadata.
 * IMPORTANT: Category relevance is not an instruction to mutate.
 * - An unopposed client quote can be category-relevant.
 * - A request for advice about a category can be category-relevant.
 * - The second agent decides whether/what to change; NOT evaluated here.
 * - Explicitly unrelated quotes and ordinary app/support questions get [].
 * - few / handful / couple = counter; next agent selects the exact amount.
 * - GoldConfidence interpretive cases must be broken out from high-consensus core.
 * - Do not change labels after observing Jev outputs.
 */
export const JEV_INTENT_BENCHMARK_L_CASES = [
  {
    "id": "L-001",
    "cohort": "fresh",
    "group": "identity_explicit",
    "note": "Please change the public-facing name on my realtor profile to Simone Caldera.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity explicit"
  },
  {
    "id": "L-002",
    "cohort": "fresh",
    "group": "identity_explicit",
    "note": "From now on, my professional name is M. R. Alvarez.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity explicit"
  },
  {
    "id": "L-003",
    "cohort": "fresh",
    "group": "identity_explicit",
    "note": "My new job title is Associate Managing Broker.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity explicit"
  },
  {
    "id": "L-004",
    "cohort": "fresh",
    "group": "identity_explicit",
    "note": "Remove Principal Agent as my title; use Broker Associate.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity explicit"
  },
  {
    "id": "L-005",
    "cohort": "fresh",
    "group": "identity_explicit",
    "note": "I have joined Sundial Harbor Realty.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity explicit"
  },
  {
    "id": "L-006",
    "cohort": "fresh",
    "group": "identity_explicit",
    "note": "Please list Coyote Mesa Partners as my current team.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity explicit"
  },
  {
    "id": "L-007",
    "cohort": "fresh",
    "group": "identity_explicit",
    "note": "I am now taking seller clients throughout Cave Creek.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity explicit"
  },
  {
    "id": "L-008",
    "cohort": "fresh",
    "group": "identity_explicit",
    "note": "Remove Anthem from the list of markets where I work.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity explicit"
  },
  {
    "id": "L-009",
    "cohort": "fresh",
    "group": "identity_explicit",
    "note": "My ideal clients are military families purchasing their first house.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity explicit"
  },
  {
    "id": "L-010",
    "cohort": "fresh",
    "group": "identity_explicit",
    "note": "I have stopped handling foreclosure transactions as a specialty.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity explicit"
  },
  {
    "id": "L-011",
    "cohort": "fresh",
    "group": "identity_explicit",
    "note": "I earned my degree in architectural engineering before starting real estate.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity explicit"
  },
  {
    "id": "L-012",
    "cohort": "fresh",
    "group": "identity_explicit",
    "note": "Set the primary brand color to #315A71 and the secondary to #C89B4D.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "primary_brand_color",
      "secondary_brand_color"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity explicit"
  },
  {
    "id": "L-013",
    "cohort": "fresh",
    "group": "identity_implicit",
    "note": "These days I introduce myself professionally as Quinn Solis.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity implicit"
  },
  {
    "id": "L-014",
    "cohort": "fresh",
    "group": "identity_implicit",
    "note": "I am the designated broker, not an assistant broker anymore.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity implicit"
  },
  {
    "id": "L-015",
    "cohort": "fresh",
    "group": "identity_implicit",
    "note": "After the merger, my brokerage is now Juniper Crown Realty.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity implicit"
  },
  {
    "id": "L-016",
    "cohort": "fresh",
    "group": "identity_implicit",
    "note": "I spend my working days representing clients in Paradise Valley and Arcadia.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity implicit"
  },
  {
    "id": "L-017",
    "cohort": "fresh",
    "group": "identity_implicit",
    "note": "My customer base is mostly people downsizing after retirement.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity implicit"
  },
  {
    "id": "L-018",
    "cohort": "fresh",
    "group": "identity_implicit",
    "note": "Probate listings and estate sales have become my main line of work.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity implicit"
  },
  {
    "id": "L-019",
    "cohort": "fresh",
    "group": "identity_implicit",
    "note": "Investment condominiums are no longer part of my practice.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity implicit"
  },
  {
    "id": "L-020",
    "cohort": "fresh",
    "group": "identity_implicit",
    "note": "I grew up in Boise and used to work as a school counselor.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity implicit"
  },
  {
    "id": "L-021",
    "cohort": "fresh",
    "group": "identity_implicit",
    "note": "I coach youth soccer in my free time.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity implicit"
  },
  {
    "id": "L-022",
    "cohort": "fresh",
    "group": "identity_implicit",
    "note": "The official primary color of my brand is sea glass green.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity implicit"
  },
  {
    "id": "L-023",
    "cohort": "fresh",
    "group": "identity_implicit",
    "note": "Burnt sienna is our designated secondary brand color now.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity implicit"
  },
  {
    "id": "L-024",
    "cohort": "fresh",
    "group": "identity_implicit",
    "note": "I recently switched to Harbor Beacon Homes as my team, and I primarily serve nurses relocating to the area.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "brokerage_name",
      "target_audience"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity implicit"
  },
  {
    "id": "L-025",
    "cohort": "fresh",
    "group": "identity_field_boundary",
    "note": "My job title is Relocation Specialist; I am not describing a practice niche.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity field boundary"
  },
  {
    "id": "L-026",
    "cohort": "fresh",
    "group": "identity_field_boundary",
    "note": "My title is Director of Luxury Sales, but my work itself is ordinary residential transactions.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity field boundary"
  },
  {
    "id": "L-027",
    "cohort": "fresh",
    "group": "identity_field_boundary",
    "note": "I specialize in selling homes with historic-preservation restrictions.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity field boundary"
  },
  {
    "id": "L-028",
    "cohort": "fresh",
    "group": "identity_field_boundary",
    "note": "I focus professionally on short-sale negotiations, rather than general listings.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity field boundary"
  },
  {
    "id": "L-029",
    "cohort": "fresh",
    "group": "identity_field_boundary",
    "note": "The clients I mainly help are newly divorced homeowners.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity field boundary"
  },
  {
    "id": "L-030",
    "cohort": "fresh",
    "group": "identity_field_boundary",
    "note": "A brochure describes Phoenix as a relocation destination, but I am not offering services there or requesting a post.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity field boundary"
  },
  {
    "id": "L-031",
    "cohort": "fresh",
    "group": "identity_field_boundary",
    "note": "My clients are moving to Prescott, but I only practice real estate in Flagstaff.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity field boundary"
  },
  {
    "id": "L-032",
    "cohort": "fresh",
    "group": "identity_field_boundary",
    "note": "I am a member of the Willow Lark Team at Ravencrest Realty.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity field boundary"
  },
  {
    "id": "L-033",
    "cohort": "fresh",
    "group": "identity_field_boundary",
    "note": "The team called Willow Lark was featured in a newspaper article, but I do not work for them.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity field boundary"
  },
  {
    "id": "L-034",
    "cohort": "fresh",
    "group": "identity_field_boundary",
    "note": "I retired from teaching years ago and now run a real estate business.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity field boundary"
  },
  {
    "id": "L-035",
    "cohort": "fresh",
    "group": "identity_field_boundary",
    "note": "Ask whether my current professional name is listed correctly.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity field boundary"
  },
  {
    "id": "L-036",
    "cohort": "fresh",
    "group": "identity_field_boundary",
    "note": "My public display name is Taylor Finch, and I have joined Quail Song Realty.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "display_name",
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity field boundary"
  },
  {
    "id": "L-037",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Use a relaxed, confident tone in captions as the normal approach.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference only"
  },
  {
    "id": "L-038",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Please stop putting exclamation points at the end of every sentence.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference only"
  },
  {
    "id": "L-039",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Whenever you explain a loan term, define it in plain language inside that post.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference only"
  },
  {
    "id": "L-040",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Give all property photographs a true-to-life appearance, with minimal sharpening.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference only"
  },
  {
    "id": "L-041",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "I prefer down-to-earth renovation guidance over celebrity-property gossip.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference only"
  },
  {
    "id": "L-042",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Keep each post readable by using short paragraphs.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference only"
  },
  {
    "id": "L-043",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Avoid inspirational stock imagery as a standing design rule.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference only"
  },
  {
    "id": "L-044",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Use more detail in each inspection-related caption; the current ones are too shallow.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference only"
  },
  {
    "id": "L-045",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Keep a conversational first-person voice for posts about my experiences.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference only"
  },
  {
    "id": "L-046",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Whenever a poll appears, its question should fit on a single line.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference only"
  },
  {
    "id": "L-047",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Do not place the brokerage logo over a listing photo.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference only"
  },
  {
    "id": "L-048",
    "cohort": "fresh",
    "group": "preference_only",
    "note": "Treat muted earth tones as our usual graphic look, regardless of post topic.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference only"
  },
  {
    "id": "L-049",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Talk more about financing mistakes in our posts.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "frequency only"
  },
  {
    "id": "L-050",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Feature fewer luxury-estate spotlights in the ongoing schedule.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "frequency only"
  },
  {
    "id": "L-051",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Mix in a neighborhood walking-tour post once in a while.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "frequency only"
  },
  {
    "id": "L-052",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Have client success stories make up about one out of six posts.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "frequency only"
  },
  {
    "id": "L-053",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Stop doing celebrity mansion roundups in the regular rotation.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "frequency only"
  },
  {
    "id": "L-054",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Please make new-construction updates a larger proportion of our content.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "frequency only"
  },
  {
    "id": "L-055",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "We need fewer listing-only announcements and more educational posts.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "frequency only"
  },
  {
    "id": "L-056",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Occasionally include an audience poll in the normal post lineup.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "frequency only"
  },
  {
    "id": "L-057",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Cut back on the number of posts centered on mortgage rates.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "frequency only"
  },
  {
    "id": "L-058",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Could we regularly rotate in renter-to-owner success stories?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "frequency only"
  },
  {
    "id": "L-059",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "I would like one in every five posts to highlight a local business.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "frequency only"
  },
  {
    "id": "L-060",
    "cohort": "fresh",
    "group": "frequency_only",
    "note": "Bring back open-house preparation topics to our usual content mix.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "frequency only"
  },
  {
    "id": "L-061",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "Use a charcoal background for the next five posts.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "temporary only"
  },
  {
    "id": "L-062",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "Make tomorrow’s graphic about home inspections.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "temporary only"
  },
  {
    "id": "L-063",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "For the next handful of posts, use hand-drawn arrows.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "temporary only"
  },
  {
    "id": "L-064",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "Run seller checklists throughout the first half of November.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "temporary only"
  },
  {
    "id": "L-065",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "In my next couple of posts, promote our buyer workshop.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "temporary only"
  },
  {
    "id": "L-066",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "Make the post on October 27 about earnest-money deposits.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "temporary only"
  },
  {
    "id": "L-067",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "For the next few posts, switch to candid home-interior photos.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "temporary only"
  },
  {
    "id": "L-068",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "During the next ten days, concentrate on downsizing advice.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "temporary only"
  },
  {
    "id": "L-069",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "For the next single post, use a title with no punctuation.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "temporary only"
  },
  {
    "id": "L-070",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "Use bolder fonts until the end of this month.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "temporary only"
  },
  {
    "id": "L-071",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "For a little while, try a warmer illustration style.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "temporary only"
  },
  {
    "id": "L-072",
    "cohort": "fresh",
    "group": "temporary_only",
    "note": "For the next three posts, feature buyer budgeting; during December, feature local holiday events.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "temporary only"
  },
  {
    "id": "L-073",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Normally write in a friendly tone; use a very formal style for the next four posts.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "preference temporary"
  },
  {
    "id": "L-074",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Keep photography realistic in general, but use sketch-like images tomorrow.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "preference temporary"
  },
  {
    "id": "L-075",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "I want concise captions as a permanent default, except for longer captions during November.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "preference temporary"
  },
  {
    "id": "L-076",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "By default avoid pink in graphics; for the next three posts, use bright pink accents.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "preference temporary"
  },
  {
    "id": "L-077",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Always define technical terms, but on next Friday’s post explain title insurance in depth.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "preference temporary"
  },
  {
    "id": "L-078",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Do not use stock people photos ordinarily; use studio portraits for the next couple of posts.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "preference temporary"
  },
  {
    "id": "L-079",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Keep each poll question under nine words; for my next poll post use a yellow background.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "preference temporary"
  },
  {
    "id": "L-080",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "My standard caption voice should be first person; use third person for tomorrow’s announcement.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "preference temporary"
  },
  {
    "id": "L-081",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Normally use fewer hashtags, but omit hashtags entirely for the next two posts.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "preference temporary"
  },
  {
    "id": "L-082",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Generally avoid call-to-action banners; for the next handful of posts include one.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "preference temporary"
  },
  {
    "id": "L-083",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Make images bright but natural overall; during the first week of December use sepia filters.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "preference temporary"
  },
  {
    "id": "L-084",
    "cohort": "fresh",
    "group": "preference_temporary",
    "note": "Keep writing clear and direct in regular posts; for a little while use playful headings.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "preference temporary"
  },
  {
    "id": "L-085",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "My primary brand color is now #2A6271. Use pale peach on tomorrow’s graphic.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "identity temporary"
  },
  {
    "id": "L-086",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "My secondary brand color is copper. For the next three posts, use blue backgrounds.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "identity temporary"
  },
  {
    "id": "L-087",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "I joined Saguaro Light Realty; make the next couple of posts black and white.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "identity temporary"
  },
  {
    "id": "L-088",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "I now represent clients in Avondale. For next week’s posts, use a handwritten headline.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "identity temporary"
  },
  {
    "id": "L-089",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "My professional title changed to Managing Broker. Use square graphics on the next four posts.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "identity temporary"
  },
  {
    "id": "L-090",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "I focus on historic properties. Use photo collages for the November posts.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "identity temporary"
  },
  {
    "id": "L-091",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "Most of my clients are move-up buyers now. Use pastel graphics on the next few posts.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "identity temporary"
  },
  {
    "id": "L-092",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "I grew up in New Mexico. Make this Saturday’s graphic feature yellow text.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "identity temporary"
  },
  {
    "id": "L-093",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "Please use Nora Vale as my displayed name. Give tomorrow’s post a navy border.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "identity temporary"
  },
  {
    "id": "L-094",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "I no longer specialize in vacation rentals. Add drawings of keys to the next three posts.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "identity temporary"
  },
  {
    "id": "L-095",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "Our main brand shade is plum and our secondary shade is cream; use lime green in the next two graphics.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color",
      "secondary_brand_color"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "identity temporary"
  },
  {
    "id": "L-096",
    "cohort": "fresh",
    "group": "identity_temporary",
    "note": "My team is now Golden Ridge Group; for the next month, run photos with no frames.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "identity temporary"
  },
  {
    "id": "L-097",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "My brokerage is now Paloma Vista Realty, and captions should generally avoid industry slang.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity preference"
  },
  {
    "id": "L-098",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "I have started serving Anthem; use longer explanations inside every educational post.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity preference"
  },
  {
    "id": "L-099",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "My display name is Ari Merrow, and keep our normal writing voice approachable.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity preference"
  },
  {
    "id": "L-100",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "I mostly work with cash buyers; whenever discussing appraisals, explain jargon simply.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity preference"
  },
  {
    "id": "L-101",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "My title is Designated Broker; our photos should look unfiltered by default.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity preference"
  },
  {
    "id": "L-102",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "My primary brand color is #1F5272; always use high-contrast headline text.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity preference"
  },
  {
    "id": "L-103",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "My secondary brand color is warm gold; stop using decorative script fonts as a rule.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity preference"
  },
  {
    "id": "L-104",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "I used to be a paramedic; keep each story caption in my own voice.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity preference"
  },
  {
    "id": "L-105",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "I specialize in duplex investments; posts about them should include simple examples.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity preference"
  },
  {
    "id": "L-106",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "I no longer handle probate sales; do not use overly promotional language anywhere.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity preference"
  },
  {
    "id": "L-107",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "We joined Larkspur Homes, and a friendly closing question should be part of every caption.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity preference"
  },
  {
    "id": "L-108",
    "cohort": "fresh",
    "group": "identity_preference",
    "note": "I am now working with families relocating from military bases; keep captions short by default.",
    "expectedCategories": [
      "identity",
      "preference"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "identity preference"
  },
  {
    "id": "L-109",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Put more renovation myths in the normal rotation; explain each myth in three plain sentences.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference frequency"
  },
  {
    "id": "L-110",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Do local history posts occasionally, and include an actual date in each one.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference frequency"
  },
  {
    "id": "L-111",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Publish fewer rate-update posts; when we do post one, avoid alarmist language.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference frequency"
  },
  {
    "id": "L-112",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Let client stories make up a larger share, but anonymize names inside each story.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference frequency"
  },
  {
    "id": "L-113",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "I want a neighborhood spotlight one in every seven posts, with map-free layouts whenever it appears.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference frequency"
  },
  {
    "id": "L-114",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Talk less about bidding wars, and include concrete numbers when you do discuss them.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference frequency"
  },
  {
    "id": "L-115",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Bring back maintenance checklists more frequently; format every checklist as short bullets.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference frequency"
  },
  {
    "id": "L-116",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Use polls only once in a while; write every poll question in first person.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference frequency"
  },
  {
    "id": "L-117",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Reduce luxury-listing topics, and avoid big all-caps headlines in each post.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference frequency"
  },
  {
    "id": "L-118",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Feature financing FAQs more often, and define acronyms in each FAQ caption.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference frequency"
  },
  {
    "id": "L-119",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Publish community charity spotlights less often; always verify how organizations are named in those posts.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference frequency"
  },
  {
    "id": "L-120",
    "cohort": "fresh",
    "group": "preference_frequency",
    "note": "Mix in agent-day-in-the-life stories on occasion; keep the tone personal for each one.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "preference frequency"
  },
  {
    "id": "L-121",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Keep mixing in renter stories occasionally; for the next three posts focus on title insurance.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "frequency temporary"
  },
  {
    "id": "L-122",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Reduce regular mansion tours, but during November feature three scenic condo tours.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "frequency temporary"
  },
  {
    "id": "L-123",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Talk more about earnest money going forward; next week focus only on curb appeal.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "frequency temporary"
  },
  {
    "id": "L-124",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Bring back open-house content as a regular category; for the next couple of posts use neighborhood interviews.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "frequency temporary"
  },
  {
    "id": "L-125",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Make seller education a bigger share year-round; tomorrow’s post should explain appraisal gaps.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "frequency temporary"
  },
  {
    "id": "L-126",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Occasionally share buyer testimonials; for the next handful of posts publish staging advice.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "frequency temporary"
  },
  {
    "id": "L-127",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Stop producing monthly celebrity-home roundups, and make the next two posts about escrow.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "frequency temporary"
  },
  {
    "id": "L-128",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Post fewer price-chart explainers generally; during December cover local giving events.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "frequency temporary"
  },
  {
    "id": "L-129",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Add more property-tax tips to our usual lineup; the next four posts should be neighborhood profiles.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "frequency temporary"
  },
  {
    "id": "L-130",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Feature local restaurants sometimes; through next Friday focus on seller repairs.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "frequency temporary"
  },
  {
    "id": "L-131",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Do more client-success stories as a normal mix; try quick quizzes for a little while.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "frequency temporary"
  },
  {
    "id": "L-132",
    "cohort": "fresh",
    "group": "frequency_temporary",
    "note": "Have commercial leasing topics appear once in six posts; for next month publish relocation resources.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "frequency temporary"
  },
  {
    "id": "L-133",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "I moved to Cedar Coast Realty. Keep writing friendly normally, but use formal captions for next two posts.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "identity preference temporary"
  },
  {
    "id": "L-134",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "My primary brand color is marine blue. Keep visuals minimal by default, but add orange stickers tomorrow.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "identity preference temporary"
  },
  {
    "id": "L-135",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "My practice includes Carefree now. Use plain language normally; through November use illustrated diagrams.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "identity preference temporary"
  },
  {
    "id": "L-136",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "I now represent retirees primarily. Normally use natural photos, but use line-art drawings for the next few posts.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "identity preference temporary"
  },
  {
    "id": "L-137",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "My title is Managing Broker. Keep each caption under 100 words usually; for the next handful write longer stories.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "identity preference temporary"
  },
  {
    "id": "L-138",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "I left vacation-rental sales. Avoid stock photos generally; for the next couple of posts use studio shots.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "identity preference temporary"
  },
  {
    "id": "L-139",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "I was raised in Tucson. Keep captions in first person, but for the weekend use a third-person narrator.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "identity preference temporary"
  },
  {
    "id": "L-140",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "My professional name is Mel Rowan. Normally use small amounts of emoji, but use none for the next three posts.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "identity preference temporary"
  },
  {
    "id": "L-141",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "My secondary brand color is dusty rose. Make typography readable by default; for the next week use thin italic labels.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "identity preference temporary"
  },
  {
    "id": "L-142",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "Our new team is Silver Palm Partners. Regular captions should have short paragraphs; the next two should be one-liners.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "identity preference temporary"
  },
  {
    "id": "L-143",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "I have begun handling estate settlement sales. Normally use original photos; use watercolor scenes through December.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "identity preference temporary"
  },
  {
    "id": "L-144",
    "cohort": "fresh",
    "group": "identity_preference_temporary",
    "note": "My main audience is renters becoming buyers. Avoid slang generally; use playful slang for a little while.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "identity preference temporary"
  },
  {
    "id": "L-145",
    "cohort": "fresh",
    "group": "all_four",
    "note": "I joined Ironwood Realty; keep captions concise, cover home inspections more often, and use comics for the next three posts.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "all four"
  },
  {
    "id": "L-146",
    "cohort": "fresh",
    "group": "all_four",
    "note": "I am now a Broker Associate. Normally use original photos, add financing explainers to the rotation, and spotlight local cafes tomorrow.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "all four"
  },
  {
    "id": "L-147",
    "cohort": "fresh",
    "group": "all_four",
    "note": "I serve Tempe now; use plain-language captions, reduce luxury-home posts, and show neighborhood trails during November.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "all four"
  },
  {
    "id": "L-148",
    "cohort": "fresh",
    "group": "all_four",
    "note": "I mostly help first-time investors. Keep graphics low-clutter, post landlord tips more often, and use bold borders for the next few posts.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "all four"
  },
  {
    "id": "L-149",
    "cohort": "fresh",
    "group": "all_four",
    "note": "I now specialize in townhouse sales. Never use stock portraits, bring back staging posts sometimes, and focus on kitchen layouts next week.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "all four"
  },
  {
    "id": "L-150",
    "cohort": "fresh",
    "group": "all_four",
    "note": "My professional name is Jules Ferris. Use approachable headlines by default, feature move-in tips occasionally, and post a school-district graphic this Friday.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "all four"
  },
  {
    "id": "L-151",
    "cohort": "fresh",
    "group": "all_four",
    "note": "I used to be a civil engineer. Keep a calm voice, cut back on rate forecasts, and use map illustrations for the next four posts.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "all four"
  },
  {
    "id": "L-152",
    "cohort": "fresh",
    "group": "all_four",
    "note": "My primary brand color is pine green. Keep text highly legible, rotate in pet-friendly listings sometimes, and use bright yellow cards tomorrow.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "all four"
  },
  {
    "id": "L-153",
    "cohort": "fresh",
    "group": "all_four",
    "note": "Our secondary brand color changed to sand. Keep poll questions short, run polls more often, and feature a buyer workshop in the next two posts.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "all four"
  },
  {
    "id": "L-154",
    "cohort": "fresh",
    "group": "all_four",
    "note": "I changed brokerages to West Cove Homes. Use a welcoming writing style, add more homeowner maintenance content, and try line-art panels next month.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "all four"
  },
  {
    "id": "L-155",
    "cohort": "fresh",
    "group": "all_four",
    "note": "My title is Senior Managing Broker. Avoid heavy filters, feature closing-day tips one in five posts, and use a vintage effect for the next handful.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "all four"
  },
  {
    "id": "L-156",
    "cohort": "fresh",
    "group": "all_four",
    "note": "I work in Peoria now. I prefer practical seller advice to celebrity gossip; publish neighborhood histories more often; make tomorrow’s post about HOA rules.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "all four"
  },
  {
    "id": "L-157",
    "cohort": "fresh",
    "group": "quoted_delegation",
    "note": "My seller texted, “Use teal for the next three posts.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed third-party suggestion supplied as a realtor note is relevant to the stated category; second agent decides whether to enact it."
  },
  {
    "id": "L-158",
    "cohort": "fresh",
    "group": "quoted_delegation",
    "note": "A client suggested, “Make tomorrow’s graphic a walkthrough checklist.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed third-party suggestion supplied as a realtor note is relevant to the stated category; second agent decides whether to enact it."
  },
  {
    "id": "L-159",
    "cohort": "fresh",
    "group": "quoted_delegation",
    "note": "My partner said, “Please make the usual captions less salesy.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed third-party suggestion supplied as a realtor note is relevant to the stated category; second agent decides whether to enact it."
  },
  {
    "id": "L-160",
    "cohort": "fresh",
    "group": "quoted_delegation",
    "note": "One of my buyers asked, “Could you publish neighborhood highlights more often?”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed third-party suggestion supplied as a realtor note is relevant to the stated category; second agent decides whether to enact it."
  },
  {
    "id": "L-161",
    "cohort": "fresh",
    "group": "quoted_delegation",
    "note": "My assistant’s message was, “For the next few posts, try candid outdoor photos.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed third-party suggestion supplied as a realtor note is relevant to the stated category; second agent decides whether to enact it."
  },
  {
    "id": "L-162",
    "cohort": "fresh",
    "group": "quoted_delegation",
    "note": "A longtime customer recommended, “Whenever you discuss rates, explain what APR means.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed third-party suggestion supplied as a realtor note is relevant to the stated category; second agent decides whether to enact it."
  },
  {
    "id": "L-163",
    "cohort": "fresh",
    "group": "quoted_delegation",
    "note": "The homeowner said, “Please add more seller-prep posts into your regular mix.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed third-party suggestion supplied as a realtor note is relevant to the stated category; second agent decides whether to enact it."
  },
  {
    "id": "L-164",
    "cohort": "fresh",
    "group": "quoted_delegation",
    "note": "My photographer told me, “Run minimalist illustrations throughout November.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed third-party suggestion supplied as a realtor note is relevant to the stated category; second agent decides whether to enact it."
  },
  {
    "id": "L-165",
    "cohort": "fresh",
    "group": "quoted_delegation",
    "note": "My coach suggested, “Avoid exaggerated claims in captions from now on.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed third-party suggestion supplied as a realtor note is relevant to the stated category; second agent decides whether to enact it."
  },
  {
    "id": "L-166",
    "cohort": "fresh",
    "group": "quoted_delegation",
    "note": "My client messaged me, “Use bright orange on the next handful of graphics.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed third-party suggestion supplied as a realtor note is relevant to the stated category; second agent decides whether to enact it."
  },
  {
    "id": "L-167",
    "cohort": "fresh",
    "group": "quoted_delegation",
    "note": "The team lead proposed, “One in six posts should be a local business feature.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed third-party suggestion supplied as a realtor note is relevant to the stated category; second agent decides whether to enact it."
  },
  {
    "id": "L-168",
    "cohort": "fresh",
    "group": "quoted_delegation",
    "note": "My buyer said, “Can you make this weekend’s post about open-house etiquette?”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed third-party suggestion supplied as a realtor note is relevant to the stated category; second agent decides whether to enact it."
  },
  {
    "id": "L-169",
    "cohort": "fresh",
    "group": "quoted_override",
    "note": "My seller asked, “Purple in the next two posts.” I disagree: make them orange.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Routing should capture the category; deciding which conflicting value wins belongs to the next agent."
  },
  {
    "id": "L-170",
    "cohort": "fresh",
    "group": "quoted_override",
    "note": "A buyer suggested formal captions going forward, but I would rather keep our normal tone conversational.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Routing should capture the category; deciding which conflicting value wins belongs to the next agent."
  },
  {
    "id": "L-171",
    "cohort": "fresh",
    "group": "quoted_override",
    "note": "My assistant wrote, “More luxury tours.” I disagree; feature homeowner maintenance more often instead.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Routing should capture the category; deciding which conflicting value wins belongs to the next agent."
  },
  {
    "id": "L-172",
    "cohort": "fresh",
    "group": "quoted_override",
    "note": "A client wants neon graphics throughout November; I want charcoal instead for that period.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Routing should capture the category; deciding which conflicting value wins belongs to the next agent."
  },
  {
    "id": "L-173",
    "cohort": "fresh",
    "group": "quoted_override",
    "note": "My coworker said, “Avoid all emojis permanently.” I prefer just one or two per caption.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Routing should capture the category; deciding which conflicting value wins belongs to the next agent."
  },
  {
    "id": "L-174",
    "cohort": "fresh",
    "group": "quoted_override",
    "note": "The photographer suggested watercolor for the next three posts, but I want natural snapshots instead.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Routing should capture the category; deciding which conflicting value wins belongs to the next agent."
  },
  {
    "id": "L-175",
    "cohort": "fresh",
    "group": "quoted_override",
    "note": "My buyer asked for fewer neighborhood spotlights. Actually, make them more frequent.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Routing should capture the category; deciding which conflicting value wins belongs to the next agent."
  },
  {
    "id": "L-176",
    "cohort": "fresh",
    "group": "quoted_override",
    "note": "A colleague said this Saturday’s post should be about mortgages. Ignore that idea and feature title insurance.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Routing should capture the category; deciding which conflicting value wins belongs to the next agent."
  },
  {
    "id": "L-177",
    "cohort": "fresh",
    "group": "quoted_override",
    "note": "My client asked for more inspirational quotes. I would prefer more practical buyer checklists in the rotation.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Routing should capture the category; deciding which conflicting value wins belongs to the next agent."
  },
  {
    "id": "L-178",
    "cohort": "fresh",
    "group": "quoted_override",
    "note": "Someone suggested longer captions as a general rule, but I want concise ones.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Routing should capture the category; deciding which conflicting value wins belongs to the next agent."
  },
  {
    "id": "L-179",
    "cohort": "fresh",
    "group": "quoted_override",
    "note": "My marketing partner asked for red backgrounds on the next handful of posts; use blue for those posts instead.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Routing should capture the category; deciding which conflicting value wins belongs to the next agent."
  },
  {
    "id": "L-180",
    "cohort": "fresh",
    "group": "quoted_override",
    "note": "My associate said avoid stock images, but I want to allow them when they look realistic.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Routing should capture the category; deciding which conflicting value wins belongs to the next agent."
  },
  {
    "id": "L-181",
    "cohort": "fresh",
    "group": "quoted_nonaction",
    "note": "Please transcribe this client quote exactly for my records, not as a request to update posts: “Use yellow for the next three posts.”",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly background, transcription, or unrelated text rather than a realtor request to modify posting categories."
  },
  {
    "id": "L-182",
    "cohort": "fresh",
    "group": "quoted_nonaction",
    "note": "This line is from a screenplay, not instructions for PostPooch: “Tomorrow, publish a red poster.”",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly background, transcription, or unrelated text rather than a realtor request to modify posting categories."
  },
  {
    "id": "L-183",
    "cohort": "fresh",
    "group": "quoted_nonaction",
    "note": "A marketing article contains the example “Use shorter captions forever.” I am only asking what the article means.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly background, transcription, or unrelated text rather than a realtor request to modify posting categories."
  },
  {
    "id": "L-184",
    "cohort": "fresh",
    "group": "quoted_nonaction",
    "note": "I am archiving the message “Do more real estate polls” for recordkeeping; I explicitly do not want posting changes.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly background, transcription, or unrelated text rather than a realtor request to modify posting categories."
  },
  {
    "id": "L-185",
    "cohort": "fresh",
    "group": "quoted_nonaction",
    "note": "This is a training example of bad client feedback: “For two weeks, make everything purple.” No changes requested.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly background, transcription, or unrelated text rather than a realtor request to modify posting categories."
  },
  {
    "id": "L-186",
    "cohort": "fresh",
    "group": "quoted_nonaction",
    "note": "I am quoting a newspaper, not giving a note: “Publish neighborhood news more often.”",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly background, transcription, or unrelated text rather than a realtor request to modify posting categories."
  },
  {
    "id": "L-187",
    "cohort": "fresh",
    "group": "quoted_nonaction",
    "note": "A former client once wrote “Use fewer hashtags.” This is a historical record; do not treat it as my instruction.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly background, transcription, or unrelated text rather than a realtor request to modify posting categories."
  },
  {
    "id": "L-188",
    "cohort": "fresh",
    "group": "quoted_nonaction",
    "note": "For a testimonial transcription only, preserve the phrase “Make the next four posts about escrow.” Do not act on it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly background, transcription, or unrelated text rather than a realtor request to modify posting categories."
  },
  {
    "id": "L-189",
    "cohort": "fresh",
    "group": "quoted_nonaction",
    "note": "A pasted flyer reads “Use mint graphics all November.” I just need help proofreading the flyer, not changing our posts.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly background, transcription, or unrelated text rather than a realtor request to modify posting categories."
  },
  {
    "id": "L-190",
    "cohort": "fresh",
    "group": "quoted_nonaction",
    "note": "This interview included “Stop posting open-house photos.” It is a quotation to be summarized, not a posting request.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly background, transcription, or unrelated text rather than a realtor request to modify posting categories."
  },
  {
    "id": "L-191",
    "cohort": "fresh",
    "group": "quoted_nonaction",
    "note": "I am reporting a spam message: “Update your brokerage to Crest Valley Homes.” That is not my brokerage.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly background, transcription, or unrelated text rather than a realtor request to modify posting categories."
  },
  {
    "id": "L-192",
    "cohort": "fresh",
    "group": "quoted_nonaction",
    "note": "A sample business letter says “Make tomorrow’s post blue.” Please explain the grammar; no content changes.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly background, transcription, or unrelated text rather than a realtor request to modify posting categories."
  },
  {
    "id": "L-193",
    "cohort": "fresh",
    "group": "advisory_questions",
    "note": "Would a peach-colored graphic work better for this weekend’s post?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "A question proposing a category-specific posting decision is relevant to that category; Jev need not settle yes/no action."
  },
  {
    "id": "L-194",
    "cohort": "fresh",
    "group": "advisory_questions",
    "note": "Would using a friendlier voice in captions make us seem more approachable?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A question proposing a category-specific posting decision is relevant to that category; Jev need not settle yes/no action."
  },
  {
    "id": "L-195",
    "cohort": "fresh",
    "group": "advisory_questions",
    "note": "Do you think more first-time-buyer stories in our normal mix could raise engagement?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A question proposing a category-specific posting decision is relevant to that category; Jev need not settle yes/no action."
  },
  {
    "id": "L-196",
    "cohort": "fresh",
    "group": "advisory_questions",
    "note": "Should the next three posts be about preparing for an open house?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "A question proposing a category-specific posting decision is relevant to that category; Jev need not settle yes/no action."
  },
  {
    "id": "L-197",
    "cohort": "fresh",
    "group": "advisory_questions",
    "note": "Would it be smarter to use smaller blocks of text inside each caption?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A question proposing a category-specific posting decision is relevant to that category; Jev need not settle yes/no action."
  },
  {
    "id": "L-198",
    "cohort": "fresh",
    "group": "advisory_questions",
    "note": "Could a handful of upcoming posts about curb appeal help engagement?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "A question proposing a category-specific posting decision is relevant to that category; Jev need not settle yes/no action."
  },
  {
    "id": "L-199",
    "cohort": "fresh",
    "group": "advisory_questions",
    "note": "Do you think we should introduce neighborhood interviews once in a while?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A question proposing a category-specific posting decision is relevant to that category; Jev need not settle yes/no action."
  },
  {
    "id": "L-200",
    "cohort": "fresh",
    "group": "advisory_questions",
    "note": "Would a yellow outline improve tomorrow’s listing graphic?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "A question proposing a category-specific posting decision is relevant to that category; Jev need not settle yes/no action."
  },
  {
    "id": "L-201",
    "cohort": "fresh",
    "group": "advisory_questions",
    "note": "Would a permanent ban on stock photographs improve our look?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A question proposing a category-specific posting decision is relevant to that category; Jev need not settle yes/no action."
  },
  {
    "id": "L-202",
    "cohort": "fresh",
    "group": "advisory_questions",
    "note": "Could we talk more about property taxes in our posts?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A question proposing a category-specific posting decision is relevant to that category; Jev need not settle yes/no action."
  },
  {
    "id": "L-203",
    "cohort": "fresh",
    "group": "advisory_questions",
    "note": "Do you think next week’s posts should use video-still thumbnails?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "A question proposing a category-specific posting decision is relevant to that category; Jev need not settle yes/no action."
  },
  {
    "id": "L-204",
    "cohort": "fresh",
    "group": "advisory_questions",
    "note": "Should we normally define technical jargon whenever we cover mortgages?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A question proposing a category-specific posting decision is relevant to that category; Jev need not settle yes/no action."
  },
  {
    "id": "L-205",
    "cohort": "fresh",
    "group": "tentative_requests",
    "note": "Maybe try deep-blue backgrounds on the next couple of graphics.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "A proposed content change is routed to the relevant category; second agent handles adoption/degree."
  },
  {
    "id": "L-206",
    "cohort": "fresh",
    "group": "tentative_requests",
    "note": "I am thinking we could post seller Q&As more often.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A proposed content change is routed to the relevant category; second agent handles adoption/degree."
  },
  {
    "id": "L-207",
    "cohort": "fresh",
    "group": "tentative_requests",
    "note": "Perhaps our captions could be a bit shorter as a general style.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A proposed content change is routed to the relevant category; second agent handles adoption/degree."
  },
  {
    "id": "L-208",
    "cohort": "fresh",
    "group": "tentative_requests",
    "note": "I am considering an illustration style for the weekend’s listing post.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "A proposed content change is routed to the relevant category; second agent handles adoption/degree."
  },
  {
    "id": "L-209",
    "cohort": "fresh",
    "group": "tentative_requests",
    "note": "It might be worth adding homeowner checklists to our usual rotation.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A proposed content change is routed to the relevant category; second agent handles adoption/degree."
  },
  {
    "id": "L-210",
    "cohort": "fresh",
    "group": "tentative_requests",
    "note": "I wonder if the regular graphic style should be cleaner and less busy.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A proposed content change is routed to the relevant category; second agent handles adoption/degree."
  },
  {
    "id": "L-211",
    "cohort": "fresh",
    "group": "tentative_requests",
    "note": "Maybe spend the next three posts explaining the closing process.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "A proposed content change is routed to the relevant category; second agent handles adoption/degree."
  },
  {
    "id": "L-212",
    "cohort": "fresh",
    "group": "tentative_requests",
    "note": "We could probably stop doing celebrity-home posts altogether.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A proposed content change is routed to the relevant category; second agent handles adoption/degree."
  },
  {
    "id": "L-213",
    "cohort": "fresh",
    "group": "tentative_requests",
    "note": "I am leaning toward warmer headlines as our default writing style.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A proposed content change is routed to the relevant category; second agent handles adoption/degree."
  },
  {
    "id": "L-214",
    "cohort": "fresh",
    "group": "tentative_requests",
    "note": "What if we used coral graphics for the next few posts?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "A proposed content change is routed to the relevant category; second agent handles adoption/degree."
  },
  {
    "id": "L-215",
    "cohort": "fresh",
    "group": "tentative_requests",
    "note": "I am debating whether an occasional local park highlight belongs in the mix.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A proposed content change is routed to the relevant category; second agent handles adoption/degree."
  },
  {
    "id": "L-216",
    "cohort": "fresh",
    "group": "tentative_requests",
    "note": "Perhaps photos should be less saturated on most posts.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "A proposed content change is routed to the relevant category; second agent handles adoption/degree."
  },
  {
    "id": "L-217",
    "cohort": "fresh",
    "group": "nonaction_counterfactual",
    "note": "Last spring I saw a campaign with purple graphics for four posts; that is only background context.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Past observation, counterfactual, or third-party report explicitly not presented as our content decision."
  },
  {
    "id": "L-218",
    "cohort": "fresh",
    "group": "nonaction_counterfactual",
    "note": "I used to read more first-time-buyer content back when I was studying marketing.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Past observation, counterfactual, or third-party report explicitly not presented as our content decision."
  },
  {
    "id": "L-219",
    "cohort": "fresh",
    "group": "nonaction_counterfactual",
    "note": "A realtor on television said her next five posts would be about homes near parks.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Past observation, counterfactual, or third-party report explicitly not presented as our content decision."
  },
  {
    "id": "L-220",
    "cohort": "fresh",
    "group": "nonaction_counterfactual",
    "note": "If a fictional agent wrote “more posts about escrow,” how would you punctuate the sentence?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Past observation, counterfactual, or third-party report explicitly not presented as our content decision."
  },
  {
    "id": "L-221",
    "cohort": "fresh",
    "group": "nonaction_counterfactual",
    "note": "My neighbor once planned a seven-day listing campaign; I am just recalling it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Past observation, counterfactual, or third-party report explicitly not presented as our content decision."
  },
  {
    "id": "L-222",
    "cohort": "fresh",
    "group": "nonaction_counterfactual",
    "note": "The case study describes a brokerage with a permanent no-emoji rule, not ours.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Past observation, counterfactual, or third-party report explicitly not presented as our content decision."
  },
  {
    "id": "L-223",
    "cohort": "fresh",
    "group": "nonaction_counterfactual",
    "note": "A podcast guest said all graphics should have drop shadows. This is a quote from the episode.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Past observation, counterfactual, or third-party report explicitly not presented as our content decision."
  },
  {
    "id": "L-224",
    "cohort": "fresh",
    "group": "nonaction_counterfactual",
    "note": "In a novel I read, the realtor was told to make her next three posts blue.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Past observation, counterfactual, or third-party report explicitly not presented as our content decision."
  },
  {
    "id": "L-225",
    "cohort": "fresh",
    "group": "nonaction_counterfactual",
    "note": "An old industry report discussed whether extra local-history posts helped people.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Past observation, counterfactual, or third-party report explicitly not presented as our content decision."
  },
  {
    "id": "L-226",
    "cohort": "fresh",
    "group": "nonaction_counterfactual",
    "note": "Yesterday I noticed that someone else posted two orange designs in a row.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Past observation, counterfactual, or third-party report explicitly not presented as our content decision."
  },
  {
    "id": "L-227",
    "cohort": "fresh",
    "group": "nonaction_counterfactual",
    "note": "The client’s old marketing brief contains a sentence about using short captions; we are not adopting it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Past observation, counterfactual, or third-party report explicitly not presented as our content decision."
  },
  {
    "id": "L-228",
    "cohort": "fresh",
    "group": "nonaction_counterfactual",
    "note": "I am collecting examples of advice people give agents, not asking you to change content.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Past observation, counterfactual, or third-party report explicitly not presented as our content decision."
  },
  {
    "id": "L-229",
    "cohort": "fresh",
    "group": "out_of_scope",
    "note": "How do I export my CRM contacts to a spreadsheet?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "May need a helpful response or another product workflow, but supplies no Identity/Preference/Frequency/Temporary update."
  },
  {
    "id": "L-230",
    "cohort": "fresh",
    "group": "out_of_scope",
    "note": "What time zone does Phoenix use during December?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "May need a helpful response or another product workflow, but supplies no Identity/Preference/Frequency/Temporary update."
  },
  {
    "id": "L-231",
    "cohort": "fresh",
    "group": "out_of_scope",
    "note": "Can you explain the difference between a deed and a title?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "May need a helpful response or another product workflow, but supplies no Identity/Preference/Frequency/Temporary update."
  },
  {
    "id": "L-232",
    "cohort": "fresh",
    "group": "out_of_scope",
    "note": "Where do I find my account billing receipt?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "May need a helpful response or another product workflow, but supplies no Identity/Preference/Frequency/Temporary update."
  },
  {
    "id": "L-233",
    "cohort": "fresh",
    "group": "out_of_scope",
    "note": "How can I reset my password on this website?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "May need a helpful response or another product workflow, but supplies no Identity/Preference/Frequency/Temporary update."
  },
  {
    "id": "L-234",
    "cohort": "fresh",
    "group": "out_of_scope",
    "note": "What is the typical mortgage amortization formula?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "May need a helpful response or another product workflow, but supplies no Identity/Preference/Frequency/Temporary update."
  },
  {
    "id": "L-235",
    "cohort": "fresh",
    "group": "out_of_scope",
    "note": "How do I connect my Google Business Profile?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "May need a helpful response or another product workflow, but supplies no Identity/Preference/Frequency/Temporary update."
  },
  {
    "id": "L-236",
    "cohort": "fresh",
    "group": "out_of_scope",
    "note": "Can you help me understand whether an agent needs professional liability insurance?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "May need a helpful response or another product workflow, but supplies no Identity/Preference/Frequency/Temporary update."
  },
  {
    "id": "L-237",
    "cohort": "fresh",
    "group": "out_of_scope",
    "note": "What is the best way to organize my calendar?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "May need a helpful response or another product workflow, but supplies no Identity/Preference/Frequency/Temporary update."
  },
  {
    "id": "L-238",
    "cohort": "fresh",
    "group": "out_of_scope",
    "note": "How do I update the email address used for account notifications?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "May need a helpful response or another product workflow, but supplies no Identity/Preference/Frequency/Temporary update."
  },
  {
    "id": "L-239",
    "cohort": "fresh",
    "group": "out_of_scope",
    "note": "What does a rate lock mean for homebuyers?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "May need a helpful response or another product workflow, but supplies no Identity/Preference/Frequency/Temporary update."
  },
  {
    "id": "L-240",
    "cohort": "fresh",
    "group": "out_of_scope",
    "note": "Where can I see the newsletter send history?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "May need a helpful response or another product workflow, but supplies no Identity/Preference/Frequency/Temporary update."
  },
  {
    "id": "L-241",
    "cohort": "fresh",
    "group": "contrast_actionable",
    "note": "A client suggested purple graphics for the next two posts, and I think we should try it.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Minimal-pair positive: wording makes category relevance explicit.",
    "pairId": "L-PAIR-01",
    "pairSide": "relevant"
  },
  {
    "id": "L-242",
    "cohort": "fresh",
    "group": "contrast_nonaction",
    "note": "A client suggested purple graphics for the next two posts, but I am only transcribing the complaint and do not want any changes.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair negative: explicit no-change or external-only context.",
    "pairId": "L-PAIR-01",
    "pairSide": "not_relevant"
  },
  {
    "id": "L-243",
    "cohort": "fresh",
    "group": "contrast_actionable",
    "note": "Would more community spotlights work better in our normal post mix?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair positive: wording makes category relevance explicit.",
    "pairId": "L-PAIR-02",
    "pairSide": "relevant"
  },
  {
    "id": "L-244",
    "cohort": "fresh",
    "group": "contrast_nonaction",
    "note": "A journal article asks 'Would more community spotlights work better?' I only want its citation.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair negative: explicit no-change or external-only context.",
    "pairId": "L-PAIR-02",
    "pairSide": "not_relevant"
  },
  {
    "id": "L-245",
    "cohort": "fresh",
    "group": "contrast_actionable",
    "note": "My broker recommends brief captions in general; let's adopt that.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair positive: wording makes category relevance explicit.",
    "pairId": "L-PAIR-03",
    "pairSide": "relevant"
  },
  {
    "id": "L-246",
    "cohort": "fresh",
    "group": "contrast_nonaction",
    "note": "My broker recommended brief captions in general; keep the message for records, but don't adopt it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair negative: explicit no-change or external-only context.",
    "pairId": "L-PAIR-03",
    "pairSide": "not_relevant"
  },
  {
    "id": "L-247",
    "cohort": "fresh",
    "group": "contrast_actionable",
    "note": "Please follow this draft instruction: 'For the next four posts, use diagrams.'",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Minimal-pair positive: wording makes category relevance explicit.",
    "pairId": "L-PAIR-04",
    "pairSide": "relevant"
  },
  {
    "id": "L-248",
    "cohort": "fresh",
    "group": "contrast_nonaction",
    "note": "Please proofread this draft sentence: 'For the next four posts, use diagrams.' Do not follow it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair negative: explicit no-change or external-only context.",
    "pairId": "L-PAIR-04",
    "pairSide": "not_relevant"
  },
  {
    "id": "L-249",
    "cohort": "fresh",
    "group": "contrast_actionable",
    "note": "I recently joined Lake Echo Realty as my brokerage.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair positive: wording makes category relevance explicit.",
    "pairId": "L-PAIR-05",
    "pairSide": "relevant"
  },
  {
    "id": "L-250",
    "cohort": "fresh",
    "group": "contrast_nonaction",
    "note": "My client recently joined Lake Echo Realty as their brokerage, not me.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair negative: explicit no-change or external-only context.",
    "pairId": "L-PAIR-05",
    "pairSide": "not_relevant"
  },
  {
    "id": "L-251",
    "cohort": "fresh",
    "group": "contrast_actionable",
    "note": "Our primary brand color is now #287F73.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair positive: wording makes category relevance explicit.",
    "pairId": "L-PAIR-06",
    "pairSide": "relevant"
  },
  {
    "id": "L-252",
    "cohort": "fresh",
    "group": "contrast_nonaction",
    "note": "A client’s primary brand color is #287F73; that is not my brand color.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair negative: explicit no-change or external-only context.",
    "pairId": "L-PAIR-06",
    "pairSide": "not_relevant"
  },
  {
    "id": "L-253",
    "cohort": "fresh",
    "group": "contrast_actionable",
    "note": "Let's make short bullet paragraphs our normal caption style.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair positive: wording makes category relevance explicit.",
    "pairId": "L-PAIR-07",
    "pairSide": "relevant"
  },
  {
    "id": "L-254",
    "cohort": "fresh",
    "group": "contrast_nonaction",
    "note": "A marketing course uses 'make short bullet paragraphs the normal style' as a hypothetical, not our direction.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair negative: explicit no-change or external-only context.",
    "pairId": "L-PAIR-07",
    "pairSide": "not_relevant"
  },
  {
    "id": "L-255",
    "cohort": "fresh",
    "group": "contrast_actionable",
    "note": "Bring back neighborhood features more often in our content rotation.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair positive: wording makes category relevance explicit.",
    "pairId": "L-PAIR-08",
    "pairSide": "relevant"
  },
  {
    "id": "L-256",
    "cohort": "fresh",
    "group": "contrast_nonaction",
    "note": "I am asking about the grammar of 'bring back neighborhood features more often,' not requesting new posts.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair negative: explicit no-change or external-only context.",
    "pairId": "L-PAIR-08",
    "pairSide": "not_relevant"
  },
  {
    "id": "L-257",
    "cohort": "fresh",
    "group": "contrast_actionable",
    "note": "What if we made next Tuesday's graphic entirely black and white?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Minimal-pair positive: wording makes category relevance explicit.",
    "pairId": "L-PAIR-09",
    "pairSide": "relevant"
  },
  {
    "id": "L-258",
    "cohort": "fresh",
    "group": "contrast_nonaction",
    "note": "In a play, a character says 'Make next Tuesday's graphic black and white.' This is a quote only.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair negative: explicit no-change or external-only context.",
    "pairId": "L-PAIR-09",
    "pairSide": "not_relevant"
  },
  {
    "id": "L-259",
    "cohort": "fresh",
    "group": "contrast_actionable",
    "note": "Let's try candid snapshots for the next few posts.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Minimal-pair positive: wording makes category relevance explicit.",
    "pairId": "L-PAIR-10",
    "pairSide": "relevant"
  },
  {
    "id": "L-260",
    "cohort": "fresh",
    "group": "contrast_nonaction",
    "note": "Someone else tried candid snapshots for the next few posts; I'm describing what happened, not asking you to copy it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair negative: explicit no-change or external-only context.",
    "pairId": "L-PAIR-10",
    "pairSide": "not_relevant"
  },
  {
    "id": "L-261",
    "cohort": "fresh",
    "group": "contrast_actionable",
    "note": "Keep captions under a hundred words as a general rule.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair positive: wording makes category relevance explicit.",
    "pairId": "L-PAIR-11",
    "pairSide": "relevant"
  },
  {
    "id": "L-262",
    "cohort": "fresh",
    "group": "contrast_nonaction",
    "note": "An old marketing brief says 'keep captions under a hundred words,' but we are not adopting that rule.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair negative: explicit no-change or external-only context.",
    "pairId": "L-PAIR-11",
    "pairSide": "not_relevant"
  },
  {
    "id": "L-263",
    "cohort": "fresh",
    "group": "contrast_actionable",
    "note": "My client asked for orange in the next two posts; sounds good, let's do it.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Minimal-pair positive: wording makes category relevance explicit.",
    "pairId": "L-PAIR-12",
    "pairSide": "relevant"
  },
  {
    "id": "L-264",
    "cohort": "fresh",
    "group": "contrast_nonaction",
    "note": "My client asked for orange in the next two posts; I refused and do not want any posting changes.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Minimal-pair negative: explicit no-change or external-only context.",
    "pairId": "L-PAIR-12",
    "pairSide": "not_relevant"
  },
  {
    "id": "L-R-01",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My client said \"Please use purple for the next two posts\" in a testimonial.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Under current agreement a bare client instruction submitted as a note can imply a request; \"in a testimonial\" adds ambiguity. Report separately."
  },
  {
    "id": "L-R-02",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My client said, \"Please use purple for the next two posts.\"",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Bare client instruction is category-relevant without requiring the quote to be an imperative from the realtor."
  },
  {
    "id": "L-R-03",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My client said, \"Please use purple for the next two posts.\" I disagree with them. Use orange.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Temporary context is relevant; next agent resolves purple versus orange and inherited two-post scope."
  },
  {
    "id": "L-R-04",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Would a post with a purple background perform better this weekend?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Advice request about a possible weekend-limited design is Temporary-relevant."
  },
  {
    "id": "L-R-05",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Would a two-week series about home insurance be useful?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Question proposing a bounded campaign is routed to Temporary; second agent decides viability."
  },
  {
    "id": "L-R-06",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "The event flyer says 'Post three neighborhood tips this month'.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Bare quoted finite campaign may be proposal; label is contestable, separated from primary evidence."
  },
  {
    "id": "L-R-07",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My primary brand color is #226B5E; for this weekend's graphic use purple.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Primary-brand fact plus bounded design, not a permanent preference."
  },
  {
    "id": "L-R-08",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Normally choose my own uploaded pictures; for next week's graphics use studio photographs.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Independent lasting image default and bounded override."
  },
  {
    "id": "L-R-09",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Include a poll in about one of every six posts; whenever a poll appears, keep its question under eight words.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Post mix frequency and conditional per-post length rule."
  },
  {
    "id": "L-R-10",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My team is now Westwind Realty; keep language straightforward, mention escrow myths more often, and make next week's posts use paper-cut illustrations.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Brokerage fact, lasting style, frequency change, temporary art; no display-name change."
  },
  {
    "id": "L-R-11",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My secondary brand color is now #E9B44C.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Identity-only brand fact."
  },
  {
    "id": "L-R-12",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Talk more about first-time buyer closing costs.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Talk more about X changes post mix."
  },
  {
    "id": "L-R-13",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "For the next handful of posts, focus on staging.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Fuzzy post count is still counter; agent chooses quantity."
  },
  {
    "id": "L-R-14",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "For a little while, let the visuals feel playful.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "No identifiable count or calendar kind."
  },
  {
    "id": "L-R-15",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "For the next two posts cover solar panels; during November, cover leasebacks.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "One choice cannot represent incompatible count and calendar constraints."
  },
  {
    "id": "L-R-16",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Keep captions conversational generally, but use bullet-point checklists for the next two posts.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Independent lasting plus bounded instructions."
  },
  {
    "id": "L-R-17",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Would posting more local business spotlights help engagement?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Advice about an ongoing mix change is Frequency-relevant."
  },
  {
    "id": "L-R-18",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Use fewer hashtags per post.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Less within every post, not fewer post types."
  },
  {
    "id": "L-R-19",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Stop publishing celebrity mansion roundup posts.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Remove this post category from ongoing distribution."
  },
  {
    "id": "L-R-20",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My primary brand color is navy; use yellow tomorrow.",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Brand fact plus temporary color choice."
  },
  {
    "id": "L-R-21",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Generally avoid stock images, but use grayscale graphics for the next three posts.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Permanent default and count-limited override."
  },
  {
    "id": "L-R-22",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My brokerage is now Red Mesa Homes; captions should stay upbeat normally, but during November use a serious tone.",
    "expectedCategories": [
      "identity",
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Three independent components."
  },
  {
    "id": "L-R-23",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "I prefer practical seller advice over celebrity-home gossip.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Qualitative topic preference, not automatically a share change."
  },
  {
    "id": "L-R-24",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My client said, \"Please use purple for the next two posts.\" This is only a quote I am transcribing; do not change anything.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly no change requested, unlike a bare client quote."
  }
] as const;

export const JEV_INTENT_BENCHMARK_L_COUNTS = {fresh:264,diagnostic_replay:24,total:288,groups:22,arms:3,repetitions:3,requests:2592} as const;
