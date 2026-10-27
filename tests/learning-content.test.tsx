import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { QuizLearningCards } from "../src/components/QuizLearningCards";
import { loadLocaleCatalog } from "../src/lib/locale-catalog";
import { publishedLocales } from "../src/lib/i18n";
import { quizzes } from "../src/lib/registry";

describe("quiz learning cards", () => {
  it("renders always-visible localized learning copy for every public quiz and locale", async () => {
    const publicQuizzes = quizzes.filter((quiz) => quiz.isPublic);

    for (const locale of publishedLocales) {
      await loadLocaleCatalog(locale);
      for (const quiz of publicQuizzes) {
        const html = renderToStaticMarkup(createElement(QuizLearningCards, { locale, quiz }));
        expect(html.match(/class="learning-card"/g), `${locale}/${quiz.slug}`).toHaveLength(5);
        expect(html).toContain("class=\"learning-card-copy\"");
        expect(html).toContain("<h2>");
        expect(html).not.toContain("<details");
        expect(html).not.toContain("display:none");
        expect(html).not.toContain("visibility:hidden");
      }
    }
  });

  it("provides locale-specific information cautions", async () => {
    const publicQuiz = quizzes.find((quiz) => quiz.isPublic);
    if (!publicQuiz) throw new Error("Expected at least one public quiz");

    const markupByLocale = new Map<string, string>();
    for (const locale of publishedLocales) {
      await loadLocaleCatalog(locale);
      markupByLocale.set(locale, renderToStaticMarkup(createElement(QuizLearningCards, { locale, quiz: publicQuiz })));
    }

    expect(new Set(markupByLocale.values()).size).toBe(publishedLocales.length);
  });
});
