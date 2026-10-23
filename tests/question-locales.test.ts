import { describe, expect, it } from "vitest";
import { publishedLocales } from "../src/lib/i18n";
import { loadQuestionBankForCategory } from "../src/lib/question-bank/select-questions";
import { getQuestionLocalizationGaps } from "../src/lib/localization-quality";

describe("generated question localizations", () => {
  it("provides a complete Japanese copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "ja");
    expect(originals).toHaveLength(621);
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("ja");
    expect(gaps, "Japanese translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.ja;
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("provides a complete Simplified Chinese copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "zh");
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("zh");
    expect(gaps, "Simplified Chinese translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.zh;
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("provides a complete Spanish copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "es");
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("es");
    expect(gaps, "Spanish translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.es;
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("provides a complete Brazilian Portuguese copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "pt-br");
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("pt-br");
    expect(gaps, "Brazilian Portuguese translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.["pt-br"];
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("provides a complete German copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "de");
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("de");
    expect(gaps, "German translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.de;
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("provides a complete French copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "fr");
    expect(originals).toHaveLength(621);
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("fr");
    expect(gaps, "French translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.fr;
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("provides a complete Vietnamese copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "vi");
    expect(originals).toHaveLength(621);
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("vi");
    expect(gaps, "Vietnamese translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.vi;
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("provides a complete Indonesian copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "id");
    expect(originals).toHaveLength(621);
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("id");
    expect(gaps, "Indonesian translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.id;
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("provides a complete Thai copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "th");
    expect(originals).toHaveLength(621);
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("th");
    expect(gaps, "Thai translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.th;
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("provides a complete Traditional Chinese copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "zh-tw");
    expect(originals).toHaveLength(621);
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("zh-tw");
    expect(gaps, "Traditional Chinese translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.["zh-tw"];
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("provides a complete Italian copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "it");
    expect(originals).toHaveLength(621);
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("it");
    expect(gaps, "Italian translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.it;
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("provides a complete Dutch copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "nl");
    expect(originals).toHaveLength(621);
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("nl");
    expect(gaps, "Dutch translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.nl;
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("provides a complete Hindi copy for the shared question bank", async () => {
    const originals = await loadQuestionBankForCategory("all");
    const translated = await loadQuestionBankForCategory("all", "hi");
    expect(originals).toHaveLength(621);
    expect(translated).toHaveLength(originals.length);
    const gaps = await getQuestionLocalizationGaps("hi");
    expect(gaps, "Hindi translation gaps").toEqual([]);
    for (const original of originals) {
      const localized = translated.find((question) => question.id === original.id)!;
      const copy = localized.localizations?.hi;
      expect(copy?.question.trim(), original.id).toBeTruthy();
      expect(copy?.options).toHaveLength(original.options.length);
      expect(new Set(copy?.options).size, original.id).toBe(original.options.length);
      expect(copy?.explanation.trim(), original.id).toBeTruthy();
      expect(localized.answer).toBe(original.answer);
    }
  }, 30000);

  it("loads patterned copies by locale without changing answers", async () => {
    for (const category of ["math", "brain", "geography", "language"]) {
      const originals = await loadQuestionBankForCategory(category);
      const prefix = category === "math" ? "math-x-" : category === "brain" ? "brain-x-pattern-" : category === "geography" ? "geography-x-" : "language-x-vocab-";
      const generated = originals.filter((question) => question.id.startsWith(prefix));
      for (const locale of publishedLocales.filter((item) => item !== "en" && item !== "ru" && item !== "tr" && item !== "pl")) {
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
    for (const locale of publishedLocales.filter((item) => item !== "en" && item !== "ru" && item !== "tr" && item !== "pl")) {
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
    for (const locale of publishedLocales.filter((item) => item !== "en" && item !== "ru" && item !== "tr" && item !== "pl")) {
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
    for (const locale of publishedLocales.filter((item) => item !== "en" && item !== "ru" && item !== "tr" && item !== "pl")) {
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
