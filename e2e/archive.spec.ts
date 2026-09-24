import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { publications } from "../src/data/publications";
import { researchAreas } from "../src/lib/research-areas";
import { fixture, fixturePath, fixtureWord } from "./fixture";

// Derived from the records so adding a report never needs a test edit. TC-2026-001 is the stable fixture.
const everything = `${publications.length} ${publications.length === 1 ? "publication" : "publications"}`;
const fixtureTitle = new RegExp(fixture.title.slice(0, 30)); // "Analytical Report: Traffic Co": no regex specials
const fixtureArea = researchAreas.find((area) => area.slug === fixture.area)!;
const fixtureCard = (page: import("@playwright/test").Page) =>
  page.locator("article", { hasText: fixture.reference });
const word = fixtureWord.toLowerCase();

const search = (page: import("@playwright/test").Page) =>
  page.getByRole("searchbox", { name: "Search the archive" });
/** Narrow screens fold the filters behind a "Filters" disclosure; wide screens always show them. */
const openFilters = async (page: import("@playwright/test").Page) => {
  const summary = page.locator(".archive-filters > summary");
  if (await summary.isVisible()) await summary.click();
};
/** Rows start compact; Expanded shows each entry's summary, tags, actions and inline record. */
const expand = (page: import("@playwright/test").Page) =>
  page
    .getByRole("group", { name: "List density" })
    .getByRole("button", { name: "Expanded" })
    .click();

test("full-text search finds words inside the PDF and highlights them", async ({ page }) => {
  await page.goto("/research");
  await search(page).fill(word);
  await expect(page).toHaveURL(new RegExp(`q=${word}`));
  await expect(fixtureCard(page)).toBeVisible();
  await expect(fixtureCard(page).locator("mark").first()).toContainText(new RegExp(word, "i"));
});

test("typos still find the report", async ({ page }) => {
  await page.goto("/research?q=colisions");
  await expect(page.getByRole("link", { name: fixtureTitle })).toBeVisible();
});

test("area chips toggle a shareable filter", async ({ page }) => {
  await page.goto("/research");
  await openFilters(page);
  const chip = page
    .getByRole("group", { name: "Research area" })
    .getByRole("button", { name: new RegExp(fixtureArea.name) });
  await chip.click();
  await expect(page).toHaveURL(new RegExp(`area=${fixtureArea.slug}`));
  await expect(chip).toHaveAttribute("aria-pressed", "true");
  await chip.click();
  await expect(page).not.toHaveURL(/area=/);
});

test("garbage URL parameters fall back to the full archive", async ({ page }) => {
  await page.goto("/research?area=nope&year=abc&sort=x");
  await expect(
    page.locator(".archive-result-count").getByText(everything, { exact: true }),
  ).toBeVisible();
});

test("no matches offers a way back", async ({ page }) => {
  await page.goto("/research?q=zzzzqqq");
  await expect(page.getByText("No publications match.")).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(
    page.locator(".archive-result-count").getByText(everything, { exact: true }),
  ).toBeVisible();
});

