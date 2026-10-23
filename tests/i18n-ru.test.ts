import { describe, expect, it } from "vitest";
import catalog from "../src/lib/i18n/ru.json";
import { quizzes } from "../src/lib/registry";
import { isLocale, isPublishedLocale, localeExpansionTargets, locales, publishedLocales } from "../src/lib/i18n";

function stringsIn(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(stringsIn);
  if (value && typeof value === "object") return Object.values(value).flatMap(stringsIn);
  return [];
}

describe("Russian UI catalog", () => {
  it("covers the complete catalog and is published only after passing the page gates", () => {
    const publicQuizzes = quizzes.filter((quiz) => quiz.isPublic);
    expect(localeExpansionTargets).toContain("ru");
    expect(locales).toContain("ru");
    expect(isLocale("ru")).toBe(true);
    expect(isPublishedLocale("ru")).toBe(true);
    expect(publishedLocales).toContain("ru");
    expect(catalog.localeName).toMatch(/[\u0400-\u04FF]/);
    expect(Object.keys(catalog.quizTitles)).toHaveLength(publicQuizzes.length);
    expect(Object.keys(catalog.quizDescriptions)).toHaveLength(publicQuizzes.length);
    expect(Object.keys(catalog.categories)).toHaveLength(14);
    expect(Object.keys(catalog.categoryLabels)).toHaveLength(14);
    expect(Object.keys(catalog.messages)).toHaveLength(16);
    expect(Object.keys(catalog.ui)).toHaveLength(51);
    expect(Object.keys(catalog.serviceGuide)).toHaveLength(9);
    expect(Object.keys(catalog.interactiveTest.copy)).toHaveLength(15);
    expect(Object.keys(catalog.interactiveTest.extraCopy)).toHaveLength(3);
    expect(catalog.interactiveTest.passage.trim()).not.toBe("");
    expect(catalog.interactiveTest.memoryWords.trim()).not.toBe("");
    expect(catalog.titleTerms).toHaveLength(70);
    expect(Object.keys(catalog.slugTerms)).toHaveLength(70);
    for (const term of [...catalog.titleTerms, ...Object.values(catalog.slugTerms)]) {
      expect(term, "Russian title terms contain no mistranslated batch vocabulary").not.toMatch(/^(Отдел|Стол|Психический|Выкройка|Признание|Нажмите|Мелочи|Жесткий|Контрольный опрос|Дополнение)$/);
      expect(term, "Russian title terms contain no stray colon").not.toMatch(/:$/);
    }
    expect(catalog.ui.localeCount).toContain("21");
    expect(catalog.discovery.resultsFor).toContain("QUERY_SLOT");
    expect(catalog.discovery.resultsFor).toContain("QUERY_COUNT");
    expect(catalog.ui.quizCount).toContain("COUNT_SLOT");
    expect(catalog.ui.questionCount).toContain("COUNT_SLOT");
    expect(catalog.ui.quizSummary).toContain("TITLE_SLOT");
    expect(catalog.quizTitles["click-speed-test"]).toBe("Тест на скорость нажатий");
    expect(catalog.quizTitles["english-vocabulary"]).not.toMatch(/:$/);
    expect(catalog.quizTitles["brain-teaser"]).not.toContain(" - ");

    for (const quiz of publicQuizzes) {
      expect((catalog.quizTitles as Record<string, string>)[quiz.slug], `${quiz.slug} title`).toBeTruthy();
      expect((catalog.quizDescriptions as Record<string, string>)[quiz.slug], `${quiz.slug} description`).toBeTruthy();
      expect((catalog.quizDescriptions as Record<string, string>)[quiz.slug], `${quiz.slug} has no batch-template residue`)
        .not.toMatch(/средней и средней|от среднего до среднего|любознательных умов/);
    }
    const strings = stringsIn(catalog);
    expect(strings.filter((value) => /[\u0400-\u04FF]/.test(value)).length).toBeGreaterThan(250);
    for (const [index, value] of strings.entries()) {
      expect(value.trim(), `catalog string ${index}`).not.toBe("");
      expect(value, `catalog string ${index} has no Unicode replacement characters`).not.toContain("\uFFFD");
      expect(value, `catalog string ${index} has no generation artifacts`).not.toMatch(/ZZUI|98765|\n/);
    }
  });
});
