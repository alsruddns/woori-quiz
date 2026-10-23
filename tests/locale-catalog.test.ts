import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { expansionLocales } from "../src/lib/locale-catalog";

describe("locale catalog loading boundary", () => {
  it("keeps expansion catalogs out of static imports in browser modules", () => {
    const browserModules = [
      "src/lib/i18n.ts",
      "src/lib/content-copy.ts",
      "src/lib/quiz-copy.ts",
      "src/components/InteractiveTest.tsx",
    ];
    const staticLocaleImport = /(?:from\s*|import\s*)["'][^"']*\/i18n\/(?:ru|tr|pl|fil|bn|uk|ms|sv|cs|ro|el)\.json["']/;
    for (const file of browserModules) {
      expect(readFileSync(resolve(process.cwd(), file), "utf8"), file).not.toMatch(staticLocaleImport);
    }
  });

  it("provides one lazy loader per published expansion locale", () => {
    const loaderSource = readFileSync(resolve(process.cwd(), "src/lib/locale-catalog.ts"), "utf8");
    for (const locale of expansionLocales) {
      expect(loaderSource).toContain(`${locale}: () => import("./i18n/${locale}.json")`);
    }
  });
});
