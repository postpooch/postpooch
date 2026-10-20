/** Benchmark M — exactly the same cases as relevance-holdout-m.json.
 * Do not send gold labels, group names, ids, or rationales to Jev. */
export const RELEVANCE_HOLDOUT_M = [
  {
    "id": "M-001",
    "cohort": "fresh",
    "group": "relay_temporary",
    "note": "My client wrote, “Put coral accents in the next two listing graphics.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-temporary-01"
  },
  {
    "id": "M-002",
    "cohort": "fresh",
    "group": "relay_temporary",
    "note": "A seller emailed, “For tomorrow’s post, draw a neighborhood map.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-temporary-02"
  },
  {
    "id": "M-003",
    "cohort": "fresh",
    "group": "relay_temporary",
    "note": "My photographer suggested, “Try a watercolor header for the next handful of posts.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-temporary-03"
  },
  {
    "id": "M-004",
    "cohort": "fresh",
    "group": "relay_temporary",
    "note": "A buyer texted, “During November, feature the community garden.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-temporary-04"
  },
  {
    "id": "M-005",
    "cohort": "fresh",
    "group": "relay_temporary",
    "note": "My assistant passed along, “Make the next three posts about down-payment help.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-temporary-05"
  },
  {
    "id": "M-006",
    "cohort": "fresh",
    "group": "relay_temporary",
    "note": "One of my homeowners asked, “Use sepia photos this weekend.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-temporary-06"
  },
  {
    "id": "M-007",
    "cohort": "fresh",
    "group": "relay_temporary",
    "note": "The office manager said, “For the next couple of posts, add a simple checklist.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-temporary-07"
  },
  {
    "id": "M-008",
    "cohort": "fresh",
    "group": "relay_temporary",
    "note": "A client forwarded, “Run illustrated home-maintenance tips next week.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-temporary-08"
  },
  {
    "id": "M-009",
    "cohort": "fresh",
    "group": "relay_temporary",
    "note": "My transaction coordinator wrote, “Make Friday’s post about the local farmers market.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-temporary-09"
  },
  {
    "id": "M-010",
    "cohort": "fresh",
    "group": "relay_temporary",
    "note": "The team lead mentioned, “For five upcoming posts, highlight the new transit route.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-temporary-10"
  },
  {
    "id": "M-011",
    "cohort": "fresh",
    "group": "relay_temporary",
    "note": "A client messaged, “Use a charcoal border on the next post.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-temporary-11"
  },
  {
    "id": "M-012",
    "cohort": "fresh",
    "group": "relay_temporary",
    "note": "My designer suggested, “For the next few graphics, use geometric shapes.”",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-temporary-12"
  },
  {
    "id": "M-013",
    "cohort": "fresh",
    "group": "relay_preference",
    "note": "My client wrote, “Keep every caption direct and jargon-free.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-preference-01"
  },
  {
    "id": "M-014",
    "cohort": "fresh",
    "group": "relay_preference",
    "note": "A seller emailed, “Usually avoid stock photography.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-preference-02"
  },
  {
    "id": "M-015",
    "cohort": "fresh",
    "group": "relay_preference",
    "note": "My photographer suggested, “Write in a warm first-person voice from now on.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-preference-03"
  },
  {
    "id": "M-016",
    "cohort": "fresh",
    "group": "relay_preference",
    "note": "A buyer texted, “Put the brokerage logo in the corner of each graphic.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-preference-04"
  },
  {
    "id": "M-017",
    "cohort": "fresh",
    "group": "relay_preference",
    "note": "My assistant passed along, “Normally limit hashtags to two per caption.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-preference-05"
  },
  {
    "id": "M-018",
    "cohort": "fresh",
    "group": "relay_preference",
    "note": "One of my homeowners asked, “Use short paragraphs as the default caption format.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-preference-06"
  },
  {
    "id": "M-019",
    "cohort": "fresh",
    "group": "relay_preference",
    "note": "The office manager said, “Stop using exclamation marks in our standard copy.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-preference-07"
  },
  {
    "id": "M-020",
    "cohort": "fresh",
    "group": "relay_preference",
    "note": "A client forwarded, “When writing about rates, explain terms simply.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-preference-08"
  },
  {
    "id": "M-021",
    "cohort": "fresh",
    "group": "relay_preference",
    "note": "My transaction coordinator wrote, “Give property photos a natural look without filters.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-preference-09"
  },
  {
    "id": "M-022",
    "cohort": "fresh",
    "group": "relay_preference",
    "note": "The team lead mentioned, “Use no emojis in routine listing captions.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-preference-10"
  },
  {
    "id": "M-023",
    "cohort": "fresh",
    "group": "relay_preference",
    "note": "A client messaged, “As a rule, use a conversational style.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-preference-11"
  },
  {
    "id": "M-024",
    "cohort": "fresh",
    "group": "relay_preference",
    "note": "My designer suggested, “Never put client full names in social captions.”",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-preference-12"
  },
  {
    "id": "M-025",
    "cohort": "fresh",
    "group": "relay_frequency",
    "note": "My client wrote, “Add more neighborhood history posts to the regular mix.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-frequency-01"
  },
  {
    "id": "M-026",
    "cohort": "fresh",
    "group": "relay_frequency",
    "note": "A seller emailed, “Publish fewer luxury-mansion tours.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-frequency-02"
  },
  {
    "id": "M-027",
    "cohort": "fresh",
    "group": "relay_frequency",
    "note": "My photographer suggested, “Work an occasional client Q&A into the rotation.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-frequency-03"
  },
  {
    "id": "M-028",
    "cohort": "fresh",
    "group": "relay_frequency",
    "note": "A buyer texted, “Make one in five posts a buyer checklist.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-frequency-04"
  },
  {
    "id": "M-029",
    "cohort": "fresh",
    "group": "relay_frequency",
    "note": "My assistant passed along, “Talk more about HOA rules over the coming months.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-frequency-05"
  },
  {
    "id": "M-030",
    "cohort": "fresh",
    "group": "relay_frequency",
    "note": "One of my homeowners asked, “Stop regularly making celebrity-home roundups.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-frequency-06"
  },
  {
    "id": "M-031",
    "cohort": "fresh",
    "group": "relay_frequency",
    "note": "The office manager said, “Increase the share of condo-maintenance tips.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-frequency-07"
  },
  {
    "id": "M-032",
    "cohort": "fresh",
    "group": "relay_frequency",
    "note": "A client forwarded, “Feature local small businesses once in a while.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-frequency-08"
  },
  {
    "id": "M-033",
    "cohort": "fresh",
    "group": "relay_frequency",
    "note": "My transaction coordinator wrote, “Post fewer broad market forecasts and more seller explainers.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-frequency-09"
  },
  {
    "id": "M-034",
    "cohort": "fresh",
    "group": "relay_frequency",
    "note": "The team lead mentioned, “Make staging myths a more common post topic.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-frequency-10"
  },
  {
    "id": "M-035",
    "cohort": "fresh",
    "group": "relay_frequency",
    "note": "A client messaged, “Bring back property-tax education posts now and then.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-frequency-11"
  },
  {
    "id": "M-036",
    "cohort": "fresh",
    "group": "relay_frequency",
    "note": "My designer suggested, “Put financing basics into the rotation more often.”",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Unopposed relayed proposal is category-relevant; only next agent selects final action",
    "pairId": "Q-frequency-12"
  },
  {
    "id": "M-037",
    "cohort": "fresh",
    "group": "reject_temporary",
    "note": "My client wrote, “Put coral accents in the next two listing graphics.” I am archiving that quote only. Do not make the suggested change.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-temporary-01"
  },
  {
    "id": "M-038",
    "cohort": "fresh",
    "group": "reject_temporary",
    "note": "A seller emailed, “For tomorrow’s post, draw a neighborhood map.” Please transcribe their words for my records; this is not a posting request.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-temporary-02"
  },
  {
    "id": "M-039",
    "cohort": "fresh",
    "group": "reject_temporary",
    "note": "My photographer suggested, “Try a watercolor header for the next handful of posts.” This is an example for a training document, not something to implement.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-temporary-03"
  },
  {
    "id": "M-040",
    "cohort": "fresh",
    "group": "reject_temporary",
    "note": "A buyer texted, “During November, feature the community garden.” I rejected that idea and am not requesting any posting changes.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-temporary-04"
  },
  {
    "id": "M-041",
    "cohort": "fresh",
    "group": "reject_temporary",
    "note": "My assistant passed along, “Make the next three posts about down-payment help.” I am quoting their feedback for reference; leave our posting settings alone.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-temporary-05"
  },
  {
    "id": "M-042",
    "cohort": "fresh",
    "group": "reject_temporary",
    "note": "One of my homeowners asked, “Use sepia photos this weekend.” This is what somebody else wanted, not a direction to our account.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-temporary-06"
  },
  {
    "id": "M-043",
    "cohort": "fresh",
    "group": "reject_temporary",
    "note": "The office manager said, “For the next couple of posts, add a simple checklist.” Please save the wording as a historical quote only; do not follow it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-temporary-07"
  },
  {
    "id": "M-044",
    "cohort": "fresh",
    "group": "reject_temporary",
    "note": "A client forwarded, “Run illustrated home-maintenance tips next week.” I am discussing the sentence, not asking PostPooch to act on it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-temporary-08"
  },
  {
    "id": "M-045",
    "cohort": "fresh",
    "group": "reject_temporary",
    "note": "My transaction coordinator wrote, “Make Friday’s post about the local farmers market.” The suggestion was declined. Keep our current settings unchanged.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-temporary-09"
  },
  {
    "id": "M-046",
    "cohort": "fresh",
    "group": "reject_temporary",
    "note": "The team lead mentioned, “For five upcoming posts, highlight the new transit route.” Treat this as a transcription exercise only, not a marketing instruction.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-temporary-10"
  },
  {
    "id": "M-047",
    "cohort": "fresh",
    "group": "reject_temporary",
    "note": "A client messaged, “Use a charcoal border on the next post.” I do not approve that proposal and am not giving a replacement instruction.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-temporary-11"
  },
  {
    "id": "M-048",
    "cohort": "fresh",
    "group": "reject_temporary",
    "note": "My designer suggested, “For the next few graphics, use geometric shapes.” I am merely recording their comment; do not change the posts.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-temporary-12"
  },
  {
    "id": "M-049",
    "cohort": "fresh",
    "group": "reject_preference",
    "note": "My client wrote, “Keep every caption direct and jargon-free.” I am archiving that quote only. Do not make the suggested change.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-preference-01"
  },
  {
    "id": "M-050",
    "cohort": "fresh",
    "group": "reject_preference",
    "note": "A seller emailed, “Usually avoid stock photography.” Please transcribe their words for my records; this is not a posting request.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-preference-02"
  },
  {
    "id": "M-051",
    "cohort": "fresh",
    "group": "reject_preference",
    "note": "My photographer suggested, “Write in a warm first-person voice from now on.” This is an example for a training document, not something to implement.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-preference-03"
  },
  {
    "id": "M-052",
    "cohort": "fresh",
    "group": "reject_preference",
    "note": "A buyer texted, “Put the brokerage logo in the corner of each graphic.” I rejected that idea and am not requesting any posting changes.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-preference-04"
  },
  {
    "id": "M-053",
    "cohort": "fresh",
    "group": "reject_preference",
    "note": "My assistant passed along, “Normally limit hashtags to two per caption.” I am quoting their feedback for reference; leave our posting settings alone.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-preference-05"
  },
  {
    "id": "M-054",
    "cohort": "fresh",
    "group": "reject_preference",
    "note": "One of my homeowners asked, “Use short paragraphs as the default caption format.” This is what somebody else wanted, not a direction to our account.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-preference-06"
  },
  {
    "id": "M-055",
    "cohort": "fresh",
    "group": "reject_preference",
    "note": "The office manager said, “Stop using exclamation marks in our standard copy.” Please save the wording as a historical quote only; do not follow it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-preference-07"
  },
  {
    "id": "M-056",
    "cohort": "fresh",
    "group": "reject_preference",
    "note": "A client forwarded, “When writing about rates, explain terms simply.” I am discussing the sentence, not asking PostPooch to act on it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-preference-08"
  },
  {
    "id": "M-057",
    "cohort": "fresh",
    "group": "reject_preference",
    "note": "My transaction coordinator wrote, “Give property photos a natural look without filters.” The suggestion was declined. Keep our current settings unchanged.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-preference-09"
  },
  {
    "id": "M-058",
    "cohort": "fresh",
    "group": "reject_preference",
    "note": "The team lead mentioned, “Use no emojis in routine listing captions.” Treat this as a transcription exercise only, not a marketing instruction.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-preference-10"
  },
  {
    "id": "M-059",
    "cohort": "fresh",
    "group": "reject_preference",
    "note": "A client messaged, “As a rule, use a conversational style.” I do not approve that proposal and am not giving a replacement instruction.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-preference-11"
  },
  {
    "id": "M-060",
    "cohort": "fresh",
    "group": "reject_preference",
    "note": "My designer suggested, “Never put client full names in social captions.” I am merely recording their comment; do not change the posts.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-preference-12"
  },
  {
    "id": "M-061",
    "cohort": "fresh",
    "group": "reject_frequency",
    "note": "My client wrote, “Add more neighborhood history posts to the regular mix.” I am archiving that quote only. Do not make the suggested change.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-frequency-01"
  },
  {
    "id": "M-062",
    "cohort": "fresh",
    "group": "reject_frequency",
    "note": "A seller emailed, “Publish fewer luxury-mansion tours.” Please transcribe their words for my records; this is not a posting request.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-frequency-02"
  },
  {
    "id": "M-063",
    "cohort": "fresh",
    "group": "reject_frequency",
    "note": "My photographer suggested, “Work an occasional client Q&A into the rotation.” This is an example for a training document, not something to implement.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-frequency-03"
  },
  {
    "id": "M-064",
    "cohort": "fresh",
    "group": "reject_frequency",
    "note": "A buyer texted, “Make one in five posts a buyer checklist.” I rejected that idea and am not requesting any posting changes.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-frequency-04"
  },
  {
    "id": "M-065",
    "cohort": "fresh",
    "group": "reject_frequency",
    "note": "My assistant passed along, “Talk more about HOA rules over the coming months.” I am quoting their feedback for reference; leave our posting settings alone.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-frequency-05"
  },
  {
    "id": "M-066",
    "cohort": "fresh",
    "group": "reject_frequency",
    "note": "One of my homeowners asked, “Stop regularly making celebrity-home roundups.” This is what somebody else wanted, not a direction to our account.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-frequency-06"
  },
  {
    "id": "M-067",
    "cohort": "fresh",
    "group": "reject_frequency",
    "note": "The office manager said, “Increase the share of condo-maintenance tips.” Please save the wording as a historical quote only; do not follow it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-frequency-07"
  },
  {
    "id": "M-068",
    "cohort": "fresh",
    "group": "reject_frequency",
    "note": "A client forwarded, “Feature local small businesses once in a while.” I am discussing the sentence, not asking PostPooch to act on it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-frequency-08"
  },
  {
    "id": "M-069",
    "cohort": "fresh",
    "group": "reject_frequency",
    "note": "My transaction coordinator wrote, “Post fewer broad market forecasts and more seller explainers.” The suggestion was declined. Keep our current settings unchanged.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-frequency-09"
  },
  {
    "id": "M-070",
    "cohort": "fresh",
    "group": "reject_frequency",
    "note": "The team lead mentioned, “Make staging myths a more common post topic.” Treat this as a transcription exercise only, not a marketing instruction.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-frequency-10"
  },
  {
    "id": "M-071",
    "cohort": "fresh",
    "group": "reject_frequency",
    "note": "A client messaged, “Bring back property-tax education posts now and then.” I do not approve that proposal and am not giving a replacement instruction.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-frequency-11"
  },
  {
    "id": "M-072",
    "cohort": "fresh",
    "group": "reject_frequency",
    "note": "My designer suggested, “Put financing basics into the rotation more often.” I am merely recording their comment; do not change the posts.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicit non-adoption; no independent posting/profile request remains",
    "pairId": "Q-frequency-12"
  },
  {
    "id": "M-073",
    "cohort": "fresh",
    "group": "replace_temporary",
    "note": "My seller wanted purple for the next two posts. I disagree; make those posts sage green.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-074",
    "cohort": "fresh",
    "group": "replace_temporary",
    "note": "The designer proposed a red banner tomorrow, but use a cream banner tomorrow instead.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-075",
    "cohort": "fresh",
    "group": "replace_temporary",
    "note": "The owner suggested cartoons for the next handful of posts. No, use documentary photos for those posts.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-076",
    "cohort": "fresh",
    "group": "replace_temporary",
    "note": "The office asked for a holiday collage in November; I want simple autumn photos that month.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-077",
    "cohort": "fresh",
    "group": "replace_temporary",
    "note": "A client proposed three posts about luxury cars; reject that and make the next three posts about inspection checklists.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-078",
    "cohort": "fresh",
    "group": "replace_temporary",
    "note": "They asked for sepia graphics this weekend; instead give this weekend’s posts crisp blue graphics.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-079",
    "cohort": "fresh",
    "group": "replace_temporary",
    "note": "Our photographer said colorful stickers for the next couple posts. Skip stickers; use plain typography for those posts.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-080",
    "cohort": "fresh",
    "group": "replace_temporary",
    "note": "A seller asked for a carousel next week. Don’t do a carousel; post one illustrated guide next week.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-081",
    "cohort": "fresh",
    "group": "replace_temporary",
    "note": "The customer wanted a resort-home feature on Friday. I disagree; Friday should be a local café guide.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-082",
    "cohort": "fresh",
    "group": "replace_temporary",
    "note": "The team proposed five posts on interest rates. Not that; use the next five for curb appeal.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-083",
    "cohort": "fresh",
    "group": "replace_temporary",
    "note": "Someone asked for neon on the next post, but choose soft charcoal on that post.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-084",
    "cohort": "fresh",
    "group": "replace_temporary",
    "note": "My colleague said add emojis for the next few posts. No, remove emojis from those next few posts.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-085",
    "cohort": "fresh",
    "group": "replace_preference",
    "note": "My client wants a snarky voice forever. I disagree; keep captions polite as our normal tone.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-086",
    "cohort": "fresh",
    "group": "replace_preference",
    "note": "A designer recommended stock imagery as our standard. Reject that; use our own photos by default.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-087",
    "cohort": "fresh",
    "group": "replace_preference",
    "note": "The broker proposed permanent all-caps captions. No, write normally in sentence case.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-088",
    "cohort": "fresh",
    "group": "replace_preference",
    "note": "The owner suggested always using long intros. Instead make concise intros our default.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-089",
    "cohort": "fresh",
    "group": "replace_preference",
    "note": "My colleague wants emoji-heavy captions generally. I disagree; keep captions nearly emoji-free.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-090",
    "cohort": "fresh",
    "group": "replace_preference",
    "note": "A seller said use an overly formal voice permanently. No; our standard voice is friendly.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-091",
    "cohort": "fresh",
    "group": "replace_preference",
    "note": "My assistant suggested putting prices in every graphic. I disagree; avoid prices on graphics by default.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-092",
    "cohort": "fresh",
    "group": "replace_preference",
    "note": "The office wants decorative fonts as our normal style; reject that and use plain readable fonts.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-093",
    "cohort": "fresh",
    "group": "replace_preference",
    "note": "A client requested permanent neon backgrounds. Nope; keep neutral backgrounds generally.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-094",
    "cohort": "fresh",
    "group": "replace_preference",
    "note": "A coworker said use long hashtag blocks in all captions. No; use at most three hashtags per post.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-095",
    "cohort": "fresh",
    "group": "replace_preference",
    "note": "My photographer proposed a heavily filtered look for every picture. I disagree; keep images natural.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-096",
    "cohort": "fresh",
    "group": "replace_preference",
    "note": "My team suggested always including client names. No, never include identifying client names in captions.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-097",
    "cohort": "fresh",
    "group": "replace_frequency",
    "note": "Someone wants luxury tours more often; I disagree. More first-time-buyer lessons, please.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-098",
    "cohort": "fresh",
    "group": "replace_frequency",
    "note": "My partner requested fewer Q&A posts. No; put Q&A posts in the rotation more often.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-099",
    "cohort": "fresh",
    "group": "replace_frequency",
    "note": "The team suggested daily celebrity-home posts. Reject those; feature park spotlights occasionally instead.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-100",
    "cohort": "fresh",
    "group": "replace_frequency",
    "note": "A client wants one in three posts about rates. I disagree; make one in three about budgeting tips.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-101",
    "cohort": "fresh",
    "group": "replace_frequency",
    "note": "An assistant suggested eliminating maintenance posts. No; increase the share of maintenance posts.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-102",
    "cohort": "fresh",
    "group": "replace_frequency",
    "note": "The broker wants more speculative market predictions. I disagree; run fewer predictions.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-103",
    "cohort": "fresh",
    "group": "replace_frequency",
    "note": "A seller pushed more open house posts. No, make fewer open house posts in our usual mix.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-104",
    "cohort": "fresh",
    "group": "replace_frequency",
    "note": "A buyer wanted to remove home-repair explainers. Reject that; include repair explainers sometimes.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-105",
    "cohort": "fresh",
    "group": "replace_frequency",
    "note": "One person asked for constant beach-home tours. I disagree; put more townhouse guides in rotation.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-106",
    "cohort": "fresh",
    "group": "replace_frequency",
    "note": "My colleague proposed fewer local-restaurant posts. No, keep them appearing more often.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-107",
    "cohort": "fresh",
    "group": "replace_frequency",
    "note": "Our team lead wanted to stop lender Q&As. Reject that and include more lender Q&As.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-108",
    "cohort": "fresh",
    "group": "replace_frequency",
    "note": "Someone recommended fewer neighborhood stories. I disagree; bring neighborhood stories back more often.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Original quote rejected but separate affirmative request in same category remains"
  },
  {
    "id": "M-109",
    "cohort": "fresh",
    "group": "advice_temporary",
    "note": "Would a hand-drawn skyline look better in the next two posts?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate a bounded posting idea"
  },
  {
    "id": "M-110",
    "cohort": "fresh",
    "group": "advice_temporary",
    "note": "Should we try monochrome listing photos this weekend?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate a bounded posting idea"
  },
  {
    "id": "M-111",
    "cohort": "fresh",
    "group": "advice_temporary",
    "note": "Could a simple floor-plan diagram help tomorrow’s post?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate a bounded posting idea"
  },
  {
    "id": "M-112",
    "cohort": "fresh",
    "group": "advice_temporary",
    "note": "Would a short series about home warranties make sense for our next four posts?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate a bounded posting idea"
  },
  {
    "id": "M-113",
    "cohort": "fresh",
    "group": "advice_temporary",
    "note": "What if next week’s visuals used a warm terracotta accent?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate a bounded posting idea"
  },
  {
    "id": "M-114",
    "cohort": "fresh",
    "group": "advice_temporary",
    "note": "Could we test interactive maps on the next handful of posts?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate a bounded posting idea"
  },
  {
    "id": "M-115",
    "cohort": "fresh",
    "group": "advice_temporary",
    "note": "Might a very short caption work best on Thursday’s post?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate a bounded posting idea"
  },
  {
    "id": "M-116",
    "cohort": "fresh",
    "group": "advice_temporary",
    "note": "Should we feature dog parks for the next couple of posts?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate a bounded posting idea"
  },
  {
    "id": "M-117",
    "cohort": "fresh",
    "group": "advice_temporary",
    "note": "Would we get better results with minimal graphics during November?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate a bounded posting idea"
  },
  {
    "id": "M-118",
    "cohort": "fresh",
    "group": "advice_temporary",
    "note": "Could the next post highlight first-time buyer closing costs?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate a bounded posting idea"
  },
  {
    "id": "M-119",
    "cohort": "fresh",
    "group": "advice_temporary",
    "note": "What about experimenting with a charcoal background for the next few posts?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate a bounded posting idea"
  },
  {
    "id": "M-120",
    "cohort": "fresh",
    "group": "advice_temporary",
    "note": "Do you think a neighborhood spotlight would suit tomorrow’s graphic?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate a bounded posting idea"
  },
  {
    "id": "M-121",
    "cohort": "fresh",
    "group": "advice_preference",
    "note": "Would it be clearer to write captions in shorter paragraphs as a standard?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate lasting within-post default"
  },
  {
    "id": "M-122",
    "cohort": "fresh",
    "group": "advice_preference",
    "note": "Should we keep our regular listing photos unfiltered?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate lasting within-post default"
  },
  {
    "id": "M-123",
    "cohort": "fresh",
    "group": "advice_preference",
    "note": "Would a permanently more conversational style make the captions stronger?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate lasting within-post default"
  },
  {
    "id": "M-124",
    "cohort": "fresh",
    "group": "advice_preference",
    "note": "Could we make plain-English explanations our default for financing topics?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate lasting within-post default"
  },
  {
    "id": "M-125",
    "cohort": "fresh",
    "group": "advice_preference",
    "note": "Would avoiding stock illustrations generally help our brand?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate lasting within-post default"
  },
  {
    "id": "M-126",
    "cohort": "fresh",
    "group": "advice_preference",
    "note": "Should our ordinary captions use only one or two emojis?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate lasting within-post default"
  },
  {
    "id": "M-127",
    "cohort": "fresh",
    "group": "advice_preference",
    "note": "Would a light background be better as the usual design?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate lasting within-post default"
  },
  {
    "id": "M-128",
    "cohort": "fresh",
    "group": "advice_preference",
    "note": "Could we avoid acronyms in every educational post?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate lasting within-post default"
  },
  {
    "id": "M-129",
    "cohort": "fresh",
    "group": "advice_preference",
    "note": "Should we normally put the call-to-action below the photo?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate lasting within-post default"
  },
  {
    "id": "M-130",
    "cohort": "fresh",
    "group": "advice_preference",
    "note": "Would it be better to keep client names out of all captions?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate lasting within-post default"
  },
  {
    "id": "M-131",
    "cohort": "fresh",
    "group": "advice_preference",
    "note": "Would short sentences make our everyday captions more readable?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate lasting within-post default"
  },
  {
    "id": "M-132",
    "cohort": "fresh",
    "group": "advice_preference",
    "note": "Could a consistent first-person tone be our normal posting voice?",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate lasting within-post default"
  },
  {
    "id": "M-133",
    "cohort": "fresh",
    "group": "advice_frequency",
    "note": "Would posting more neighborhood histories improve our regular feed?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate post distribution change"
  },
  {
    "id": "M-134",
    "cohort": "fresh",
    "group": "advice_frequency",
    "note": "Should we include fewer celebrity-home stories across our posts?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate post distribution change"
  },
  {
    "id": "M-135",
    "cohort": "fresh",
    "group": "advice_frequency",
    "note": "Could an occasional HOA myth-buster get good engagement?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate post distribution change"
  },
  {
    "id": "M-136",
    "cohort": "fresh",
    "group": "advice_frequency",
    "note": "Would one in five posts about home upkeep be a good mix?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate post distribution change"
  },
  {
    "id": "M-137",
    "cohort": "fresh",
    "group": "advice_frequency",
    "note": "Should we talk more about property-tax exemptions in the post rotation?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate post distribution change"
  },
  {
    "id": "M-138",
    "cohort": "fresh",
    "group": "advice_frequency",
    "note": "Would it help to feature more local small businesses regularly?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate post distribution change"
  },
  {
    "id": "M-139",
    "cohort": "fresh",
    "group": "advice_frequency",
    "note": "Could we stop doing luxury-car content as a recurring series?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate post distribution change"
  },
  {
    "id": "M-140",
    "cohort": "fresh",
    "group": "advice_frequency",
    "note": "Should seller negotiation tips appear in a higher share of posts?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate post distribution change"
  },
  {
    "id": "M-141",
    "cohort": "fresh",
    "group": "advice_frequency",
    "note": "Would it be smart to occasionally post a poll?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate post distribution change"
  },
  {
    "id": "M-142",
    "cohort": "fresh",
    "group": "advice_frequency",
    "note": "Should we make fewer generic housing headlines?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate post distribution change"
  },
  {
    "id": "M-143",
    "cohort": "fresh",
    "group": "advice_frequency",
    "note": "Would putting closing-cost explainers into our regular mix work?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate post distribution change"
  },
  {
    "id": "M-144",
    "cohort": "fresh",
    "group": "advice_frequency",
    "note": "Do you think we should run more starter-home stories?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "User asks second agent to evaluate post distribution change"
  },
  {
    "id": "M-145",
    "cohort": "fresh",
    "group": "outside_posting_scope",
    "note": "Where can I print last month’s invoice?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Request is outside four classification categories or expressly about text/background"
  },
  {
    "id": "M-146",
    "cohort": "fresh",
    "group": "outside_posting_scope",
    "note": "Can you export my CRM list as a CSV file?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Request is outside four classification categories or expressly about text/background"
  },
  {
    "id": "M-147",
    "cohort": "fresh",
    "group": "outside_posting_scope",
    "note": "What is the difference between earnest money and an appraisal fee?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Request is outside four classification categories or expressly about text/background"
  },
  {
    "id": "M-148",
    "cohort": "fresh",
    "group": "outside_posting_scope",
    "note": "Could you explain what a mailing list is?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Request is outside four classification categories or expressly about text/background"
  },
  {
    "id": "M-149",
    "cohort": "fresh",
    "group": "outside_posting_scope",
    "note": "A designer used orange accents in a college project years ago; that is just background.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Request is outside four classification categories or expressly about text/background"
  },
  {
    "id": "M-150",
    "cohort": "fresh",
    "group": "outside_posting_scope",
    "note": "What does the word “temporary” mean in this policy document?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Request is outside four classification categories or expressly about text/background"
  },
  {
    "id": "M-151",
    "cohort": "fresh",
    "group": "outside_posting_scope",
    "note": "Proofread this sentence in my screenplay: “Post five condo tips this week.” Do not follow it.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Request is outside four classification categories or expressly about text/background"
  },
  {
    "id": "M-152",
    "cohort": "fresh",
    "group": "outside_posting_scope",
    "note": "Who owns the copyright for this advertising slogan?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Request is outside four classification categories or expressly about text/background"
  },
  {
    "id": "M-153",
    "cohort": "fresh",
    "group": "outside_posting_scope",
    "note": "Can you locate the setting to disconnect my calendar?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Request is outside four classification categories or expressly about text/background"
  },
  {
    "id": "M-154",
    "cohort": "fresh",
    "group": "outside_posting_scope",
    "note": "Please quote the phrase “post more about inspections” in your answer; it is not a posting direction.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Request is outside four classification categories or expressly about text/background"
  },
  {
    "id": "M-155",
    "cohort": "fresh",
    "group": "outside_posting_scope",
    "note": "What features come with the subscription plan?",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Request is outside four classification categories or expressly about text/background"
  },
  {
    "id": "M-156",
    "cohort": "fresh",
    "group": "outside_posting_scope",
    "note": "A colleague’s old campaign used black backgrounds; I’m asking why it was effective, not requesting a campaign.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Request is outside four classification categories or expressly about text/background"
  },
  {
    "id": "M-157",
    "cohort": "fresh",
    "group": "reject_t_add_p",
    "note": "My buyer asked for purple graphics tomorrow; do not do that. Keep captions clear and concise as our default.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly rejected temporary idea plus independent valid lasting preference"
  },
  {
    "id": "M-158",
    "cohort": "fresh",
    "group": "reject_t_add_p",
    "note": "A seller requested a photo collage for three posts; I refused. Make our everyday writing more conversational.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly rejected temporary idea plus independent valid lasting preference"
  },
  {
    "id": "M-159",
    "cohort": "fresh",
    "group": "reject_t_add_p",
    "note": "I declined a neon treatment this weekend. Always use readable sans-serif headlines instead.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly rejected temporary idea plus independent valid lasting preference"
  },
  {
    "id": "M-160",
    "cohort": "fresh",
    "group": "reject_t_add_p",
    "note": "Someone wanted cartoons through November; we are not doing those. Keep listing photos natural by default.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly rejected temporary idea plus independent valid lasting preference"
  },
  {
    "id": "M-161",
    "cohort": "fresh",
    "group": "reject_t_add_p",
    "note": "We rejected a red banner on tomorrow’s post. Generally avoid excessive emojis.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly rejected temporary idea plus independent valid lasting preference"
  },
  {
    "id": "M-162",
    "cohort": "fresh",
    "group": "reject_t_add_p",
    "note": "My photographer proposed a filter for the next few posts; no thanks. Use short paragraphs in normal captions.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly rejected temporary idea plus independent valid lasting preference"
  },
  {
    "id": "M-163",
    "cohort": "fresh",
    "group": "reject_t_add_p",
    "note": "A client suggested a temporary Halloween theme. I explicitly said no; use a warm, professional voice generally.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly rejected temporary idea plus independent valid lasting preference"
  },
  {
    "id": "M-164",
    "cohort": "fresh",
    "group": "reject_t_add_p",
    "note": "The office’s next-week carousel proposal is canceled. Never put client surnames in captions.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly rejected temporary idea plus independent valid lasting preference"
  },
  {
    "id": "M-165",
    "cohort": "fresh",
    "group": "reject_t_add_p",
    "note": "They wanted a blue sticker on Friday’s graphic, but I declined. Normally keep all graphics uncluttered.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly rejected temporary idea plus independent valid lasting preference"
  },
  {
    "id": "M-166",
    "cohort": "fresh",
    "group": "reject_t_add_p",
    "note": "Do not follow the client’s proposal for illustrated posts this month. Avoid industry acronyms in our usual copy.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly rejected temporary idea plus independent valid lasting preference"
  },
  {
    "id": "M-167",
    "cohort": "fresh",
    "group": "reject_t_add_p",
    "note": "The trial with all-caps headlines for two posts is rejected. Keep everyday captions under 100 words.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly rejected temporary idea plus independent valid lasting preference"
  },
  {
    "id": "M-168",
    "cohort": "fresh",
    "group": "reject_t_add_p",
    "note": "Archive, but do not implement, their proposed three-post series. Make natural-light imagery the regular style.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly rejected temporary idea plus independent valid lasting preference"
  },
  {
    "id": "M-169",
    "cohort": "fresh",
    "group": "reject_p_add_t",
    "note": "The client asked us to always use neon; reject that. Use pale gold for the next two posts.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Explicitly rejected lasting rule plus independently requested bounded action"
  },
  {
    "id": "M-170",
    "cohort": "fresh",
    "group": "reject_p_add_t",
    "note": "Do not adopt the proposal to write formally forever. Tomorrow use a brief seller checklist.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Explicitly rejected lasting rule plus independently requested bounded action"
  },
  {
    "id": "M-171",
    "cohort": "fresh",
    "group": "reject_p_add_t",
    "note": "I refused the permanent stock-photo policy. For the next three posts, use line drawings.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Explicitly rejected lasting rule plus independently requested bounded action"
  },
  {
    "id": "M-172",
    "cohort": "fresh",
    "group": "reject_p_add_t",
    "note": "The suggested all-caps default is canceled. Feature walkability on Saturday’s graphic.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Explicitly rejected lasting rule plus independently requested bounded action"
  },
  {
    "id": "M-173",
    "cohort": "fresh",
    "group": "reject_p_add_t",
    "note": "I declined the client’s request for a logo on every post. Use an orange footer for the next few graphics.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Explicitly rejected lasting rule plus independently requested bounded action"
  },
  {
    "id": "M-174",
    "cohort": "fresh",
    "group": "reject_p_add_t",
    "note": "The team’s idea of long captions forever is rejected. Try one-page infographics throughout November.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Explicitly rejected lasting rule plus independently requested bounded action"
  },
  {
    "id": "M-175",
    "cohort": "fresh",
    "group": "reject_p_add_t",
    "note": "Archive the advice to use emojis in every caption; we will not adopt it. Tomorrow feature curb appeal.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Explicitly rejected lasting rule plus independently requested bounded action"
  },
  {
    "id": "M-176",
    "cohort": "fresh",
    "group": "reject_p_add_t",
    "note": "Do not follow the instruction to use vintage filters normally. For the next couple posts, use hand sketches.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Explicitly rejected lasting rule plus independently requested bounded action"
  },
  {
    "id": "M-177",
    "cohort": "fresh",
    "group": "reject_p_add_t",
    "note": "The plan to standardize on comic-style headlines was declined. This weekend highlight neighborhood trails.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Explicitly rejected lasting rule plus independently requested bounded action"
  },
  {
    "id": "M-178",
    "cohort": "fresh",
    "group": "reject_p_add_t",
    "note": "Our client’s proposed permanent dark mode is rejected. For next four posts use short question headlines.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Explicitly rejected lasting rule plus independently requested bounded action"
  },
  {
    "id": "M-179",
    "cohort": "fresh",
    "group": "reject_p_add_t",
    "note": "We will not switch to an always-salesy voice. Next week publish brief open-house explainers.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Explicitly rejected lasting rule plus independently requested bounded action"
  },
  {
    "id": "M-180",
    "cohort": "fresh",
    "group": "reject_p_add_t",
    "note": "The suggested standard of displaying client names is declined. Use anonymous testimonials for the next three posts.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Explicitly rejected lasting rule plus independently requested bounded action"
  },
  {
    "id": "M-181",
    "cohort": "fresh",
    "group": "reject_f_add_identity",
    "note": "My assistant wants more mansion tours; we will not adopt it. I now work at Sierra Gate Realty.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "No frequency change; first-party realtor fact remains Identity"
  },
  {
    "id": "M-182",
    "cohort": "fresh",
    "group": "reject_f_add_identity",
    "note": "I refused the suggestion to cut open-house posts. My public display name is Taylor Lenox.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "No frequency change; first-party realtor fact remains Identity"
  },
  {
    "id": "M-183",
    "cohort": "fresh",
    "group": "reject_f_add_identity",
    "note": "Archive the proposal for occasional polls; do not use it. My title is Associate Broker now.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "No frequency change; first-party realtor fact remains Identity"
  },
  {
    "id": "M-184",
    "cohort": "fresh",
    "group": "reject_f_add_identity",
    "note": "They recommended making more resort content, but I rejected it. I now personally serve Gilbert.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "No frequency change; first-party realtor fact remains Identity"
  },
  {
    "id": "M-185",
    "cohort": "fresh",
    "group": "reject_f_add_identity",
    "note": "Do not add investor explainers to the normal mix. I primarily serve first-time buyers.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "No frequency change; first-party realtor fact remains Identity"
  },
  {
    "id": "M-186",
    "cohort": "fresh",
    "group": "reject_f_add_identity",
    "note": "The team asked for weekly celebrity-home coverage; no changes to content mix. My specialty is probate transactions.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "No frequency change; first-party realtor fact remains Identity"
  },
  {
    "id": "M-187",
    "cohort": "fresh",
    "group": "reject_f_add_identity",
    "note": "I declined more listing videos. I grew up in Flagstaff, and that is part of my bio.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "No frequency change; first-party realtor fact remains Identity"
  },
  {
    "id": "M-188",
    "cohort": "fresh",
    "group": "reject_f_add_identity",
    "note": "Reject the request for fewer neighborhood posts. Our primary brand color is #187D69.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "No frequency change; first-party realtor fact remains Identity"
  },
  {
    "id": "M-189",
    "cohort": "fresh",
    "group": "reject_f_add_identity",
    "note": "Ignore the proposal to boost lender Q&As. Our secondary brand color is #C4A072.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "No frequency change; first-party realtor fact remains Identity"
  },
  {
    "id": "M-190",
    "cohort": "fresh",
    "group": "reject_f_add_identity",
    "note": "The partner suggested more market forecasts; no. I joined North Ridge Property Group this week.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "No frequency change; first-party realtor fact remains Identity"
  },
  {
    "id": "M-191",
    "cohort": "fresh",
    "group": "reject_f_add_identity",
    "note": "I rejected the client’s idea for occasional open-house livestreams. I now specialize in lakefront properties.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "No frequency change; first-party realtor fact remains Identity"
  },
  {
    "id": "M-192",
    "cohort": "fresh",
    "group": "reject_f_add_identity",
    "note": "Do not increase fixer-upper posts. I serve real estate clients in Goodyear now.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "No frequency change; first-party realtor fact remains Identity"
  },
  {
    "id": "M-193",
    "cohort": "fresh",
    "group": "third_party_identity",
    "note": "My client changed her professional display name to Alana Cruz, not me.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Facts are explicitly about others, not realtor identity"
  },
  {
    "id": "M-194",
    "cohort": "fresh",
    "group": "third_party_identity",
    "note": "A colleague was promoted to Managing Broker yesterday; my own title is unchanged.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Facts are explicitly about others, not realtor identity"
  },
  {
    "id": "M-195",
    "cohort": "fresh",
    "group": "third_party_identity",
    "note": "A buyer recently switched brokerage firms to West Mesa Homes; this is about the buyer.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Facts are explicitly about others, not realtor identity"
  },
  {
    "id": "M-196",
    "cohort": "fresh",
    "group": "third_party_identity",
    "note": "My photographer now serves Surprise, but I have not changed my markets.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Facts are explicitly about others, not realtor identity"
  },
  {
    "id": "M-197",
    "cohort": "fresh",
    "group": "third_party_identity",
    "note": "Another agency mostly targets retirees; I am discussing its business model.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Facts are explicitly about others, not realtor identity"
  },
  {
    "id": "M-198",
    "cohort": "fresh",
    "group": "third_party_identity",
    "note": "The realtor in the article stopped handling probate cases; it is not my practice.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Facts are explicitly about others, not realtor identity"
  },
  {
    "id": "M-199",
    "cohort": "fresh",
    "group": "third_party_identity",
    "note": "My friend grew up in Flagstaff and studied electrical engineering, not me.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Facts are explicitly about others, not realtor identity"
  },
  {
    "id": "M-200",
    "cohort": "fresh",
    "group": "third_party_identity",
    "note": "The logo in this sample brochure uses #336699 as its primary color, not ours.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Facts are explicitly about others, not realtor identity"
  },
  {
    "id": "M-201",
    "cohort": "fresh",
    "group": "third_party_identity",
    "note": "That client’s secondary brand color is light coral, not mine.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Facts are explicitly about others, not realtor identity"
  },
  {
    "id": "M-202",
    "cohort": "fresh",
    "group": "third_party_identity",
    "note": "A fictional character in our story is named Sasha Fielding, not my professional name.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Facts are explicitly about others, not realtor identity"
  },
  {
    "id": "M-203",
    "cohort": "fresh",
    "group": "third_party_identity",
    "note": "A brokerage mentioned in the flyer is called Mesa Palms; I do not work there.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Facts are explicitly about others, not realtor identity"
  },
  {
    "id": "M-204",
    "cohort": "fresh",
    "group": "third_party_identity",
    "note": "The guest speaker specializes in historic properties; I am just summarizing her talk.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Facts are explicitly about others, not realtor identity"
  },
  {
    "id": "M-205",
    "cohort": "fresh",
    "group": "identity_plus_advice_t",
    "note": "I joined Solano Ridge Realty. Would a teal border suit the next two posts?",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Own Identity fact plus independently advisory bounded posting idea"
  },
  {
    "id": "M-206",
    "cohort": "fresh",
    "group": "identity_plus_advice_t",
    "note": "My display name is now Devon Park. Could we feature local events tomorrow?",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Own Identity fact plus independently advisory bounded posting idea"
  },
  {
    "id": "M-207",
    "cohort": "fresh",
    "group": "identity_plus_advice_t",
    "note": "I serve Litchfield Park real estate clients. Would line drawings work for next week’s posts?",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Own Identity fact plus independently advisory bounded posting idea"
  },
  {
    "id": "M-208",
    "cohort": "fresh",
    "group": "identity_plus_advice_t",
    "note": "I now mainly work with relocating families. Should the next handful of graphics use hand-drawn maps?",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Own Identity fact plus independently advisory bounded posting idea"
  },
  {
    "id": "M-209",
    "cohort": "fresh",
    "group": "identity_plus_advice_t",
    "note": "My specialty is land transactions now. What about showcasing survey tips throughout November?",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Own Identity fact plus independently advisory bounded posting idea"
  },
  {
    "id": "M-210",
    "cohort": "fresh",
    "group": "identity_plus_advice_t",
    "note": "Our primary brand color is #3D6671. Would a rust accent help this weekend’s post?",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "primary_brand_color"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Own Identity fact plus independently advisory bounded posting idea"
  },
  {
    "id": "M-211",
    "cohort": "fresh",
    "group": "identity_plus_advice_t",
    "note": "My title is Designated Broker. Could we try minimalist diagrams for the next three posts?",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Own Identity fact plus independently advisory bounded posting idea"
  },
  {
    "id": "M-212",
    "cohort": "fresh",
    "group": "identity_plus_advice_t",
    "note": "I used to teach kindergarten. Might a checklist format work tomorrow?",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Own Identity fact plus independently advisory bounded posting idea"
  },
  {
    "id": "M-213",
    "cohort": "fresh",
    "group": "identity_plus_advice_t",
    "note": "Our secondary brand color is #BC8F61. Would a cream overlay look good on the next post?",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "secondary_brand_color"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Own Identity fact plus independently advisory bounded posting idea"
  },
  {
    "id": "M-214",
    "cohort": "fresh",
    "group": "identity_plus_advice_t",
    "note": "We recently opened service in Buckeye. Could the next couple of posts include neighborhood walking paths?",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "markets"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Own Identity fact plus independently advisory bounded posting idea"
  },
  {
    "id": "M-215",
    "cohort": "fresh",
    "group": "identity_plus_advice_t",
    "note": "I work at Harbor Dawn Realty now. Would autumn graphics be appropriate for October posts?",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "brokerage_name"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Own Identity fact plus independently advisory bounded posting idea"
  },
  {
    "id": "M-216",
    "cohort": "fresh",
    "group": "identity_plus_advice_t",
    "note": "I primarily serve seniors downsizing. Should the next five posts highlight smaller-home storage?",
    "expectedCategories": [
      "identity",
      "temporary"
    ],
    "expectedIdentityFields": [
      "target_audience"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Own Identity fact plus independently advisory bounded posting idea"
  },
  {
    "id": "M-217",
    "cohort": "fresh",
    "group": "keep_preference_temporary",
    "note": "Use clean typography normally; for tomorrow, try playful lettering.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_preference_temporary"
  },
  {
    "id": "M-218",
    "cohort": "fresh",
    "group": "keep_preference_temporary",
    "note": "Keep the regular captions friendly, but on the next three posts use a formal headline.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_preference_temporary"
  },
  {
    "id": "M-219",
    "cohort": "fresh",
    "group": "keep_preference_temporary",
    "note": "As a rule use our own photos; next week, use illustrated floorplans.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_preference_temporary"
  },
  {
    "id": "M-220",
    "cohort": "fresh",
    "group": "keep_preference_temporary",
    "note": "Usually avoid emojis, but add a small smiley in the next couple of captions.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_preference_temporary"
  },
  {
    "id": "M-221",
    "cohort": "fresh",
    "group": "keep_preference_temporary",
    "note": "Our normal pictures should be unfiltered; during November try duotone images.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_preference_temporary"
  },
  {
    "id": "M-222",
    "cohort": "fresh",
    "group": "keep_preference_temporary",
    "note": "Normally use a first-person voice; for the next few posts write from the team perspective.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_preference_temporary"
  },
  {
    "id": "M-223",
    "cohort": "fresh",
    "group": "keep_preference_temporary",
    "note": "Keep daily graphics minimal by default; add bold orange shapes for the next four posts.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_preference_temporary"
  },
  {
    "id": "M-224",
    "cohort": "fresh",
    "group": "keep_preference_temporary",
    "note": "Always explain financing jargon clearly; tomorrow make the graphic an FAQ.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_preference_temporary"
  },
  {
    "id": "M-225",
    "cohort": "fresh",
    "group": "keep_preference_temporary",
    "note": "Use brief paragraphs generally, but make the next two posts detailed explainers.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_preference_temporary"
  },
  {
    "id": "M-226",
    "cohort": "fresh",
    "group": "keep_preference_temporary",
    "note": "Keep the overall tone upbeat; for this weekend use a serious informational voice.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_preference_temporary"
  },
  {
    "id": "M-227",
    "cohort": "fresh",
    "group": "keep_preference_temporary",
    "note": "Never include client names in regular posts; for the next handful of posts use anonymous success quotes.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_preference_temporary"
  },
  {
    "id": "M-228",
    "cohort": "fresh",
    "group": "keep_preference_temporary",
    "note": "Our default imagery should be natural-light; for October use monochrome photos.",
    "expectedCategories": [
      "preference",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_preference_temporary"
  },
  {
    "id": "M-229",
    "cohort": "fresh",
    "group": "keep_frequency_temporary",
    "note": "Feature first-time-buyer tips more often, but tomorrow only cover move-in checklists.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_frequency_temporary"
  },
  {
    "id": "M-230",
    "cohort": "fresh",
    "group": "keep_frequency_temporary",
    "note": "Bring local restaurant stories into the rotation occasionally; next three posts should cover zoning.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_frequency_temporary"
  },
  {
    "id": "M-231",
    "cohort": "fresh",
    "group": "keep_frequency_temporary",
    "note": "Publish fewer mansion tours overall; during November focus on cozy townhomes.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_frequency_temporary"
  },
  {
    "id": "M-232",
    "cohort": "fresh",
    "group": "keep_frequency_temporary",
    "note": "Talk more about closing costs across posts; use orange callouts on the next two posts.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_frequency_temporary"
  },
  {
    "id": "M-233",
    "cohort": "fresh",
    "group": "keep_frequency_temporary",
    "note": "Make every fifth post a neighborhood profile; this weekend highlight the county fair.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_frequency_temporary"
  },
  {
    "id": "M-234",
    "cohort": "fresh",
    "group": "keep_frequency_temporary",
    "note": "Include homeowner-maintenance tips more frequently; for the next few posts feature gutters.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_frequency_temporary"
  },
  {
    "id": "M-235",
    "cohort": "fresh",
    "group": "keep_frequency_temporary",
    "note": "Reduce condo tours in the regular mix; next week show neighborhood parks.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_frequency_temporary"
  },
  {
    "id": "M-236",
    "cohort": "fresh",
    "group": "keep_frequency_temporary",
    "note": "Make financing explainers a bigger share of future posts; use charts on next four posts.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_frequency_temporary"
  },
  {
    "id": "M-237",
    "cohort": "fresh",
    "group": "keep_frequency_temporary",
    "note": "Use client success stories once in a while; tomorrow publish a seller checklist.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_frequency_temporary"
  },
  {
    "id": "M-238",
    "cohort": "fresh",
    "group": "keep_frequency_temporary",
    "note": "Post fewer market-prediction pieces; try annotated photos for the next couple of posts.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_frequency_temporary"
  },
  {
    "id": "M-239",
    "cohort": "fresh",
    "group": "keep_frequency_temporary",
    "note": "Bring back curb-appeal posts more often; feature landscaping in October.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_frequency_temporary"
  },
  {
    "id": "M-240",
    "cohort": "fresh",
    "group": "keep_frequency_temporary",
    "note": "Stop regular celebrity-home content; next five posts should explain insurance premiums.",
    "expectedCategories": [
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_frequency_temporary"
  },
  {
    "id": "M-241",
    "cohort": "fresh",
    "group": "keep_preference_frequency",
    "note": "Make condo-maintenance posts more common; when we cover them, use simple numbered steps.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "keep_preference_frequency"
  },
  {
    "id": "M-242",
    "cohort": "fresh",
    "group": "keep_preference_frequency",
    "note": "Bring occasional local history stories into the mix, and include dates within those stories.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "keep_preference_frequency"
  },
  {
    "id": "M-243",
    "cohort": "fresh",
    "group": "keep_preference_frequency",
    "note": "Publish fewer rate updates; keep the tone calm whenever we do publish one.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "keep_preference_frequency"
  },
  {
    "id": "M-244",
    "cohort": "fresh",
    "group": "keep_preference_frequency",
    "note": "Make client Q&As a larger share, and write each question in fewer than eight words.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "keep_preference_frequency"
  },
  {
    "id": "M-245",
    "cohort": "fresh",
    "group": "keep_preference_frequency",
    "note": "Talk more about inspections across posts; within inspection posts give concrete examples.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "keep_preference_frequency"
  },
  {
    "id": "M-246",
    "cohort": "fresh",
    "group": "keep_preference_frequency",
    "note": "Mix in property-tax content sometimes; always spell out abbreviations in those captions.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "keep_preference_frequency"
  },
  {
    "id": "M-247",
    "cohort": "fresh",
    "group": "keep_preference_frequency",
    "note": "Run fewer luxury-tour posts; when featuring properties, stick to natural-light photos.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "keep_preference_frequency"
  },
  {
    "id": "M-248",
    "cohort": "fresh",
    "group": "keep_preference_frequency",
    "note": "Feature neighborhood arts events more often; use a conversational voice in those posts.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "keep_preference_frequency"
  },
  {
    "id": "M-249",
    "cohort": "fresh",
    "group": "keep_preference_frequency",
    "note": "Stop recurring celebrity-home summaries, and avoid stock imagery in ordinary posts.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "keep_preference_frequency"
  },
  {
    "id": "M-250",
    "cohort": "fresh",
    "group": "keep_preference_frequency",
    "note": "Occasionally run quick polls, with each poll answer under ten words.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "keep_preference_frequency"
  },
  {
    "id": "M-251",
    "cohort": "fresh",
    "group": "keep_preference_frequency",
    "note": "Increase the share of renovation stories; keep those stories free of excessive emojis.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "keep_preference_frequency"
  },
  {
    "id": "M-252",
    "cohort": "fresh",
    "group": "keep_preference_frequency",
    "note": "Bring back seller-tip posts every now and then, explaining each tip in plain language.",
    "expectedCategories": [
      "preference",
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "keep_preference_frequency"
  },
  {
    "id": "M-253",
    "cohort": "fresh",
    "group": "keep_all_four",
    "note": "I joined Valley Lantern Realty. Normally use clean sans-serif headlines, mention HOA myths more often, and feature plant care in the next two posts.",
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
    "rationale": "keep_all_four"
  },
  {
    "id": "M-254",
    "cohort": "fresh",
    "group": "keep_all_four",
    "note": "My public display name is now Quinn Easton. Keep captions friendly, mix in renter advice occasionally, and use dark-blue illustrations tomorrow.",
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
    "rationale": "keep_all_four"
  },
  {
    "id": "M-255",
    "cohort": "fresh",
    "group": "keep_all_four",
    "note": "I serve Surprise now. Generally avoid emojis, make relocation tips a bigger share, and use checklists next week.",
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
    "rationale": "keep_all_four"
  },
  {
    "id": "M-256",
    "cohort": "fresh",
    "group": "keep_all_four",
    "note": "I specialize in estate sales now. Use natural photos by default, do more staging stories, and use sketches in the next couple posts.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_all_four"
  },
  {
    "id": "M-257",
    "cohort": "fresh",
    "group": "keep_all_four",
    "note": "My title is Managing Broker. Keep normal captions concise, run fewer luxury tours, and spotlight transit in October.",
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
    "rationale": "keep_all_four"
  },
  {
    "id": "M-258",
    "cohort": "fresh",
    "group": "keep_all_four",
    "note": "My primary brand color is #527B68. Keep layouts uncluttered, add local park posts to the mix, and use coral tomorrow.",
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
    "rationale": "keep_all_four"
  },
  {
    "id": "M-259",
    "cohort": "fresh",
    "group": "keep_all_four",
    "note": "I target military families now. Avoid jargon as a lasting default, talk more about VA loans, and show neighborhood trails in the next three posts.",
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
    "rationale": "keep_all_four"
  },
  {
    "id": "M-260",
    "cohort": "fresh",
    "group": "keep_all_four",
    "note": "I grew up in Mesa. Use first-person captions normally, run occasional community Q&As, and highlight a library event this weekend.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "personal_context"
    ],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "keep_all_four"
  },
  {
    "id": "M-261",
    "cohort": "fresh",
    "group": "keep_all_four",
    "note": "My secondary brand color is #CBA47A. Keep imagery crisp, run fewer forecast posts, and use line-art diagrams for next five posts.",
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
    "rationale": "keep_all_four"
  },
  {
    "id": "M-262",
    "cohort": "fresh",
    "group": "keep_all_four",
    "note": "I now work at Willow Crest Homes. Use short paragraphs, rotate in school-zone explainers more often, and feature backyards next week.",
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
    "rationale": "keep_all_four"
  },
  {
    "id": "M-263",
    "cohort": "fresh",
    "group": "keep_all_four",
    "note": "My specialty is investment duplexes. Normally use readable headings, post more tenant-landlord explainers, and add blue banners for next two posts.",
    "expectedCategories": [
      "identity",
      "preference",
      "frequency",
      "temporary"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "keep_all_four"
  },
  {
    "id": "M-264",
    "cohort": "fresh",
    "group": "keep_all_four",
    "note": "I serve Fountain Hills now. Keep the regular tone warm, reduce celebrity-home content, and post local trail maps tomorrow.",
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
    "rationale": "keep_all_four"
  },
  {
    "id": "M-265",
    "cohort": "fresh",
    "group": "standalone_regression",
    "note": "My professional name is now Elise Salcedo.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "display_name"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "standalone_regression"
  },
  {
    "id": "M-266",
    "cohort": "fresh",
    "group": "standalone_regression",
    "note": "I am now an Associate Broker.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "professional_title"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "standalone_regression"
  },
  {
    "id": "M-267",
    "cohort": "fresh",
    "group": "standalone_regression",
    "note": "I stopped specializing in commercial lease negotiations.",
    "expectedCategories": [
      "identity"
    ],
    "expectedIdentityFields": [
      "specialties"
    ],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "standalone_regression"
  },
  {
    "id": "M-268",
    "cohort": "fresh",
    "group": "standalone_regression",
    "note": "Use generous white space as the normal design style.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "standalone_regression"
  },
  {
    "id": "M-269",
    "cohort": "fresh",
    "group": "standalone_regression",
    "note": "Usually put two short paragraphs in our captions.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "standalone_regression"
  },
  {
    "id": "M-270",
    "cohort": "fresh",
    "group": "standalone_regression",
    "note": "Never include full client names in the caption.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "standalone_regression"
  },
  {
    "id": "M-271",
    "cohort": "fresh",
    "group": "standalone_regression",
    "note": "Add occasional home-energy explainers to the content mix.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "standalone_regression"
  },
  {
    "id": "M-272",
    "cohort": "fresh",
    "group": "standalone_regression",
    "note": "Make fewer posts about celebrity mansions.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "standalone_regression"
  },
  {
    "id": "M-273",
    "cohort": "fresh",
    "group": "standalone_regression",
    "note": "Talk more about property surveys.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "standalone_regression"
  },
  {
    "id": "M-274",
    "cohort": "fresh",
    "group": "standalone_regression",
    "note": "For the next four posts, focus on exterior paint.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "standalone_regression"
  },
  {
    "id": "M-275",
    "cohort": "fresh",
    "group": "standalone_regression",
    "note": "Tomorrow’s post should feature local hiking paths.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "standalone_regression"
  },
  {
    "id": "M-276",
    "cohort": "fresh",
    "group": "standalone_regression",
    "note": "Use a charcoal vignette in this weekend’s graphic.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "standalone_regression"
  },
  {
    "id": "M-277",
    "cohort": "fresh",
    "group": "boundary_regression",
    "note": "For the next few posts, highlight accessible-entry homes.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Boundary type must be recognized without inventing numeric count"
  },
  {
    "id": "M-278",
    "cohort": "fresh",
    "group": "boundary_regression",
    "note": "Try image captions for the next handful of posts.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Boundary type must be recognized without inventing numeric count"
  },
  {
    "id": "M-279",
    "cohort": "fresh",
    "group": "boundary_regression",
    "note": "For the next couple of posts, explain refinancing risks.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Boundary type must be recognized without inventing numeric count"
  },
  {
    "id": "M-280",
    "cohort": "fresh",
    "group": "boundary_regression",
    "note": "Make the next post about a local community center.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Boundary type must be recognized without inventing numeric count"
  },
  {
    "id": "M-281",
    "cohort": "fresh",
    "group": "boundary_regression",
    "note": "On October 31, feature neighborhood costumes.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Boundary type must be recognized without inventing numeric count"
  },
  {
    "id": "M-282",
    "cohort": "fresh",
    "group": "boundary_regression",
    "note": "During the next ten days, use black-and-white photography.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Boundary type must be recognized without inventing numeric count"
  },
  {
    "id": "M-283",
    "cohort": "fresh",
    "group": "boundary_regression",
    "note": "For next month’s graphics, try brushed-paper textures.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Boundary type must be recognized without inventing numeric count"
  },
  {
    "id": "M-284",
    "cohort": "fresh",
    "group": "boundary_regression",
    "note": "This Friday’s post should be about the farmers market.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "high",
    "rationale": "Boundary type must be recognized without inventing numeric count"
  },
  {
    "id": "M-285",
    "cohort": "fresh",
    "group": "boundary_regression",
    "note": "For a little while, use playful iconography.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "Boundary type must be recognized without inventing numeric count"
  },
  {
    "id": "M-286",
    "cohort": "fresh",
    "group": "boundary_regression",
    "note": "Temporarily try a zine-like visual feel, for a while.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "Boundary type must be recognized without inventing numeric count"
  },
  {
    "id": "M-287",
    "cohort": "fresh",
    "group": "boundary_regression",
    "note": "For the next two posts feature open houses, and separately during November feature school districts.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "Boundary type must be recognized without inventing numeric count"
  },
  {
    "id": "M-288",
    "cohort": "fresh",
    "group": "boundary_regression",
    "note": "I want a short-lived trial of a simpler headline style, without specifying an end.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "Boundary type must be recognized without inventing numeric count"
  },
  {
    "id": "M-R-01",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My client said \"Please use purple for the next two posts\" in a testimonial.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Under current agreement a bare client instruction submitted as a note can imply a request; \"in a testimonial\" adds ambiguity. Report separately.",
    "sourceId": "L-R-01"
  },
  {
    "id": "M-R-02",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My client said, \"Please use purple for the next two posts.\"",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Bare client instruction is category-relevant without requiring the quote to be an imperative from the realtor.",
    "sourceId": "L-R-02"
  },
  {
    "id": "M-R-03",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My client said, \"Please use purple for the next two posts.\" I disagree with them. Use orange.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "interpretive",
    "rationale": "Temporary context is relevant; next agent resolves purple versus orange and inherited two-post scope.",
    "sourceId": "L-R-03"
  },
  {
    "id": "M-R-04",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Would a post with a purple background perform better this weekend?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Advice request about a possible weekend-limited design is Temporary-relevant.",
    "sourceId": "L-R-04"
  },
  {
    "id": "M-R-05",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Would a two-week series about home insurance be useful?",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Question proposing a bounded campaign is routed to Temporary; second agent decides viability.",
    "sourceId": "L-R-05"
  },
  {
    "id": "M-R-06",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "The event flyer says 'Post three neighborhood tips this month'.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "date_range",
    "goldConfidence": "interpretive",
    "rationale": "Bare quoted finite campaign may be proposal; label is contestable, separated from primary evidence.",
    "sourceId": "L-R-06"
  },
  {
    "id": "M-R-07",
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
    "rationale": "Primary-brand fact plus bounded design, not a permanent preference.",
    "sourceId": "L-R-07"
  },
  {
    "id": "M-R-08",
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
    "rationale": "Independent lasting image default and bounded override.",
    "sourceId": "L-R-08"
  },
  {
    "id": "M-R-09",
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
    "rationale": "Post mix frequency and conditional per-post length rule.",
    "sourceId": "L-R-09"
  },
  {
    "id": "M-R-10",
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
    "rationale": "Brokerage fact, lasting style, frequency change, temporary art; no display-name change.",
    "sourceId": "L-R-10"
  },
  {
    "id": "M-R-11",
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
    "rationale": "Identity-only brand fact.",
    "sourceId": "L-R-11"
  },
  {
    "id": "M-R-12",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Talk more about first-time buyer closing costs.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Talk more about X changes post mix.",
    "sourceId": "L-R-12"
  },
  {
    "id": "M-R-13",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "For the next handful of posts, focus on staging.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "counter",
    "goldConfidence": "high",
    "rationale": "Fuzzy post count is still counter; agent chooses quantity.",
    "sourceId": "L-R-13"
  },
  {
    "id": "M-R-14",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "For a little while, let the visuals feel playful.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "No identifiable count or calendar kind.",
    "sourceId": "L-R-14"
  },
  {
    "id": "M-R-15",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "For the next two posts cover solar panels; during November, cover leasebacks.",
    "expectedCategories": [
      "temporary"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": "unclear",
    "goldConfidence": "high",
    "rationale": "One choice cannot represent incompatible count and calendar constraints.",
    "sourceId": "L-R-15"
  },
  {
    "id": "M-R-16",
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
    "rationale": "Independent lasting plus bounded instructions.",
    "sourceId": "L-R-16"
  },
  {
    "id": "M-R-17",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Would posting more local business spotlights help engagement?",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "interpretive",
    "rationale": "Advice about an ongoing mix change is Frequency-relevant.",
    "sourceId": "L-R-17"
  },
  {
    "id": "M-R-18",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Use fewer hashtags per post.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Less within every post, not fewer post types.",
    "sourceId": "L-R-18"
  },
  {
    "id": "M-R-19",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "Stop publishing celebrity mansion roundup posts.",
    "expectedCategories": [
      "frequency"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Remove this post category from ongoing distribution.",
    "sourceId": "L-R-19"
  },
  {
    "id": "M-R-20",
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
    "rationale": "Brand fact plus temporary color choice.",
    "sourceId": "L-R-20"
  },
  {
    "id": "M-R-21",
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
    "rationale": "Permanent default and count-limited override.",
    "sourceId": "L-R-21"
  },
  {
    "id": "M-R-22",
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
    "rationale": "Three independent components.",
    "sourceId": "L-R-22"
  },
  {
    "id": "M-R-23",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "I prefer practical seller advice over celebrity-home gossip.",
    "expectedCategories": [
      "preference"
    ],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Qualitative topic preference, not automatically a share change.",
    "sourceId": "L-R-23"
  },
  {
    "id": "M-R-24",
    "cohort": "diagnostic_replay",
    "group": "diagnostic_replay",
    "note": "My client said, \"Please use purple for the next two posts.\" This is only a quote I am transcribing; do not change anything.",
    "expectedCategories": [],
    "expectedIdentityFields": [],
    "expectedTemporaryType": null,
    "goldConfidence": "high",
    "rationale": "Explicitly no change requested, unlike a bare client quote.",
    "sourceId": "L-R-24"
  }
] as const;
