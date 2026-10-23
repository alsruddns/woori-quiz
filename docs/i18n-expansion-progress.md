# Woori Quiz language expansion progress

Progress is measured from the source catalog and localization quality checks. A locale is complete only when common UI and every public quiz are localized, routing and quiz behavior work, and metadata, sitemap, TypeScript, lint, tests, and production build pass. Incomplete locales stay out of routing and indexing.

## Scope and current counts

- Repository identified as **Woori Quiz** (`woori-quiz`, branch `develop`).
- Target: 26 locales: existing `ko`, `en`, `ja`, `zh`, `es`, `pt-br`, `de`, `fr`, `vi`, `id`, `th`, `zh-tw`, `it`, `nl`, `hi`, plus new `ru`, `tr`, `pl`, `fil`, `bn`, `uk`, `ms`, `sv`, `cs`, `ro`, `el`.
- Explicitly excluded from this expansion: `ar`, `ur`, `fa`, `he`. No staged catalogs for these locales were found; they are not in route, selector, or publication registries.
- Locale typing now exposes `TargetLocale` and `ExpansionLocale` separately from active `Locale`, with the excluded codes tracked independently. Tests guard that excluded locales do not re-enter the target set.
- Quiz registry: 96 entries, 58 public quizzes, 38 closed entries.
- Shared question bank: 621 records. UI, route and publication completion is counted separately from question data.
- 19 locales are currently published: the existing 15 plus Russian, Turkish, Polish, and Filipino. Sitemap contains 1,121 URLs (19 list pages and 1,102 detail pages).

## Locale progress

**Question copy** includes static translations and generated pattern copies. **UI catalog** means source entries exist; it does not imply runtime connection or quality approval. Published page count is list pages plus quiz detail pages.

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
| ru | 621/621 translated and reviewed | Connected; common UI and 58/58 quiz titles/descriptions | Pass; Russian page render, interactive test, route, selector, and SEO checks pass | 59 (1 list + 58 details) | Pass; canonical, hreflang, and sitemap verified |
| tr | 621/621; localized questions, choices, and explanations; answer IDs/order preserved | Connected; common UI, interactive test, guides, categories, and 58/58 quiz titles/descriptions | Pass; all public quiz and list-page quality gates pass | 59 (1 list + 58 details) | Pass; canonical, hreflang, and sitemap verified |
| pl | 621/621 translated; IDs, categories, option order, and answer IDs preserved | Connected; common UI, guides, categories, interactive test, and 58/58 quiz titles/descriptions | Pass; localized page quality and route rendering pass | 59 (1 list + 58 details) | Pass; canonical, hreflang, sitemap, and HTML lang verified |
| fil | 621/621 translated; IDs, categories, option order, and answer IDs preserved | Connected; common UI, guides, categories, interactive test, and 58/58 quiz titles/descriptions | Pass; zero question/choice/explanation fallbacks, all public page gates pass | 59 (1 list + 58 details) | Pass; canonical, hreflang, sitemap, and HTML lang verified |
| bn, uk, ms, sv, cs, ro, el | 0/621 | Missing | Not verified | 0 | Not published |

The existing non-English catalogs need a fresh audit. The earlier “390/621” values are the pre-expansion baseline, not proof of completion. Japanese, Simplified Chinese, Spanish, Brazilian Portuguese, German, French, Vietnamese, Indonesian, Thai, Traditional Chinese, Italian, Dutch, and Hindi pass common UI and question coverage, all 58 public quiz gates, routing, selector, canonical/hreflang, and sitemap checks. Other incomplete languages remain out of routes, selectors, hreflang, and sitemap.

## Verification and next start point

