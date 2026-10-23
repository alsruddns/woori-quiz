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
import { GET } from "../src/app/sitemap.xml/route";
import { generateMetadata as quizMetadata } from "../src/app/(localized)/[locale]/quiz/[slug]/page";
import { generateMetadata as listMetadata } from "../src/app/(localized)/[locale]/quiz/page";
import LocaleRootLayout from "../src/app/(localized)/[locale]/layout";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Czech published runtime", () => {
  it("renders Czech UI and connects the language selector", () => {
    const home = renderToStaticMarkup(createElement(HomeView, { locale: "cs" }));
    const detail = renderToStaticMarkup(createElement(QuizView, { locale: "cs", slug: "general-knowledge" }));
    const interactive = renderToStaticMarkup(createElement(InteractiveTest, { locale: "cs", slug: "reaction-time-test" }));
    expect(home).toContain("mobile-discovery-nav");
    expect(home).toContain('value="cs"');
    expect(detail).toContain("Kvíz všeobecných znalostí");
    expect(interactive).toContain("Až karta zezelená, klikněte.");
    expect(localeNames.cs).toBe("Čeština");
  });

  it("formats localized dynamic copy and quiz titles", () => {
    expect(uiMessages.cs.quizCount(58)).toContain("58");
    expect(uiMessages.cs.questionCount(621)).toContain("621");
    expect(uiMessages.cs.localeCount).toContain("26");
    expect(discoveryCopy.cs.resultsFor("matematika", 4)).toContain("4");
    expect(quizTitle("cs", quizzes.find((quiz) => quiz.slug === "brain-teaser")!)).toBe("Mozkový trénink");
    expect(localizeMathPrompt("cs", "What is x? (decimal)")).toContain("hodnota x");
  });

  it("passes every question and public quiz quality gate and publishes only after quality gates", async () => {
    expect(isLocale("cs")).toBe(true);
    expect(isPublishedLocale("cs")).toBe(true);
    expect(await getListLocalizationQuality("cs")).toEqual({ complete: true, indexable: true });
    for (const quiz of quizzes.filter((item) => item.isPublic)) {
      expect((await getQuizLocalizationQuality("cs", quiz)).complete, quiz.slug).toBe(true);
    }
    const markup = renderToStaticMarkup(await LocaleRootLayout({ children: createElement("main", null, "quiz"), params: Promise.resolve({ locale: "cs" }) }));
    expect(markup).toContain('<html lang="cs">');
    const detail = await quizMetadata({ params: Promise.resolve({ locale: "cs", slug: "general-knowledge" }) });
    const list = await listMetadata({ params: Promise.resolve({ locale: "cs" }) });
    expect(detail.robots).toEqual({ index: true, follow: true });
    expect(detail.alternates?.canonical).toBe("/cs/quiz/general-knowledge");
    expect((detail.alternates?.languages as Record<string,string>).cs).toBe("/cs/quiz/general-knowledge");
    expect(list.alternates?.canonical).toBe("/cs/quiz");
    expect((list.alternates?.languages as Record<string,string>).cs).toBe("/cs/quiz");
    const xml = await (await GET()).text();
    expect(xml).toContain("https://www.woori.today/cs/quiz");
    expect(xml).not.toContain("/ar/");
    expect((xml.match(/<loc>/g) ?? []).length).toBe(1416);
  }, 60000);
});
