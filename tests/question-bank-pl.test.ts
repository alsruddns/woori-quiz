import { describe, expect, it } from "vitest";
import copies from "../src/lib/question-bank/locales/pl/question-bank.json";
import { questionBank } from "../src/lib/question-bank";
import { loadQuestionBankForCategory } from "../src/lib/question-bank/select-questions";
import { isLocale, isPublishedLocale, localeExpansionTargets, publishedLocales } from "../src/lib/i18n";
import { polishInvariantChoices } from "../src/lib/localization-quality";

describe("Polish question bank", () => {
  it("covers all 621 records with translated copy and four distinct choices", () => {
    const sourceById = new Map(questionBank.map((question) => [question.id, question]));
    expect(questionBank).toHaveLength(621);
    expect(Object.keys(copies).sort()).toEqual([...sourceById.keys()].sort());
    expect(localeExpansionTargets).toContain("pl");
    expect(isLocale("pl")).toBe(true);
    expect(isPublishedLocale("pl")).toBe(true);
    expect(publishedLocales).toContain("pl");

    for (const [id, copy] of Object.entries(copies)) {
      const source = sourceById.get(id)!;
      expect(copy.question.trim(), `${id} question`).not.toBe("");
      expect(copy.explanation.trim(), `${id} explanation`).not.toBe("");
      expect(copy.options, `${id} option count`).toHaveLength(4);
      expect(new Set(copy.options).size, `${id} unique options`).toBe(4);
      expect(copy.question, `${id} question translated`).not.toBe(source.question);
      for (const value of [copy.question, ...copy.options, copy.explanation]) {
        expect(value, `${id} has no replacement character`).not.toContain("\uFFFD");
        expect(value, `${id} has no unresolved question mark`).not.toMatch(/\?(?!\s*$)/);
        expect(value, `${id} has no generation artifact`).not.toMatch(/(?:QZX\d+XZQ|ZZQB\d+ZZ|COUNT_SLOT|QUERY_COUNT)/);
        expect(value, `${id} has no embedded newlines`).not.toMatch(/[\r\n]/);
      }
      if (source.category === "language") {
        expect(copy.options, `${id} preserves English-learning choices`).toEqual(source.options);
      } else {
        copy.options.forEach((option, index) => {
          if (option === source.options[index] && !/^[\s\p{N}\p{S}\p{P}]+$/u.test(option)) {
            expect(polishInvariantChoices.has(option), `${id} approved invariant: ${option}`).toBe(true);
          }
        });
      }
    }

    for (let index = 1; index <= 24; index += 1) {
      expect(copies[`math-x-percent-${index}` as keyof typeof copies].explanation).toMatch(/× .* ÷ 100 =/);
    }
    for (let index = 1; index <= 12; index += 1) {
      expect(copies[`math-x-sequence-square-${index}` as keyof typeof copies].explanation).toContain("5\u00b2 \u00d7");
    }
  });

  it("loads Polish copies without changing IDs, categories, answer positions, or question count", async () => {
    const localized = await loadQuestionBankForCategory("all", "pl");
    expect(localized).toHaveLength(questionBank.length);
    for (const source of questionBank) {
      const item = localized.find((question) => question.id === source.id)!;
      expect(item.category, source.id).toBe(source.category);
      expect(item.answer, source.id).toBe(source.answer);
      expect(item.localizations?.pl, source.id).toEqual(copies[source.id as keyof typeof copies]);
    }
  }, 30000);
});
