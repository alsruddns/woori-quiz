import { describe, expect, it } from "vitest";
import copies from "../src/lib/question-bank/locales/ru/question-bank.json";
import { questionBank } from "../src/lib/question-bank";
import { localeExpansionTargets, locales, publishedLocales } from "../src/lib/i18n";

describe("Russian question bank draft", () => {
  it("covers all source questions while the incomplete locale stays unpublished", () => {
    const sourceById = new Map(questionBank.map((question) => [question.id, question]));
    expect(Object.keys(copies)).toHaveLength(questionBank.length);
    expect(Object.keys(copies).sort()).toEqual([...sourceById.keys()].sort());
    expect(localeExpansionTargets).toContain("ru");
    expect(locales).not.toContain("ru");
    expect(publishedLocales).not.toContain("ru");

    for (const [id, copy] of Object.entries(copies)) {
      const source = sourceById.get(id)!;
      expect(copy.question.trim(), `${id} question`).not.toBe("");
      expect(copy.explanation.trim(), `${id} explanation`).not.toBe("");
      expect(copy.options, `${id} option count`).toHaveLength(source.options.length);
      expect(new Set(copy.options).size, `${id} duplicate options`).toBe(copy.options.length);
      if (source.category === "language") expect(copy.options, `${id} preserves English quiz material`).toEqual(source.options);
      expect(`${copy.question} ${copy.explanation}`, `${id} has Russian text`).toMatch(/[\u0400-\u04FF]/);
      expect(JSON.stringify(copy), `${id} has no unresolved batch marker`).not.toMatch(/ZZQB\d{4}ZZ/);
    }
    expect(copies["general-007"].options).toEqual(["Атлантический океан", "Индийский", "Северный Ледовитый океан", "Тихий океан"]);
    expect(copies["general-010"].options).toContain("Ртуть");
  });
});
