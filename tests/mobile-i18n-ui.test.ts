import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("mobile quiz navigation", () => {
  it("keeps locale and category navigation usable at narrow widths", () => {
    const discovery = readFileSync("src/app/discovery.css", "utf8");
    const navigation = readFileSync("src/app/navigation.css", "utf8");
    const narrowDiscovery = discovery.split(/\r?\n/).find((line) => line.startsWith("@media(max-width:620px)")) ?? "";
    const narrowHeader = navigation.slice(navigation.indexOf("@media(max-width:620px)"));

    expect(narrowDiscovery).toContain(".desktop-discovery-nav{display:none}");
    expect(narrowDiscovery).toContain(".mobile-discovery-nav{display:grid");
    expect(narrowDiscovery).toContain(".discovery-content .quiz-grid{grid-template-columns:1fr");
    expect(narrowHeader).toContain(".language{max-width:34vw");
    expect(navigation).toContain(".mobile-menu-button{display:grid}");
  });
});
