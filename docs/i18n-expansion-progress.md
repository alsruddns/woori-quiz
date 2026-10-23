# Woori Quiz language expansion progress

Progress is measured from the source catalog and localization quality checks. A locale is complete only when common UI and every public quiz are localized, routing and quiz behavior work, and metadata, sitemap, TypeScript, lint, tests, and production build pass. Incomplete locales stay out of routing and indexing.

## Scope and current counts

- Repository identified as **Woori Quiz** (`woori-quiz`, branch `develop`).
- Target: 26 locales: `ko`, `en`, `ja`, `zh`, `es`, `pt-br`, `de`, `fr`, `vi`, `id`, `th`, `zh-tw`, `it`, `nl`, `hi`, `ar`, `bn`, `fil`, `ms`, `pl`, `ru`, `sv`, `tr`, `uk`, `ur`, `fa`.
- Quiz registry: 96 entries, 58 public quizzes, 38 closed entries.
- Shared question bank: 621 records. UI, route and publication completion is counted separately from question data.
- Korean, English, Japanese, and Simplified Chinese are currently published. Sitemap contains 236 URLs (4 list pages and 232 detail pages).

## Locale progress

“Question copy” includes static translations and generated pattern copies. “UI catalog” means source entries exist and are wired; it does not imply quality approval. Published page count is list pages plus quiz detail pages.

| Locale | Question copy | UI catalog | UI quality | Published pages | SEO |
|---|---:|---|---|---:|---|
| ko | 621/621 | Connected | Pass | 59 | Pass |
| en | 621/621 (source) | Connected | Pass | 59 | Pass |
| ja | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| zh | 621/621; 0 question gaps | Connected | Pass | 1 + 58 | Pass |
| es | 548/621 gap-free; 73 records retain choice gaps | Connected | Blocked by content gaps | 0 | Not published |
| pt-br | 390/621 baseline | Connected | Not verified | 0 | Not published |
| de | 390/621 baseline | Connected | Not verified | 0 | Not published |
| fr | 390/621 baseline | Connected | Not verified | 0 | Not published |
| vi | 390/621 baseline | Connected | Not verified | 0 | Not published |
| id | 390/621 baseline | Connected | Not verified | 0 | Not published |
| th | 390/621 baseline | Connected | Not verified | 0 | Not published |
| zh-tw | 390/621 baseline | Connected | Not verified | 0 | Not published |
| it | 390/621 baseline | Connected | Not verified | 0 | Not published |
| nl | 390/621 baseline | Connected | Not verified | 0 | Not published |
| hi | 390/621 baseline | Connected | Not verified | 0 | Not published |
| ar, bn, fil, ms, pl, ru, sv, tr, uk, ur, fa | 0/621 | Missing | Not verified | 0 | Not published |

The existing non-English catalogs need a fresh audit. The earlier “390/621” values are the pre-expansion baseline, not proof of completion. Japanese and Simplified Chinese pass common UI and question coverage, all 58 public quiz gates, routing, selector, canonical/hreflang, and sitemap checks. Other incomplete languages remain out of routes, selectors, hreflang, and sitemap.

## Verification and next start point

- Japanese and Simplified Chinese question localization suites cover all 621 records with zero gaps, patterned translations, stable answer positions, historical dates, and science symbols.
- TypeScript: passed (`pnpm exec tsc --noEmit`).
- Lint: passed (`pnpm lint`).
- Full test suite: **50/50 passed** (`pnpm test`), including Japanese and Simplified Chinese question coverage, Spanish withholding checks, route generation, language switching, SEO, sitemap, and mobile UI checks.
- Production build: passed (`pnpm build`); 247 static pages generated, including 4 localized list pages and 232 quiz detail routes.

Spanish translation checkpoint: a batched translation draft covers 231 records. The source audit reports 0 question fallbacks, 0 explanation fallbacks, and 107 unresolved choice fallbacks across 73 question records. The UI catalog exists; the list quality gate remains blocked by these content gaps, and no Spanish routes are generated or indexed. Resume by running `getQuestionLocalizationGaps("es")` against `src/lib/question-bank/locales/es/question-bank.json`, resolve the remaining proper-name choices and generated feature options, then run all 58 detail quality checks.

**Next start:** finish the 107 unresolved Spanish choice fallbacks across 73 question records, run the full language and SEO checks, then publish only if all gates pass. Korean, English, Japanese, and Chinese are currently public. Following Spanish, proceed with Brazilian Portuguese (`pt-br`).