test("typing does not flood browser history", async ({ page }) => {
  await page.goto("/");
  await page.goto("/research");
  await search(page).pressSequentially("ottawa", { delay: 60 });
  await expect(page).toHaveURL(/q=ottawa/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test("result actions cite with the stable reference", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/research");
  await expand(page);
  await fixtureCard(page).getByText("Cite", { exact: true }).click();
  await fixtureCard(page).getByRole("button", { name: "Copy citation" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(fixture.reference);
});

test("archive with a query has no serious accessibility violations", async ({ page }) => {
  await page.goto("/research?q=ottawa");
  await expect(page.locator("article").first()).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations
      .filter((v) => ["serious", "critical"].includes(v.impact ?? ""))
      .map((v) => v.id),
  ).toEqual([]);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the archive list still links to the report", async ({ page }) => {
    await page.goto("/research");
    await expect(page.getByRole("link", { name: fixtureTitle })).toBeVisible();
  });
});

test("pausing mid-phrase keeps the space and every keystroke", async ({ page }) => {
  await page.goto("/research");
  await search(page).pressSequentially("traffic ", { delay: 40 });
  await page.waitForTimeout(600);
  await search(page).pressSequentially("collisions", { delay: 40 });
  await expect(search(page)).toHaveValue("traffic collisions");
  await expect(page).toHaveURL(/q=traffic\+collisions/);
});

test("the cite popover stays on screen on phones", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/research");
  await expand(page);
  const card = page.locator("article").first();
  await card.getByText("Cite", { exact: true }).click();
  const box = (await card.locator(".cite-popover-body").boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(360);
});

test("rows start compact, Expanded shows the summary, tags and actions, and the choice survives a reload", async ({
  page,
}) => {
  await page.goto("/research");
  const card = fixtureCard(page);
  for (const part of [".archive-summary", ".archive-tags", ".archive-card-actions"])
    await expect(card.locator(part)).toBeHidden();
  await expect(card.getByRole("link", { name: fixtureTitle })).toBeVisible();
  await expand(page);
  for (const part of [".archive-summary", ".archive-tags", ".archive-card-actions"])
    await expect(card.locator(part)).toBeVisible();
  await page.reload();
  await expect(fixtureCard(page).locator(".archive-summary")).toBeVisible();
  await page
    .getByRole("group", { name: "List density" })
    .getByRole("button", { name: "Compact" })
    .click();
  await expect(fixtureCard(page).locator(".archive-summary")).toBeHidden();
});

test("the record pane follows the selected result and links matches to their page", async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    "The record pane is the wide-screen layout; phones open the record under each entry",
  );
  await page.goto(`/research?q=${word}`);
  const pane = page.getByRole("complementary", { name: "Selected publication" });
  // The pane starts off; Preview opens it, and the choice survives a reload.
  await expect(pane).toHaveCount(0);
  await page.getByRole("button", { name: "Preview" }).click();
  await page.reload();
  await expect(pane.getByRole("heading", { name: fixtureTitle })).toBeVisible();
  const match = pane.getByRole("link", { name: /p\. \d/ }).first();
  await expect(match).toHaveAttribute(
    "href",
    new RegExp(`${fixturePath}#page=[0-9]+&search=${word}`, "i"),
  );
  await expect(pane.getByRole("heading", { name: "Sources" })).toBeVisible();
});

test("slash jumps to the search field", async ({ page, isMobile }) => {
  test.skip(isMobile, "A keyboard shortcut");
  await page.goto("/research");
  await page.locator("main h1").click();
  await page.keyboard.press("/");
  await expect(search(page)).toBeFocused();
  await expect(search(page)).toHaveValue("");
});

test("phones fold the filters, and the record opens under its entry", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "The narrow layout");
  await page.goto("/research");
  const areas = page.getByRole("group", { name: "Research area" });
  await expect(areas).toBeHidden();
  await openFilters(page);
  await expect(areas).toBeVisible();
  await expand(page);
  const card = fixtureCard(page);
  await card.getByText("Record", { exact: true }).click();
  await expect(card.getByRole("link", { name: /p\. 1/ }).first()).toHaveAttribute(
    "href",
    /#page=1$/,
  );
});

test("a search match opens the report at its page with the word found", async ({ page }) => {
  await page.goto(`${fixturePath}#page=3&search=${word}`);
  await expect(page.locator("[data-report-viewer]")).not.toHaveAttribute("data-loading", /.*/, {
    timeout: 15_000,
  });
  await expect(page.getByRole("searchbox", { name: "Find in report" })).toHaveValue(word);
  await expect(page.locator('.report-sheet[data-page="3"]')).toBeInViewport();
});

test("the not-found page searches the archive", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  await page.getByLabel("Search the research").fill("ottawa");
  await page.getByLabel("Search the research").press("Enter");
  await expect(page).toHaveURL(/\/research\?q=ottawa/);
  await expect(page.getByRole("link", { name: fixtureTitle }).first()).toBeVisible();
});
