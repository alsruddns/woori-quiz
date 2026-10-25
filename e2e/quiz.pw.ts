import { expect, test, type Page } from "@playwright/test";

const supportedLocales = ["ko", "en", "ja", "zh", "es", "pt-br", "de", "fr", "vi", "id", "th", "zh-tw", "it", "nl", "hi", "ru", "tr", "pl", "fil", "bn", "uk", "ms", "sv", "cs", "ro", "el"];
const codeLikeContinent = /^(?:002|005|021|142|150)$/u;

async function startBankQuiz(page: Page, count: number) {
  const start = page.locator(".start-panel > .button.primary");
  await expect(start).toBeVisible();
  await page.getByRole("button", { name: String(count), exact: true }).click();
  await start.click();
  await expect(page.getByRole("progressbar")).toBeVisible();
  await expect(page.locator(".answer-grid .answer")).toHaveCount(4);
}

async function answerAndAdvance(page: Page, options: { doubleClick?: boolean } = {}) {
  const choices = page.locator(".answer-grid .answer");
  const progress = page.getByRole("progressbar");
  const current = Number(await progress.getAttribute("aria-valuenow"));
  const total = Number(await progress.getAttribute("aria-valuemax"));
  const question = (await page.locator(".play-panel h2").textContent())?.trim() ?? "";

  if (options.doubleClick) {
    await choices.evaluateAll((buttons) => {
      (buttons[0] as HTMLButtonElement).click();
      (buttons[1] as HTMLButtonElement).click();
    });
  } else {
    await choices.first().click();
  }
  await expect(page.locator(".feedback[role=status]")).toBeVisible();
  const selected = page.locator(".answer.selected");
  const classes = (await selected.getAttribute("class")) ?? "";
  await page.clock.fastForward(850);

  if (current < total) {
    await expect(progress).toHaveAttribute("aria-valuenow", String(current + 1));
  } else {
    await expect(page.locator(".result-panel h2")).toContainText(`/ ${total}`);
  }
  return { question, correct: classes.includes("is-correct"), total };
}

async function completeRound(page: Page, requestedCount: number) {
  const questions = new Set<string>();
  let correct = 0;
  let actualCount = 0;
  for (let turn = 0; turn < requestedCount + 1; turn++) {
    if (!(await page.getByRole("progressbar").count())) break;
    const result = await answerAndAdvance(page);
    questions.add(result.question);
    actualCount = result.total;
    if (result.correct) correct++;
  }
  await expect(page.locator(".result-panel")).toBeVisible();
  return { questions, correct, actualCount };
}

test("category selection, 20-question session, feedback, review, and replay", async ({ page }) => {
  await page.clock.install({ time: new Date("2025-01-01T00:00:00Z") });
  await page.goto("/en/quiz");
  await expect(page.locator("main h1")).toBeVisible();
  await page.getByRole("button", { name: /General/i }).first().click();
  await expect(page).toHaveURL(/category=general/);
  await page.getByRole("link", { name: /General Knowledge Quiz/ }).first().click();
  await expect(page.locator(".count-select")).toBeVisible();
  await page.getByRole("button", { name: "20", exact: true }).click();
  await startBankQuiz(page, 20);
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "20");

  const first = await answerAndAdvance(page, { doubleClick: true });
  let correct = Number(first.correct);
  const questions = new Set([first.question]);
  for (let turn = 1; turn < 20; turn++) {
    const result = await answerAndAdvance(page);
    questions.add(result.question);
    correct += Number(result.correct);
  }

  await expect(page.locator(".result-panel")).toBeVisible();
  expect(questions.size).toBe(20);
  const stats = page.locator(".result-stats strong");
  await expect(stats.nth(0)).toHaveText("20");
  await expect(stats.nth(1)).toHaveText(String(correct));
  await expect(stats.nth(2)).toHaveText(String(20 - correct));
  await expect(stats.nth(3)).toHaveText(`${Math.round(correct / 20 * 100)}%`);
  if (correct < 20) {
    const review = page.locator(".question-review");
    await expect(review).toBeVisible();
    await expect(review.locator("li")).toHaveCount(20 - correct);
    await expect(review.locator("li").first()).toContainText(/Question\s+\d+/i);
    await expect(review.locator("li").first()).toContainText(/Incorrect|Correct/);
  }

  await page.locator(".result-actions .button.primary").click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "20");
});

test("10, 20, 30, 40, and 50 requested questions match actual unique question counts", async ({ page }) => {
  await page.clock.install({ time: new Date("2025-01-01T00:00:00Z") });
  await page.goto("/en/quiz/general-knowledge");
  await page.locator(".difficulty-select select").selectOption("all");

  let firstRun = true;
  for (const count of [10, 20, 30, 40, 50]) {
    if (!firstRun) await page.getByRole("button", { name: /Try new questions/i }).click();
    firstRun = false;
    await startBankQuiz(page, count);
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuemax", String(count));
    const result = await completeRound(page, count);
    expect(result.actualCount).toBe(count);
    expect(result.questions.size).toBe(count);
    await expect(page.locator(".result-stats strong").first()).toHaveText(String(count));
  }
});

