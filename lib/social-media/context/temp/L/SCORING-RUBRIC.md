# PostPooch Jev benchmark L — agreed classification contract

**Read this before running or changing any labels. This is an evaluation policy, not text to send to Jev.**

## The separation of responsibilities

**Jev:** Detect every relevant posting/profile category and the *kind* of boundary on a Temporary request. It does **not** need to decide whether a suggestion is wise, whether to enact an offered suggestion, which of two competing colors wins, what an approximate quantity means, or which content to create.

**Second AI (NOT part of this experiment):** Read the complete original note, use the routed category context, decide the actual realtor intent, resolve conflicts, decide approximate counts, and decide what changes, if any, to make. A category forwarded by Jev is a **candidate for interpretation**, not authorization to mutate data.

## Gold category definitions

1. **Identity:** The realtor supplies, corrects, or removes one of the nine stored personal/professional profile facts. Factual statements can count without imperative wording. Only the realtor's **own** facts count: display name, professional title, brokerage/team, markets personally served, client audience, practice specialties, personal history, primary brand color, secondary brand color. Brand color **facts** do not imply a lasting visual Preference. Titles do not automatically establish specialties. A business named in a quote is not automatically the realtor's brokerage.
2. **Preference:** A lasting default for the wording, images, formatting, style, or content **within an individual post** (including conditional defaults: "when writing about financing, define APR"). Qualitative subject preference can qualify. It does not mean the ratio of posts featuring a topic. A separate Temporary exception does not cancel a lasting default.
3. **Frequency:** An ongoing change in the **distribution across different posts**: more/fewer posts about X, occasional polls, a fraction of posts, eliminating a category from the mix. "Talk more about X" means more X-focused posts. More detail or fewer hashtags **within every post** is Preference.
4. **Temporary:** A proposed/requested bounded posting change: next post(s), a date, tomorrow, a specific calendar period, or a clearly short-lived but vaguely bounded experiment. The writing/design/topic may be temporary. A bounded visual request is **not** automatically a permanent Preference.
5. **Temporary Type:** `counter` if the end is based on number of upcoming posts (including **few, couple, handful, single next post**); `date_range` if a date or calendar period determines the end (including tomorrow's post); `unclear` if no boundary *kind* can be identified (e.g. "for a little while") or **two independent temporary instructions** have incompatible count/calendar boundary kinds in the current single-choice scheme. A date explicitly bounding the same requested action takes precedence over post count; evaluate independently bounded instructions carefully. Do **not** demand an exact integer for `counter`.

## The crucial new intent interpretation

- **Bare quoted client instruction**: "My client said, 'Use purple for the next two posts.'" → **Temporary, counter** is a reasonable *relevance* label. Jev need not refuse merely because the words are quoted. The next agent decides the actual action.
- **Quoted instruction followed by disagreement**: "My client said purple for the next two posts; I disagree, use orange" → **Temporary, counter**. Jev need not select purple/orange. The second agent does that, using the whole note.
- **Advisory question**: "Would a purple graphic be effective this weekend?" → **Temporary, date_range** is category-relevant. This does **not** mean automatically changing the graphic; the second agent may advise against it.
- **Tentative suggestion**: "Maybe make seller checklists a larger share of posts" → **Frequency**. The second agent can decide whether to adopt it.
- **Explicit transcription/non-adoption**: "This quote is for transcription only; do not change my posts" → **no posting category** in this benchmark. The intent expressly excludes altering the posting rules, and unrelated text must not be treated as the realtor's own fact.
- **Support or factual question outside the four categories**: expected `[]`. This does **not** mean the app should ignore the message. It may require another workflow or human reply. The benchmark cannot certify that behavior.
- **Real profile facts in otherwise ordinary prose** still count as Identity, even without an explicit request; do not apply a strict imperative-only gate to them.

The label is about **relevance for handing the original note to the second AI**, not about whether the second AI ultimately performs a mutation. It is possible to have one quote that is category-relevant and a different quote explicitly marked non-actionable. This is why the dataset includes **matched counterfactual pairs**.

## Gold label handling

`goldConfidence = high` is the benchmark's clearer primary subset. `goldConfidence = interpretive` marks notes where inferring a proposed or relayed instruction involves some judgment. Their labels are **pre-registered**, but score them **separately**; do not use disagreement on these to overwrite labels after viewing model results.

- Fresh: **264** unique notes in **22 balanced groups** of 12. Fresh `high` and `interpretive` must be separated. Balance is experimental and does not represent real production prevalence.
- Diagnostic replay: **24** previously seen/problematic examples, including some re-labelled under this revised contract. Never count these as unseen validation evidence.
- `expectedCategories` is a **set** of any of the four categories.
- `expectedIdentityFields` is a set of the nine fields, present when Identity is expected. For the original broad Version 7 Identity Noul, report field-level performance as **not available**, not a failure; compare category-level Identity consistently.
- `expectedTemporaryType` is `counter | date_range | unclear | null`.
- `rationale` documents the intended interpretation; it is never model input.

## Meaningful errors, classified precisely

- **Missed relevant category:** gold category score < 0.75, regardless of whether review prevented routing. Report `<= .25` (confidently excluded) and `( .25, .75 )` (review-causing) separately.
- **Spurious confident category:** absent gold category scored >= .75, even if another uncertainty blocked routing.
- **Unnecessary category uncertainty:** absent category scored strictly > .25 and < .75, causing or contributing to review.
- **Correct automatic route:** the router emitted exactly the gold category set with a correct representable Temporary Type; empty sets are **not** counted as correct automatic mutation routes. Report `routed: []` separately.
- **Incorrect automatic route / processor mismatch:** automatically routed extra/missing category or wrong/unrepresentable Temporary Type. **This is not proof the second agent would make an incorrect database change.**
- **Justified review:** a gold `unclear` Temporary Type requiring review under the unchanged single-choice router. Other reviews on representable cases are unnecessary for the Jev stage, although the second agent may still be cautious.
- **Identity field error:** only for decomposed Identity (J and K), report exact nine-field set, false fields, and uncertain field scores; a correctly included Identity top-level category can still contain wrong field hints.
- **Boundary selection:** score the `choice` output independently of the Temporary Noul and report selected option's **probability** as the router does; don't substitute Choice `confidence` for that probability.

## What the benchmark cannot tell us

- Whether purple or orange should actually win, how many posts "a handful" means, whether an advisory idea should be adopted, or whether a quoted suggestion should become an actual setting. Those are second-agent decisions and not evaluated.
- Whether `routed: []` gets a response in the rest of the application. Report empty routes, do not claim they are harmless.
- Real-world accuracy, as this is a deliberately challenging, **synthetic**, roughly balanced sample without actual user-note frequencies.
- A change in one unchanged question's score does **not** by itself prove the changed Preference wording caused the difference. Calls are independent and may vary.

Freeze this rubric before executing any model calls. Do not relabel based on results.
