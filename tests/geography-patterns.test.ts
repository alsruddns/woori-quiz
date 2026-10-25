import { describe, expect, it } from "vitest";
import { localizedContinentName } from "../src/lib/question-bank/locales/geography-patterns";
import { loadQuestionBankForCategory } from "../src/lib/question-bank/select-questions";
import { selectQuestions } from "../src/lib/question-bank/core";

describe("localized geography region names", () => {
  it("uses a readable fallback when Intl returns the raw three-digit region code", () => {
    const incompleteIntl = { of: (code: string) => code } as Pick<Intl.DisplayNames, "of">;
    expect(localizedContinentName("South America", "zh", incompleteIntl)).toBe("南美洲");
    expect(localizedContinentName("Asia", "zh-tw", incompleteIntl)).toBe("亞洲");
    expect(localizedContinentName("South America", "en", incompleteIntl)).toBe("South America");
  });

  it("keeps the Baikal and Sahara answers aligned in Simplified and Traditional Chinese", async () => {
    for (const locale of ["zh", "zh-tw"] as const) {
      const bank = await loadQuestionBankForCategory("geography", locale);
      for (const id of ["geography-x-feature-1", "geography-x-feature-9"]) {
        const question = bank.find((item) => item.id === id)!;
        const copy = question.localizations?.[locale];
        expect(copy, `${locale}/${id}: localized copy exists`).toBeDefined();
        if (!copy) continue;
        expect(copy.options, `${locale}/${id}`).not.toEqual(expect.arrayContaining(["002", "005", "021", "142", "150"]));
        const expectedAnswer = id === "geography-x-feature-1" ? "非洲" : locale === "zh" ? "亚洲" : "亞洲";
        expect(copy.options[question.answer], `${locale}/${id}: correct continent`).toBe(expectedAnswer);
        expect(copy.explanation, `${locale}/${id}: explanation`).toContain(copy.options[question.answer]);
      }
    }
  });

  it("preserves translated option-to-answer mapping after shuffle", async () => {
    const [question] = await loadQuestionBankForCategory("geography", "zh").then((bank) => bank.filter((item) => item.id === "geography-x-feature-9"));
    const [shuffled] = selectQuestions([question], { category: "geography", count: 1, seed: 712 });
    expect(shuffled.options[shuffled.answer]).toBe("Asia");
    expect(shuffled.localizations?.zh?.options[shuffled.answer]).toBe("亚洲");
    expect(shuffled.localizations?.zh?.explanation).toContain("亚洲");
  });
});
