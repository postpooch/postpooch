# PostPooch — Benchmark M: fixed classification/relevance contract

**Read before running any Jev calls. Do not edit gold labels based on outputs.**

## What Jev is responsible for

Jev identifies all *relevant* category destinations (`identity`, `preference`, `frequency`, `temporary`), plus the **kind** of Temporary boundary. It does **not** decide whether a proposed change is wise, select between orange/purple, infer the exact integer behind "few," or perform mutations. The **second agent** receives the original full note and resolves exact intent/action. **Do not call the second agent in this benchmark.**

There are two importantly different statements:

- **Unopposed quotation:** `My client said, "Use coral in the next two posts."` → relevant **Temporary**, `counter`, even without an explicit command from the realtor. The second agent decides the final action.
- **Explicit non-adoption:** `My client said, "Use coral in the next two posts." I'm archiving their words only; do not act on them.` → **no Temporary category**; the note explicitly rules out that proposed change and gives no replacement.

It is **not** enough to reject anything in quotation marks, any question, or any third-party proposal. That would destroy the classification recall this system is designed to provide.

## Core labels

- **Identity:** An actual fact, removal, or correction about **the realtor's own** professional display name, title, brokerage/team, service markets, target clients, specialties, personal background, primary brand color, or secondary brand color. An ordinary first-person fact counts without an imperative. Another person's facts do not. Never infer an unmentioned Identity field from a related field.
- **Preference:** An ongoing/default rule for what goes **within** individual posts, including a contextual rule (`when explaining financing, define terms`) or qualitative topic preference. Different from the share or number of posts on a topic.
- **Frequency:** How frequently a *kind of post* or optional feature occurs **across different posts**. `Talk more about X` means more X-focused posts. Stopping a recurring post category is Frequency. A rule about emojis **per caption** is Preference.
- **Temporary:** A bounded content/design/tone/posting proposal, for a count of posts or a calendar date/period. `A few`, `a handful`, and `a couple` of upcoming posts count as `counter`. `Tomorrow's post` and `next week` are `date_range`. `For a little while` is Temporary with `unclear` boundary. Two independent bounded instructions with incompatible count/calendar types are `unclear` under the existing single-choice representation.

**An expressly rejected quoted instruction with no positive replacement is not an independently relevant category.** This does not erase an independent instruction elsewhere in the same note. The word "reject" alone must not negate a positive replacement instruction: `They wanted purple; I disagree, use orange in the next two posts` is still **Temporary**. `Stop publishing celebrity-home roundups` is itself a real **Frequency** instruction, not mere rejection of an outside idea.

**Unadopted quote vs. adopted/replacement vs. first-person fact** must be scored by their actual scope. Do not apply a global yes/no action gate. Do not invent a fourteenth Jev question or split the note into multiple requests.

## Questions and advice

`Would a coral border work for tomorrow's post?` → **Temporary**, `date_range`: the second agent is being asked to consider the idea. `Should we use shorter sentences as our normal style?` → **Preference**. `Would more neighborhood posts help?` → **Frequency**. Even if the second agent later advises against the idea, the category is relevant.

`Can you explain what "a temporary post" means?` or `Please quote this instruction for an essay; do not follow it` → no posting categories. Such notes may still deserve an answer via another app workflow. **An empty category set is NOT the same as ignoring the user.**

## Gold cohorts and matches

- **Fresh high-confidence:** 216 cases, primary for clear correctness, including 36 explicit non-adoption cases, 36 positive replacement cases, and 36 bare-quote paired *negatives*.
- **Fresh interpretation-sensitive:** 72 cases, bare relayed proposals and genuine advisory questions. Their positive labels follow the user's relevance standard but require interpretation, so report them separately. Do not reclassify after seeing results.
- **Diagnostic replays:** 24 historical notes from Benchmark L, distinct from fresh. Do not count them as new evidence.
- **36 counterfactual matched pairs:** same underlying quoted request, once merely relayed and once explicitly disclaimed. Pairs cross the interpretive/high cohorts. `pairId` links them; score correct-both-side behavior as well as each side separately.

Synthetic holdout distribution is deliberately adversarial and **not an estimate of real customer-note prevalence**. Group names, labels, rationales, pair IDs, and this rubric **must never appear in the Jev request state**.

## Pre-registered primary measures

