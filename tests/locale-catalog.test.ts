import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { expansionLocales, legacyLocales } from "../src/lib/locale-catalog";

describe("locale catalog loading boundary", () => {
  it("keeps all locale catalogs out of static imports in browser modules", () => {
    const browserModules = [
      "src/lib/i18n.ts",
      "src/lib/content-copy.ts",
      "src/lib/quiz-copy.ts",
      "src/components/InteractiveTest.tsx",
    ];
    const localeCodes=[...legacyLocales,...expansionLocales].join("|");
    const staticLocaleImport = new RegExp(`(?:from\\s*|import\\s*)[\"'][^\"']*\\/i18n\\/(?:${localeCodes})\\.json[\"']`);
    for (const file of browserModules) {
      expect(readFileSync(resolve(process.cwd(), file), "utf8"), file).not.toMatch(staticLocaleImport);
    }
  });

  it("provides one lazy loader per published locale", () => {
    const loaderSource = readFileSync(resolve(process.cwd(), "src/lib/locale-catalog.ts"), "utf8");
    for (const locale of legacyLocales) {
      const key=locale.includes("-")?`"${locale}"`:locale;
      expect(loaderSource).toContain(`${key}: () => import("./i18n/legacy/${locale}.json")`);
    }
    for (const locale of expansionLocales) {
      expect(loaderSource).toContain(`${locale}: () => import("./i18n/${locale}.json")`);
    }
  });

  it("does not retain the replaced inline locale dictionaries", () => {
    const i18nSource=readFileSync(resolve(process.cwd(),"src/lib/i18n.ts"),"utf8");
    const quizCopySource=readFileSync(resolve(process.cwd(),"src/lib/quiz-copy.ts"),"utf8");
    const contentCopySource=readFileSync(resolve(process.cwd(),"src/lib/content-copy.ts"),"utf8");
    const interactiveSource=readFileSync(resolve(process.cwd(),"src/components/InteractiveTest.tsx"),"utf8");
    expect(i18nSource).not.toMatch(/\b(?:ko|en|ja|zh):\s*\{\s*(?:title|familySites):/);
    expect(quizCopySource).not.toMatch(/Record<StaticLocale|localizedTerms|mathPromptCopy/);
    expect(contentCopySource).not.toMatch(/categoryDescriptions:\s*Record/);
    expect(interactiveSource).not.toMatch(/passages:\s*Record|memoryWords:\s*Record/);
  });
});