test("limited pools explain the shortage and finish only the available unique questions", async ({ page }) => {
  await page.clock.install({ time: new Date("2025-01-01T00:00:00Z") });
  await page.goto("/en/quiz/world-geography");
  await page.locator(".difficulty-select select").selectOption("easy");
  await page.getByRole("button", { name: "50", exact: true }).click();
  const summary = page.locator(".pool-summary");
  await expect(summary).toBeVisible();
  const available = Number((await summary.textContent())?.match(/\d+/)?.[0]);
  expect(available).toBeGreaterThan(0);
  expect(available).toBeLessThan(50);

  await page.locator(".start-panel > .button.primary").click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuemax", String(available));
  const result = await completeRound(page, available);
  expect(result.actualCount).toBe(available);
  expect(result.questions.size).toBe(available);
  await expect(page.locator(".result-stats strong").first()).toHaveText(String(available));
});

test("Chinese geography never renders M.49 codes and numerical math answers stay numeric", async ({ page }) => {
  await page.clock.install({ time: new Date("2025-01-01T00:00:00Z") });
  for (const locale of ["zh", "zh-tw"]) {
    await page.goto(`/${locale}/quiz/world-geography`);
    await page.getByRole("button", { name: "50", exact: true }).click();
    await startBankQuiz(page, 50);
    for (let turn = 0; turn < 51 && await page.getByRole("progressbar").count(); turn++) {
      const question = (await page.locator(".play-panel h2").textContent()) ?? "";
      const copy = [question, ...(await page.locator(".answer-grid .answer").allTextContents())];
      expect(copy.filter((value) => codeLikeContinent.test(value.trim()))).toEqual([]);
      await answerAndAdvance(page);
    }
    await expect(page.locator(".result-panel")).toBeVisible();
  }

  await page.goto("/en/quiz/addition-quiz");
  await page.getByRole("button", { name: "10", exact: true }).click();
  await page.locator(".start-panel > .button.primary").click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "10");
  const numericOptions = await page.locator(".answer-grid .answer").allTextContents();
  expect(numericOptions.every((value) => /^[+-]?\d+(?:\.\d+)?$/u.test(value.trim()))).toBe(true);
});

test("keyboard answers advance, unmount clears the timer, and reduced motion is respected", async ({ page }) => {
  await page.clock.install({ time: new Date("2025-01-01T00:00:00Z") });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/quiz/general-knowledge");
  await startBankQuiz(page, 20);
  const firstChoice = page.locator(".answer-grid .answer").first();
  await firstChoice.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".feedback[role=status]")).toBeVisible();
  await page.clock.fastForward(850);
  await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
  const reducedMotion = await page.locator(".progress span").evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(reducedMotion).toBe("0s");

  await page.locator(".answer-grid .answer").first().click();
  await expect(page.locator(".feedback[role=status]")).toBeVisible();
  await page.goto("/en/quiz");
  await page.clock.fastForward(2_000);
  await expect(page).toHaveURL(/\/en\/quiz$/);
  await expect(page.locator("main h1")).toBeVisible();
});

test("mobile and desktop result layouts stay within the viewport", async ({ page }) => {
  await page.clock.install({ time: new Date("2025-01-01T00:00:00Z") });
  await page.goto("/en/quiz/general-knowledge");
  await startBankQuiz(page, 20);
  await completeRound(page, 20);

  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      result: document.querySelector(".result-panel")?.getBoundingClientRect().right ?? 0,
    }));
    expect(dimensions.document, `${width}px horizontal overflow`).toBeLessThanOrEqual(dimensions.viewport + 1);
    expect(dimensions.result, `${width}px result panel overflow`).toBeLessThanOrEqual(width + 1);
    await expect(page.locator(".result-panel")).toBeVisible();
  }
});

test("all 26 locale routes render and SEO metadata and sitemap remain locale-first", async ({ page, request }) => {
  for (const locale of supportedLocales) {
    for (const suffix of ["", "/world-geography"]) {
      const response = await request.get(`/${locale}/quiz${suffix}`);
      expect(response.status(), `${locale}/quiz${suffix}`).toBe(200);
      const html = await response.text();
      expect(html, `${locale}/quiz${suffix}`).toMatch(/<h1[\s>]/u);
      expect(html, `${locale}/quiz${suffix}`).toContain(`/${locale}/quiz`);
    }
  }

  for (const locale of ["ko", "en", "ja", "zh", "zh-tw"]) {
    await page.goto(`/${locale}/quiz`);
    await expect(page.locator("main h1"), locale).toBeVisible();
    await expect(page.locator('link[rel="canonical"]'), locale).toHaveAttribute("href", new RegExp(`/${locale}/quiz$`, "u"));
  }

  await page.goto("/zh-tw/quiz/world-geography");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(new URL(canonical!, page.url()).pathname).toBe("/zh-tw/quiz/world-geography");
  const languages = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((nodes) =>
    Object.fromEntries(nodes.map((node) => [(node as HTMLLinkElement).hreflang, (node as HTMLLinkElement).href])),
  );
  expect(languages["zh-TW"]).toContain("/zh-tw/quiz/world-geography");
  expect(languages["x-default"]).toContain("/en/quiz/world-geography");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", /zh-tw\/quiz\/world-geography/u);
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content", /noindex/u);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const locale of supportedLocales) expect(xml).toContain(`https://www.woori.today/${locale}/quiz`);
  expect(xml).toContain("https://www.woori.today/zh-tw/quiz/world-geography");
  expect(new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)].map(([, url]) => url)).size).toBe([...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)].length);
});
