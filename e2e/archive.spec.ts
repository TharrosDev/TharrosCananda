import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { allPublications } from "../src/data/publications";

// Derived from the records so adding a report never needs a test edit. The specimen is the stable fixture.
const everything = `${allPublications.length} ${allPublications.length === 1 ? "publication" : "publications"}`;
const specimenCard = (page: import("@playwright/test").Page) =>
  page.locator("article", { hasText: /Lorem ipsum dolor sit amet/ });

const search = (page: import("@playwright/test").Page) => page.getByRole("searchbox", { name: "Search the archive" });
/** Narrow screens fold the filters behind a "Filters" disclosure; wide screens always show them. */
const openFilters = async (page: import("@playwright/test").Page) => {
  const summary = page.locator(".archive-filters > summary");
  if (await summary.isVisible()) await summary.click();
};

test("full-text search finds words inside the PDF and highlights them", async ({ page }) => {
  await page.goto("/research");
  await search(page).fill("vestibulum");
  await expect(page).toHaveURL(/q=vestibulum/);
  await expect(page.locator(".archive-result-count").getByText("1 publication", { exact: true })).toBeVisible();
  await expect(page.locator("article mark").first()).toContainText(/vestibulum/i);
});

test("typos still find the report", async ({ page }) => {
  await page.goto("/research?q=lorme");
  await expect(page.getByRole("link", { name: /Lorem ipsum dolor sit amet/ })).toBeVisible();
});

test("area chips toggle a shareable filter", async ({ page }) => {
  await page.goto("/research");
  await openFilters(page);
  const chip = page.getByRole("group", { name: "Research area" }).getByRole("button", { name: /Trade & Economic Integration/ });
  await chip.click();
  await expect(page).toHaveURL(/area=trade-economic-integration/);
  await expect(chip).toHaveAttribute("aria-pressed", "true");
  await chip.click();
  await expect(page).not.toHaveURL(/area=/);
});

test("garbage URL parameters fall back to the full archive", async ({ page }) => {
  await page.goto("/research?area=nope&year=abc&sort=x");
  await expect(page.locator(".archive-result-count").getByText(everything, { exact: true })).toBeVisible();
});

test("no matches offers a way back", async ({ page }) => {
  await page.goto("/research?q=zzzzqqq");
  await expect(page.getByText("No publications match.")).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(page.locator(".archive-result-count").getByText(everything, { exact: true })).toBeVisible();
});

test("typing does not flood browser history", async ({ page }) => {
  await page.goto("/");
  await page.goto("/research");
  await search(page).pressSequentially("lorem", { delay: 60 });
  await expect(page).toHaveURL(/q=lorem/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
});

test("result actions cite with the stable reference", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/research");
  await specimenCard(page).getByText("Cite", { exact: true }).click();
  await specimenCard(page).getByRole("button", { name: "Copy citation" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("TC-EX-000");
});

test("archive with a query has no serious accessibility violations", async ({ page }) => {
  await page.goto("/research?q=lorem");
  await expect(page.locator("article").first()).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")).map((v) => v.id)).toEqual([]);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the archive list still links to the report", async ({ page }) => {
    await page.goto("/research");
    await expect(page.getByRole("link", { name: /Lorem ipsum dolor sit amet/ })).toBeVisible();
  });
});

test("pausing mid-phrase keeps the space and every keystroke", async ({ page }) => {
  await page.goto("/research");
  await search(page).pressSequentially("lorem ", { delay: 40 });
  await page.waitForTimeout(600);
  await search(page).pressSequentially("ipsum", { delay: 40 });
  await expect(search(page)).toHaveValue("lorem ipsum");
  await expect(page).toHaveURL(/q=lorem\+ipsum/);
});

test("the cite popover stays on screen on phones", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/research");
  const card = page.locator("article").first();
  await card.getByText("Cite", { exact: true }).click();
  const box = (await card.locator(".cite-popover-body").boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(360);
});

test("the specimen cover thumbnail is not indexable", async ({ page, request }) => {
  await page.goto("/research");
  const src = await specimenCard(page).locator(".archive-cover img").getAttribute("src");
  const response = await request.get(src!);
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
});

test("compact rows hide the summary, tags and actions, and the choice survives a reload", async ({ page }) => {
  await page.goto("/research");
  const card = specimenCard(page);
  await expect(card.locator(".archive-summary")).toBeVisible();
  await page.getByRole("group", { name: "List density" }).getByRole("button", { name: "Compact" }).click();
  for (const part of [".archive-summary", ".archive-tags", ".archive-card-actions"]) await expect(card.locator(part)).toBeHidden();
  await expect(card.getByRole("link", { name: /Lorem ipsum dolor sit amet/ })).toBeVisible();
  await page.reload();
  await expect(specimenCard(page).locator(".archive-summary")).toBeHidden();
  await page.getByRole("group", { name: "List density" }).getByRole("button", { name: "Expanded" }).click();
  await expect(specimenCard(page).locator(".archive-summary")).toBeVisible();
});

test("the record pane follows the selected result and links matches to their page", async ({ page, isMobile }) => {
  test.skip(isMobile, "The record pane is the wide-screen layout; phones open the record under each entry");
  await page.goto("/research?q=vestibulum");
  const pane = page.getByRole("complementary", { name: "Selected publication" });
  await expect(pane.getByRole("heading", { name: /Lorem ipsum dolor sit amet/ })).toBeVisible();
  const match = pane.getByRole("link", { name: /p\. \d/ }).first();
  await expect(match).toHaveAttribute("href", /\/research\/example-report#page=\d+&search=vestibulum/i);
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

test("phones fold the filters, and the record opens under its entry", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The narrow layout");
  await page.goto("/research");
  const areas = page.getByRole("group", { name: "Research area" });
  await expect(areas).toBeHidden();
  await openFilters(page);
  await expect(areas).toBeVisible();
  const card = specimenCard(page);
  await card.getByText("Record", { exact: true }).click();
  await expect(card.getByRole("link", { name: /p\. 1/ }).first()).toHaveAttribute("href", /#page=1$/);
});

test("a search match opens the report at its page with the word found", async ({ page }) => {
  await page.goto("/research/example-report#page=2&search=vestibulum");
  await expect(page.locator("[data-report-viewer]")).not.toHaveAttribute("data-loading", /.*/, { timeout: 15_000 });
  await expect(page.getByRole("searchbox", { name: "Find in report" })).toHaveValue("vestibulum");
  await expect(page.locator('.report-sheet[data-page="2"]')).toBeInViewport();
});

test("the not-found page searches the archive", async ({ page }) => {
  await page.goto("/this-page-does-not-exist");
  await page.getByLabel("Search the research").fill("lorem");
  await page.getByLabel("Search the research").press("Enter");
  await expect(page).toHaveURL(/\/research\?q=lorem/);
  await expect(page.getByRole("link", { name: /Lorem ipsum dolor sit amet/ }).first()).toBeVisible();
});
