import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AdSlot } from "../src/components/AdSlot";
import { SiteFooter } from "../src/components/SiteFooter";
import { categoryDescription, quizDescription, scoreFeedback, serviceGuide } from "../src/lib/content-copy";
import { locales } from "../src/lib/i18n";
import { categories, quizzes } from "../src/lib/registry";
import { quizTitle } from "../src/lib/quiz-copy";
import { quizPath } from "../src/lib/urls";

describe("public content and navigation", () => {
  it("publishes only complete, distinct quizzes with valid links", () => {
    const publicQuizzes = quizzes.filter((quiz) => quiz.isPublic);
    expect(publicQuizzes).toHaveLength(58);
    expect(new Set(quizzes.map((quiz) => quiz.slug)).size).toBe(quizzes.length);
    expect(new Set(publicQuizzes.map((quiz) => quiz.summary.trim().toLowerCase())).size).toBe(publicQuizzes.length);
    expect(publicQuizzes.find((quiz) => quiz.slug === "challenge-20")?.count).toBe(20);
    expect(publicQuizzes.every((quiz) => quiz.category && quiz.summary.trim() && quiz.tags.length && quiz.count !== 0)).toBe(true);
    for (const locale of locales) {
      const descriptions = publicQuizzes.map((quiz) => quizDescription(locale, quiz, quizTitle(locale, quiz)));
      expect(new Set(descriptions).size).toBe(publicQuizzes.length);
      for (const quiz of publicQuizzes) {
        expect(quizPath(locale, quiz.slug)).toMatch(new RegExp(`^/${locale}/quiz/[a-z0-9-]+$`));
        expect(quizTitle(locale, quiz).trim()).toBeTruthy();
        expect(quizDescription(locale, quiz, quizTitle(locale, quiz)).trim()).toBeTruthy();
      }
    }
  });

  it("provides distinct category guidance and complete 15-locale UI copy", () => {
    for (const locale of locales) {
      const descriptions = categories.map((category) => categoryDescription(locale, category));
      expect(descriptions.every((copy) => copy.trim().length > 10)).toBe(true);
      expect(new Set(descriptions).size).toBe(categories.length);
      if (locale !== "en") {
        expect(descriptions.every((copy, index) => copy !== categoryDescription("en", categories[index]))).toBe(true);
        expect(serviceGuide[locale].account).not.toBe(serviceGuide.en.account);
        expect(scoreFeedback(locale, 2, 10)).not.toBe(scoreFeedback("en", 2, 10));
      }
      const guide = serviceGuide[locale];
      expect(Object.values(guide).every((copy) => copy.trim().length > 0 && !copy.includes("undefined"))).toBe(true);
      expect(scoreFeedback(locale, 2, 10)).not.toBe(scoreFeedback(locale, 9, 10));
    }
  });

  it("links policy pages and keeps disabled ads out of the DOM", () => {
    for (const locale of locales) {
      const footer = renderToStaticMarkup(<SiteFooter locale={locale} />);
      expect(footer).toContain(`href="/${locale}/privacy"`);
      expect(footer).toContain(`href="/${locale}/terms"`);
      expect(footer).toContain("mailto:krdd125@gmail.com");
      expect(footer).not.toContain("href=\"#privacy\"");
    }
    const previous = process.env.NEXT_PUBLIC_ADS_ENABLED;
    try {
      process.env.NEXT_PUBLIC_ADS_ENABLED = "false";
      expect(renderToStaticMarkup(<AdSlot locale="ko" />)).toBe("");
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_ADS_ENABLED;
      else process.env.NEXT_PUBLIC_ADS_ENABLED = previous;
    }
  });
});