1. **Explicit non-adoption:** Among the 36 fresh `reject_temporary`, `reject_preference`, `reject_frequency` notes, how often does each arm *confidently* include an irrelevant category (yes-score `>= 0.75`)? Also report middle-score uncertainty and incorrect automatically routed nonempty sets. Separate the three groups. This is the primary targeted problem.
2. **Preserve actionable instructions:** On `replace_*` and `reject_*_add_*` groups (72 fresh positive notes), count every relevant-category miss (< `.75`) and any incorrect automatic route. A change that eliminates irrelevant categories at the price of missing real replacements is **not** an improvement.
3. **Preserve relayed/advisory recall:** On the 72 interpretation-sensitive positives, report recall and exact sets separately. Don't reward simply rejecting all quotes/questions.
4. **Preserve normal category recognition:** `keep_*`, `identity_plus_advice_t`, `standalone_regression`, `boundary_regression` (plus other groups) cover unrelated tasks. Report exact sets, category recall, Identity field matches, Temporary Type selection, and routing stability. Don't let a local improvement cause broad regressions.
5. **Matched pairs:** For each of 36 pair IDs, count whether *both* sides were correctly classified in each repetition; do not count the three repeats as independent notes.

A no-gold category score between `.25` and `.75` is an **uncertain negative**, not a correct exclusion. A true category with a score below `.75` is a **miss**, including when routing is blocked for review. `<= .25` represents confident exclusion. Never treat a wrong confident inclusion as correct just because another category is relevant.

## Router scoring

The thresholds are permanently fixed for the experiment: include `>= .75`, exclude `<= .25`, review on strictly `.25 < p < .75` for **any** category; selected Temporary Type probability must be `>= .70` and selected type must not be `unclear`.

- **Correct automatic route:** Nonempty routed category set exactly equals gold categories, and routed Temporary Type matches an actionable gold boundary.
- **Incorrect automatic route:** Routed nonempty set has extra/missing category or wrong type. That is an upstream processing mismatch, **not proof the downstream agent would mutate incorrectly**.
- **Correct empty route:** `routed: []` when gold is `[]`. Always report separately from automatic actionable routes. The benchmark does not certify how the rest of PostPooch responds to empty routes.
- **Incorrect empty route:** `routed: []` when gold has a relevant category. This silently discards a route and must be highlighted.
- **Justified review:** Gold Temporary `unclear` requires review under the existing single-choice router.
- **Unnecessary review:** Review on a note with representable categories or empty categories; when multiple middle scores occur, attribute review to *all* uncertain categories, not just the first.
- **Silently omitted relevant category:** An automatic route lacks a gold category. Separately track review-causing misses and automatically routed misses.
- **Temporary Type:** Score the selected Choice option and its **selected option probability**, not top-level Choice confidence, only for gold Temporary examples.
- **Identity fields:** Exact field-set accuracy matters even when overall Identity is right. Use 9 raw scores and the unchanged max aggregator; note `max` is a routing heuristic, not a calibrated union probability.

## Repetition and statistical comparisons

Each note is evaluated 3 times/arm. Report trial-level proportions **and** per-note majority/unanimous correctness. Use paired note-level/bootstrap or pair-clustered confidence intervals; never count all 3 repeats as independent observations. Bootstrap `pairId` together for matched comparisons, not as two independent notes.

A conservative, **pre-registered preference rule** for deciding whether to replace J:

1. A challenger must reduce confident spurious categories on the 36 fresh explicit non-adoption notes by at least **10 absolute percentage points** versus J (measured by trial rate), with the paired note-clustered 95% interval supporting a real reduction. Otherwise leave J preferred.
2. It must not reduce relevant-category recall on the 216 fresh high-confidence notes by more than **2 percentage points** versus J, nor on the 72 fresh interpretation-sensitive positives by more than **2 percentage points**; examine the paired interval and individual misses, not only headline rates.
3. It must not increase **incorrect automatic routes** or incorrect **empty** routes on clear cases, nor create new severe Identity-field or Temporary-Type failures. If it does, mark the candidate unsafe/undecided rather than choosing based on aggregate accuracy alone.
4. When M and N both satisfy these conditions and are statistically indistinguishable on exact sets, prefer **M** (one modified question rather than three), then lower cost/tokens. If neither qualifies, retain **J**. If sampling uncertainty is too high to distinguish, declare no winner rather than claiming proof.

These are selection rules for *this fixed experiment*, not universal production SLAs. If a guardrail fails by a small amount or intervals are inconclusive, report the ambiguity. No changing thresholds or labels after examining model outputs.

## Limitations

- It tests ONLY Jev; do not simulate the second agent or assert any actual database effects.
- It compares frozen variants, **not** a fully general intent detector. Changing a `noul` false definition may also perturb unrelated scores because all 13 questions are submitted together.
- Some relayed/advisory labels are interpretation-sensitive; report separately. Explicit rejection with a separate replacement is deliberately a different label.
- A good synthetic result does not prove production accuracy on actual customer notes.
