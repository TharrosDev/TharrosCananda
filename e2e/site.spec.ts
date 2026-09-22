import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const paths = ["/", "/research-services", "/request-research", "/live-monitor", "/research/example-report"];
const viewports = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
  { width: 320, height: 720 },
];

for (const path of paths) {
  test(`${path} has no horizontal overflow at core breakpoints`, async ({ page }, testInfo) => {
    // The loop sets its own viewports, so one project covers it.
    test.skip(testInfo.project.name === "mobile");
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(path);
      const size = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(size.scroll, `${path} at ${viewport.width}px`).toBeLessThanOrEqual(size.client + 1);
    }
  });
}

test("commissioning reaches a complete review without forcing a product classification", async ({
  page,
}) => {
  await page.goto("/request-research");
  await page.getByLabel("Organization").fill("Example GmbH");
  await page.getByLabel("Country").fill("Germany");
  await page.getByLabel("Business email").fill("research@example.com");
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByLabel("Subject, product or sector").fill("Industrial components");
  await page.getByLabel("Enter the Canadian market").check();
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page.getByText("research@example.com")).toBeVisible();
  await expect(page.getByText("Industrial components")).toBeVisible();
  await expect(page.getByText("Research format to be suggested by Tharros")).toBeVisible();
  await page.getByRole("button", { name: "Edit" }).first().click();
  await expect(page.getByText("Who is the research for?")).toBeVisible();
});

test("commissioning prefills from the link that opened it", async ({ page }) => {
  await page.goto("/request-research?product=Maple%20syrup&hs=1702.20");
  await page.getByLabel("Organization").fill("Example GmbH");
  await page.getByLabel("Country").fill("Germany");
  await page.getByLabel("Business email").fill("research@example.com");
  await page.getByRole("button", { name: /continue/i }).click();
  await expect(page.getByLabel("Subject, product or sector")).toHaveValue("Maple syrup");
  await expect(page.getByLabel("HS code")).toHaveValue("1702.20");
});

test("Live Monitor navigation opens the route", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: /menu/i }).click();
  await page.getByRole("link", { name: "Live Monitor", exact: true }).first().click();
  await expect(page).toHaveURL(/\/live-monitor$/);
  await expect(page.getByRole("heading", { name: "Signals across the Atlantic." })).toBeVisible();
});

test("live monitor renders attributed Currents coverage and filters research areas", async ({
  page,
}) => {
  await page.goto("/live-monitor");
  await expect(page.getByRole("heading", { name: "Signals across the Atlantic." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Currents News API/i })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Canada and European firms deepen transatlantic trade links/i }),
  ).toBeVisible();
  await page.getByRole("button", { name: /^Defence\s+\d+$/ }).click();
  await expect(
    page.getByRole("link", { name: /Canadian and European defence suppliers expand cooperation/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Canada and European firms deepen transatlantic trade links/i }),
  ).toHaveCount(0);
  await page.getByLabel("Search coverage").fill("no-match-for-this-query");
  await expect(
    page.getByRole("heading", { name: "No developments match these filters." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(
    page.getByRole("link", { name: /Canada and European firms deepen transatlantic trade links/i }),
  ).toBeVisible();
});

test("retired Market Data surface is absent from navigation and routing", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Market Data", exact: true })).toHaveCount(0);
  const response = await page.goto("/market-explorer");
  expect(response?.status()).toBe(404);
});

test("nested research route keeps Research navigation state", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop navigation; mobile nav is behind the menu button");
  await page.goto("/research/not-a-real-publication");
  await expect(page.getByRole("link", { name: "Research", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

for (const path of ["/", "/research-services", "/request-research", "/live-monitor"]) {
  test(`${path} has no serious or critical automated accessibility violations`, async ({
    page,
  }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );
    expect(
      blocking.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.length,
      })),
    ).toEqual([]);
  });
}
