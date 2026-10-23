# Woori Today — Docs / Quiz language expansion

This file records the rollout from repository data and the localization audit. A locale is complete only when common UI copy and the full quiz catalog are translated, routes render and work, and SEO metadata and production checks pass. Incomplete detail pages remain out of the sitemap and hreflang alternates.

## Scope

- Expansion target: 26 locales (15 currently active plus 11 not yet activated).
- Quiz catalog: 96 registered entries; 58 are public quiz pages and 38 static entries remain closed for content review.
- Shared question bank: 621 question records. Question options and explanations are included in the translation gate.
- Common UI: 15 locale message/catalog sets are connected to routes and the language selector. The 11 expansion locales have no UI data and are not routable or selectable.

## Locale status

Counts are current source-code measurements. “UI connected” means the locale has the common UI message catalogs, quiz catalog title words, and active selector/routing entry. New target locales are intentionally not exposed until complete.

| Locale | Question copy | Fallback questions / choices / explanations | UI connected | Published routes (list + detail) | SEO |
|---|---:|---:|---:|---:|---|
| ko | 621/621 | 0 / 0 / 0 | Yes | 1 + 58 | Pass |
| en | 621/621 (source) | 0 / 0 / 0 | Yes | 1 + 58 | Pass |
| ja | 390/621 | 231 / 766 / 279 | Yes | 0 + 0 | Not published |
| zh | 390/621 | 231 / 766 / 279 | Yes | 0 + 0 | Not published |
| es | 390/621 | 231 / 794 / 279 | Yes | 0 + 0 | Not published |
| pt-br | 390/621 | 231 / 794 / 279 | Yes | 0 + 0 | Not published |
| de | 390/621 | 231 / 809 / 279 | Yes | 0 + 0 | Not published |
| fr | 390/621 | 231 / 807 / 279 | Yes | 0 + 0 | Not published |
| vi | 390/621 | 231 / 787 / 279 | Yes | 0 + 0 | Not published |
| id | 390/621 | 231 / 810 / 279 | Yes | 0 + 0 | Not published |
| th | 390/621 | 231 / 766 / 279 | Yes | 0 + 0 | Not published |
| zh-tw | 390/621 | 231 / 766 / 279 | Yes | 0 + 0 | Not published |
| it | 390/621 | 231 / 810 / 279 | Yes | 0 + 0 | Not published |
| nl | 390/621 | 231 / 795 / 279 | Yes | 0 + 0 | Not published |
| hi | 390/621 | 231 / 766 / 279 | Yes | 0 + 0 | Not published |
| ar | 0/621 | — | No | 0 | Not activated |
| bn | 0/621 | — | No | 0 | Not activated |
| fil | 0/621 | — | No | 0 | Not activated |
| ms | 0/621 | — | No | 0 | Not activated |
| pl | 0/621 | — | No | 0 | Not activated |
| ru | 0/621 | — | No | 0 | Not activated |
| sv | 0/621 | — | No | 0 | Not activated |
| tr | 0/621 | — | No | 0 | Not activated |
| uk | 0/621 | — | No | 0 | Not activated |
| ur | 0/621 | — | No | 0 | Not activated |
| fa | 0/621 | — | No | 0 | Not activated |

Current sitemap: 118 URLs (2 complete list pages and 116 detail pages across Korean and English). Common UI data exists for 15 locales, but the selector and generated routes expose only the two locales whose complete catalogs pass the gate. The additional 11 targets are kept outside runtime locale configuration.

## Verification and next start point

- TypeScript: passed (`pnpm exec tsc --noEmit`).
- Lint: passed (`pnpm lint`).
- Full test suite: 46/46 passed (`pnpm test`).
- Production build: passed (`pnpm build`, Next.js 16.4.1; 127 static pages generated).
- Mobile UI: responsive CSS regression check passed.
- Translation gap test: verifies complete source-bank coverage is required before any detail route can be indexed.

**Next start:** finish Japanese. Start with `getQuestionLocalizationGaps("ja")` and the audit baseline of 231 missing question strings, 766 missing choices, and 279 missing explanations. After Japanese reaches zero gaps and all 58 detail pages pass routing, rendering, quiz scoring, selector, metadata, sitemap, mobile, test, lint, TypeScript, and production build checks, immediately continue with Simplified Chinese (`zh`).
