import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const workspace = (page: Page) => page.locator(".monitor-workspace");
const topics = (page: Page) => page.getByRole("group", { name: "Research areas" });

test("compact view groups by day and is remembered", async ({ page }) => {
  await page.goto("/live-monitor");
  await page.getByRole("group", { name: "View" }).getByRole("button", { name: "Compact" }).click();
  await expect(page).toHaveURL(/view=compact/);
  await expect(workspace(page).getByRole("heading", { level: 3, name: "Today" })).toBeVisible();
  await expect(workspace(page).locator(".monitor-day")).toHaveCount(2);
  await page.goto("/live-monitor");
  await expect(page.getByRole("group", { name: "View" }).getByRole("button", { name: "Compact" })).toHaveAttribute("aria-pressed", "true");
});

test("a shared URL opens the filtered compact view", async ({ page }) => {
  await page.goto("/live-monitor?view=compact&topics=defence-security");
  await expect(workspace(page).locator(".monitor-row")).toHaveCount(1);
  await expect(workspace(page).locator(".monitor-row")).toContainText("defence suppliers");
});

test("topics are multi-select and show their union", async ({ page }) => {
  await page.goto("/live-monitor?view=compact");
  await topics(page).getByRole("button", { name: /^Trade/ }).click();
  await topics(page).getByRole("button", { name: /^Defence/ }).click();
  await expect(page).toHaveURL(/topics=trade-economy%2Cdefence-security|topics=trade-economy,defence-security/);
  // Trade (3 stories) + Defence (1): the union is 4.
  await expect(workspace(page).locator(".monitor-row")).toHaveCount(4);
});

test("the source filter narrows results", async ({ page }) => {
  await page.goto("/live-monitor?view=compact");
  await page.getByText(/^Sources \(\d+\)$/).click();
  await page.getByRole("checkbox", { name: /example-defence\.eu/ }).check();
  await expect(workspace(page).locator(".monitor-row")).toHaveCount(1);
});

test("search terms are highlighted", async ({ page }) => {
  await page.goto("/live-monitor");
  await page.getByRole("searchbox").fill("minerals");
  await expect(workspace(page).locator("mark").first()).toHaveText(/minerals/i);
});

test("commission research on a story prefills the request form", async ({ page }) => {
  await page.goto("/live-monitor?view=compact&topics=technology-strategic");
  const row = workspace(page).locator(".monitor-row").first();
  await row.locator(".monitor-actions > summary").click();
  const commission = row.getByRole("link", { name: "Commission research on this" });
  await expect(commission).toHaveAttribute("href", /\/request-research\?context=/);
  await commission.click();
  // The form moves the prefill into its draft and drops it from the address, so a reload keeps edits.
  await expect(page).toHaveURL(/\/request-research$/);
  await page.getByLabel("Organization").fill("Example GmbH");
  await page.getByLabel("Country").fill("Germany");
  await page.getByLabel("Business email").fill("research@example.com");
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByLabel("Subject, product or sector").fill("Technology");
  await page.getByLabel("Enter the Canadian market").check();
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page.getByLabel("Additional context")).toHaveValue(/strategic technology cooperation/);
});

test("cite this article copies a news citation", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/live-monitor?view=compact&topics=defence-security");
  const row = workspace(page).locator(".monitor-row").first();
  await row.locator(".monitor-actions > summary").click();
  await row.getByText("Cite this article").click();
  await row.getByRole("button", { name: "Copy citation" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("example-defence.eu");
  expect(copied).toContain("Canadian and European defence suppliers expand cooperation");
});

test("coverage context explains the numbers", async ({ page }) => {
  await page.goto("/live-monitor");
  const panel = page.getByRole("complementary", { name: "Coverage context" });
  await expect(panel).toContainText("Up to 20 stories per refresh; counts are indicative, not market statistics.");
  await expect(panel.getByRole("table")).toHaveCount(1);
});

for (const view of ["editorial", "compact"]) {
  test(`${view} view has no serious accessibility violations`, async ({ page }) => {
    await page.goto(`/live-monitor?view=${view}`);
    await expect(workspace(page)).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? "")).map((v) => v.id)).toEqual([]);
  });
}

test("a returning compact reader keeps New tags and shared source filters", async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem("seeded")) {
      localStorage.setItem("tharros.monitor.view", "compact");
      localStorage.setItem("tharros.monitor.lastVisit", String(Date.now() - 150 * 60 * 1000));
      sessionStorage.setItem("seeded", "1");
    }
  });
  await page.goto("/live-monitor?sources=example-trade.eu");
  await expect(page).toHaveURL(/view=compact/);
  await expect(page).toHaveURL(/sources=example-trade\.eu/);
  await expect(workspace(page).locator(".monitor-new")).toHaveCount(1);
  await page.getByRole("group", { name: "View" }).getByRole("button", { name: "Editorial" }).click();
  await expect(workspace(page).locator(".monitor-new")).toHaveCount(1);
});

test("action menus stay on screen, keep their links readable and close on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/live-monitor");
  const lead = workspace(page).locator(".monitor-lead");
  await lead.locator(".monitor-actions > summary").click();
  const menu = lead.locator(".monitor-actions-menu");
  const box = (await menu.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(390);
  const link = menu.getByRole("link", { name: "Commission research on this" });
  expect((await link.boundingBox())!.width).toBeGreaterThan(150);
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(lead.locator(".monitor-actions > summary")).toBeFocused();
});

test("read at source keeps a full-size target", async ({ page }) => {
  await page.goto("/live-monitor");
  const read = workspace(page).locator(".monitor-lead").getByRole("link", { name: /Read at source/ });
  expect((await read.boundingBox())!.height).toBeGreaterThanOrEqual(44);
});
