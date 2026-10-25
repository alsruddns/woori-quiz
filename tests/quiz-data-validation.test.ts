import { describe, expect, it } from "vitest";
import { locales } from "../src/lib/i18n";
import { validateQuestionBank } from "../src/lib/question-bank/core";
import { loadQuestionBankForCategory, selectQuestionsForQuiz } from "../src/lib/question-bank/select-questions";
import { selectQuestions } from "../src/lib/question-bank/core";

const suspiciousText = (value: string) =>
  value.includes("\uFFFD") || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\uFFFE\uFFFF]/u.test(value) ||
  /&(?:#\d+|#x[\da-f]+|[a-z][\da-z]+);/iu.test(value) || /[\u200B\u200E\u200F\uFEFF]/u.test(value);

describe("complete quiz question bank validation", () => {
  it("validates source and translated questions for every published locale", async () => {
    const source = await loadQuestionBankForCategory("all");
    expect(source).toHaveLength(621);
    expect(validateQuestionBank(source)).toEqual([]);

    const categoryCounts = Object.fromEntries([...new Set(source.map((question) => question.category))]
      .sort().map((category) => [category, source.filter((question) => question.category === category).length]));
    const exactPrompts = new Map<string, string[]>();
    for (const question of source) {
      const key = question.question.normalize("NFC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("en");
      exactPrompts.set(key, [...(exactPrompts.get(key) ?? []), question.id]);
      for (const field of [question.question, ...question.options, question.explanation]) {
        expect(suspiciousText(field), question.id).toBe(false);
      }
    }
    const duplicatePrompts = [...exactPrompts].filter(([, ids]) => ids.length > 1);
    expect(duplicatePrompts, "duplicate source question text").toEqual([]);

    let localizedRecords = source.length;
    const malformedFields: string[] = [];
    for (const locale of locales.filter((value) => value !== "en")) {
      const translated = await loadQuestionBankForCategory("all", locale);
      expect(translated, `${locale}: question count`).toHaveLength(source.length);
      expect(new Set(translated.map((question) => question.id)).size, `${locale}: unique ids`).toBe(source.length);
      for (const original of source) {
        const question = translated.find((item) => item.id === original.id)!;
        const copy = question.localizations?.[locale];
        expect(copy, `${locale}/${original.id}: localized copy`).toBeDefined();
        expect(question.category, `${locale}/${original.id}: category`).toBe(original.category);
        expect(question.difficulty, `${locale}/${original.id}: difficulty`).toBe(original.difficulty);
        expect(question.answer, `${locale}/${original.id}: answer index`).toBe(original.answer);
        expect(question.options.length, `${locale}/${original.id}: options`).toBe(4);
        expect(new Set(question.options.map((option) => option.normalize("NFC").trim())).size, `${locale}/${original.id}: distinct options`).toBe(4);
        expect(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length, `${locale}/${original.id}: answer in range`).toBe(true);
        if (!copy) continue;
        for (const field of [copy.question, ...copy.options, copy.explanation]) {
          if (!field.trim() || suspiciousText(field)) malformedFields.push(`${locale}/${original.id}: ${JSON.stringify(field)}`);
        }
        if (original.id.startsWith("geography-x-feature-")) {
          for (const option of copy.options) expect(option, `${locale}/${original.id}`).not.toMatch(/^(?:002|005|021|142|150)$/u);
        }
        localizedRecords++;
      }
    }
    console.info("Question bank audit", JSON.stringify({ sourceRecords: source.length, localizedRecords, locales: locales.length, categories: categoryCounts, duplicatePromptGroups: duplicatePrompts.length, malformedFieldCount: malformedFields.length, malformedFieldSamples: malformedFields.slice(0, 20) }));
    expect(malformedFields).toEqual([]);
  }, 120000);

  it("preserves correct answers when options are shuffled and selected at any requested size", async () => {
    const source = await loadQuestionBankForCategory("all", "zh");
    const categoryNames = [...new Set(source.map((question) => question.category))];
    for (const original of source) {
      const [shuffled] = selectQuestions([original], { category: original.category, count: 1, seed: 183 });
      expect(shuffled.options[shuffled.answer], original.id).toBe(original.options[original.answer]);
      expect(shuffled.localizations?.zh?.options[shuffled.answer], original.id).toBe(original.localizations?.zh?.options[original.answer]);
    }
    for (const category of categoryNames) {
      const pool = source.filter((question) => question.category === category);
      for (const count of [10, 20, 30, 40, 50]) {
        const deck = selectQuestionsForQuiz(pool, { category, count, seed: 91 });
        expect(deck.length, `${category}/${count}: bounded to available questions`).toBe(Math.min(count, pool.length));
        expect(new Set(deck.map((question) => question.id)).size, `${category}/${count}: no duplicate questions`).toBe(deck.length);
        expect(deck.every((question) => question.answer >= 0 && question.answer < question.options.length), `${category}/${count}: answers remain valid`).toBe(true);
      }
      for (const difficulty of ["easy", "medium", "hard", "expert"] as const) {
        for (const count of [10, 20, 30, 40, 50]) {
          const eligible = pool.filter((question) => question.difficulty === difficulty);
          const deck = selectQuestionsForQuiz(pool, { category, difficulty, count, seed: 37 });
          expect(deck.length, `${category}/${difficulty}/${count}`).toBe(Math.min(count, eligible.length));
          expect(new Set(deck.map((question) => question.id)).size, `${category}/${difficulty}/${count}: no duplicates`).toBe(deck.length);
        }
      }
    }
    expect(selectQuestionsForQuiz([], { category: "geography", count: 50 })).toEqual([]);
    console.info("Question selection audit", JSON.stringify({ categories: categoryNames.length, counts: [10, 20, 30, 40, 50], difficultyLevels: 4, testedQuestionTotal: source.length }));
  }, 60000);
});
