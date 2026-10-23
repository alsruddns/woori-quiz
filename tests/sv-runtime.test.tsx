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

describe("Swedish published runtime", () => {
  it("renders Swedish UI and connects the language selector", () => {
    const home = renderToStaticMarkup(createElement(HomeView, { locale: "sv" }));
    const detail = renderToStaticMarkup(createElement(QuizView, { locale: "sv", slug: "general-knowledge" }));
    const interactive = renderToStaticMarkup(createElement(InteractiveTest, { locale: "sv", slug: "reaction-time-test" }));
    expect(home).toContain("mobile-discovery-nav");
    expect(home).toContain('value="sv"');
    expect(detail).toContain("Allmänbildningsquiz");
    expect(interactive).toContain("Klicka när kortet blir grönt");
    expect(localeNames.sv).toBe("Svenska");
  });

  it("sets HTML language and formats UI counts, search, title and math prompts", async () => {
    const markup = renderToStaticMarkup(await LocaleRootLayout({ children: createElement("main", null, "quiz"), params: Promise.resolve({ locale: "sv" }) }));
    expect(markup).toContain('<html lang="sv">');
    expect(uiMessages.sv.quizCount(23)).toContain("23");
    expect(uiMessages.sv.questionCount(621)).toContain("621");
    expect(uiMessages.sv.localeCount).toContain("26");
    expect(discoveryCopy.sv.resultsFor("matematik", 4)).toContain("matematik");
    expect(quizTitle("sv", quizzes.find((quiz) => quiz.slug === "brain-teaser")!)).toContain("Hjärngympa");
    expect(localizeMathPrompt("sv", "What is x? (decimal)")).toContain("värdet på x");
  });

  it("passes all public content gates and exposes canonical, hreflang and sitemap URLs", async () => {
    expect(isLocale("sv")).toBe(true);
    expect(isPublishedLocale("sv")).toBe(true);
    expect(publishedLocales).toContain("sv");
    expect(await getListLocalizationQuality("sv")).toEqual({ complete: true, indexable: true });
    for (const quiz of quizzes.filter((item) => item.isPublic)) expect((await getQuizLocalizationQuality("sv", quiz)).complete, quiz.slug).toBe(true);
    const detail = await quizMetadata({ params: Promise.resolve({ locale: "sv", slug: "general-knowledge" }) });
    const list = await listMetadata({ params: Promise.resolve({ locale: "sv" }) });
    expect(detail.robots).toEqual({ index: true, follow: true });
    expect(detail.alternates?.canonical).toBe("/sv/quiz/general-knowledge");
    expect((detail.alternates?.languages as Record<string,string>).sv).toBe("/sv/quiz/general-knowledge");
    expect(list.alternates?.canonical).toBe("/sv/quiz");
    expect((list.alternates?.languages as Record<string,string>).sv).toBe("/sv/quiz");
    const xml = await (await GET()).text();
    expect(xml).toContain("https://www.woori.today/sv/quiz");
    expect(xml).toContain("https://www.woori.today/sv/quiz/general-knowledge");
    expect(xml).toContain("https://www.woori.today/cs/quiz");
    expect(xml).not.toContain("/ar/");
    expect((xml.match(/<loc>/g) ?? []).length).toBe(1475);
  }, 60000);
});
