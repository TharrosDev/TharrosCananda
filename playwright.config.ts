import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const mockPort = 4010;

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  expect: { toHaveScreenshot: { animations: "disabled", caret: "hide", maxDiffPixelRatio: 0.002 } },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } },
    },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // Production build against controlled Currents responses: no live provider data in screenshots.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : [
        {
          command: `node e2e/mock-sources.mjs ${mockPort}`,
          url: `http://127.0.0.1:${mockPort}/health`,
          reuseExistingServer: !process.env.CI,
        },
        {
          command: `npm run build && npx next start -p ${port} -H 127.0.0.1`,
          url: `http://127.0.0.1:${port}`,
          timeout: 240_000,
          reuseExistingServer: !process.env.CI,
          env: {
            CURRENTS_API_BASE_URL: `http://127.0.0.1:${mockPort}`,
            CURRENTS_API_KEY: "playwright-test-key",
            NEXT_PUBLIC_SITE_URL: "https://tharros.ca",
            RESEARCH_INTAKE_WEBHOOK_URL: "",
            RESEARCH_INTAKE_WEBHOOK_SECRET: "",
          },
        },
      ],
});
