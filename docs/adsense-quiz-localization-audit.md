# Quiz localization and indexing audit

Generated from the current `develop` content with `pnpm check:localization-quality`.
The indexing gate does not translate or change quiz data. It keeps incomplete pages reachable and sets `noindex,follow` until their content meets the thresholds below.

## Source localization gaps

Counts are exact unchanged source fields in the 621-question bank. The choice count includes numeric and proper-name choices that may legitimately remain unchanged; the indexing rate separately excludes those approved values.

| Locale | Question fallback | Choice fallback | Explanation fallback |
|---|---:|---:|---:|
| ko | 221 | 2,126 | 269 |
| en | 0 | 0 | 0 |
| ja | 231 | 2,150 | 279 |
| zh | 231 | 2,150 | 279 |
| es | 231 | 2,174 | 279 |
| pt-br | 231 | 2,178 | 279 |
| de | 231 | 2,194 | 279 |
| fr | 231 | 2,186 | 279 |
| vi | 231 | 2,175 | 279 |
| id | 231 | 2,194 | 279 |
| th | 231 | 2,150 | 279 |
| zh-tw | 231 | 2,150 | 279 |
| it | 231 | 2,194 | 279 |
| nl | 231 | 2,180 | 279 |
| hi | 231 | 2,150 | 279 |

For a per-question Korean translation worklist, call `getQuestionLocalizationGaps("ko")` from `src/lib/localization-quality.ts`. Each row contains the stable question ID, category, English prompt/choices/explanation, missing fields, and choice indexes needing translation. Other non-English locales use the same helper.

## Indexing policy and current coverage

- English detail pages are always indexable.
- Non-English details require localized title and category description, localized result UI, at least 95% localized questions, 95% localized non-protected choices, and 90% localized explanations.
- Numeric-only expressions, standard capital names, historical date values, chemical symbols, and listed technology names can remain unchanged where appropriate.
- Incomplete detail pages stay available at their existing locale-first URL, retain a self-canonical, and return `noindex,follow`.
- `hreflang` lists only indexable locale pages; `x-default` remains English.
- Quiz-list pages are checked separately. Fourteen list locales are indexable; Dutch is `noindex,follow` because its visible play CTA is still the English `Start quiz` label.

| Locale | Indexable details / 58 | Noindex details |
|---|---:|---:|
| ko | 28 | 30 |
| en | 58 | 0 |
| ja | 26 | 32 |
| zh | 26 | 32 |
| es | 24 | 34 |
| pt-br | 25 | 33 |
| de | 25 | 33 |
| fr | 24 | 34 |
| vi | 24 | 34 |
| id | 24 | 34 |
| th | 26 | 32 |
| zh-tw | 26 | 32 |
| it | 24 | 34 |
| nl | 25 | 33 |
| hi | 26 | 32 |

The resulting sitemap contains **425 URLs**: 411 indexable detail URLs plus 14 localized list pages. The previous sitemap contained 885 URLs. No URL shape changed; all entries remain `/{locale}/quiz[/slug]`.

## Translation priority

The current uncovered set is concentrated in general knowledge, nonsense, and legacy question rows. Translate the Korean missing rows first, then complete the other 13 non-English locales. The locale pages currently omitted from indexing will automatically return to sitemap and `hreflang` when their measured quality crosses the threshold.

## Duplicate and uniqueness review

- Exact normalized question prompt duplicates: **0 / 621**.
- Public quiz slugs: **58 unique**.
- Public quiz titles and descriptions: **58 unique in each of the 15 locales**.
- All 38 bank-backed public quizzes have a non-empty source pool; the other 20 public quizzes use interactive or generated math modes.
- Automated high-overlap review found 10 quiz-pool pairs. These are review candidates, not automatic deletions:

| Quiz pair | Shared pool IDs | Jaccard overlap |
|---|---:|---:|
| nonsense / riddle-quiz | 45 | 100% |
| nonsense / random-nonsense-10 | 45 | 100% |
| riddle-quiz / random-nonsense-10 | 45 | 100% |
| brain-teaser / random-brain-teaser | 64 | 100% |
| number-pattern-quiz / logic-reasoning-quiz | 36 | 84% |
| history-knowledge-quiz / ancient-civilizations-quiz | 40 | 80% |
| language-knowledge-quiz / english-vocabulary | 40 | 100% |
| random-quiz / challenge-10 | 559 | 100% |
| random-quiz / challenge-20 | 559 | 100% |
| challenge-10 / challenge-20 | 559 | 100% |

The random/challenge pairs deliberately share a source pool but draw different run lengths. The nonsense, brain, history, language, and reasoning overlaps deserve editorial review before any pool split or content replacement; no questions were removed automatically.
