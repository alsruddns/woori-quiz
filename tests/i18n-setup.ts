import { beforeAll } from "vitest";
import { expansionLocales, loadLocaleCatalog } from "@/lib/locale-catalog";

beforeAll(async () => {
  await Promise.all(expansionLocales.map((locale) => loadLocaleCatalog(locale)));
});
