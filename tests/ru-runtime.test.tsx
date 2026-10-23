import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { HomeView } from "../src/components/HomeView";
import { InteractiveTest } from "../src/components/InteractiveTest";
import { QuizView } from "../src/components/QuizView";
import { generateMetadata as quizMetadata } from "../src/app/[locale]/quiz/[slug]/page";
import { generateMetadata as listMetadata } from "../src/app/[locale]/quiz/page";
import { discoveryCopy, isLocale, isPublishedLocale, publishedLocales, uiMessages } from "../src/lib/i18n";
import { localizeMathPrompt, quizTitle } from "../src/lib/quiz-copy";
import { quizzes } from "../src/lib/registry";
import { GET } from "../src/app/sitemap.xml/route";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Russian runtime", () => {
  it("renders the Russian list, quiz detail, and interactive-test UI with a working locale option", () => {
    const home = renderToStaticMarkup(createElement(HomeView, { locale: "ru" }));
    const detail = renderToStaticMarkup(createElement(QuizView, { locale: "ru", slug: "general-knowledge" }));
    const interactive = renderToStaticMarkup(createElement(InteractiveTest, { locale: "ru", slug: "click-speed-test" }));
    expect(home).toContain("Викторины и тесты");
    expect(home).toMatch(/<option value="ru"[^>]*>Русский<\/option>/);
    expect(home).toContain("Исследуйте по теме");
    expect(detail).toContain(quizTitle("ru", quizzes.find((quiz) => quiz.slug === "general-knowledge")!));
    expect(detail).toContain("Начните, когда будете готовы.");
    expect(interactive).toContain("Запомните то, что видите");
    expect(interactive).toContain("Старт");
    expect(isLocale("ru")).toBe(true);
    expect(isPublishedLocale("ru")).toBe(true);
    expect(publishedLocales).toContain("ru");
  });

  it("formats Russian counts and dynamic math copy", () => {
    expect([1, 2, 5, 11, 21].map((count) => uiMessages.ru.quizCount(count))).toEqual([
      "1 викторина", "2 викторины", "5 викторин", "11 викторин", "21 викторина",
    ]);
    expect([1, 2, 5, 11, 21].map((count) => uiMessages.ru.questionCount(count))).toEqual([
      "1 вопрос", "2 вопроса", "5 вопросов", "11 вопросов", "21 вопрос",
    ]);
    expect(discoveryCopy.ru.resultsFor("математика", 2)).toContain("2 викторины");
    expect(localizeMathPrompt("ru", "20% of 50 = ?")).toBe("Сколько составляет 20% от 50?");
    expect(localizeMathPrompt("ru", "What is x? (decimal)")).toBe("Найдите x. (десятичная дробь)");
  });

  it("publishes Russian canonical, hreflang, and sitemap URLs after passing the gates", async () => {
    const detail = await quizMetadata({ params: Promise.resolve({ locale: "ru", slug: "general-knowledge" }) });
    const list = await listMetadata({ params: Promise.resolve({ locale: "ru" }) });
    expect(detail.robots).toEqual({ index: true, follow: true });
    expect(detail.alternates?.canonical).toBe("/ru/quiz/general-knowledge");
    expect((detail.alternates?.languages as Record<string, string>).ru).toBe("/ru/quiz/general-knowledge");
    expect(list.alternates?.canonical).toBe("/ru/quiz");
    expect((list.alternates?.languages as Record<string, string>).ru).toBe("/ru/quiz");
    const xml = await (await GET()).text();
    expect(xml).toContain("https://www.woori.today/ru/quiz");
    expect(xml).toContain("https://www.woori.today/ru/quiz/general-knowledge");
    expect(xml).toContain("https://www.woori.today/tr/quiz");
  });
});

