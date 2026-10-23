import { getLoadedLocaleCatalog, isExpansionLocale } from "./locale-catalog";
import type { Locale } from "./i18n";
import { uiMessages } from "./i18n";
import type { Quiz } from "./registry";
import { quizDescription } from "./content-copy";

type QuizCopyCatalog = {
  titleTermCount?: number;
  titleTerms?: string[];
  translatedQuizSlugs?: string[];
  quizTitles: Record<string,string>;
  quizDescriptions: Record<string,string>;
  quizSeo?: Record<string,{title:string;description:string}>;
  brainSeo?: {title:string;description:string};
  categoryLabels: Record<string,string>;
  mathPrompts?: { whatIsX:string; findX:string; decimal:string; percentage:string; fraction:string };
  mathPrompt?: { findX:string; decimal:string };
};

function catalog(locale:Locale):QuizCopyCatalog {
  return getLoadedLocaleCatalog(locale) as unknown as QuizCopyCatalog;
}

export const quizTitleWordCount=70;
export function quizTitleTranslationWordCount(locale:Locale):number {
  const data=catalog(locale);
  if(locale==="tr"||locale==="fil") return quizTitleWordCount;
  return data.titleTermCount ?? data.titleTerms?.length ?? quizTitleWordCount;
}

export function quizCategoryName(locale:Locale, category:string):string {
  return catalog(locale).categoryLabels[category] ?? uiMessages[locale].category[category] ?? category;
}

export function quizTitle(locale:Locale, quiz:Pick<Quiz,"slug"|"title">):string {
  return catalog(locale).quizTitles[quiz.slug] ?? quiz.title;
}

export function quizSeoCopy(locale:Locale, quiz:Quiz):{title:string;description:string} {
  const data=catalog(locale), stored=data.quizSeo?.[quiz.slug];
  if (stored) return stored;
  if (isExpansionLocale(locale) && quiz.slug==="brain-teaser" && data.brainSeo) return data.brainSeo;
  const title=quizTitle(locale,quiz);
  return { title:`${title} | woori.today`, description:data.quizDescriptions[quiz.slug] ?? quizDescription(locale,quiz,title) };
}

export function quizSummary(locale:Locale,title:string):string {
  return uiMessages[locale].quizSummary(title);
}

export function localizeMathPrompt(locale:Locale,prompt:string):string {
  const data=catalog(locale), templates=data.mathPrompts ?? {
    whatIsX:"What is x?", findX:data.mathPrompt?.findX ?? "Find x.", decimal:data.mathPrompt?.decimal ?? "decimal",
    percentage:"PERCENT_SLOT% of WHOLE_SLOT = ?",
    fraction:"FIRST_FRACTION_SLOT + SECOND_FRACTION_SLOT = ? (decimal)",
  };
  const percentage=prompt.match(/^(\d+(?:[.,]\d+)?)% of (\d+(?:[.,]\d+)?) = \?$/);
  if (percentage) return templates.percentage.replace("PERCENT_SLOT",percentage[1]).replace("WHOLE_SLOT",percentage[2]);
  const fraction=prompt.match(/^(\d+\/\d+) \+ (\d+\/\d+) = \? \(decimal\)$/);
  if (fraction) return templates.fraction.replace("FIRST_FRACTION_SLOT",fraction[1]).replace("SECOND_FRACTION_SLOT",fraction[2]);
  return prompt.replace("What is x?",templates.whatIsX).replace("Find x.",templates.findX).replace("(decimal)",`(${templates.decimal})`);
}

export function hasQuizTermTranslations(locale:Locale, slugs:readonly string[]):boolean {
  const data=catalog(locale);
  const available=new Set(data.translatedQuizSlugs ?? Object.keys(data.quizTitles));
  return slugs.every(slug=>available.has(slug));
}

export function missingQuizTitleWords(slugs:readonly string[]):string[] {
  const en=catalog("en"), available=new Set(en.translatedQuizSlugs ?? Object.keys(en.quizTitles));
  return [...new Set(slugs.filter(slug=>!available.has(slug)))];
}
