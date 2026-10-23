import { describe, expect, it } from "vitest";
import { categories, quizzes } from "../src/lib/registry";
import { isLocale, localeExpansionTargets, locales, localeNames, publishedLocales, uiMessages } from "../src/lib/i18n";
import { hasQuizTermTranslations, missingQuizTitleWords, quizCategoryName, quizTitle, quizTitleTranslationWordCount, quizTitleWordCount } from "../src/lib/quiz-copy";

describe("quiz UI translations", () => {
  it("tracks 26 expansion targets without activating incomplete languages", () => {
    expect(localeExpansionTargets).toHaveLength(26);
    expect(new Set(localeExpansionTargets).size).toBe(26);
    expect(localeExpansionTargets.slice(0, locales.length)).toEqual(locales);
    expect(localeExpansionTargets.slice(locales.length)).toEqual(["ar", "bn", "fil", "ms", "pl", "ru", "sv", "tr", "uk", "ur", "fa"]);
    expect(localeExpansionTargets.slice(locales.length).every((locale) => !isLocale(locale))).toBe(true);
    expect(publishedLocales).toEqual(["ko", "en"]);
  });

  it("provides navigation, category, difficulty, and footer copy for all 15 locales", () => {
    expect(Object.keys(uiMessages).sort()).toEqual([...locales].sort());
    for (const locale of locales) {
      const copy = uiMessages[locale];
      expect(localeNames[locale]).toBeTruthy();
      expect([copy.familySites, copy.portal, copy.calculator, copy.tools, copy.moneyBook, copy.docs, copy.quiz, copy.language]).not.toContain("");
      expect(Object.values(copy.category).every(Boolean)).toBe(true);
      expect(categories.every((category) => quizCategoryName(locale, category).trim().length > 0)).toBe(true);
      expect(Object.keys(copy.difficultyLabels).sort()).toEqual(["easy", "expert", "hard", "medium"]);
      expect([copy.footerTagline, copy.privacy, copy.guidelines, copy.contact].every(Boolean)).toBe(true);
      expect(quizTitleTranslationWordCount(locale), `Wrong quiz title word count for ${locale}`).toBe(quizTitleWordCount);
      expect(missingQuizTitleWords(quizzes.map((quiz) => quiz.slug))).toEqual([]);
      expect(hasQuizTermTranslations(locale, quizzes.map((quiz) => quiz.slug)), `Incomplete quiz word translations for ${locale}`).toBe(true);
      expect(quizzes.every((quiz) => quizTitle(locale, quiz).trim().length > 0)).toBe(true);
    }
  });

  it("uses the requested Korean navigation and category labels instead of English fallbacks", () => {
    const copy = uiMessages.ko;
    expect([copy.portal, copy.calculator, copy.tools, copy.moneyBook, copy.docs, copy.quiz]).toEqual([
      "포탈", "계산기", "온라인 도구", "무료 공유 가계부", "문서·양식", "퀴즈·테스트",
    ]);
    expect([copy.allQuizzes, copy.category.general, copy.category.geography, copy.category.science, copy.category.history, copy.category.math, copy.category.language, copy.category.technology, copy.category.memory, copy.category.speed, copy.category.fun]).toEqual([
      "전체 퀴즈", "일반 상식", "세계·지리", "과학", "역사", "수학", "언어", "IT", "기억력·두뇌", "속도·반응", "재미 테스트",
    ]);
    expect([copy.freeToPlay, copy.noAccount]).toEqual(["무료 이용", "회원가입 없이 이용"]);
    expect(quizTitle("ko", quizzes.find((quiz) => quiz.slug === "true-false-challenge")!)).toBe("참·거짓 퀴즈");
  });
});
