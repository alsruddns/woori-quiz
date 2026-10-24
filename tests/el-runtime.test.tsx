import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { HomeView } from "../src/components/HomeView";
import { InteractiveTest } from "../src/components/InteractiveTest";
import { QuizView } from "../src/components/QuizView";
import { discoveryCopy, isLocale, isPublishedLocale, localeNames, publishedLocales, uiMessages } from "../src/lib/i18n";
import { quizzes } from "../src/lib/registry";
import { localizeMathPrompt, quizTitle } from "../src/lib/quiz-copy";
import { getListLocalizationQuality, getQuizLocalizationQuality } from "../src/lib/localization-quality";
import { generateStaticParams as generateQuizParams, generateMetadata as quizMetadata } from "../src/app/(localized)/[locale]/quiz/[slug]/page";
import { generateStaticParams as generateListParams, generateMetadata as listMetadata } from "../src/app/(localized)/[locale]/quiz/page";
import { GET } from "../src/app/sitemap.xml/route";
import LocaleRootLayout from "../src/app/(localized)/[locale]/layout";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Greek published runtime", () => {
  it("renders the localized list, quiz, interactive test and language selector", () => {
    const home = renderToStaticMarkup(createElement(HomeView, { locale: "el" }));
    const detail = renderToStaticMarkup(createElement(QuizView, { locale: "el", slug: "general-knowledge" }));
    const interactive = renderToStaticMarkup(createElement(InteractiveTest, { locale: "el", slug: "reaction-time-test" }));
    expect(home).toContain('value="el"');
    expect(home).toMatch(/[\u0370-\u03ff]/);
    expect(detail).toMatch(/[\u0370-\u03ff]/);
    expect(interactive).toMatch(/[\u0370-\u03ff]/);
    expect(localeNames.el).toBe("\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac");
    expect(uiMessages.el.quizCount(58)).toContain("58");
    expect(uiMessages.el.questionCount(621)).toContain("621");
    expect(uiMessages.el.localeCount).toContain("26");
    expect(discoveryCopy.el.resultsFor("query", 4)).toContain("4");
    expect(quizTitle("el", quizzes.find((quiz) => quiz.slug === "brain-teaser")!)).not.toBe("Brain Teaser");
    expect(localizeMathPrompt("el", "What is x? (decimal)")).toMatch(/[\u0370-\u03ff]/);
  });

  it("passes public content, route, canonical, hreflang and sitemap gates", async () => {
    expect(isLocale("el")).toBe(true);
    expect(isPublishedLocale("el")).toBe(true);
    expect(publishedLocales).toHaveLength(26);
    expect(await getListLocalizationQuality("el")).toEqual({ complete: true, indexable: true });
    for (const quiz of quizzes.filter((item) => item.isPublic)) {
      const quality = await getQuizLocalizationQuality("el", quiz);
      expect(quality.complete, quiz.slug).toBe(true);
      expect(quality.indexable, quiz.slug).toBe(true);
    }
    expect(generateListParams().map(({ locale }) => locale)).toContain("el");
    expect(generateQuizParams().map(({ locale }) => String(locale))).toContain("el");
    const markup = renderToStaticMarkup(await LocaleRootLayout({ children: createElement("main", null, "quiz"), params: Promise.resolve({ locale: "el" }) }));
    expect(markup).toContain('<html lang="el">');
    const detail = await quizMetadata({ params: Promise.resolve({ locale: "el", slug: "general-knowledge" }) });
    const list = await listMetadata({ params: Promise.resolve({ locale: "el" }) });
    expect(detail.robots).toEqual({ index: true, follow: true });
    expect(detail.alternates?.canonical).toBe("/el/quiz/general-knowledge");
    expect((detail.alternates?.languages as Record<string, string>).el).toBe("/el/quiz/general-knowledge");
    expect(Object.keys(detail.alternates?.languages ?? {})).toHaveLength(27);
    expect(list.alternates?.canonical).toBe("/el/quiz");
    expect((list.alternates?.languages as Record<string, string>).el).toBe("/el/quiz");
    const sitemap = await (await GET()).text();
    expect(sitemap).toContain("https://www.woori.today/el/quiz");
    expect(sitemap).toContain("https://www.woori.today/el/quiz/general-knowledge");
    expect(sitemap).not.toContain("/ar/");
    expect(sitemap).not.toContain("/fa/");
    expect(sitemap).not.toContain("/he/");
    expect(sitemap).not.toContain("/ur/");
    expect((sitemap.match(/<loc>/g) ?? []).length).toBe(1534);
  }, 60000);
});
