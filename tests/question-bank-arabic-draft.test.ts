import { describe, expect, it } from "vitest";
import { questionBank } from "../src/lib/question-bank";
import copies from "../src/lib/question-bank/locales/ar/question-bank.json";
import { localeExpansionTargets, locales, publishedLocales } from "../src/lib/i18n";

describe("Arabic question bank expansion draft", () => {
  it("covers every source question while keeping the incomplete locale unpublished", () => {
    const sourceById = new Map(questionBank.map((question) => [question.id, question]));
    expect(Object.keys(copies)).toHaveLength(questionBank.length);
    expect(Object.keys(copies).sort()).toEqual([...sourceById.keys()].sort());
    expect(localeExpansionTargets).toContain("ar");
    expect(locales).not.toContain("ar");
    expect(publishedLocales).not.toContain("ar");

    for (const [id, copy] of Object.entries(copies)) {
      const source = sourceById.get(id)!;
      expect(copy.question.trim(), `${id} question`).not.toBe("");
      expect(copy.explanation.trim(), `${id} explanation`).not.toBe("");
      expect(copy.options, `${id} options`).toHaveLength(source.options.length);
      expect(new Set(copy.options).size, `${id} duplicate options`).toBe(copy.options.length);
      if (source.category === "language") expect(copy.options, `${id} tests English language material`).toEqual(source.options);
      expect(`${copy.question} ${copy.explanation}`, `${id} should contain Arabic copy`).toMatch(/[\u0600-\u06FF]/);
      expect(JSON.stringify(copy), `${id} contains a broken batch marker`).not.toMatch(/ZZAR\d{4}ZZ/);
    }
  });
});
