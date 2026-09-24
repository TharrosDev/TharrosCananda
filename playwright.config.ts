import { defineConfig, devices } from "@playwright/test";

const port = 3100;

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  fullyParallel: true,
  // CI runners have 4 cores; Playwright's default would use only half of them.
  workers: process.env.CI ? 4 : undefined,
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
  // Production build with the intake webhook unset, so form submissions return 503 and the form offers a mailto link.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `npm run build && npx next start -p ${port} -H 127.0.0.1`,
        url: `http://127.0.0.1:${port}`,
        timeout: 240_000,
        reuseExistingServer: !process.env.CI,
        env: {
          NEXT_PUBLIC_SITE_URL: "https://tharros.ca",
          RESEARCH_INTAKE_WEBHOOK_URL: "",
          RESEARCH_INTAKE_WEBHOOK_SECRET: "",
        },
      },
});
