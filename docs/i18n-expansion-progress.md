# Woori Quiz language expansion progress

Progress is measured from the source catalog and localization quality checks. A locale is complete only when common UI and every public quiz are localized, routing and quiz behavior work, and metadata, sitemap, TypeScript, lint, tests, and production build pass. Incomplete locales stay out of routing and indexing.

## Scope and current counts

- Repository identified as **Woori Quiz** (`woori-quiz`, branch `develop`).
- Target: 26 locales: `ko`, `en`, `ja`, `zh`, `es`, `pt-br`, `de`, `fr`, `vi`, `id`, `th`, `zh-tw`, `it`, `nl`, `hi`, `ar`, `bn`, `fil`, `ms`, `pl`, `ru`, `sv`, `tr`, `uk`, `ur`, `fa`.
- Quiz registry: 96 entries, 58 public quizzes, 38 closed entries.
- Shared question bank: 621 records. UI, route and publication completion is counted separately from question data.
- Korean, English, Japanese, Simplified Chinese, Spanish, and Brazilian Portuguese are currently published. Sitemap contains 354 URLs (6 list pages and 348 detail pages).

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

The existing non-English catalogs need a fresh audit. The earlier “390/621” values are the pre-expansion baseline, not proof of completion. Japanese, Simplified Chinese, Spanish, and Brazilian Portuguese pass common UI and question coverage, all 58 public quiz gates, routing, selector, canonical/hreflang, and sitemap checks. Other incomplete languages remain out of routes, selectors, hreflang, and sitemap.

## Verification and next start point

- Japanese and Simplified Chinese question localization suites cover all 621 records with zero gaps, patterned translations, stable answer positions, historical dates, and science symbols.
- TypeScript: passed (`pnpm exec tsc --noEmit`).
- Lint: passed (`pnpm lint`).
- Full test suite: **52/52 passed** (`pnpm test`), including full question coverage for Japanese, Simplified Chinese, Spanish, and Brazilian Portuguese; route, selector, SEO, sitemap, and mobile UI checks.
- Production build: passed (`pnpm build`); 367 static pages generated, including 6 localized list pages and 348 quiz detail routes.

**Next start:** run TypeScript, lint, full tests, and production build for Brazilian Portuguese, then commit and push if they pass. Continue with German (`de`): audit all 621 records and close the current gaps (231 question strings, 809 choice strings, 279 explanations). Keep it unpublished until the full UI, quiz, routing, selector, SEO, mobile, and build gates pass. Korean, English, Japanese, Chinese, Spanish, and Brazilian Portuguese are currently public.
