import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { HomeView } from "../src/components/HomeView";
import { InteractiveTest } from "../src/components/InteractiveTest";
import { QuizView } from "../src/components/QuizView";
import { generateMetadata as quizMetadata } from "../src/app/[locale]/quiz/[slug]/page";
import { generateMetadata as listMetadata } from "../src/app/[locale]/quiz/page";
import { discoveryCopy, isLocale, isPublishedLocale, publishedLocales, uiMessages } from "../src/lib/i18n";
import { quizzes } from "../src/lib/registry";
import { localizeMathPrompt } from "../src/lib/quiz-copy";
import { getListLocalizationQuality, getQuizLocalizationQuality } from "../src/lib/localization-quality";
import { GET } from "../src/app/sitemap.xml/route";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Turkish runtime and publication", () => {
  it("renders the list, quiz detail, interactive test, and language switcher in Turkish", () => {
    const home = renderToStaticMarkup(createElement(HomeView, { locale: "tr" }));
    const detail = renderToStaticMarkup(createElement(QuizView, { locale: "tr", slug: "general-knowledge" }));
    const interactive = renderToStaticMarkup(createElement(InteractiveTest, { locale: "tr", slug: "click-speed-test" }));
    expect(home).toContain("Sınav ve testler");
    expect(home).toContain("mobile-discovery-nav");
    expect(home).toMatch(/<option value="tr"[^>]*>Türkçe<\/option>/);
    expect(detail).toContain("Genel kültür");
    expect(interactive).toContain("Gördüklerinizi hatırlayın");
    expect(interactive).toContain("Başla");
    expect(isLocale("tr")).toBe(true);
    expect(isPublishedLocale("tr")).toBe(true);
    expect(publishedLocales).toContain("tr");
  });

  it("formats Turkish counts, search feedback, and generated math prompts", () => {
    expect(uiMessages.tr.quizCount(10)).toBe("10 quiz");
    expect(uiMessages.tr.questionCount(10)).toBe("10 soru");
    expect(discoveryCopy.tr.resultsFor("matematik", 3)).toBe("matematik araması: 3 sonuç");
    expect(localizeMathPrompt("tr", "20% of 50 = ?")).toBe("50 sayısının %20'i kaçtır?");
    expect(localizeMathPrompt("tr", "What is x? (decimal)")).toBe("x değerini bulun. (ondalık)");
  });

  it("passes every public page quality gate and publishes canonical, hreflang, and sitemap URLs", async () => {
    expect(await getListLocalizationQuality("tr")).toEqual({ complete: true, indexable: true });
    for (const quiz of quizzes.filter((item) => item.isPublic)) {
      expect((await getQuizLocalizationQuality("tr", quiz)).complete, quiz.slug).toBe(true);
    }
    const detail = await quizMetadata({ params: Promise.resolve({ locale: "tr", slug: "general-knowledge" }) });
    const list = await listMetadata({ params: Promise.resolve({ locale: "tr" }) });
    expect(detail.robots).toEqual({ index: true, follow: true });
    expect(detail.alternates?.canonical).toBe("/tr/quiz/general-knowledge");
    expect((detail.alternates?.languages as Record<string, string>).tr).toBe("/tr/quiz/general-knowledge");
    expect(list.alternates?.canonical).toBe("/tr/quiz");
    expect((list.alternates?.languages as Record<string, string>).tr).toBe("/tr/quiz");
    const xml = await (await GET()).text();
    expect(xml).toContain("https://www.woori.today/tr/quiz");
    expect(xml).toContain("https://www.woori.today/tr/quiz/general-knowledge");
  });
});
