import type { Locale } from "./i18n";

export const SITE_ORIGIN = "https://www.woori.today";

export function quizPath(locale: Locale, slug?: string): string {
  return `/${locale}/quiz${slug ? `/${slug}` : ""}`;
}

export function quizUrl(locale: Locale, slug?: string): string {
  return `${SITE_ORIGIN}${quizPath(locale, slug)}`;
}

export function quizAlternates(locales: readonly Locale[], slug?: string) {
  const languageTags: Record<Locale, string> = {
    ko: "ko", en: "en", ja: "ja", zh: "zh", es: "es", "pt-br": "pt-BR",
    de: "de", fr: "fr", vi: "vi", id: "id", th: "th", "zh-tw": "zh-TW",
    it: "it", nl: "nl", hi: "hi",
  };
  return Object.fromEntries([
    ...locales.map((locale) => [languageTags[locale], quizPath(locale, slug)]),
    ["x-default", quizPath("en", slug)],
  ]);
}
