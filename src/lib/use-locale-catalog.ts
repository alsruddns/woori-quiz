"use client";

import { use } from "react";
import { isCatalogLocale, loadLocaleCatalog } from "./locale-catalog";

export function useLocaleCatalog(locale: string): void {
  if (isCatalogLocale(locale)) use(loadLocaleCatalog(locale));
}
