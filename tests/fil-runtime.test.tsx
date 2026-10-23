import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { HomeView } from "../src/components/HomeView";
import { InteractiveTest } from "../src/components/InteractiveTest";
import { QuizView } from "../src/components/QuizView";
import { generateMetadata as quizMetadata } from "../src/app/(localized)/[locale]/quiz/[slug]/page";
import { generateMetadata as listMetadata } from "../src/app/(localized)/[locale]/quiz/page";
import { discoveryCopy, localeNames, uiMessages } from "../src/lib/i18n";
import { quizzes } from "../src/lib/registry";
import { quizTitle, localizeMathPrompt } from "../src/lib/quiz-copy";
import { getListLocalizationQuality, getQuizLocalizationQuality } from "../src/lib/localization-quality";
import { GET } from "../src/app/sitemap.xml/route";
import LocaleRootLayout from "../src/app/(localized)/[locale]/layout";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Filipino runtime and publication", () => {
  it("renders Filipino list, quiz detail, interactive test, and locale selector", () => {
    const home = renderToStaticMarkup(createElement(HomeView, { locale: "fil" }));
    const detail = renderToStaticMarkup(createElement(QuizView, { locale: "fil", slug: "general-knowledge" }));
    const interactive = renderToStaticMarkup(createElement(InteractiveTest, { locale: "fil", slug: "reaction-time-test" }));
    expect(home).toContain("mobile-discovery-nav");
    expect(home).toMatch(/<option value="fil"[^>]*>Filipino<\/option>/);
    expect(detail).toContain("Pangkalahatang Kaalaman");
    expect(interactive).toContain("I-tap kapag naging berde ang kahon");
    expect(interactive).toContain("Magsimula");
    expect(localeNames.fil).toBe("Filipino");
  });

  it("sets the document language from the published route locale", async () => {
    const markup = renderToStaticMarkup(await LocaleRootLayout({
      children: createElement("main", null, "quiz"),
      params: Promise.resolve({ locale: "fil" }),
    }));
    expect(markup).toContain('<html lang="fil">');
  });

  it("formats Filipino counts, search feedback, title metadata, and generated math prompts", () => {
    expect(uiMessages.fil.quizCount(1)).toBe("1 quiz");
    expect(uiMessages.fil.questionCount(621)).toContain("621");
    expect(discoveryCopy.fil.resultsFor("matematika", 3)).toContain("matematika");
    expect(quizTitle("fil", quizzes.find((quiz) => quiz.slug === "brain-teaser")!)).toContain("Hamon sa Isip");
    expect(localizeMathPrompt("fil", "What is x? (decimal)")).not.toContain("What is x?");
  });

  it("passes every public page quality gate and publishes canonical, hreflang, and sitemap URLs", async () => {
    expect(await getListLocalizationQuality("fil")).toEqual({ complete: true, indexable: true });
    for (const quiz of quizzes.filter((item) => item.isPublic)) {
      expect((await getQuizLocalizationQuality("fil", quiz)).complete, quiz.slug).toBe(true);
    }
    const detail = await quizMetadata({ params: Promise.resolve({ locale: "fil", slug: "general-knowledge" }) });
    const list = await listMetadata({ params: Promise.resolve({ locale: "fil" }) });
    expect(detail.robots).toEqual({ index: true, follow: true });
    expect(detail.alternates?.canonical).toBe("/fil/quiz/general-knowledge");
    expect((detail.alternates?.languages as Record<string, string>).fil).toBe("/fil/quiz/general-knowledge");
    expect(list.alternates?.canonical).toBe("/fil/quiz");
    expect((list.alternates?.languages as Record<string, string>).fil).toBe("/fil/quiz");
    const xml = await (await GET()).text();
    expect(xml).toContain("https://www.woori.today/fil/quiz");
    expect(xml).toContain("https://www.woori.today/fil/quiz/general-knowledge");
    expect(xml).not.toContain("/bn/");
    expect(xml).not.toContain("/ar/");
  });
});
