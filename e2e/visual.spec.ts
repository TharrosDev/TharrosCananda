import { expect, test } from "@playwright/test";

// Key routes on desktop and mobile. Live coverage comes from a controlled provider response; retrieval times and the year are masked.
const routes = [
  ["home", "/"],
  ["live-monitor", "/live-monitor"],
  ["services", "/research-services"],
  ["request", "/request-research"],
  ["about", "/about"],
  ["research", "/research"],
  ["example-report", "/research/example-report"],
  ["methodology", "/methodology"],
  ["not-found", "/this-page-does-not-exist"],
] as const;

for (const [name, path] of routes) {
  test(`visual: ${name}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("[data-loading]")).toHaveCount(0, { timeout: 15_000 });
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [page.locator("[data-volatile]")],
    });
  });
}
