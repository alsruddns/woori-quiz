import type { Locale } from "./i18n";

export const SITE_ORIGIN = "https://www.woori.today";

export function quizPath(locale: Locale, slug?: string): string {
  return `/${locale}/quiz${slug ? `/${slug}` : ""}`;
}

export function quizUrl(locale: Locale, slug?: string): string {
  return `${SITE_ORIGIN}${quizPath(locale, slug)}`;
}

export function familyServiceUrl(locale: Locale, service: "docs" | "quiz"): string {
  return `${SITE_ORIGIN}/${locale}/${service}`;
}

export function quizPathForLocale(currentPath: string, locale: Locale): string {
  const segments = currentPath.split("/").filter(Boolean);
  return quizPath(locale, segments[1] === "quiz" ? segments.slice(2).join("/") || undefined : undefined);
}

export function quizAlternates(locales: readonly Locale[], slug?: string) {
  const languageTags: Record<Locale, string> = {
    ko: "ko", en: "en", ja: "ja", zh: "zh", es: "es", "pt-br": "pt-BR",
    de: "de", fr: "fr", vi: "vi", id: "id", th: "th", "zh-tw": "zh-TW",
    it: "it", nl: "nl", hi: "hi", ru: "ru", tr: "tr", pl: "pl", fil: "fil", bn: "bn", uk: "uk", ms: "ms",
  };
  return Object.fromEntries([
    ...locales.map((locale) => [languageTags[locale], quizPath(locale, slug)]),
    ["x-default", quizPath("en", slug)],
  ]);
}
