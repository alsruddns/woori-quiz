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

describe("Polish runtime and publication", () => {
  it("renders Polish list, quiz detail, interactive test, and locale selector", () => {
    const home = renderToStaticMarkup(createElement(HomeView, { locale: "pl" }));
    const detail = renderToStaticMarkup(createElement(QuizView, { locale: "pl", slug: "general-knowledge" }));
    const interactive = renderToStaticMarkup(createElement(InteractiveTest, { locale: "pl", slug: "reaction-time-test" }));
    expect(home).toContain("mobile-discovery-nav");
    expect(home).toMatch(/<option value="pl"[^>]*>Polski<\/option>/);
    expect(detail).toContain("Quiz wiedzy og\u00f3lnej");
    expect(interactive).toContain("Kliknij, gdy pole zmieni kolor na zielony");
    expect(interactive).toContain("Start");
    expect(localeNames.pl).toBe("Polski");
  });

  it("sets the document language from the published route locale", async () => {
    const markup = renderToStaticMarkup(await LocaleRootLayout({
      children: createElement("main", null, "quiz"),
      params: Promise.resolve({ locale: "pl" }),
    }));
    expect(markup).toContain('<html lang="pl">');
  });

  it("formats Polish counts, search feedback, title metadata, and generated math prompts", () => {
    expect(uiMessages.pl.quizCount(1)).toBe("1 quiz");
    expect(uiMessages.pl.quizCount(3)).toBe("3 quizy");
    expect(uiMessages.pl.quizCount(12)).toBe("12 quiz\u00f3w");
    expect(uiMessages.pl.questionCount(1)).toBe("1 pytanie");
    expect(uiMessages.pl.questionCount(4)).toBe("4 pytania");
    expect(uiMessages.pl.questionCount(15)).toBe("15 pyta\u0144");
    expect(discoveryCopy.pl.resultsFor("matematyka", 3)).toContain("matematyka");
    expect(quizTitle("pl", quizzes.find((quiz) => quiz.slug === "brain-teaser")!)).toContain("\u0141amig\u0142\u00f3wki");
    expect(localizeMathPrompt("pl", "What is x? (decimal)")).toBe("Rozwi\u0105\u017c r\u00f3wnanie dla x (liczba dziesi\u0119tna)");
  });

  it("passes every public page quality gate and publishes canonical, hreflang, and sitemap URLs", async () => {
    expect(await getListLocalizationQuality("pl")).toEqual({ complete: true, indexable: true });
    for (const quiz of quizzes.filter((item) => item.isPublic)) {
      expect((await getQuizLocalizationQuality("pl", quiz)).complete, quiz.slug).toBe(true);
    }
    const detail = await quizMetadata({ params: Promise.resolve({ locale: "pl", slug: "general-knowledge" }) });
    const list = await listMetadata({ params: Promise.resolve({ locale: "pl" }) });
    expect(detail.robots).toEqual({ index: true, follow: true });
    expect(detail.alternates?.canonical).toBe("/pl/quiz/general-knowledge");
    expect((detail.alternates?.languages as Record<string, string>).pl).toBe("/pl/quiz/general-knowledge");
    expect(list.alternates?.canonical).toBe("/pl/quiz");
    expect((list.alternates?.languages as Record<string, string>).pl).toBe("/pl/quiz");
    const xml = await (await GET()).text();
    expect(xml).toContain("https://www.woori.today/pl/quiz");
    expect(xml).toContain("https://www.woori.today/pl/quiz/general-knowledge");
  });
});
