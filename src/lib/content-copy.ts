import { getLoadedLocaleCatalog } from "./locale-catalog";
import { locales, type Locale } from "./i18n";
import type { Category, Quiz } from "./registry";

type Guide = { categories:string; how:string; account:string; score:string; scoreLow:string; scoreMid:string; scoreHigh:string; scoreNote:string; focus:string };
type CopyCatalog = {
  categories?: Record<string,string>;
  categoryDescriptions?: Record<string,string>;
  serviceGuide: Guide;
  advertisement: string;
  difficulty: string;
  quizDescriptions: Record<string,string>;
};

function localeRecord<T>(read:(locale:Locale)=>T):Record<Locale,T> {
  const record = {} as Record<Locale,T>;
  for (const locale of locales) Object.defineProperty(record,locale,{enumerable:true,get:()=>read(locale)});
  return record;
}

function catalog(locale:Locale):CopyCatalog {
  return getLoadedLocaleCatalog(locale) as unknown as CopyCatalog;
}

export function categoryDescription(locale:Locale, category:Category):string {
  const data = catalog(locale);
  return (data.categoryDescriptions?.[category] ?? data.categories?.[category]) ?? "";
}

export const serviceGuide = localeRecord(locale=>catalog(locale).serviceGuide);

export function scoreFeedback(locale:Locale, correct:number, total:number):string {
  const accuracy=correct/Math.max(1,total), copy=serviceGuide[locale];
  return accuracy<0.5?copy.scoreLow:accuracy<0.8?copy.scoreMid:copy.scoreHigh;
}

export function quizDescription(locale:Locale, quiz:Quiz, title:string):string {
  return catalog(locale).quizDescriptions[quiz.slug] ?? `${title}: ${categoryDescription(locale,quiz.category)}`;
}

export const advertisementLabel=localeRecord(locale=>catalog(locale).advertisement);
export const anyDifficultyLabel=localeRecord(locale=>catalog(locale).difficulty);
