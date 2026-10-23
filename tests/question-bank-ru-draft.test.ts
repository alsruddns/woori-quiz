import { describe, expect, it } from "vitest";
import copies from "../src/lib/question-bank/locales/ru/question-bank.json";
import { questionBank } from "../src/lib/question-bank";
import { loadQuestionBankForCategory, selectQuestionsForCategory } from "../src/lib/question-bank/select-questions";
import { localeExpansionTargets, locales, publishedLocales } from "../src/lib/i18n";

describe("Russian question bank draft", () => {
  it("covers all source questions while the incomplete locale stays unpublished", () => {
    const sourceById = new Map(questionBank.map((question) => [question.id, question]));
    const preservedRussianTokens = new Set(["CO₂", "H₂O", "NaCl", "JavaScript", "SQL", "HTML", "CSS", "PNG", ".png", ".mp3", ".csv", ".exe"]);
    expect(Object.keys(copies)).toHaveLength(questionBank.length);
    expect(Object.keys(copies).sort()).toEqual([...sourceById.keys()].sort());
    expect(localeExpansionTargets).toContain("ru");
    expect(locales).not.toContain("ru");
    expect(publishedLocales).not.toContain("ru");

    const batchArtifacts: string[] = [];
    const untranslatedOptions: string[] = [];
    for (const [id, copy] of Object.entries(copies)) {
      const source = sourceById.get(id)!;
      expect(copy.question.trim(), `${id} question`).not.toBe("");
      expect(copy.explanation.trim(), `${id} explanation`).not.toBe("");
      expect(copy.options, `${id} option count`).toHaveLength(source.options.length);
      expect(new Set(copy.options).size, `${id} duplicate options`).toBe(copy.options.length);
      for (const value of [copy.question, ...copy.options, copy.explanation]) {
        expect(value, `${id} has no Unicode replacement characters`).not.toContain("\uFFFD");
        if (/ZZQB\d{4}ZZ|[\r\n]/.test(value)) batchArtifacts.push(`${id}: ${JSON.stringify(value)}`);
      }
      if (source.category === "language") expect(copy.options, `${id} preserves English quiz material`).toEqual(source.options);
      else copy.options.forEach((option, index) => {
        if (option === source.options[index] && !preservedRussianTokens.has(option) && !/^[-+]?\d/.test(option)) {
          untranslatedOptions.push(`${id}: ${option}`);
        }
      });
      expect(`${copy.question} ${copy.explanation}`, `${id} has Russian text`).toMatch(/[\u0400-\u04FF]/);
      expect(JSON.stringify(copy), `${id} has no unresolved batch marker`).not.toMatch(/ZZQB\d{4}ZZ/);
    }
    expect(batchArtifacts, "Russian copy has no batch artifacts or embedded line breaks").toEqual([]);
    expect(untranslatedOptions, "Russian answer choices are translated except for scientific and technical tokens").toEqual([]);
    expect(copies["general-007"].options).toEqual(["Атлантический океан", "Индийский", "Северный Ледовитый океан", "Тихий океан"]);
    expect(copies["general-010"].options).toContain("Ртуть");
  });

  it("loads Russian copy through the quiz question loader and preserves scoring after shuffling", async () => {
    const russianPool = await loadQuestionBankForCategory("all", "ru");
    expect(russianPool).toHaveLength(questionBank.length);
    const sourceById = new Map(questionBank.map((question) => [question.id, question]));

    for (const localized of russianPool) {
      const source = sourceById.get(localized.id)!;
      expect(localized.localizations?.ru).toEqual(copies[localized.id as keyof typeof copies]);
      expect(localized.answer).toBe(source.answer);
    }

    const selected = selectQuestionsForCategory(russianPool, { count: 120, seed: 20261024 });
    expect(selected).toHaveLength(120);
    for (const localized of selected) {
      const source = sourceById.get(localized.id)!;
      const translated = copies[localized.id as keyof typeof copies];
      const sourceIndexes = localized.options.map((option) => source.options.indexOf(option));
      expect(localized.answer).toBe(sourceIndexes.indexOf(source.answer));
      expect(localized.localizations?.ru?.options).toEqual(sourceIndexes.map((index) => translated.options[index]));
      expect(localized.localizations?.ru?.options[localized.answer]).toBe(translated.options[source.answer]);
    }
  });
});
