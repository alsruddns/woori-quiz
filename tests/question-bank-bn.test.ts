import { describe, expect, it } from "vitest";
import copies from "../src/lib/question-bank/locales/bn/question-bank.json";
import { questionBank } from "../src/lib/question-bank";
import { loadQuestionBankForCategory } from "../src/lib/question-bank/select-questions";
import { isLocale, isPublishedLocale, localeExpansionTargets, publishedLocales } from "../src/lib/i18n";
import { getQuestionLocalizationGaps } from "../src/lib/localization-quality";

describe("Bengali question bank", () => {
  it("covers every source question and keeps valid translated content", () => {
    const sourceById = new Map(questionBank.map((question) => [question.id, question]));
    expect(questionBank).toHaveLength(621);
    expect(Object.keys(copies).sort()).toEqual([...sourceById.keys()].sort());
    expect(localeExpansionTargets).toContain("bn");
    expect(isLocale("bn")).toBe(true);
    expect(isPublishedLocale("bn")).toBe(true);
    expect(publishedLocales).toContain("bn");

    for (const [id, copy] of Object.entries(copies)) {
      const source = sourceById.get(id)!;
      expect(copy.question.trim(), `${id} question`).not.toBe("");
      expect(copy.explanation.trim(), `${id} explanation`).not.toBe("");
      expect(copy.options, `${id} option count`).toHaveLength(4);
      expect(new Set(copy.options).size, `${id} unique choices`).toBe(4);
      expect(copy.question, `${id} question translated`).not.toBe(source.question);
      for (const value of [copy.question, ...copy.options, copy.explanation]) {
        expect(value, `${id} has no replacement character`).not.toContain("\uFFFD");
        expect(value, `${id} has no batch artifact`).not.toMatch(/(?:QZX\d+XZQ|ZZQB\d+ZZ|COUNT_SLOT|QUERY_COUNT)/);
        expect(value, `${id} has no embedded newline`).not.toMatch(/[\r\n]/);
      }
      if (source.category === "language") {
        expect(copy.options, `${id} preserves English-learning choices`).toEqual(source.options);
      }
    }
  });

  it("loads Bengali copies without changing IDs, categories, answer positions, or option order", async () => {
    const localized = await loadQuestionBankForCategory("all", "bn");
    expect(localized).toHaveLength(questionBank.length);
    for (const source of questionBank) {
      const item = localized.find((question) => question.id === source.id)!;
      expect(item.category, source.id).toBe(source.category);
      expect(item.answer, source.id).toBe(source.answer);
      expect(item.options, source.id).toEqual(source.options);
      expect(item.localizations?.bn, source.id).toEqual(copies[source.id as keyof typeof copies]);
    }
  }, 30000);

  it("has no question, choice, or explanation fallbacks", async () => {
    expect(await getQuestionLocalizationGaps("bn")).toEqual([]);
  }, 30000);
});
