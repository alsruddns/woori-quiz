"use client";

import { use } from "react";
import { hasLoadedLocaleCatalog, isExpansionLocale, loadLocaleCatalog } from "./locale-catalog";

export function useLocaleCatalog(locale: string): void {
  if (isExpansionLocale(locale) && !hasLoadedLocaleCatalog(locale)) use(loadLocaleCatalog(locale));
}
