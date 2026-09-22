import { expect, test } from "@playwright/test";

test("print surface exposes report metadata and stays out of search", async ({ page }) => {
  await page.goto("/research/example-report/print");
  await expect(page.locator('meta[name="report-reference"]')).toHaveAttribute("content", "TC-EX-000");
  await expect(page.locator('meta[name="report-sha"]')).toHaveAttribute("content", /^[0-9a-f]{16}$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
});

test("viewer draws every PDF page as a sheet with selectable text", async ({ page }) => {
  await page.goto("/research/example-report");
  const viewer = page.locator("[data-report-viewer]");
  await expect(viewer).not.toHaveAttribute("data-loading", /.*/, { timeout: 15_000 });
  await expect(viewer.locator(".report-sheet")).toHaveCount(3);
  await expect(viewer.locator('.report-sheet[data-page="1"] .textLayer')).toContainText("Lorem ipsum");
});

test("page input jumps and zoom changes sheet width", async ({ page }) => {
  await page.goto("/research/example-report");
  const viewer = page.locator("[data-report-viewer]");
  await expect(viewer).not.toHaveAttribute("data-loading", /.*/, { timeout: 15_000 });
  await page.getByLabel("Page", { exact: true }).fill("3");
  await page.getByLabel("Page", { exact: true }).press("Enter");
  await expect(viewer.locator('.report-sheet[data-page="3"]')).toBeInViewport();
  const before = (await viewer.locator(".report-sheet").first().boundingBox())!.width;
  await page.getByRole("button", { name: "Zoom out" }).click();
  await expect.poll(async () => (await viewer.locator(".report-sheet").first().boundingBox())!.width).toBeLessThan(before);
});

test("viewer fails closed with a download link when the PDF cannot load", async ({ page }) => {
  await page.route("**/research/TC-EX-000.pdf", (route) => route.abort());
  await page.goto("/research/example-report");
  await expect(page.getByText("The PDF could not be displayed.")).toBeVisible({ timeout: 15_000 });
  await expect(page.locator("[data-report-viewer]").getByRole("link", { name: /Download PDF/ }).first()).toHaveAttribute("href", "/research/TC-EX-000.pdf");
});

test("example report is labelled, noindex and has no Scholar tags", async ({ page }) => {
  await page.goto("/research/example-report");
  await expect(page.getByRole("note")).toContainText("Example layout");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('meta[name^="citation_"]')).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
  await expect(page.getByText("TC-EX-000").first()).toBeVisible();
});

test("download serves a real PDF", async ({ request }) => {
  const response = await request.get("/research/TC-EX-000.pdf");
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("cite popover copies an APA citation with the stable reference URL", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/research/example-report");
  await page.getByText("Cite", { exact: true }).click();
  await page.getByRole("button", { name: "Copy citation" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("(Report No. TC-EX-000)");
  expect(copied).toContain("/research/id/TC-EX-000");
});

test("share falls back to copy, and to a visible URL when copying is denied", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "share", { value: undefined, configurable: true });
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) }, configurable: true });
  });
  await page.goto("/research/example-report");
  await page.getByRole("button", { name: "Share" }).click();
  await expect(page.getByRole("textbox", { name: "Report link" })).toHaveValue(/\/research\/id\/TC-EX-000$/);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("header, abstract and download remain", async ({ page }) => {
    await page.goto("/research/example-report");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Download PDF/ }).first()).toHaveAttribute("href", "/research/TC-EX-000.pdf");
  });
});