- Question localization suites cover all 621 records with zero gaps for Japanese, Simplified Chinese, Spanish, Brazilian Portuguese, German, French, Vietnamese, Indonesian, Thai, Traditional Chinese, Italian, Dutch, and Hindi; patterned questions preserve stable answer positions, historical dates, and science symbols.
- TypeScript: passed (`pnpm exec tsc --noEmit`, 2026-10-24).
- Lint: passed (`pnpm lint`, 2026-10-24).
- Polish completion validation on 2026-10-24: **79/79 tests passed**, TypeScript passed, lint passed, and production build passed with 1,069 generated pages. Sitemap has 1,062 URLs (18 localized lists + 1,044 quiz detail URLs). The production server returned 200 for `/pl/quiz` and `/pl/quiz/general-knowledge`, 404 for `/fil/quiz`, and served `<html lang="pl">`, Polish canonical/hreflang links, and Polish sitemap entries. No `fil` sitemap entry is present.
- Polish content gate: 621/621 source IDs have localized questions, choices, and explanations; IDs, categories, choices order, answer IDs, and scoring behavior are preserved. All 58 public quiz entries, common UI, discovery, interactive test, category and guide copy pass page quality checks. The 48 explanation fallback fields are language-neutral formula/expression entries, with zero question or choice fallbacks.
- Shared runtime root layouts now set HTML language by published route locale while keeping the URL tree and static generation policy unchanged. The default `/` route remains Korean.
- Incomplete-target publication guard: all seven remaining targets (`bn`, `uk`, `ms`, `sv`, `cs`, `ro`, `el`) and excluded locales (`ar`, `ur`, `fa`, `he`) are absent from generated routes, published hreflang, and sitemap URLs; tests confirm unsupported paths return 404.
- Russian question copy: all 621 source IDs are available through the question-bank loader in `src/lib/question-bank/locales/ru/question-bank.json`. Structural checks pass for all records, four unique choices, Russian question/explanation text, unchanged English language-test choices, no batch artifacts, and scoring order preservation. All 621 records received manual language review.
- Russian UI copy: `src/lib/i18n/ru.json` includes common UI, interactive-test labels, categories, and all 58 public quiz titles/descriptions. Russian is connected to rendered routes, selector, and runtime content. Russian plural forms and dynamic count tokens are covered by tests.
- Russian QA pass: reviewed all 58 quiz titles and descriptions, correcting awkward labels and batch-template language. Corrected the Pacific Ocean options and the Russian word for liquid mercury in two question records. All 621 question records received linguistic review; RU is now published after page, selector, SEO, sitemap, and build gates.
- Russian question-loader integration: the quiz's existing asynchronous question loader dynamically loads the RU question-bank JSON only for `ru` targets. It returns localized copies without mutating source question IDs or answer indices. Tests load all 621 questions and shuffle a deterministic 120-question selection, verifying each localized choice stays aligned with the correct answer.
- Russian SEO term QA: corrected mistranslated dynamic-title words (including division, multiplication table, mental arithmetic, pattern, recognition, click, trivia, and quiz) and revised the brain-teaser SEO title/description. Russian runtime tests guard against those known translation errors.
- Manual Russian question review: reviewed source and translation for all 621/621 bank records. Corrected semantic errors and awkward text, including mistranslated answer choices, English vocabulary explanations, riddle adaptations, generated math prompts, historical question templates, chemistry notation, and technical terminology. Replaced 24 question-mark placeholders with multiplication/division operators and normalized generated math prompts. All 40 English-vocabulary items now retain the English term in both the question and explanation while preserving their English choices. Question IDs, choice order, and answer indices are unchanged.
- Additional Russian bank checks found and removed stray period/newline prefixes from 48 question, choice, and explanation fields. Tests check all question, choice, and explanation strings for embedded line breaks, batch markers, and Unicode replacement characters, and flag untranslated choices except language-learning material, numbers, and approved scientific/technical tokens.
- RU runtime validation on 2026-10-24: focused RU render tests pass; the production server returned 200 for Russian list/detail routes. Russian canonical and hreflang tags, selector option, visible copy, and sitemap entries were verified.
- TR runtime validation on 2026-10-24: the local production server returned 200 for `/tr/quiz` and `/tr/quiz/general-knowledge`; `/pl/quiz` returned 404. Turkish canonical and hreflang tags, selector option, visible copy, and sitemap entries were verified.
- Turkish localization: all 621 IDs and 3,526 question/choice/explanation fields have Turkish copies. Structural and content checks confirm complete fields, four distinct choices, preserved English-learning choices, no localization fallbacks, and unchanged IDs/categories/answer indices. Generated arithmetic explanations were normalized against the source formulas. All 58 public titles and descriptions and the common UI catalog received a Turkish editorial pass.
- Turkish runtime includes the interactive test, search and count formatting, categories and service guides, and dynamic math prompts. Question bank JSON is loaded through a locale-specific dynamic import.
- Previous validation before Polish on 2026-10-24: 73/73 tests passed, TypeScript passed, lint passed, and production build passed with 1,010 static pages. Static route policy uses `ensureStatic = "navigation"` so unsupported locale paths return an actual 404 under Cache Components.
- Turkish translation model attribution: Helsinki-NLP `opus-mt-tc-big-en-tr` (OPUS-MT), licensed CC-BY-4.0; inference ran locally. [Model card](https://huggingface.co/Helsinki-NLP/opus-mt-tc-big-en-tr).
- Turkish translation model attribution: Helsinki-NLP `opus-mt-tc-big-en-tr` (OPUS-MT), licensed CC-BY-4.0; inference ran locally. [Model card](https://huggingface.co/Helsinki-NLP/opus-mt-tc-big-en-tr).

Filipino source copy was produced with the local Helsinki-NLP `opus-mt-en-tl` model (Apache-2.0); no translation API was used. [Model card](https://huggingface.co/Helsinki-NLP/opus-mt-en-tl). A manual editorial pass corrected option-context drift, riddles, UI terminology, and generated math explanations.

Filipino QA on 2026-10-24: **86/86 tests passed**, TypeScript and lint passed, and production build passed with **1,128 generated pages**. Production server returned 200 for `/fil/quiz` and `/fil/quiz/general-knowledge`; `/bn/quiz` and `/ar/quiz` returned 404. The rendered HTML has `lang="fil"`, canonical URLs, all 19 hreflang alternates, and the Filipino selector option. Sitemap returns 1,121 URLs and includes Filipino list/detail pages without incomplete or excluded locales. All 621 questions have translated questions, options, and explanations; answer positions and option order are unchanged. All 58 public quiz titles/descriptions and common UI are connected.

**Next start:** Bengali (`bn`). Source-backed progress is 19/26 published locales, 19/26 UI-connected locales, and 1,121 published sitemap URLs. Russian, Turkish, Polish, and Filipino each have 621/621 question records and 59/59 public pages localized. Each remaining target (`bn`, `uk`, `ms`, `sv`, `cs`, `ro`, `el`) has 0/621 translated question records, no UI connection, and 0 published pages. Do not publish or index an incomplete locale. Push verified commits only to `origin/develop`; do not deploy.
