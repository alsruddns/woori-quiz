import { describe, expect, it } from "vitest";
import copies from "../src/lib/question-bank/locales/tr/question-bank.json";
import { questionBank } from "../src/lib/question-bank";
import { loadQuestionBankForCategory } from "../src/lib/question-bank/select-questions";
import { isLocale, isPublishedLocale, localeExpansionTargets, publishedLocales } from "../src/lib/i18n";

describe("Turkish question bank draft", () => {
  it("covers all 621 source IDs without exposing Turkish as a locale", () => {
    const sourceById = new Map(questionBank.map((question) => [question.id, question]));
    expect(questionBank).toHaveLength(621);
    expect(Object.keys(copies).sort()).toEqual([...sourceById.keys()].sort());
    expect(localeExpansionTargets).toContain("tr");
    expect(isLocale("tr")).toBe(false);
    expect(isPublishedLocale("tr")).toBe(false);
    expect(publishedLocales).not.toContain("tr");

    const englishFunctionWords = /\b(?:the|is|are|was|were|of|and|with|from|which|what|who|where|when|why|how|this|that|these|those|will|does)\b/;
    for (const [id, copy] of Object.entries(copies)) {
      const source = sourceById.get(id)!;
      expect(copy.question.trim(), `${id} question`).not.toBe("");
      expect(copy.explanation.trim(), `${id} explanation`).not.toBe("");
      expect(copy.options, `${id} option count`).toHaveLength(4);
      expect(new Set(copy.options).size, `${id} unique options`).toBe(4);
      expect(copy.question, `${id} question localized`).not.toBe(source.question);
      if (!/^[\s\p{N}\p{S}\p{P}]+$/u.test(source.explanation)) {
        expect(copy.explanation, `${id} explanation localized`).not.toBe(source.explanation);
      }
      const localizedText = [copy.question, ...copy.options, copy.explanation];
      for (const value of localizedText) {
        expect(value, `${id} has no replacement characters`).not.toContain("\uFFFD");
        expect(value, `${id} has no unresolved question marks`).not.toMatch(/\?(?!\s*$)/);
        expect(value, `${id} has no batch marker`).not.toMatch(/QZX\d{6}XZQ/);
        expect(value, `${id} has no embedded newlines`).not.toMatch(/[\r\n]/);
      }
      if (source.category === "language") {
        expect(copy.options, `${id} keeps English learning choices`).toEqual(source.options);
        expect(`${copy.question} ${copy.explanation}`, `${id} has no English function-word fallback`)
          .not.toMatch(englishFunctionWords);
      }
    }
  });

  it("loads all Turkish copies while preserving question IDs, categories, and answer positions", async () => {
    const localized = await loadQuestionBankForCategory("all", "tr");
    expect(localized).toHaveLength(questionBank.length);
    for (const source of questionBank) {
      const item = localized.find((question) => question.id === source.id)!;
      expect(item.category, source.id).toBe(source.category);
      expect(item.answer, source.id).toBe(source.answer);
      expect(item.localizations?.tr, source.id).toEqual(copies[source.id]);
    }
  }, 30000);
});
