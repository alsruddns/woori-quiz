import { describe, expect, it } from "vitest";
import { GET } from "../src/app/sitemap.xml/route";
import { generateMetadata } from "../src/app/(localized)/[locale]/quiz/[slug]/page";
import { generateStaticParams as generateQuizParams } from "../src/app/(localized)/[locale]/quiz/[slug]/page";
import { generateMetadata as generateListMetadata } from "../src/app/(localized)/[locale]/quiz/page";
import { generateStaticParams as generateListParams } from "../src/app/(localized)/[locale]/quiz/page";
import { isLocale, isPublishedLocale, localeExpansionTargets, locales, publishedLocales } from "../src/lib/i18n";
import { quizzes } from "../src/lib/registry";
import { questionBank, questionCopyForLocale, questionCopyResultForLocale } from "../src/lib/question-bank";
import { quizDescription } from "../src/lib/content-copy";
import { quizCategoryName, quizTitle } from "../src/lib/quiz-copy";
import { getListLocalizationQuality, getLocalizationAudit, getQuestionLocalizationGaps, getQuizLocalizationQuality, getQuizQuestionPoolIds, LOCALIZATION_INDEX_THRESHOLD } from "../src/lib/localization-quality";

describe("localization quality index policy", () => {
  it("statically generates only fully published locale routes", () => {
    expect(generateListParams()).toEqual([{ locale: "ko" }, { locale: "en" }, { locale: "ja" }, { locale: "zh" }, { locale: "es" }, { locale: "pt-br" }, { locale: "de" }, { locale: "fr" }, { locale: "vi" }, { locale: "id" }, { locale: "th" }, { locale: "zh-tw" }, { locale: "it" }, { locale: "nl" }, { locale: "hi" }, { locale: "ru" }, { locale: "tr" }, { locale: "pl" }, { locale: "fil" }, { locale: "bn" }, { locale: "uk" }, { locale: "ms" }, { locale: "sv" }, { locale: "cs" }, { locale: "ro" }, { locale: "el" }]);
    const quizParams = generateQuizParams();
    expect(quizParams).toHaveLength(1508);
    expect(new Set(quizParams.map(({ locale }) => locale))).toEqual(new Set(["ko", "en", "ja", "zh", "es", "pt-br", "de", "fr", "vi", "id", "th", "zh-tw", "it", "nl", "hi", "ru", "tr", "pl", "fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"]));
  });

  it("uses the configured quality thresholds and always permits English", async () => {
    expect(LOCALIZATION_INDEX_THRESHOLD).toEqual({ questionRate: 1, choiceRate: 1, explanationRate: 1 });
    for (const quiz of quizzes.filter((item) => item.isPublic)) {
      const quality = await getQuizLocalizationQuality("en", quiz);
      expect(quality.complete, quiz.slug).toBe(true);
      expect(quality.indexable, quiz.slug).toBe(true);
      expect(quality.questionRate, quiz.slug).toBe(1);
      expect(quality.choiceRate, quiz.slug).toBe(1);
      expect(quality.explanationRate, quiz.slug).toBe(1);
    }
  }, 30000);

  it("confirms all Russian page content passes localization quality while publication remains gated", async () => {
    const quizzesToCheck = quizzes.filter((quiz) => quiz.isPublic);
    expect(await getListLocalizationQuality("ru")).toEqual({ complete: true, indexable: true });
    const results = await Promise.all(quizzesToCheck.map((quiz) => getQuizLocalizationQuality("ru", quiz)));
    expect(results.every((quality) => quality.complete)).toBe(true);
    expect(results.every((quality) => quality.indexable)).toBe(true);
  }, 30000);

  it("exposes fallback provenance without changing the existing copy helper output", () => {
    const missing = questionBank.find((question) => !question.localizations?.ko)!;
    const result = questionCopyResultForLocale(missing, "ko");
    expect(result.sourceLocale).toBe("en");
    expect(result.isFallback).toBe(true);
    expect(result.value).toEqual(questionCopyForLocale(missing, "ko"));
    const translated = questionBank.find((question) => question.localizations?.ko && question.localizations.ko.question !== question.question)!;
    expect(questionCopyResultForLocale(translated, "ko")).toMatchObject({ sourceLocale: "ko", questionIsFallback: false });
    expect(questionCopyResultForLocale(missing, "en")).toMatchObject({ sourceLocale: "en", isFallback: false });
  });

  it("keeps list locales only when their visible copy is localized", async () => {
    for (const locale of locales) {
      const result = await getListLocalizationQuality(locale);
      expect(result.indexable, locale).toBe(result.complete && publishedLocales.includes(locale as (typeof publishedLocales)[number]));
    }
  }, 60000);

  it("keeps every incomplete target outside routing until its catalog is connected", () => {
    const incompleteTargets = localeExpansionTargets.filter((locale) => !publishedLocales.includes(locale as (typeof publishedLocales)[number]));
    const routedLocales = generateListParams().map(({ locale }) => String(locale));
    for (const locale of incompleteTargets) {
      expect(publishedLocales, `${locale} must not be published`).not.toContain(locale);
      expect(isPublishedLocale(locale), `${locale} must not be published`).toBe(false);
      if (locale !== "ru" && locale !== "tr" && locale !== "pl" && locale !== "fil" && locale !== "bn" && locale !== "uk" && locale !== "ms" && locale !== "sv" && locale !== "cs" && locale !== "ro") expect(isLocale(locale), `${locale} must not have runtime locale data yet`).toBe(false);
      expect(routedLocales, `${locale} must not have a generated list route`).not.toContain(locale);
    }
  });

  it("filters sitemap detail URLs by the same page quality result", async () => {
    const response = await GET();
    const xml = await response.text();
    const urls = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url));
    for (const locale of localeExpansionTargets.filter((item) => !publishedLocales.includes(item as (typeof publishedLocales)[number]))) {
      expect(urls.has(`https://www.woori.today/${locale}/quiz`), `${locale} list page must stay out of the sitemap`).toBe(false);
      for (const quiz of quizzes.filter((item) => item.isPublic)) {
        expect(urls.has(`https://www.woori.today/${locale}/quiz/${quiz.slug}`), `${locale}/${quiz.slug} must stay out of the sitemap`).toBe(false);
      }
    }
    const expectedLists = (await Promise.all(locales.map(async (locale) => [locale, await getListLocalizationQuality(locale)] as const)))
      .filter(([, quality]) => quality.indexable).map(([locale]) => locale);
    for (const locale of expectedLists) expect(urls.has(`https://www.woori.today/${locale}/quiz`)).toBe(true);
    for (const locale of locales.filter((locale) => !expectedLists.includes(locale))) expect(urls.has(`https://www.woori.today/${locale}/quiz`)).toBe(false);
    for (const quiz of quizzes.filter((item) => item.isPublic)) {
      for (const locale of locales) {
        const expected = publishedLocales.includes(locale as (typeof publishedLocales)[number]) && (await getQuizLocalizationQuality(locale, quiz)).indexable;
        expect(urls.has(`https://www.woori.today/${locale}/quiz/${quiz.slug}`), `${locale}/${quiz.slug}`).toBe(expected);
      }
    }
    expect(urls.has("https://www.woori.today/en/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/ja/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/zh/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/es/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/pt-br/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/de/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/fr/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/vi/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/id/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/th/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/zh-tw/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/it/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/nl/quiz/general-knowledge")).toBe(true);
    expect(urls.has("https://www.woori.today/hi/quiz/general-knowledge")).toBe(true);
    expect(new Set(urls).size).toBe(urls.size);
  }, 60000);

  it("keeps self canonicals but excludes incomplete locales from robots and hreflang", async () => {
    for (const locale of ["en", "ko", "ja", "zh", "es", "pt-br", "de", "fr", "vi", "id", "th", "zh-tw", "it", "nl", "hi"] as const) {
      const metadata = await generateMetadata({ params: Promise.resolve({ locale, slug: "general-knowledge" }) });
      expect(metadata.alternates?.canonical).toBe(`/${locale}/quiz/general-knowledge`);
      const quality = await getQuizLocalizationQuality(locale, quizzes.find((quiz) => quiz.slug === "general-knowledge")!);
      expect(metadata.robots).toMatchObject({ index: quality.indexable, follow: true });
      const alternates = metadata.alternates?.languages as Record<string, string>;
      expect(alternates.en).toBe("/en/quiz/general-knowledge");
      const languageTag = locale === "pt-br" ? "pt-BR" : locale === "zh-tw" ? "zh-TW" : locale;
      expect(alternates[languageTag]).toBe(quality.indexable ? `/${locale}/quiz/general-knowledge` : undefined);
      expect(alternates["x-default"]).toBe("/en/quiz/general-knowledge");
    }
  }, 30000);

  it("keeps every incomplete target out of published hreflang", async () => {
    const metadata = await generateListMetadata({ params: Promise.resolve({ locale: "hi" }) });
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
    expect(metadata.alternates?.canonical).toBe("/hi/quiz");
    const languages = metadata.alternates?.languages as Record<string, string>;
    for (const locale of localeExpansionTargets.slice(locales.length)) {
      expect(languages[locale], `${locale} must not appear in hreflang`).toBeUndefined();
    }
    expect(languages.en).toBe("/en/quiz");
  });

  it("reports source fallback counts and index coverage for the audit document", async () => {
    const audit = await getLocalizationAudit();
    expect(audit.detailQuizCount).toBe(58);
    expect(audit.listPageCount).toBe(26);
    expect(audit.detailUrlCount).toBe(1508);
    expect(audit.sitemapUrlCount).toBe(1534);
    expect(audit.sitemapUrlCount).toBe(audit.listPageCount + audit.detailUrlCount);
    const sitemapResponse = await GET();
    const sitemapXml = await sitemapResponse.text();
    const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
    expect(sitemapUrls).toHaveLength(audit.sitemapUrlCount);
    expect(new Set(sitemapUrls).size).toBe(sitemapUrls.length);
    console.log("Localization indexing audit", JSON.stringify(audit));
    expect(audit.byLocale.en.indexableQuizCount).toBe(58);
    expect(audit.byLocale.en.noindexQuizCount).toBe(0);
    expect(audit.byLocale.ko.indexableQuizCount).toBe(58);
    expect(audit.byLocale.ko.noindexQuizCount).toBe(0);
    for (const locale of locales.filter((item) => !publishedLocales.includes(item as (typeof publishedLocales)[number]))) {
      expect(audit.byLocale[locale].indexableQuizCount, `${locale} must wait for complete question coverage`).toBe(0);
    }
    for (const locale of locales.filter((item) => item !== "en")) {
      expect(audit.byLocale[locale].indexableQuizCount).toBeGreaterThanOrEqual(0);
      expect(audit.byLocale[locale].noindexQuizCount + audit.byLocale[locale].indexableQuizCount).toBe(58);
    }
  }, 60000);

  it("has no unapproved Korean question, choice, or explanation fallbacks", async () => {
    const audit = await getLocalizationAudit();
    const gaps = await getQuestionLocalizationGaps("ko");
    expect(questionBank).toHaveLength(621);
    expect(gaps).toHaveLength(0);
    expect(audit.byLocale.ko.questionFallbacks).toBe(0);
    expect(audit.byLocale.ko.choiceFallbacks).toBe(0);
    expect(audit.byLocale.ko.explanationFallbacks).toBe(0);
    expect(audit.byLocale.ko.indexableQuizCount).toBe(58);
    expect(audit.byLocale.ko.noindexQuizCount).toBe(0);
  }, 60000);

  it("checks the 58 public quiz identities and records high-overlap bank candidates", async () => {
    const published = quizzes.filter((quiz) => quiz.isPublic);
    expect(published).toHaveLength(58);
    expect(new Set(published.map((quiz) => quiz.slug)).size).toBe(58);
    for (const locale of locales) {
      const titles = published.map((quiz) => quizTitle(locale, quiz).trim().toLocaleLowerCase());
      expect(new Set(titles).size, `duplicate titles in ${locale}`).toBe(58);
      const descriptions = published.map((quiz) => quizDescription(locale, quiz, quizTitle(locale, quiz)).trim().toLocaleLowerCase());
      expect(new Set(descriptions).size, `duplicate descriptions in ${locale}`).toBe(58);
      for (const quiz of published) {
        expect(quizTitle(locale, quiz), `${locale}/${quiz.slug} title`).not.toMatch(/^[a-z][a-z0-9_-]*(?:\.[a-z0-9_-]+)+$/i);
        expect(quizDescription(locale, quiz, quizTitle(locale, quiz)), `${locale}/${quiz.slug} description`).not.toMatch(/^[a-z][a-z0-9_-]*(?:\.[a-z0-9_-]+)+$/i);
        expect(quizCategoryName(locale, quiz.category), `${locale}/${quiz.category} category`).not.toMatch(/^[a-z][a-z0-9_-]*(?:\.[a-z0-9_-]+)+$/i);
      }
    }
    expect(new Set(questionBank.map((question) => question.question.trim().toLocaleLowerCase())).size).toBe(621);

    const bankQuizzes = published.filter((quiz) => quiz.mode === "bank");
    const pools = await Promise.all(bankQuizzes.map(async (quiz) => ({ quiz, ids: new Set(await getQuizQuestionPoolIds(quiz)) })));
    expect(pools.every(({ ids }) => ids.size > 0)).toBe(true);
    const overlaps: Array<{ first: string; second: string; shared: number; rate: number }> = [];
    for (let i = 0; i < pools.length; i++) for (let j = i + 1; j < pools.length; j++) {
      const shared = [...pools[i].ids].filter((id) => pools[j].ids.has(id)).length;
      const combined = new Set([...pools[i].ids, ...pools[j].ids]).size;
      const overlapRate = combined ? shared / combined : 0;
      if (overlapRate >= 0.8) overlaps.push({ first: pools[i].quiz.slug, second: pools[j].quiz.slug, shared, rate: Number(overlapRate.toFixed(2)) });
    }
    console.log("High question-pool overlap review candidates", JSON.stringify(overlaps));
  }, 30000);
});
