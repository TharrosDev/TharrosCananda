import { expect, test } from "@playwright/test";

// Key routes on desktop and mobile; the footer year is masked.
const routes = [
  ["home", "/"],
  ["services", "/research-services"],
  ["request", "/request-research"],
  ["about", "/about"],
  ["research", "/research"],
  ["example-report", "/research/example-report"],
  ["methodology", "/methodology"],
  ["not-found", "/this-page-does-not-exist"],
] as const;

// Baselines capture the settled, reduced-motion state (the map route fully drawn).
test.use({ reducedMotion: "reduce" });

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
