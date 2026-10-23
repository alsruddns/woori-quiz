import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { HomeView } from "../src/components/HomeView";
import { InteractiveTest } from "../src/components/InteractiveTest";
import { QuizView } from "../src/components/QuizView";
import { discoveryCopy, isLocale, isPublishedLocale, localeNames, uiMessages } from "../src/lib/i18n";
import { quizzes } from "../src/lib/registry";
import { quizTitle, localizeMathPrompt } from "../src/lib/quiz-copy";
import { getListLocalizationQuality, getQuizLocalizationQuality } from "../src/lib/localization-quality";
import { generateStaticParams as generateQuizParams, generateMetadata as quizMetadata } from "../src/app/(localized)/[locale]/quiz/[slug]/page";
import { generateStaticParams as generateListParams, generateMetadata as listMetadata } from "../src/app/(localized)/[locale]/quiz/page";
import { GET } from "../src/app/sitemap.xml/route";
import LocaleRootLayout from "../src/app/(localized)/[locale]/layout";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Romanian published runtime", () => {
  it("renders Romanian list, quiz, interactive test and language selector", () => {
    const home = renderToStaticMarkup(createElement(HomeView, { locale: "ro" }));
    const detail = renderToStaticMarkup(createElement(QuizView, { locale: "ro", slug: "general-knowledge" }));
    const interactive = renderToStaticMarkup(createElement(InteractiveTest, { locale: "ro", slug: "reaction-time-test" }));
    expect(home).toContain("mobile-discovery-nav");
    expect(home).toContain('value="ro"');
    expect(detail).toContain("Cultură generală");
    expect(interactive).toContain("Începe");
    expect(localeNames.ro).toBe("Română");
    expect(uiMessages.ro.quizCount(58)).toContain("58");
    expect(uiMessages.ro.questionCount(621)).toContain("621");
    expect(uiMessages.ro.localeCount).toContain("26");
    expect(discoveryCopy.ro.resultsFor("matematică", 4)).toContain("4");
    expect(quizTitle("ro", quizzes.find((quiz) => quiz.slug === "brain-teaser")!)).toContain("minte");
    expect(localizeMathPrompt("ro", "What is x? (decimal)")).toContain("valoarea lui x");
  });

  it("passes every public-content, route, canonical, hreflang and sitemap gate", async () => {
    expect(isLocale("ro")).toBe(true);
    expect(isPublishedLocale("ro")).toBe(true);
    expect(await getListLocalizationQuality("ro")).toEqual({ complete: true, indexable: true });
    for (const quiz of quizzes.filter((item) => item.isPublic)) {
      const quality = await getQuizLocalizationQuality("ro", quiz);
      expect(quality.complete, quiz.slug).toBe(true);
      expect(quality.indexable, quiz.slug).toBe(true);
    }
    expect(generateListParams().map(({ locale }) => locale)).toContain("ro");
    expect(generateQuizParams().map(({ locale }) => String(locale))).toContain("ro");
    const markup = renderToStaticMarkup(await LocaleRootLayout({ children: createElement("main", null, "quiz"), params: Promise.resolve({ locale: "ro" }) }));
    expect(markup).toContain('<html lang="ro">');
    const detail = await quizMetadata({ params: Promise.resolve({ locale: "ro", slug: "general-knowledge" }) });
    const list = await listMetadata({ params: Promise.resolve({ locale: "ro" }) });
    expect(detail.robots).toEqual({ index: true, follow: true });
    expect(detail.alternates?.canonical).toBe("/ro/quiz/general-knowledge");
    expect((detail.alternates?.languages as Record<string, string>).ro).toBe("/ro/quiz/general-knowledge");
    expect(list.alternates?.canonical).toBe("/ro/quiz");
    expect((list.alternates?.languages as Record<string, string>).ro).toBe("/ro/quiz");
    const sitemap = await (await GET()).text();
    expect(sitemap).toContain("https://www.woori.today/ro/quiz");
    expect(sitemap).not.toContain("/el/quiz");
    expect(sitemap).not.toContain("/ar/");
    expect((sitemap.match(/<loc>/g) ?? []).length).toBe(1475);
  }, 60000);
});
