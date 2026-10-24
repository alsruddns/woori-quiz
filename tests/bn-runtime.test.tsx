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
import LocaleRootLayout from "../src/app/(localized)/[locale]/layout";
import { GET } from "../src/app/sitemap.xml/route";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("Bengali published runtime", () => {
  it("renders localized list, quiz detail, and interactive test copy", () => {
    const home = renderToStaticMarkup(createElement(HomeView, { locale: "bn" }));
    const detail = renderToStaticMarkup(createElement(QuizView, { locale: "bn", slug: "general-knowledge" }));
    const interactive = renderToStaticMarkup(createElement(InteractiveTest, { locale: "bn", slug: "reaction-time-test" }));
    expect(home).toContain("mobile-discovery-nav");
    expect(home).toContain("value=\"bn\"");
    expect(detail).toContain("সাধারণ জ্ঞান");
    expect(interactive).toContain("আরম্ভ");
    expect(localeNames.bn).toBe("বাংলা");
  });

  it("sets the document language from the published route locale", async () => {
    const markup = renderToStaticMarkup(await LocaleRootLayout({ children: createElement("main", null, "quiz"), params: Promise.resolve({ locale: "bn" }) }));
    expect(markup).toContain('<html lang="bn">');
  });

  it("formats counts, search feedback, translated titles, and generated math prompts", () => {
    expect(uiMessages.bn.quizCount(3)).toContain("3");
    expect(uiMessages.bn.questionCount(12)).toContain("12");
    expect(discoveryCopy.bn.resultsFor("গণিত", 4)).toContain("গণিত");
    expect(quizTitle("bn", quizzes.find((quiz) => quiz.slug === "brain-teaser")!)).toContain("মস্তিষ্ক");
    expect(localizeMathPrompt("bn", "What is x? (decimal)")).toContain("x-এর মান");
  });

  it("passes list and all public quiz content gates after publication", async () => {
    expect(await getListLocalizationQuality("bn")).toEqual({ complete: true, indexable: true });
    for (const quiz of quizzes.filter((item) => item.isPublic)) {
      expect((await getQuizLocalizationQuality("bn", quiz)).complete, quiz.slug).toBe(true);
    }
    const detail = await quizMetadata({ params: Promise.resolve({ locale: "bn", slug: "general-knowledge" }) });
    const list = await listMetadata({ params: Promise.resolve({ locale: "bn" }) });
    expect(detail.robots).toEqual({ index: true, follow: true });
    expect(detail.alternates?.canonical).toBe("/bn/quiz/general-knowledge");
    expect((detail.alternates?.languages as Record<string,string>).bn).toBe("/bn/quiz/general-knowledge");
    expect(list.alternates?.canonical).toBe("/bn/quiz");
    expect((list.alternates?.languages as Record<string,string>).bn).toBe("/bn/quiz");
    const xml = await (await GET()).text();
    expect(xml).toContain("https://www.woori.today/bn/quiz");
    expect(xml).toContain("https://www.woori.today/bn/quiz/general-knowledge");
    expect(xml).toContain("https://www.woori.today/uk/quiz");
    expect(xml).not.toContain("/ar/");
  }, 60000);
});
