export const expansionLocales = ["ru", "tr", "pl", "fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"] as const;
export type ExpansionLocale = (typeof expansionLocales)[number];
type CatalogByLocale = {
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

const loaders: { [Locale in ExpansionLocale]: () => Promise<CatalogByLocale[Locale]> } = {
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
};

const catalogCache = new Map<ExpansionLocale, CatalogByLocale[ExpansionLocale]>();
const catalogPromises = new Map<ExpansionLocale, Promise<CatalogByLocale[ExpansionLocale]>>();

export function isExpansionLocale(locale: string): locale is ExpansionLocale {
  return (expansionLocales as readonly string[]).includes(locale);
}

export function loadLocaleCatalog<Locale extends ExpansionLocale>(locale: Locale): Promise<CatalogByLocale[Locale]> {
  const cached = catalogCache.get(locale);
  if (cached) return (catalogPromises.get(locale) ?? Promise.resolve(cached)) as Promise<CatalogByLocale[Locale]>;
  let pending = catalogPromises.get(locale);
  if (!pending) {
    pending = loaders[locale]().then((catalog) => {
      catalogCache.set(locale, catalog);
      return catalog;
    });
    catalogPromises.set(locale, pending);
  }
  return pending as Promise<CatalogByLocale[Locale]>;
}

export function getLoadedLocaleCatalog<Locale extends ExpansionLocale>(locale: Locale): CatalogByLocale[Locale] {
  const catalog = catalogCache.get(locale);
  if (!catalog) throw new Error(`Locale catalog ${locale} has not been loaded`);
  return catalog as CatalogByLocale[Locale];
}

export function hasLoadedLocaleCatalog(locale: string): locale is ExpansionLocale {
  return isExpansionLocale(locale) && catalogCache.has(locale);
}

export async function loadLocaleCatalogForServer(locale: string): Promise<void> {
  if (isExpansionLocale(locale)) await loadLocaleCatalog(locale);
}
