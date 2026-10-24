import { describe, expect, it } from "vitest";
import copies from "../src/lib/question-bank/locales/ro/question-bank.json";
import { questionBank } from "../src/lib/question-bank";
import { loadQuestionBankForCategory } from "../src/lib/question-bank/select-questions";
import { isLocale, isPublishedLocale, localeExpansionTargets } from "../src/lib/i18n";
import { getQuestionLocalizationGaps } from "../src/lib/localization-quality";

describe("Romanian question bank", () => {
  it("covers every source question with Romanian copy and four distinct choices", () => {
    const sourceById = new Map(questionBank.map((question) => [question.id, question]));
    expect(questionBank).toHaveLength(621);
    expect(Object.keys(copies).sort()).toEqual([...sourceById.keys()].sort());
    expect(localeExpansionTargets).toContain("ro");
    expect(isLocale("ro")).toBe(true);
    expect(isPublishedLocale("ro")).toBe(true);
    for (const [id, copy] of Object.entries(copies)) {
      const source = sourceById.get(id)!;
      expect(copy.question.trim(), `${id} question`).not.toBe("");
      expect(copy.explanation.trim(), `${id} explanation`).not.toBe("");
      expect(copy.options, `${id} option count`).toHaveLength(4);
      expect(new Set(copy.options).size, `${id} distinct choices`).toBe(4);
      expect(copy.question, `${id} translated question`).not.toBe(source.question);
      for (const value of [copy.question, ...copy.options, copy.explanation]) {
        expect(value, `${id} no replacement character`).not.toContain("\uFFFD");
        expect(value, `${id} no broken Romanian encoding`).not.toMatch(/\w\?\w/);
        expect(value, `${id} no batch artifact`).not.toMatch(/(?:QZX\d+XZQ|ZZQB\d+ZZ|COUNT_SLOT|QUERY_COUNT)/);
        expect(value, `${id} no newlines`).not.toMatch(/[\r\n]/);
      }
      if (source.category === "language") expect(copy.options, `${id} English learning choices`).toEqual(source.options);
    }
  });

  it("loads localized copies while preserving IDs, answer positions and option order", async () => {
    const localized = await loadQuestionBankForCategory("all", "ro");
    expect(localized).toHaveLength(questionBank.length);
    for (const source of questionBank) {
      const item = localized.find((question) => question.id === source.id)!;
      expect(item.category, source.id).toBe(source.category);
      expect(item.answer, source.id).toBe(source.answer);
      expect(item.options, source.id).toEqual(source.options);
      expect(item.localizations?.ro, source.id).toEqual(copies[source.id as keyof typeof copies]);
    }
  }, 30000);

  it("has no question, choice, or explanation fallbacks", async () => {
    const gaps = await getQuestionLocalizationGaps("ro");
    expect(gaps).toEqual([]);
  }, 30000);
});
