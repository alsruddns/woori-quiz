import { getLoadedLocaleCatalog, isExpansionLocale } from "./locale-catalog";

export const locales = ["ko", "en", "ja", "zh", "es", "pt-br", "de", "fr", "vi", "id", "th", "zh-tw", "it", "nl", "hi", "ru", "tr", "pl", "fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"] as const;
export type Locale = (typeof locales)[number];
export const localeExpansionTargets = [...locales] as const;
export type TargetLocale = (typeof localeExpansionTargets)[number];
export type ExpansionLocale = Exclude<TargetLocale, (typeof publishedLocales)[number]>;
export const excludedExpansionLocales = ["ar", "ur", "fa", "he"] as const;
export const publishedLocales = [...locales] as const satisfies readonly Locale[];
export const localeNames: Record<Locale, string> = { ko:"한국어", en:"English", ja:"日本語", zh:"简体中文", es:"Español", "pt-br":"Português (Brasil)", de:"Deutsch", fr:"Français", vi:"Tiếng Việt", id:"Bahasa Indonesia", th:"ไทย", "zh-tw":"繁體中文", it:"Italiano", nl:"Nederlands", hi:"हिन्दी", ru:"Русский", tr:"Türkçe", pl:"Polski", fil:"Filipino", bn:"বাংলা", uk:"Українська", ms:"Bahasa Melayu", sv:"Svenska", cs:"Čeština", ro:"Română", el:"Ελληνικά" };

type MessageCopy = { title:string; subtitle:string; search:string; today:string; categories:string; popular:string; play:string; question:string; next:string; submit:string; result:string; retry:string; home:string; related:string; score:string; footer:string };
type DiscoveryCopy = { intro:string; quickStart:string; searchResults:string; browseCategories:string; clearSearch:string; resultsFor:(query:string,count:number)=>string };
type LocaleData = {
  messages: MessageCopy;
  ui: Record<string, string> & { quizCount:string; questionCount:string; quizSummary:string; category:Record<string,string>; difficultyLabels:Record<string,string> };
  detail: { correctCount:string; incorrectCount:string; newSet:string; otherQuizzes:string };
  discovery: { intro:string; quickStart:string; searchResults:string; browseCategories:string; clearSearch:string; resultsFor?:string; resultsForForms?:Record<string,string> };
  uiCountForms?: { quizCount:Record<string,string>; questionCount:Record<string,string> };
  uiSummary?: string;
};

function localeRecord<T>(read: (locale: Locale) => T): Record<Locale, T> {
  const record = {} as Record<Locale, T>;
  for (const locale of locales) Object.defineProperty(record, locale, { enumerable:true, get:() => read(locale) });
  return record;
}

export const messages = localeRecord((locale) => getLoadedLocaleCatalog(locale).messages as MessageCopy);
export function isLocale(value:string): value is Locale { return (locales as readonly string[]).includes(value); }
export function isPublishedLocale(value:string): value is (typeof publishedLocales)[number] { return (publishedLocales as readonly string[]).includes(value); }

function formatPolishCount(count: number, forms: readonly [string, string, string]): string {
  const value = Math.abs(count), lastTwo = value % 100, last = value % 10;
  const form = last === 1 && lastTwo !== 11 ? 0 : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14) ? 1 : 2;
  return `${count} ${forms[form]}`;
}

function formatRussianCount(count: number, noun: "викторина" | "вопрос"): string {
  const lastTwo = Math.abs(count) % 100, last = Math.abs(count) % 10;
  const form = lastTwo >= 11 && lastTwo <= 14 ? 2 : last === 1 ? 0 : last >= 2 && last <= 4 ? 1 : 2;
  const forms = noun === "викторина" ? ["викторина", "викторины", "викторин"] : ["вопрос", "вопроса", "вопросов"];
  return `${count} ${forms[form]}`;
}

function formatUkrainianQuizCount(count: number): string {
  const absolute = Math.abs(count), lastTwo = absolute % 100, last = absolute % 10;
  const noun = lastTwo >= 11 && lastTwo <= 14 ? "вікторин" : last === 1 ? "вікторина" : last >= 2 && last <= 4 ? "вікторини" : "вікторин";
  return `${count} ${noun}`;
}

