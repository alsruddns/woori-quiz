import { describe, expect, it } from "vitest";
import { categories, quizzes } from "../src/lib/registry";
import { discoveryQuizzes, discoveryState } from "../src/lib/discovery";
import { discoveryCopy, locales } from "../src/lib/i18n";

describe("quiz discovery", () => {
  it("starts on the compact home and switches to a category at the top level", () => {
    expect(discoveryState("", categories).mode).toBe("home");
    expect(discoveryState("?category=general", categories)).toMatchObject({ mode: "category", category: "general" });
    const general = discoveryQuizzes(quizzes, "ko", "?category=general", categories);
    expect(general.length).toBeGreaterThan(0);
    expect(general.every((quiz) => quiz.category === "general" && quiz.isPublic)).toBe(true);
    expect(discoveryQuizzes(quizzes, "ko", "?category=math", categories).every((quiz) => quiz.category === "math")).toBe(true);
    expect(discoveryQuizzes(quizzes, "ko", "?category=brain", categories).every((quiz) => quiz.category === "brain")).toBe(true);
  });

  it("shows all public quizzes and searches localized title, category and tags", () => {
    const all = discoveryQuizzes(quizzes, "ko", "?category=all", categories);
    expect(all).toHaveLength(quizzes.filter((quiz) => quiz.isPublic).length);
    expect(all).toHaveLength(58);
    expect(discoveryState("?q=%EC%88%98%ED%95%99", categories).mode).toBe("search");
    expect(discoveryQuizzes(quizzes, "ko", "?q=%EC%88%98%ED%95%99", categories).length).toBeGreaterThan(0);
    expect(discoveryQuizzes(quizzes, "en", "?q=probability", categories).some((quiz) => quiz.slug === "probability-quiz")).toBe(true);
    expect(discoveryState("?category=math&q=", categories).mode).toBe("category");
  });

  it("provides discovery strings for every supported locale", () => {
    for (const locale of locales) {
      const copy = discoveryCopy[locale];
      expect([copy.intro, copy.quickStart, copy.searchResults, copy.browseCategories, copy.clearSearch].every((value) => value.length > 0)).toBe(true);
      expect(copy.resultsFor("test", 2)).toContain("2");
    }
  });
});
