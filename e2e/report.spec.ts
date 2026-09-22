import { expect, test } from "@playwright/test";

test("print surface exposes report metadata and stays out of search", async ({ page }) => {
  await page.goto("/research/example-report/print");
  await expect(page.locator('meta[name="report-reference"]')).toHaveAttribute("content", "TC-EX-000");
  await expect(page.locator('meta[name="report-sha"]')).toHaveAttribute("content", /^[0-9a-f]{16}$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
});
