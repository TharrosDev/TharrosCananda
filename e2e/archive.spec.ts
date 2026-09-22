import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const search = (page: import("@playwright/test").Page) => page.getByRole("searchbox", { name: "Search the archive" });

test("full-text search finds words inside the PDF and highlights them", async ({ page }) => {
  await page.goto("/research");
  await search(page).fill("vestibulum");
  await expect(page).toHaveURL(/q=vestibulum/);
  await expect(page.getByText("1 publication", { exact: true })).toBeVisible();
  await expect(page.locator("article mark").first()).toContainText(/vestibulum/i);
});

test("typos still find the report", async ({ page }) => {
  await page.goto("/research?q=lorme");
  await expect(page.getByRole("link", { name: /Lorem ipsum dolor sit amet/ })).toBeVisible();
});

test("area chips toggle a shareable filter", async ({ page }) => {
  await page.goto("/research");
  const chip = page.getByRole("group", { name: "Research area" }).getByRole("button", { name: /Trade & Economic Integration/ });
  await chip.click();
  await expect(page).toHaveURL(/area=trade-economic-integration/);
  await expect(chip).toHaveAttribute("aria-pressed", "true");
  await chip.click();
  await expect(page).not.toHaveURL(/area=/);
});

test("garbage URL parameters fall back to the full archive", async ({ page }) => {
  await page.goto("/research?area=nope&year=abc&sort=x");
  await expect(page.getByText("1 publication", { exact: true })).toBeVisible();
});

test("no matches offers a way back", async ({ page }) => {
  await page.goto("/research?q=zzzzqqq");
  await expect(page.getByText("No publications match.")).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(page.getByText("1 publication", { exact: true })).toBeVisible();
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
  await page.locator("article").first().getByText("Cite", { exact: true }).click();
  await page.getByRole("button", { name: "Copy citation" }).click();
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
