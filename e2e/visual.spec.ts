import { expect, test } from "@playwright/test";

// Key routes on desktop and mobile; the footer year is masked. Content that grows with every
// published report is hidden (home latest release and area counts, archive year chips) or filtered to the specimen
// (the archive query), so adding a report never needs new baselines. Functional specs cover that content.
const routes = [
  ["home", "/"],
  ["services", "/research-services"],
  ["request", "/request-research"],
  ["about", "/about"],
  ["research", "/research?q=vestibulum"],
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
    await page.addStyleTag({
      content:
        '.home-release, .home-field-count, .archive-chips[aria-label="Year"], .archive-group-label:has(+ .archive-chips[aria-label="Year"]) { display: none !important; }',
    });
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [page.locator("[data-volatile]")],
    });
  });
}
