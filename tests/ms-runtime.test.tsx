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
import { quizTitle } from "../src/lib/quiz-copy";
import { getListLocalizationQuality, getQuizLocalizationQuality } from "../src/lib/localization-quality";
import LocaleRootLayout from "../src/app/(localized)/[locale]/layout";
import { GET } from "../src/app/sitemap.xml/route";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Malay published runtime", () => {
  it("renders localized list, quiz and interactive UI with a working language selector", () => {
    const home = renderToStaticMarkup(createElement(HomeView, { locale: "ms" }));
    const detail = renderToStaticMarkup(createElement(QuizView, { locale: "ms", slug: "general-knowledge" }));
    const interactive = renderToStaticMarkup(createElement(InteractiveTest, { locale: "ms", slug: "reaction-time-test" }));
    expect(home).toContain("mobile-discovery-nav");
    expect(home).toContain('value="ms"');
    expect(detail).toContain(quizTitle("ms", quizzes.find((quiz) => quiz.slug === "general-knowledge")!));
    expect(interactive).toContain("Klik apabila kad bertukar hijau");
    expect(localeNames.ms).toBe("Bahasa Melayu");
  });

  it("sets the HTML language and formats Malay counts, search and math prompts", async () => {
    const markup = renderToStaticMarkup(await LocaleRootLayout({ children: createElement("main", null, "quiz"), params: Promise.resolve({ locale: "ms" }) }));
    expect(markup).toContain('<html lang="ms">');
    expect(uiMessages.ms.quizCount(26)).toContain("26");
    expect(uiMessages.ms.questionCount(621)).toContain("621");
    expect(uiMessages.ms.localeCount).toContain("26");
    expect(discoveryCopy.ms.resultsFor("matematik", 4)).toContain("matematik");
    expect(quizTitle("ms", quizzes.find((quiz) => quiz.slug === "brain-teaser")!)).toContain("Teka-teki");
    expect(uiMessages.ms.quizSummary("Kuiz Matematik")).toContain("Kuiz Matematik");
  });

  it("passes all content gates and exposes canonical, hreflang, and sitemap URLs", async () => {
    expect(isLocale("ms")).toBe(true);
    expect(isPublishedLocale("ms")).toBe(true);
    expect(publishedLocales).toContain("ms");
    expect(await getListLocalizationQuality("ms")).toEqual({ complete: true, indexable: true });
    for (const quiz of quizzes.filter((item) => item.isPublic)) expect((await getQuizLocalizationQuality("ms", quiz)).complete, quiz.slug).toBe(true);
    const detail = await quizMetadata({ params: Promise.resolve({ locale: "ms", slug: "general-knowledge" }) });
    const list = await listMetadata({ params: Promise.resolve({ locale: "ms" }) });
    expect(detail.robots).toEqual({ index: true, follow: true });
    expect(detail.alternates?.canonical).toBe("/ms/quiz/general-knowledge");
    expect((detail.alternates?.languages as Record<string,string>).ms).toBe("/ms/quiz/general-knowledge");
    expect(list.alternates?.canonical).toBe("/ms/quiz");
    expect((list.alternates?.languages as Record<string,string>).ms).toBe("/ms/quiz");
    const xml = await (await GET()).text();
    expect(xml).toContain("https://www.woori.today/ms/quiz");
    expect(xml).toContain("https://www.woori.today/ms/quiz/general-knowledge");
    expect(xml).not.toContain("/sv/");
    expect(xml).not.toContain("/ar/");
    expect((xml.match(/<loc>/g) ?? []).length).toBe(1298);
  }, 60000);
});
