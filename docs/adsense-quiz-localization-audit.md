# Quiz localization and indexing audit

Generated from the current `develop` content with `pnpm check:localization-quality`.
The indexing gate does not translate or change quiz data. It keeps incomplete pages reachable and sets `noindex,follow` until their content meets the thresholds below.

## Source localization gaps

Question and explanation counts are unchanged fallback fields across the 621-question bank. Choice counts omit unchanged values that are intentionally preserved as the language sample being tested, a number or symbol, or a recognized proper/technical name; this matches the existing quality gate's protected-choice rules. The gate thresholds remain unchanged.

| Locale | Question fallback | Choice fallback | Explanation fallback |
|---|---:|---:|---:|
| ko | 0 | 0 | 0 |
| en | 0 | 0 | 0 |
| ja | 231 | 766 | 279 |
| zh | 231 | 766 | 279 |
| es | 231 | 794 | 279 |
| pt-br | 231 | 794 | 279 |
| de | 231 | 809 | 279 |
| fr | 231 | 807 | 279 |
| vi | 231 | 791 | 279 |
| id | 231 | 810 | 279 |
| th | 231 | 766 | 279 |
| zh-tw | 231 | 766 | 279 |
| it | 231 | 810 | 279 |
| nl | 231 | 795 | 279 |
| hi | 231 | 766 | 279 |

For a per-question Korean translation worklist, call `getQuestionLocalizationGaps("ko")` from `src/lib/localization-quality.ts`. Each row contains the stable question ID, category, English prompt/choices/explanation, missing fields, and choice indexes needing translation. Other non-English locales use the same helper.

## Indexing policy and current coverage

- English detail pages are always indexable.
- Non-English details require localized title and category description, localized result UI, at least 95% localized questions, 95% localized non-protected choices, and 90% localized explanations.
- Language quiz answer text, single-letter pattern targets, numeric/unit expressions, standard capital names, historical date values, chemical symbols, and listed technology names can remain unchanged where they are the content being tested.
- Incomplete detail pages stay available at their existing locale-first URL, retain a self-canonical, and return `noindex,follow`.
- `hreflang` lists only indexable locale pages; `x-default` remains English.
- Quiz-list pages are checked separately. All 15 localized list locales are indexable, including Dutch after the CTA was translated to `Quiz starten`.

| Locale | Indexable details / 58 | Noindex details |
|---|---:|---:|
| ko | 58 | 0 |
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

The resulting sitemap contains **456 URLs**: 441 indexable detail URLs plus 15 localized list pages. Korean detail coverage is now 58/58. Dutch `Start quiz` was changed to `Quiz starten`, so the Dutch list remains eligible under the unchanged list localization gate. No SEO policy or URL shape changed; all entries remain `/{locale}/quiz[/slug]`.

## Translation priority

Korean question, unapproved choice, and explanation fallback counts are now zero. Remaining non-English gaps are concentrated in the other locales; translate those before enabling their detail pages for indexing. The locale pages currently omitted from indexing will automatically return to sitemap and `hreflang` when their measured quality crosses the unchanged threshold. English-target examples, numeric/symbol values, and approved proper-name terms are not counted as untranslated choices.

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
