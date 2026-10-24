import { beforeAll } from "vitest";
import { expansionLocales, legacyLocales, loadLocaleCatalog } from "@/lib/locale-catalog";

beforeAll(async () => {
  await Promise.all([...legacyLocales, ...expansionLocales].map((locale) => loadLocaleCatalog(locale)));
});
