import { describe, expect, it } from "vitest";
import catalog from "../src/lib/i18n/ar.json";
import { quizzes } from "../src/lib/registry";
import { localeExpansionTargets, locales, publishedLocales } from "../src/lib/i18n";

function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") return Object.values(value).flatMap(stringsIn);
  return [];
}

describe("Arabic UI catalog draft", () => {
  it("covers the full catalog while remaining outside routing and publication", () => {
    const publicQuizzes = quizzes.filter((quiz) => quiz.isPublic);
    expect(localeExpansionTargets).toContain("ar");
    expect(locales).not.toContain("ar");
    expect(publishedLocales).not.toContain("ar");
    expect(catalog.localeName).toMatch(/[\u0600-\u06FF]+/);
    expect(Object.keys(catalog.quizTitles)).toHaveLength(publicQuizzes.length);
    expect(Object.keys(catalog.quizDescriptions)).toHaveLength(publicQuizzes.length);
    expect(Object.keys(catalog.categories)).toHaveLength(14);
    expect(Object.keys(catalog.categoryLabels)).toHaveLength(14);
    expect(Object.keys(catalog.messages)).toHaveLength(16);
    expect(Object.keys(catalog.ui)).toHaveLength(51);

    for (const quiz of publicQuizzes) {
      expect((catalog.quizTitles as Record<string, string>)[quiz.slug], `${quiz.slug} title`).toBeTruthy();
      expect((catalog.quizDescriptions as Record<string, string>)[quiz.slug], `${quiz.slug} description`).toBeTruthy();
    }
    for (const [index, value] of stringsIn(catalog).entries()) {
      expect(value.trim(), `catalog string ${index}`).not.toBe("");
      expect(value, `catalog string ${index} has a broken marker`).not.toMatch(/ZZUI\d{4}ZZ/);
    }
    expect(stringsIn(catalog).filter((value) => /[\u0600-\u06FF]/.test(value)).length).toBeGreaterThan(200);
  });
});
