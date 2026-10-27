import { defineConfig, devices } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT ?? "3005";
const baseURL = `http://127.0.0.1:${port}`;
const webServer = process.env.PLAYWRIGHT_EXTERNAL_URL ? undefined : {
  command: "pnpm start",
  url: `${baseURL}/en/quiz`,
  reuseExistingServer: !process.env.CI,
  timeout: 120_000,
  env: { PORT: port, HOSTNAME: "127.0.0.1" },
};

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.pw.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  timeout: 60_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: process.env.PLAYWRIGHT_EXTERNAL_URL ?? baseURL,
    ...devices["Desktop Chrome"],
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  ...(webServer ? { webServer } : {}),
});
