import { expect, test } from "@playwright/test";
import { fixture, fixturePath, fixtureWord } from "./fixture";

// Key routes on desktop and mobile; the footer year is masked. Content that grows with every published report is
// hidden (home latest release and research year chips) or masked (research-area counts) or filtered to the fixture
// report (the archive query), so adding a report never needs new baselines. Functional specs cover that content.
const routes = [
  ["home", "/"],
  ["about", "/about"],
  ["research-areas", "/research-areas"],
  ["research", `/research?q=${fixtureWord.toLowerCase()}&area=${fixture.area}`],
  ["report", fixturePath],
  ["methodology", "/methodology"],
  ["not-found", "/this-page-does-not-exist"],
] as const;

// Baselines capture the static, reduced-motion state, with the full hero title and actions visible.
test.use({ reducedMotion: "reduce" });

for (const [name, path] of routes) {
  test(`visual: ${name}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("[data-loading]")).toHaveCount(0, { timeout: 15_000 });
    await page.addStyleTag({
      content:
        '.home-release, .archive-chips[aria-label="Year"], .archive-group-label:has(+ .archive-chips[aria-label="Year"]) { display: none !important; }',
    });
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [page.locator("[data-volatile]:visible")],
    });
  });
}
