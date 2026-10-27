# Quiz content risk review — 2026-10

## Scope and status

- Source questions: 621.
- Automated structural/localization validation: 621 source questions and 16,146 locale records passed `pnpm quiz:validate`; this does not establish factual correctness.
- Risk triage: 13 high, 478 medium, and 130 low. High risk covers the continent-model items; medium covers non-arithmetic factual, language, history, science, technology, geography, and reasoning content; low covers the deterministic arithmetic category.
- Source-based fact checks completed: 13/621, all in the high-risk continent/geography group. The other 608 remain explicitly unverified in the accompanying CSV.
- Dynamic leader, population, GDP, and dated-record prompts were not found by the inventory scan.
- Confirmed false answer keys: 0. Confirmed ambiguity/localization issue: 1, corrected below.
- Native-speaker review was not performed.

## Finding and correction

`geography-027` asked for the smallest continent without naming a continent model. National Geographic's seven-continent model names Australia as the smallest by land area, while continent groupings vary across educational conventions. Several locale copies also translated “by area” awkwardly. The prompt now names the seven-continent model; its explanation states the land-area basis and notes that groupings vary. The question and explanation were updated in all 26 locales. The choices and answer index are unchanged.

Sources checked:

- [National Geographic: Continent](https://education.nationalgeographic.org/resource/Continent/) — seven-continent model and continent size ordering.
- [National Geographic Society: Map Policy](https://www.nationalgeographic.org/national-geographic-map-policy) — Australia as a continent and Oceania as a region in this convention.

## High-risk source checks

The CSV identifies each source-checked question by ID and lists the supporting reference. Checks covered the Asia/Australia continent model and the continent locations of the Sahara, Andes, Alps, Great Barrier Reef, Amazon, Danube, Nile, Gobi, Lake Baikal, and Rocky Mountains.

References include [National Geographic Africa physical geography](https://education.nationalgeographic.org/resource/africa-physical-geography/), [South America physical geography](https://education.nationalgeographic.org/resource/south-america-physical-geography/), [Europe physical geography](https://education.nationalgeographic.org/resource/europe-physical-geography/), [Asia physical geography](https://education.nationalgeographic.org/resource/asia/), [North America physical geography](https://education.nationalgeographic.org/resource/north-america-physical-geography/), [National Geographic's Danube overview](https://www.nationalgeographic.com/travel/article/a-practical-guide-to-the-danube-river), [Nile River](https://education.nationalgeographic.org/resource/nile-river/), and the [Australian Government's Great Barrier Reef page](https://www.dcceew.gov.au/parks-heritage/heritage/places/national/great-barrier-reef).

## Per-question ledger

See [`quiz-content-risk-audit-2026-10.csv`](quiz-content-risk-audit-2026-10.csv) for all 621 IDs, risk bands, answers, source-check status, issue/change fields, locale state, and automated-validation state. “Not source-verified” means no question-specific factual source check was recorded for that row.
