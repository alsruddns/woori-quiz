import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { HomeView } from "../src/components/HomeView";
import { InteractiveTest } from "../src/components/InteractiveTest";
import { QuizView } from "../src/components/QuizView";
import { generateMetadata as quizMetadata } from "../src/app/(localized)/[locale]/quiz/[slug]/page";
import { generateMetadata as listMetadata } from "../src/app/(localized)/[locale]/quiz/page";
import { discoveryCopy, isLocale, isPublishedLocale, localeNames, publishedLocales, uiMessages } from "../src/lib/i18n";
import { quizzes } from "../src/lib/registry";
import { quizTitle, localizeMathPrompt } from "../src/lib/quiz-copy";
import { getListLocalizationQuality, getQuizLocalizationQuality } from "../src/lib/localization-quality";
import LocaleRootLayout from "../src/app/(localized)/[locale]/layout";
import { GET } from "../src/app/sitemap.xml/route";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Ukrainian published runtime", () => {
  it("renders localized pages and keeps the published locale in the selector", () => {
    const home = renderToStaticMarkup(createElement(HomeView, { locale: "uk" }));
    const detail = renderToStaticMarkup(createElement(QuizView, { locale: "uk", slug: "general-knowledge" }));
    const interactive = renderToStaticMarkup(createElement(InteractiveTest, { locale: "uk", slug: "reaction-time-test" }));
    expect(home).toContain("mobile-discovery-nav");
    expect(home).toContain('value="uk"');
    expect(detail).toContain("Вікторина на загальні знання");
    expect(interactive).toContain("Натисніть, коли поле стане зеленим");
    expect(localeNames.uk).toBe("Українська");
  });

  it("sets the document language, formats counts, search, titles, and generated math", async () => {
    const markup = renderToStaticMarkup(await LocaleRootLayout({ children: createElement("main", null, "quiz"), params: Promise.resolve({ locale: "uk" }) }));
    expect(markup).toContain('<html lang="uk">');
    expect(uiMessages.uk.quizCount(1)).toBe("1 вікторина");
    expect(uiMessages.uk.quizCount(2)).toBe("2 вікторини");
    expect(uiMessages.uk.quizCount(5)).toBe("5 вікторин");
    expect(uiMessages.uk.questionCount(12)).toContain("12");
    expect(discoveryCopy.uk.resultsFor("математика", 4)).toContain("математика");
    expect(quizTitle("uk", quizzes.find((quiz) => quiz.slug === "brain-teaser")!)).toContain("Головоломки");
    expect(localizeMathPrompt("uk", "What is x? (decimal)")).toContain("значення x");
  });

  it("passes all content gates and publishes canonical, hreflang, and sitemap URLs", async () => {
    expect(isLocale("uk")).toBe(true);
    expect(isPublishedLocale("uk")).toBe(true);
    expect(publishedLocales).toContain("uk");
    expect(await getListLocalizationQuality("uk")).toEqual({ complete: true, indexable: true });
    for (const quiz of quizzes.filter((item) => item.isPublic)) {
      expect((await getQuizLocalizationQuality("uk", quiz)).complete, quiz.slug).toBe(true);
    }
    const detail = await quizMetadata({ params: Promise.resolve({ locale: "uk", slug: "general-knowledge" }) });
    const list = await listMetadata({ params: Promise.resolve({ locale: "uk" }) });
    expect(detail.robots).toEqual({ index: true, follow: true });
    expect(detail.alternates?.canonical).toBe("/uk/quiz/general-knowledge");
    expect((detail.alternates?.languages as Record<string,string>).uk).toBe("/uk/quiz/general-knowledge");
    expect(list.alternates?.canonical).toBe("/uk/quiz");
    expect((list.alternates?.languages as Record<string,string>).uk).toBe("/uk/quiz");
    const xml = await (await GET()).text();
    expect(xml).toContain("https://www.woori.today/uk/quiz");
    expect(xml).toContain("https://www.woori.today/uk/quiz/general-knowledge");
    expect(xml).not.toContain("/ms/");
    expect(xml).not.toContain("/ar/");
    expect((xml.match(/<loc>/g) ?? []).length).toBe(1239);
  }, 60000);
});

