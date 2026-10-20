# PostPooch — Candidate K: Preference scope regression test

## Purpose

Compare **Combined J** (the verified experimental classifier) against **Combined J with ONLY its Preference `noul` replaced by Candidate K**. Do not compare against the old production Version 7 in this experiment. Do not deploy anything.

The narrow issue: Combined J confidently misclassified a realtor's **primary brand color fact plus a weekend-only purple graphic request** as a **lasting Preference**, potentially causing a temporary style to be saved as a permanent default. We want to eliminate that false positive **without undoing Candidate I's ability to detect real lasting Preferences alongside Temporary instructions**.

Candidate K is intentionally almost identical to Candidate I:

- Exactly the same **question** text.
- Exactly the same **true** criterion.
- Exactly the same **false** criterion **plus one contrasting example** at the end showing an Identity fact + bounded visual instruction that is **not** a lasting Preference.

**No additional Noul questions. No extra agent. No changed thresholds.**

## Files supplied together

1. `postpooch-combined-classifier-j.ts` — exact assembled Combined J baseline, also contains the unchanged router, threshold constants, max Identity aggregation, and 13-question map.
2. `preference-jev-candidate-k.ts` — one alternative Preference `noul`.
3. `preference-temporary-scope-holdout-k.ts` — 42 fresh notes and 8 diagnostic replays with local-only gold labels.
4. `postpooch-preference-k-manifest.json` — SHA-256 integrity manifest.
5. This evaluation instruction file.

Use the actual project's existing TypeSafe Jev SDK adapter, with its proven decoding and timeout behavior. Do not reconstruct any baseline question from memory.

## Preflight: must pass BEFORE any Jev call

1. Hash the supplied files; check the supplied integrity manifest. Verify the assembled Combined J file is the exact one previously evaluated and has not been rewritten.
2. TypeScript syntax/import check. Verify the supplied Preference K exports **one** `noul`.
3. Verify Candidate K changed **only** the final example in the **false** criterion versus Candidate I in Combined J. The question and true criterion must match **exactly**. If they do not, stop.
4. Confirm the candidate question map is constructed exactly as follows:

   ```ts
   import { COMBINED_J_QUESTIONS } from './postpooch-combined-classifier-j';
   import { PREFERENCE_QUESTION_CANDIDATE_K } from './preference-jev-candidate-k';
   const K_QUESTIONS = {
     ...COMBINED_J_QUESTIONS,
     preference: PREFERENCE_QUESTION_CANDIDATE_K,
   } as const;
   ```

   This code is illustrative; adapt file locations to your temporary runner, without changing question bodies. Both maps contain **exactly thirteen questions**: nine Identity, one Preference, one Frequency, one Temporary, one Temporary Type. The only difference is Preference.
5. Verify the fixture has **42 unique fresh** note texts and **8 separately labeled diagnostic replays**, 50 unique IDs/notes in total. None of the 42 fresh note texts occurs verbatim in prior test fixtures. The replay cases are **not fresh validation evidence**.
6. Confirm shared `jev-latest`, `0.75` inclusion, `0.25` exclusion, `0.70` Temporary Type, eight-second timeout, **zero retries**, maximum Identity score, and unchanged `decideClassification`.
7. Confirm this is **read-only** for the application and database. Save all experiment runner files and outputs in the OS temporary directory, **outside the project repository**. Record pre/post production-source hashes.
8. Verify all Jev requests send **only `{note: testCase.note}`** as model input. Do not send test IDs, cohorts, expected categories, gold field labels, or scoring instructions.

If preflight fails, **stop with no Jev requests** and report the exact missing/unverifiable item. Do not improvise replacements.

## Execute exactly 100 requests

For each of the 50 notes:

- One request with **Arm J**, `COMBINED_J_QUESTIONS`.
- One request with **Arm K**, the same 13-question map with only Preference replaced.

**100 attempted Jev requests total**, one call per arm per note. Alternate which arm runs first across notes. Run sequentially, with zero retries. If a call fails, log it; do not rerun or secretly add further calls. Do not change prompts based on interim scores.

Append each complete raw response or error to a JSONL file immediately, outside the repository. Preserve raw outputs before calculating metrics. After all requested calls are finished, compute analysis **offline** from the saved records only. Do not make extra model calls.

Store per arm/case: note, ID, cohort, expected labels (local scoring only), all nine Identity probabilities and max, Preference/Frequency/Temporary probabilities, Temporary Type selected option and all option probabilities (not merely any summary confidence field), threshold inclusions and uncertainties, exact router result and reason, model version, request tokens, latency, errors/timeouts.

## Required interpretation (do not change the gold labels after seeing outputs)

All four categories can co-occur. A factual realtor Identity update is separate from posting instructions.

**Preference** means an independent **lasting default** for what individual posts say or look like. A real default remains a Preference even if a separate short-lived rule overrides it for a few posts.

