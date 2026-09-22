import { expect, test } from "@playwright/test";

// Key routes on desktop and mobile. Data comes from recorded fixtures; retrieval times and the year are masked.
const routes = [
  ["home", "/"],
  ["market-data", "/market-explorer"],
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
    await page.locator("[data-loading]").first().waitFor({ state: "detached", timeout: 15_000 }).catch(() => {});
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, mask: [page.locator("[data-volatile]")] });
  });
}
