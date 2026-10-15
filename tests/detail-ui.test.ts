import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { QuizSidebar } from "../src/components/QuizSidebar";
import { detailCopy, locales } from "../src/lib/i18n";
import { readFileSync } from "node:fs";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

describe("shared quiz detail navigation", () => {
  it("renders search, desktop and mobile navigation, and the active category", () => {
    const html = renderToStaticMarkup(createElement(QuizSidebar, { locale: "ko", mode: "detail", activeCategory: "brain" }));
    expect(html).toContain('aria-label="퀴즈 검색"');
    expect(html).toContain('class="desktop-discovery-nav"');
    expect(html).toContain('class="mobile-discovery-nav"');
    expect(html).toContain('<details');
    expect(html).toContain('href="/ko/quiz?category=math"');
    expect(html).toContain('href="/ko/quiz?category=brain"');
    expect(html).toMatch(/aria-current="page" href="\/ko\/quiz\?category=brain"/);
  });

  it("keeps the discovery navigation and detail theme on shared indigo styles", () => {
    const css = readFileSync("src/app/discovery.css", "utf8");
    expect(css).toContain(".detail-content .button.primary{background:#4f46e5");
    expect(css).toContain(".detail-content .progress span{background:#6366f1}");
    expect(css).toContain(".detail-content .answer.selected{background:#eef2ff;border-color:#6366f1");
    expect(css).toContain(".detail-content .result-panel .result-stats");
  });

  it("provides result actions in all 15 locales", () => {
    for (const locale of locales) {
      expect(Object.values(detailCopy[locale]).every((value) => value.length > 0)).toBe(true);
    }
  });
});