**Temporary** means a post-count or finite-calendar-bounded instruction. A visual/color request **only** for tomorrow's graphic, next week's graphics, or the next three posts is Temporary, **not** automatically Preference. A primary or secondary **brand color** is Identity, not an implied general post-style Preference.

Examples (do not insert these explanations into the Jev input):

- "My brand's primary color is navy; use yellow in tomorrow's post" ⇒ **Identity + Temporary**, no Preference.
- "Keep images natural by default; use yellow filters tomorrow" ⇒ **Preference + Temporary**.
- "Our primary brand color is navy; normally use high-contrast text, but use yellow letters tomorrow" ⇒ **Identity + Preference + Temporary**.
- "Publish polls occasionally, and keep poll questions brief whenever they appear" ⇒ **Frequency + Preference**.

**Frequency** means ongoing distribution **across different posts**; do not confuse it with adding more detail *within* one post.

**Temporary Type** remains exactly unchanged. “Next **few** posts,” “next **handful** of posts,” and “next **couple** of posts” are valid **`counter`**, even without numeric digits: the downstream second agent decides the actual number. A calendar date/period is `date_range`. “For a little while” with no identifiable boundary kind is `unclear`. If the router reviews because Temporary Type is `unclear`, that is the currently expected safe behavior. Do not treat a fuzzy count as an error or edit the downstream agent.

A quotation from a customer, testimonial, flyer, or third-party report **does not by itself become the realtor's own posting instruction**. This is a negative-control issue seen in Combined J; it is **not** what Candidate K was designed to fix.

## Primary metrics — focus on actual regressions, not review-count cosmetics

Report the 42 fresh cases **separately** from eight diagnostic replays.

### 1. Preference recognition

For J and K show true positives, false negatives, confident false positives, uncertain negatives, precision and recall. A real Preference with score `< .75` is missed even if another category caused review; an absent Preference with `.25 < p < .75` is uncertain rather than excluded.

### 2. Narrow safety goal

Among the 10 **Identity + Temporary (visual)** fresh notes and the 7 **Temporary-only visual** fresh notes, show:

- Number of new or pre-existing **confident Preference false positives**.
- Number of **Preference uncertainty reviews**.
- Whether any **incorrect lasting Preference** was routed automatically.
- Paired Preference scores for **every** such note.

Also display the first diagnostic replay containing the exact Combined J brand-color/weekend regression, but **do not count fixing a seen replay as sufficient proof of generalization**.

### 3. Must preserve genuine Preferences

For the 8 fresh **Preference + Temporary** notes and 4 fresh **Identity + Preference + Temporary** notes, show whether the genuine lasting Preference is retained. Check the 5 **Preference + Frequency** notes as well, because Candidate I previously regressed on this group. Report every new Preference miss, and whether it merely caused review or was **silently omitted in an automatic route**.

### 4. Overall accuracy and routing safety

Compare exact category sets, all nine exact Identity field labels, Temporal Type, and correct automatic routing on all fresh cases.

Separate these outcomes, never combine them:

- **Correct automatic routes** with the complete intended set and correct representable Temporary Type.
- **Unsafe silent misroutes**: an automatically routed note missing an intended category, adding an invented one, or with wrong/unrepresentable boundary type.
- **Justified reviews** when a gold boundary is `unclear` under the current one-choice design.
- **Unnecessary reviews** when gold labels are fully representable.
- **Empty-category routes**: list these separately; Jev routing to `[]` does not prove how the downstream app behaves.

For reviews, give `routing_uncertainty` vs `temporary_type_uncertainty`, and name which category caused the uncertainty. Investigate whether unchanged Identity, Frequency, Temporary or Temporary Type scores crossed threshold boundaries when Preference wording changed. Do not misattribute unrelated baseline errors to K.

### 5. Usage

Report actual input/output/total tokens, median and P90 latency, failures and timeouts for paired successful cases. Never invent API prices.

## Required final report

Provide:

1. **Primary Preference accuracy table** (fresh first, replay separate).
2. **All seventeen fresh temporary-visual negatives** with exact notes and paired Preference scores, particularly the 10 Identity + Temporary ones.
3. **All seventeen fresh Preference mixed-note positives** (8 P+T, 4 I+P+T, 5 P+F) with paired Preference scores and route decisions.
4. **Every additional classification or routing error** (including the eight replays), with reasons and full probabilities in downloadable CSV/JSON.
5. **Routing/safety table** separating correct routes, silent misroutes, appropriate reviews, unnecessary reviews, empty routes.
6. **Token/latency table**.
7. **Concise decision**: Did K remove the targeted confident false-positive without reducing legitimate Preference recall or creating new silent errors? Was it better on **fresh cases**, not just the previously seen regression? Keep J or promote K as the new *experimental* Preference candidate?

Output the raw append-only JSONL, a complete JSON, CSV(s), a manifest of before/after hashes, and exact local filesystem paths. No production edits, migrations, database calls, deployments, new Jev runs after initial 100, routing-threshold changes, prompt changes during the test, or second-agent alterations. **Stop after offline reporting.**
