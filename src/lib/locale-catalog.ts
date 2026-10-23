export const expansionLocales = ["ru", "tr", "pl", "fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"] as const;
export type ExpansionLocale = (typeof expansionLocales)[number];
export const legacyLocales = ["ko", "en", "ja", "zh", "es", "pt-br", "de", "fr", "vi", "id", "th", "zh-tw", "it", "nl", "hi"] as const;
export type LegacyLocale = (typeof legacyLocales)[number];
export type CatalogLocale = ExpansionLocale | LegacyLocale;

type CatalogByLocale = {
  ko: typeof import("./i18n/legacy/ko.json");
  en: typeof import("./i18n/legacy/en.json");
  ja: typeof import("./i18n/legacy/ja.json");
  zh: typeof import("./i18n/legacy/zh.json");
  es: typeof import("./i18n/legacy/es.json");
  "pt-br": typeof import("./i18n/legacy/pt-br.json");
  de: typeof import("./i18n/legacy/de.json");
  fr: typeof import("./i18n/legacy/fr.json");
  vi: typeof import("./i18n/legacy/vi.json");
  id: typeof import("./i18n/legacy/id.json");
  th: typeof import("./i18n/legacy/th.json");
  "zh-tw": typeof import("./i18n/legacy/zh-tw.json");
  it: typeof import("./i18n/legacy/it.json");
  nl: typeof import("./i18n/legacy/nl.json");
  hi: typeof import("./i18n/legacy/hi.json");
  ru: typeof import("./i18n/ru.json");
  tr: typeof import("./i18n/tr.json");
  pl: typeof import("./i18n/pl.json");
  fil: typeof import("./i18n/fil.json");
  bn: typeof import("./i18n/bn.json");
  uk: typeof import("./i18n/uk.json");
  ms: typeof import("./i18n/ms.json");
  sv: typeof import("./i18n/sv.json");
  cs: typeof import("./i18n/cs.json");
  ro: typeof import("./i18n/ro.json");
  el: typeof import("./i18n/el.json");
};

const loaders = {
  ko: () => import("./i18n/legacy/ko.json").then((module) => module),
  en: () => import("./i18n/legacy/en.json").then((module) => module),
  ja: () => import("./i18n/legacy/ja.json").then((module) => module),
  zh: () => import("./i18n/legacy/zh.json").then((module) => module),
  es: () => import("./i18n/legacy/es.json").then((module) => module),
  "pt-br": () => import("./i18n/legacy/pt-br.json").then((module) => module),
  de: () => import("./i18n/legacy/de.json").then((module) => module),
  fr: () => import("./i18n/legacy/fr.json").then((module) => module),
  vi: () => import("./i18n/legacy/vi.json").then((module) => module),
  id: () => import("./i18n/legacy/id.json").then((module) => module),
  th: () => import("./i18n/legacy/th.json").then((module) => module),
  "zh-tw": () => import("./i18n/legacy/zh-tw.json").then((module) => module),
  it: () => import("./i18n/legacy/it.json").then((module) => module),
  nl: () => import("./i18n/legacy/nl.json").then((module) => module),
  hi: () => import("./i18n/legacy/hi.json").then((module) => module),
  ru: () => import("./i18n/ru.json").then((module) => module),
  tr: () => import("./i18n/tr.json").then((module) => module),
  pl: () => import("./i18n/pl.json").then((module) => module),
  fil: () => import("./i18n/fil.json").then((module) => module),
  bn: () => import("./i18n/bn.json").then((module) => module),
  uk: () => import("./i18n/uk.json").then((module) => module),
  ms: () => import("./i18n/ms.json").then((module) => module),
  sv: () => import("./i18n/sv.json").then((module) => module),
  cs: () => import("./i18n/cs.json").then((module) => module),
  ro: () => import("./i18n/ro.json").then((module) => module),
  el: () => import("./i18n/el.json").then((module) => module),
} satisfies { [Locale in CatalogLocale]: () => Promise<unknown> };

const catalogCache = new Map<CatalogLocale, unknown>();
type CatalogPromise = Promise<unknown> & { status?: "pending" | "fulfilled" | "rejected"; value?: unknown; reason?: unknown };
const catalogPromises = new Map<CatalogLocale, CatalogPromise>();

export function isExpansionLocale(locale: string): locale is ExpansionLocale {
  return (expansionLocales as readonly string[]).includes(locale);
}

export function isCatalogLocale(locale: string): locale is CatalogLocale {
  return (legacyLocales as readonly string[]).includes(locale) || isExpansionLocale(locale);
}

export function loadLocaleCatalog<Locale extends CatalogLocale>(locale: Locale): Promise<CatalogByLocale[Locale]> {
  const cached = catalogCache.get(locale);
  if (cached) return (catalogPromises.get(locale) ?? fulfilledCatalogPromise(cached)) as Promise<CatalogByLocale[Locale]>;
  let pending = catalogPromises.get(locale);
  if (!pending) {
    pending = loaders[locale]().then((catalog) => {
      catalogCache.set(locale, catalog);
      return catalog;
    }) as CatalogPromise;
    pending.status = "pending";
    pending.then(
      (catalog) => { pending!.status = "fulfilled"; pending!.value = catalog; },
      (reason: unknown) => { pending!.status = "rejected"; pending!.reason = reason; },
    );
    catalogPromises.set(locale, pending);
  }
  return pending as Promise<CatalogByLocale[Locale]>;
}

function fulfilledCatalogPromise(catalog: unknown): CatalogPromise {
  const fulfilled = Promise.resolve(catalog) as CatalogPromise;
  fulfilled.status = "fulfilled";
  fulfilled.value = catalog;
  return fulfilled;
}

export function getLoadedLocaleCatalog<Locale extends CatalogLocale>(locale: Locale): CatalogByLocale[Locale] {
  const catalog = catalogCache.get(locale);
  if (!catalog) throw new Error(`Locale catalog ${locale} has not been loaded`);
  return catalog as CatalogByLocale[Locale];
}

export function hasLoadedLocaleCatalog(locale: string): locale is CatalogLocale {
  return isCatalogLocale(locale) && catalogCache.has(locale);
}

export async function loadLocaleCatalogForServer(locale: string): Promise<void> {
  if (isCatalogLocale(locale)) {
    if (locale === "en") await loadLocaleCatalog("en");
    else await Promise.all([loadLocaleCatalog(locale), loadLocaleCatalog("en")]);
  }
}
