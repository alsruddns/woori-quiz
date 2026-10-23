import { describe, expect, it } from "vitest";
import { categories, quizzes } from "../src/lib/registry";
import { locales } from "../src/lib/i18n";
import { getLoadedLocaleCatalog } from "../src/lib/locale-catalog";

type CatalogShape = {
  messages: Record<string,string>;
  ui: Record<string,unknown>;
  discovery: Record<string,unknown>;
  detail: Record<string,string>;
  serviceGuide: Record<string,string>;
  categoryLabels: Record<string,string>;
  categories?: Record<string,string>;
  categoryDescriptions?: Record<string,string>;
  quizTitles: Record<string,string>;
  quizDescriptions: Record<string,string>;
  quizSeo?: Record<string,Record<string,string>>;
  mathPrompts: Record<string,string>;
  interactiveTest: Record<string,unknown>;
};

describe("published locale catalogs",()=>{
  it("contain complete shared UI and content copy for every public quiz",()=>{
    const publicSlugs=quizzes.filter(quiz=>quiz.isPublic).map(quiz=>quiz.slug);
    for(const locale of locales) {
      const catalog=getLoadedLocaleCatalog(locale) as unknown as CatalogShape;
      expect(Object.values(catalog.messages).every(Boolean),`${locale} common messages`).toBe(true);
      expect(Object.values(catalog.detail).every(Boolean),`${locale} detail copy`).toBe(true);
      expect(Object.values(catalog.serviceGuide).every(Boolean),`${locale} guide copy`).toBe(true);
      const descriptions=catalog.categoryDescriptions??catalog.categories??{};
      for(const category of categories) {
        expect(catalog.categoryLabels[category],`${locale} category label ${category}`).toBeTruthy();
        expect(descriptions[category],`${locale} category description ${category}`).toBeTruthy();
      }
      for(const slug of publicSlugs) {
        expect(catalog.quizTitles[slug],`${locale} title ${slug}`).toBeTruthy();
        expect(catalog.quizDescriptions[slug],`${locale} description ${slug}`).toBeTruthy();
        if(catalog.quizSeo) expect(catalog.quizSeo[slug],`${locale} SEO ${slug}`).toBeTruthy();
      }
      expect(catalog.interactiveTest.copy,`${locale} interactive test UI`).toBeTruthy();
      expect(catalog.interactiveTest.passage,`${locale} interactive test passage`).toBeTruthy();
      expect(catalog.mathPrompts.whatIsX,`${locale} math prompt`).toBeTruthy();
    }
  });

  it("keeps all locale loaders keyed by the supported locale union",()=>{
    expect(locales).toHaveLength(26);
    expect(new Set(locales).size).toBe(26);
  });
});
