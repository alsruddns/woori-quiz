# Common service rules

## Product and runtime

- Quiz is a frontend-only woori.today family service with locale-first routes `/{locale}/quiz` and dev port `3005`.
- Use Next.js 16 App Router, TypeScript, Tailwind CSS, pnpm, Vitest, and ESLint. Deploy the standalone Next server behind Nginx using the supplied Docker configuration.
- Store quiz definitions in the typed registry (`src/lib/registry.ts`) as the single source of truth. Never duplicate answer keys in locale files.
- Use static typed/JSON question packs for factual topics. Generate arithmetic questions algorithmically and calculate the answer independently of options.
- Do not copy protected quiz or exam content. Cite authoritative sources in catalog entries when external facts need source verification.
- User scores remain in localStorage; do not collect personal data.
- Subjective personality content must not be presented as scientific or medical diagnosis.

## Locales, SEO, privacy

- Supported locales: ko, en, ja, zh, es, pt-br, de, fr, vi, id, th, zh-tw, it, nl, hi.
- Translate UI and reviewed question, choice, and explanation text. Keep historical facts and answer keys identical across locales.
- Every public quiz has a locale route and metadata. Do not create per-question URLs. Canonical, hreflang, internal links, and `/quiz-sitemap.xml` use locale-first routes generated from public registry entries and the locale list.
- Store best/recent result, recent quiz, selected difficulty, streak, and records locally only when needed. Provide privacy and usage links and contact `krdd125@gmail.com`.
- Ad inventory must be hidden unless `NEXT_PUBLIC_ADS_ENABLED=true`; the default is false.

## Branch and quality workflow

- `main` is production; `develop` is regular development. Start all work from `develop`.
- Finish and verify work, commit and push `develop`, merge into `main`, verify and push `main`, then return to `develop`.
- Never create release branches. Do not force push or discard user changes.
- Run `pnpm test`, `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, and `git diff --check` before release.

## Interactive tests

- Reaction, click speed, typing, memory, visual recall, patterns, and concentration activities run in the browser.
- Use `performance.now()` for elapsed measurements. Use `requestAnimationFrame` for live timing updates.
- Typing metrics are calculated from the locale-specific passage, including words per minute, accuracy, elapsed time, and character errors.
