import { describe, expect, it } from "vitest";
import { locales } from "../src/lib/i18n";
import { loadQuestionBankForCategory } from "../src/lib/question-bank/select-questions";

describe("generated question localizations", () => {
  it("loads patterned copies by locale without changing answers", async () => {
    for (const category of ["math", "brain", "geography", "language"]) {
      const originals = await loadQuestionBankForCategory(category);
      const prefix = category === "math" ? "math-x-" : category === "brain" ? "brain-x-pattern-" : category === "geography" ? "geography-x-" : "language-x-vocab-";
      const generated = originals.filter((question) => question.id.startsWith(prefix));
      for (const locale of locales.filter((item) => item !== "en")) {
        const localized = await loadQuestionBankForCategory(category, locale);
        expect(localized).toHaveLength(originals.length);
        for (const original of generated) {
          const translated = localized.find((question) => question.id === original.id)!;
          const copy = translated.localizations?.[locale];
          expect(copy?.question.trim(), `${locale}/${original.id}`).toBeTruthy();
          expect(copy?.explanation.trim(), `${locale}/${original.id}`).toBeTruthy();
          expect(copy?.question).not.toBe(original.question);
          if (category !== "geography" || original.id.includes("capital")) expect(copy?.options).toEqual(original.options);
          else expect(copy?.options).toHaveLength(original.options.length);
          expect(translated.answer).toBe(original.answer);
          expect(translated.category).toBe(original.category);
          expect(translated.difficulty).toBe(original.difficulty);
        }
      }
    }
  }, 30000);
  it("translates all technology choices without changing their positions", async () => {
    const originals = await loadQuestionBankForCategory("technology");
    const generated = originals.filter((question) => question.id.startsWith("it-x-concept-"));
    expect(generated).toHaveLength(40);
    for (const locale of locales.filter((item) => item !== "en")) {
      const localized = await loadQuestionBankForCategory("technology", locale);
      for (const original of generated) {
        const translated = localized.find((question) => question.id === original.id)!;
        const copy = translated.localizations?.[locale];
        expect(copy?.question).not.toBe(original.question);
        expect(copy?.options).toHaveLength(original.options.length);
        expect(copy?.options[translated.answer]).not.toBe(original.options[original.answer]);
        expect(new Set(copy?.options).size).toBe(original.options.length);
        expect(copy?.explanation.trim()).toBeTruthy();
        expect(translated.answer).toBe(original.answer);
      }
    }
  }, 30000);
  it("localizes historical events while preserving dates and answer indexes", async () => {
    const originals = (await loadQuestionBankForCategory("history")).filter((question) => question.id.startsWith("history-x-"));
    expect(originals).toHaveLength(40);
    for (const locale of locales.filter((item) => item !== "en")) {
      const translated = await loadQuestionBankForCategory("history", locale);
      for (const original of originals) {
        const question = translated.find((item) => item.id === original.id)!;
        const copy = question.localizations?.[locale];
        expect(copy?.question.trim(), `${locale}/${original.id}`).toBeTruthy();
        expect(copy?.question).not.toBe(original.question);
        expect(copy?.options).toHaveLength(original.options.length);
        expect(copy?.explanation.trim()).toBeTruthy();
        expect(question.answer).toBe(original.answer);
        original.options.forEach((option, index) => {
          if (/\d/.test(option)) expect(copy?.options[index]).toBe(option);
        });
      }
    }
  }, 30000);
  it("translates science facts and choices with intact chemical symbols", async () => {
    const originals = (await loadQuestionBankForCategory("science")).filter((question) => question.id.startsWith("science-x-"));
    expect(originals).toHaveLength(40);
    for (const locale of locales.filter((item) => item !== "en")) {
      const translated = await loadQuestionBankForCategory("science", locale);
      for (const original of originals) {
        const question = translated.find((item) => item.id === original.id)!;
        const copy = question.localizations?.[locale];
        expect(copy?.question).toContain("___");
        expect(copy?.explanation).not.toContain("___");
        expect(copy?.options).toHaveLength(original.options.length);
        expect(new Set(copy?.options).size).toBe(original.options.length);
        expect(question.answer).toBe(original.answer);
        original.options.forEach((option, index) => {
          if (/^(O|Au|Na|Fe|C|7)$/.test(option)) expect(copy?.options[index]).toBe(option);
        });
      }
    }
  }, 30000);
});