function localeDiscovery(locale: Locale): DiscoveryCopy {
  const discovery = (getLoadedLocaleCatalog(locale) as unknown as LocaleData).discovery;
  if (!isExpansionLocale(locale)) {
    const plural = new Intl.PluralRules(locale);
    const forms = discovery.resultsForForms!;
    return { ...discovery, resultsFor:(query, count) => (forms[plural.select(count)] ?? forms.other).replace("COUNT_SLOT", String(count)).replace("QUERY_SLOT", query) };
  }
  const resultsFor = (query:string, count:number) => {
    if (locale === "ru") return discovery.resultsFor!.replace("QUERY_SLOT", query).replace("QUERY_COUNT", formatRussianCount(count, "викторина"));
    if (locale === "tr") return discovery.resultsFor!.replace("QUERY_SLOT", query).replace("QUERY_COUNT", `${count} sonuç`);
    if (locale === "pl") return `${formatPolishCount(count, ["quiz", "quizy", "quizów"])} dla „${query}”`;
    return (discovery.resultsFor ?? "COUNT_SLOT results for QUERY_SLOT").replace("COUNT_SLOT", String(count)).replace("QUERY_SLOT", query);
  };
  return { intro:discovery.intro, quickStart:discovery.quickStart, searchResults:discovery.searchResults, browseCategories:discovery.browseCategories, clearSearch:discovery.clearSearch, resultsFor };
}

export const discoveryCopy = localeRecord(locale => localeDiscovery(locale));
export const detailCopy = localeRecord(locale => getLoadedLocaleCatalog(locale).detail as LocaleData["detail"]);

export type UiMessages = {
  familySites:string; portal:string; calculator:string; tools:string; moneyBook:string; docs:string; quiz:string;
  language:string; openMenu:string; closeMenu:string; allQuizzes:string; freeToPlay:string; noAccount:string;
  heroEyebrow:string; heroTitle:string; heroDescription:string; nextChallenge:string; searchEmpty:string;
  quizCount:(count:number)=>string; questionCount:(count:number)=>string; questionSetReview:string;
  difficulty:string; startHeading:string; startDescription:string; correct:string; incorrect:string;
  accuracy:string; finishedIn:string; seconds:string; bestScore:string; reviewHeading:string; reviewDescription:string;
  howToPlay:string; howToDescription:string; aboutQuiz:string; faq:string; scoreUploadedQuestion:string;
  scoreUploadedAnswer:string; interactiveTest:string; localeCount:string; dynamicGeneration:string; back:string;
  footerTagline:string; privacy:string; guidelines:string; contact:string; copyright:string; searchLabel:string;
  category:Record<string,string>; difficultyLabels:Record<string,string>; quizSummary:(title:string)=>string;
};

function localeUi(locale: Locale): UiMessages {
  const catalog = getLoadedLocaleCatalog(locale) as unknown as LocaleData;
  const ui = catalog.ui;
  if (!isExpansionLocale(locale)) {
    const plural = new Intl.PluralRules(locale), countForms = catalog.uiCountForms!;
    const count = (key:"quizCount" | "questionCount", value:number) => {
      const forms = countForms[key];
      return (forms[plural.select(value)] ?? forms.other).replace("COUNT_SLOT", String(value));
    };
    return { ...ui, quizCount:value => count("quizCount", value), questionCount:value => count("questionCount", value), quizSummary:title => catalog.uiSummary!.replace("TITLE_SLOT", title) } as UiMessages;
  }
  const interpolate = (template:string, token:string, value:string) => template.replace(token, value);
  const count = (key:"quizCount" | "questionCount", value:number) => {
    if (locale === "ru") return formatRussianCount(value, key === "quizCount" ? "викторина" : "вопрос");
    if (locale === "pl") return formatPolishCount(value, key === "quizCount" ? ["quiz", "quizy", "quizów"] : ["pytanie", "pytania", "pytań"]);
    if (locale === "uk" && key === "quizCount") return formatUkrainianQuizCount(value);
    if (locale === "tr") return `${value} ${ui[key].replace("COUNT_SLOT", "").trim()}`;
    return interpolate(ui[key], "COUNT_SLOT", String(value));
  };
  return { ...ui, quizCount:value => count("quizCount", value), questionCount:value => count("questionCount", value), quizSummary:title => interpolate(ui.quizSummary, "TITLE_SLOT", title) } as UiMessages;
}

export const uiMessages = localeRecord(locale => localeUi(locale));
