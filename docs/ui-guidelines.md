# UI guidelines

- Use a calm, welcoming editorial style with clear typography, generous spacing, restrained color, and responsive cards.
- Shared shell includes a header, family-site links, language selector, category sidebar, search, progress, feedback, results, toast area when needed, and footer.
- Family links appear in this order: Portal, Calculator, Online tools, Household ledger, Documents, Quiz. Preserve selected locale and open other family services in a new tab.
- Persist sidebar scroll position across route changes with key `woori-quiz:sidebar-scroll`.
- Quiz flow shows question number, progress, prompt, choices, submit, feedback, and next. Results show score, accuracy, elapsed time, difficulty, retry, related quizzes, and home.
- Brain/reaction timing uses `performance.now()`; schedule visual timing updates with `requestAnimationFrame`.
- Typing results include WPM, accuracy, elapsed time, and errors, with locale-appropriate passages.
- On narrow screens, convert the category sidebar to a horizontally scrollable selector and retain readable touch targets.
- AdSlot defaults to hidden. Do not reserve blank space when `NEXT_PUBLIC_ADS_ENABLED` is false.
- Personality-style entertainment is explicitly for fun and not a diagnosis.
