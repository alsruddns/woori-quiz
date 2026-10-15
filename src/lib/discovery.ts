import type { Locale } from "./i18n";
import type { Category, Quiz } from "./registry";
import { quizCategoryName, quizSummary, quizTitle } from "./quiz-copy";

export type DiscoveryMode = "home" | "all" | "category" | "search";

export function discoveryState(search: string, categories: readonly Category[]): { mode: DiscoveryMode; category: Category | null; query: string } {
  const params = new URLSearchParams(search);
  const query = params.get("q") ?? "";
  const value = params.get("category");
  const category = categories.find((item) => item === value) ?? null;
  return { mode: query.trim() ? "search" : category ? "category" : value === "all" ? "all" : "home", category, query };
}

export function discoveryQuizzes(items: readonly Quiz[], locale: Locale, search: string, categories: readonly Category[]): Quiz[] {
  const { mode, category, query } = discoveryState(search, categories);
  const needle = query.trim().toLocaleLowerCase(locale);
  return items.filter((quiz) => {
    if (!quiz.isPublic) return false;
    if (mode === "category") return quiz.category === category;
    if (mode !== "search") return true;
    const title = quizTitle(locale, quiz);
    const haystack = [title, quiz.title, quizSummary(locale, title), quiz.summary,
      quizCategoryName(locale, quiz.category), ...quiz.tags]
      .join(" ").toLocaleLowerCase(locale);
    return haystack.includes(needle);
  });
}
