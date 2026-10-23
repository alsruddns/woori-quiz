# Woori Quiz language expansion progress

Progress is measured from the source catalog and localization quality checks. A locale is complete only when common UI and every public quiz are localized, routing and quiz behavior work, and metadata, sitemap, TypeScript, lint, tests, and production build pass. Incomplete locales stay out of routing and indexing.

## Scope and current counts

- Repository identified as **Woori Quiz** (`woori-quiz`, branch `develop`).
- Target: 26 locales: existing `ko`, `en`, `ja`, `zh`, `es`, `pt-br`, `de`, `fr`, `vi`, `id`, `th`, `zh-tw`, `it`, `nl`, `hi`, plus new `ru`, `tr`, `pl`, `fil`, `bn`, `uk`, `ms`, `sv`, `cs`, `ro`, `el`.
- Explicitly excluded from this expansion: `ar`, `ur`, `fa`, `he`. No staged catalogs for these locales were found; they are not in route, selector, or publication registries.
- Locale typing now exposes `TargetLocale` and `ExpansionLocale` separately from active `Locale`, with the excluded codes tracked independently. Tests guard that excluded locales do not re-enter the target set.
- Quiz registry: 96 entries, 58 public quizzes, 38 closed entries.
- Shared question bank: 621 records. UI, route and publication completion is counted separately from question data.
- 15 locales are currently published: Korean, English, Japanese, Simplified Chinese, Spanish, Brazilian Portuguese, German, French, Vietnamese, Indonesian, Thai, Traditional Chinese, Italian, Dutch, and Hindi. Sitemap contains 885 URLs (15 list pages and 870 detail pages).

## Locale progress

“Question copy” includes static translations and generated pattern copies. “UI catalog” means source entries exist and are wired; it does not imply quality approval. Published page count is list pages plus quiz detail pages.

| Locale | Question copy | UI catalog | UI quality | Published pages | SEO |
|---|---:|---|---|---:|---|
| ko | 621/621 | Connected | Pass | 59 | Pass |
| en | 621/621 (source) | Connected | Pass | 59 | Pass |
| ja | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| zh | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| es | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| pt-br | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| de | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| fr | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| vi | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| id | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| th | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| zh-tw | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| it | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| nl | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| hi | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| ru | 621/621 dynamically loadable and language-reviewed; public routes closed | Common UI + 58/58 quiz titles/descriptions staged; not connected | Bank structure, scoring order, and Russian copy review pass; UI loading, rendered layout, selector, SEO, and routing not verified | 0 | Not published |
| tr, pl, fil, bn, uk, ms, sv, cs, ro, el | 0/621 | Missing | Not verified | 0 | Not published |

The existing non-English catalogs need a fresh audit. The earlier “390/621” values are the pre-expansion baseline, not proof of completion. Japanese, Simplified Chinese, Spanish, Brazilian Portuguese, German, French, Vietnamese, Indonesian, Thai, Traditional Chinese, Italian, Dutch, and Hindi pass common UI and question coverage, all 58 public quiz gates, routing, selector, canonical/hreflang, and sitemap checks. Other incomplete languages remain out of routes, selectors, hreflang, and sitemap.

## Verification and next start point

- Question localization suites cover all 621 records with zero gaps for Japanese, Simplified Chinese, Spanish, Brazilian Portuguese, German, French, Vietnamese, Indonesian, Thai, Traditional Chinese, Italian, Dutch, and Hindi; patterned questions preserve stable answer positions, historical dates, and science symbols.
- TypeScript: passed (`pnpm exec tsc --noEmit`).
- Lint: passed (`pnpm lint`).
- Full test suite: **63/63 passed** (`pnpm test` on 2026-10-24), including route, selector, SEO, sitemap, scoring, mobile UI checks, and Russian draft question/UI coverage. TypeScript (`pnpm exec tsc --noEmit`) and lint (`pnpm lint`) passed. Production build passed (`pnpm build`): 907 paths generated, including 15 localized list pages and 870 quiz detail routes; sitemap remains at 885 URLs.
- Incomplete-target publication guard: all 11 newly requested targets are checked for absence from generated routes, published hreflang, and sitemap list/detail URLs; the updated full test suite passes.
- Russian question copy: 621/621 source IDs are staged in `src/lib/question-bank/locales/ru/question-bank.json` and can be loaded through the question-bank path. Structural checks pass for all records, four unique choices, Russian question/explanation text, unchanged English language-test choices, no batch artifacts, and scoring order preservation. Machine translations still need linguistic review.
- Russian UI copy: a draft is staged in `src/lib/i18n/ru.json`, with common UI, interactive-test labels, category copy, and all 58 public quiz titles/descriptions. Structural tests check catalog size, Russian text, dynamic placeholders, and unpublished routing. Machine translations need linguistic review; runtime, RTL-independent layout, selector, and SEO are not yet verified.
- Russian QA pass: reviewed all 58 quiz titles and descriptions, correcting awkward labels and batch-template language. Corrected the Pacific Ocean options and the Russian word for liquid mercury in two question records. The 621 question records still need linguistic review, so ru remains unpublished.
- Russian question-loader integration: the quiz's existing asynchronous question loader now dynamically loads only the RU question-bank JSON for `ru` targets. It returns localized copies without mutating source question IDs or answer indices. Tests load all 621 questions and shuffle a deterministic 120-question selection, verifying each localized choice stays aligned with the correct answer. RU remains outside `Locale`, `isLocale`, published routes, selectors, and sitemap.
- Russian SEO term QA: corrected mistranslated dynamic-title words (including division, multiplication table, mental arithmetic, pattern, recognition, click, trivia, and quiz) and revised the brain-teaser SEO title/description. Draft UI test now guards against those known machine-translation errors.
- Manual Russian question review: reviewed source and translation for all 621/621 bank records. Corrected semantic errors and awkward text, including mistranslated answer choices, English vocabulary explanations, riddle adaptations, generated math prompts, historical question templates, chemistry notation, and technical terminology. Replaced 24 question-mark placeholders with multiplication/division operators and normalized generated math prompts. All 40 English-vocabulary items now retain the English term in both the question and explanation while preserving their English choices. Question IDs, choice order, and answer indices are unchanged.
- Additional Russian bank checks found and removed stray period/newline prefixes from 48 question, choice, and explanation fields. Draft tests check all question, choice, and explanation strings for embedded line breaks, batch markers, and Unicode replacement characters, and flag untranslated choices except language-learning material, numbers, and approved scientific/technical tokens.
- Latest validation on 2026-10-24 after the full Russian question review: full suite passed (64/64 tests); `pnpm exec tsc --noEmit` and `pnpm lint` passed; `pnpm build` passed and generated 907 paths. The build still contains 15 localized list pages and 870 detail routes; sitemap remains at 885 URLs. No RU route was generated.

**Next start:** Connect RU common UI and quiz-title/description catalogs while keeping route access closed. Then verify rendered pages, interactive tests, selector, canonical/hreflang, sitemap, tests, and production build before adding RU to publication. Continue with `tr`, `pl`, `fil`, `bn`, `uk`, `ms`, `sv`, `cs`, `ro`, and `el` only after ru meets every gate. Hindi and the other 14 existing completed locales remain public. Push verified changes only to `origin/develop`.
