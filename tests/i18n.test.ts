import { describe, expect, it } from "vitest";
import { categories, quizzes } from "../src/lib/registry";
import { excludedExpansionLocales, isLocale, isPublishedLocale, localeExpansionTargets, locales, localeNames, publishedLocales, uiMessages } from "../src/lib/i18n";
import { hasQuizTermTranslations, missingQuizTitleWords, quizCategoryName, quizTitle, quizTitleTranslationWordCount, quizTitleWordCount } from "../src/lib/quiz-copy";
import { quizPathForLocale } from "../src/lib/urls";

describe("quiz UI translations", () => {
  it("tracks 26 expansion targets without activating incomplete languages", () => {
    expect(localeExpansionTargets).toHaveLength(26);
    expect(new Set(localeExpansionTargets).size).toBe(26);
    expect(localeExpansionTargets).toEqual([
      ...locales.filter((locale) => locale !== "ru" && locale !== "tr" && locale !== "pl"),
      "ru", "tr", "pl", "fil", "bn", "uk", "ms", "sv", "cs", "ro", "el",
    ]);
    expect(localeExpansionTargets.slice(publishedLocales.length).every((locale) => !isPublishedLocale(locale))).toBe(true);
    expect(isLocale("ru")).toBe(true);
    expect(isPublishedLocale("ru")).toBe(true);
    expect(excludedExpansionLocales).toEqual(["ar", "ur", "fa", "he"]);
    expect(excludedExpansionLocales.some((locale) => (localeExpansionTargets as readonly string[]).includes(locale))).toBe(false);
    expect(publishedLocales).toEqual(["ko", "en", "ja", "zh", "es", "pt-br", "de", "fr", "vi", "id", "th", "zh-tw", "it", "nl", "hi", "ru", "tr", "pl"]);
  });

  it("provides navigation, category, difficulty, and footer copy for wired locales", () => {
    expect(Object.keys(uiMessages).sort()).toEqual([...locales].sort());
    for (const locale of locales) {
      const copy = uiMessages[locale];
      const publicQuizSlugs = quizzes.filter((quiz) => quiz.isPublic).map((quiz) => quiz.slug);
      expect(localeNames[locale]).toBeTruthy();
      expect([copy.familySites, copy.portal, copy.calculator, copy.tools, copy.moneyBook, copy.docs, copy.quiz, copy.language]).not.toContain("");
      expect(Object.values(copy.category).every(Boolean)).toBe(true);
      expect(categories.every((category) => quizCategoryName(locale, category).trim().length > 0)).toBe(true);
      expect(Object.keys(copy.difficultyLabels).sort()).toEqual(["easy", "expert", "hard", "medium"]);
      expect([copy.footerTagline, copy.privacy, copy.guidelines, copy.contact].every(Boolean)).toBe(true);
      expect(quizTitleTranslationWordCount(locale), `Wrong quiz title word count for ${locale}`).toBe(quizTitleWordCount);
      expect(missingQuizTitleWords(quizzes.map((quiz) => quiz.slug))).toEqual([]);
      expect(hasQuizTermTranslations(locale, locale === "ru" || locale === "tr" || locale === "pl" ? publicQuizSlugs : quizzes.map((quiz) => quiz.slug)), `Incomplete quiz word translations for ${locale}`).toBe(true);
      expect(quizzes.every((quiz) => quizTitle(locale, quiz).trim().length > 0)).toBe(true);
    }
  });

  it("switches quiz routes between the published languages", () => {
    expect(quizPathForLocale("/en/quiz/general-knowledge", "ja")).toBe("/ja/quiz/general-knowledge");
    expect(quizPathForLocale("/ja/quiz/general-knowledge", "zh")).toBe("/zh/quiz/general-knowledge");
    expect(quizPathForLocale("/zh/quiz/general-knowledge", "es")).toBe("/es/quiz/general-knowledge");
    expect(quizPathForLocale("/es/quiz/general-knowledge", "pt-br")).toBe("/pt-br/quiz/general-knowledge");
    expect(quizPathForLocale("/pt-br/quiz/general-knowledge", "de")).toBe("/de/quiz/general-knowledge");
    expect(quizPathForLocale("/de/quiz/general-knowledge", "fr")).toBe("/fr/quiz/general-knowledge");
    expect(quizPathForLocale("/fr/quiz/general-knowledge", "en")).toBe("/en/quiz/general-knowledge");
    expect(quizPathForLocale("/fr/quiz/general-knowledge", "vi")).toBe("/vi/quiz/general-knowledge");
    expect(quizPathForLocale("/vi/quiz/general-knowledge", "de")).toBe("/de/quiz/general-knowledge");
    expect(quizPathForLocale("/vi/quiz/general-knowledge", "id")).toBe("/id/quiz/general-knowledge");
    expect(quizPathForLocale("/id/quiz/general-knowledge", "vi")).toBe("/vi/quiz/general-knowledge");
    expect(quizPathForLocale("/id/quiz/general-knowledge", "th")).toBe("/th/quiz/general-knowledge");
    expect(quizPathForLocale("/th/quiz/general-knowledge", "id")).toBe("/id/quiz/general-knowledge");
    expect(quizPathForLocale("/th/quiz/general-knowledge", "zh-tw")).toBe("/zh-tw/quiz/general-knowledge");
    expect(quizPathForLocale("/zh-tw/quiz/general-knowledge", "th")).toBe("/th/quiz/general-knowledge");
    expect(quizPathForLocale("/zh-tw/quiz/general-knowledge", "it")).toBe("/it/quiz/general-knowledge");
    expect(quizPathForLocale("/it/quiz/general-knowledge", "zh-tw")).toBe("/zh-tw/quiz/general-knowledge");
    expect(quizPathForLocale("/it/quiz/general-knowledge", "nl")).toBe("/nl/quiz/general-knowledge");
    expect(quizPathForLocale("/nl/quiz/general-knowledge", "it")).toBe("/it/quiz/general-knowledge");
    expect(quizPathForLocale("/nl/quiz/general-knowledge", "hi")).toBe("/hi/quiz/general-knowledge");
    expect(quizPathForLocale("/hi/quiz/general-knowledge", "nl")).toBe("/nl/quiz/general-knowledge");
    expect(quizPathForLocale("/ja/quiz", "ko")).toBe("/ko/quiz");
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
