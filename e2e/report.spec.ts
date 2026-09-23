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
  await page.getByRole("link", { name: "Cite", exact: true }).click();
  await expect(page).toHaveURL(/#cite$/);
  await page.locator("#cite").getByRole("button", { name: "Copy citation" }).click();
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
  test("header, abstract, download and contents remain", async ({ page }) => {
    await page.goto("/research/example-report");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Contents" }).getByRole("link", { name: /Methodology/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Download PDF/ }).first()).toHaveAttribute("href", "/research/TC-EX-000.pdf");
  });
});

test("stable ID redirects permanently, case-insensitively; unknown IDs 404", async ({ request }) => {
  const ok = await request.get("/research/id/tc-ex-000", { maxRedirects: 0 });
  expect(ok.status()).toBe(308);
  expect(ok.headers()["location"]).toMatch(/\/research\/example-report$/);
  expect((await request.get("/research/id/NOPE", { maxRedirects: 0 })).status()).toBe(404);
});

test("non-indexable PDF carries X-Robots-Tag and is not in the sitemap", async ({ request }) => {
  expect((await request.get("/research/TC-EX-000.pdf")).headers()["x-robots-tag"]).toContain("noindex");
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("example-report");
});

test("rapid zoom and resize never break, blank or duplicate pages, and reuse one worker", async ({ page }) => {
  await page.addInitScript(() => {
    const Original = window.Worker;
    (window as unknown as { __workers: number }).__workers = 0;
    window.Worker = class extends Original {
      constructor(...args: ConstructorParameters<typeof Worker>) {
        super(...args);
        (window as unknown as { __workers: number }).__workers += 1;
      }
    };
  });
  await page.goto("/research/example-report");
  const viewer = page.locator("[data-report-viewer]");
  await expect(viewer).not.toHaveAttribute("data-loading", /.*/, { timeout: 15_000 });
  for (let i = 0; i < 4; i += 1) await page.getByRole("button", { name: "Zoom in" }).click();
  for (const width of [900, 1100, 800, 1300]) await page.setViewportSize({ width, height: 900 });
  await page.getByRole("button", { name: "Fit width" }).click();
  await expect(viewer).not.toHaveAttribute("data-loading", /.*/, { timeout: 15_000 });
  await expect(page.getByText("The PDF could not be displayed.")).toHaveCount(0);
  const layer = viewer.locator('.report-sheet[data-page="1"] .textLayer');
  expect((await layer.innerText()).match(/Executive summary/g)).toHaveLength(1);
  const blank = await viewer.locator("canvas").evaluateAll((canvases) =>
    canvases.filter((c) => {
      const ctx = (c as HTMLCanvasElement).getContext("2d")!;
      const { data } = ctx.getImageData(0, 0, (c as HTMLCanvasElement).width, (c as HTMLCanvasElement).height);
      for (let i = 0; i < data.length; i += 4) if (data[i] < 200) return false;
      return true;
    }).length,
  );
  expect(blank).toBe(0);
  expect(await page.evaluate(() => (window as unknown as { __workers: number }).__workers)).toBeLessThanOrEqual(1);
});

test("browser zoom shortcuts do not also zoom the report", async ({ page }) => {
  await page.goto("/research/example-report");
  const viewer = page.locator("[data-report-viewer]");
  await expect(viewer).not.toHaveAttribute("data-loading", /.*/, { timeout: 15_000 });
  const before = await viewer.locator("output").innerText();
  await viewer.locator(".report-viewer-sheets").focus();
  await page.keyboard.press("Control+Equal");
  await expect(viewer.locator("output")).toHaveText(before);
});

test.describe("without JavaScript the viewer hides empty sheets and dead controls", () => {
  test.use({ javaScriptEnabled: false });
  test("only the download link remains", async ({ page }) => {
    await page.goto("/research/example-report");
    await expect(page.locator(".report-viewer-sheets")).toBeHidden();
    await expect(page.getByRole("button", { name: "Zoom in" })).toBeHidden();
  });
});

test("the header reads wide and short on desktop", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop layout");
  await page.goto("/research/example-report");
  const box = (await page.locator(".report-header").boundingBox())!;
  expect(box.width).toBeGreaterThan(box.height * 2);
});

test("contents jump to a section and mark it as current", async ({ page, isMobile }) => {
  await page.goto("/research/example-report");
  const viewer = page.locator("[data-report-viewer]");
  await expect(viewer).not.toHaveAttribute("data-loading", /.*/, { timeout: 15_000 });
  const contents = page.getByRole("navigation", { name: "Contents" });
  if (isMobile) await contents.getByRole("button", { name: /Contents/ }).click();
  const link = contents.getByRole("link", { name: /Limitations/ });
  await expect(link).toHaveAttribute("href", /TC-EX-000\.pdf#page=2$/);
  await link.click();
  await expect(page.locator('.report-sheet[data-page="2"]')).toBeInViewport();
  if (!isMobile) await expect(link).toHaveAttribute("aria-current", "location");
});

test("find in report counts, steps through and clears matches", async ({ page }) => {
  await page.goto("/research/example-report");
  const viewer = page.locator("[data-report-viewer]");
  await expect(viewer).not.toHaveAttribute("data-loading", /.*/, { timeout: 15_000 });
  const find = page.getByRole("searchbox", { name: "Find in report" });
  await find.fill("lorem ipsum");
  const status = viewer.locator(".report-viewer-find-status");
  await expect(status).toHaveText(/^1 of \d+$/);
  const total = Number((await status.innerText()).split(" of ")[1]);
  expect(total).toBeGreaterThan(1);
  await find.press("Enter");
  await expect(status).toHaveText(`2 of ${total}`);
  await find.press("Shift+Enter");
  await find.press("Shift+Enter");
  await expect(status).toHaveText(`${total} of ${total}`);
  await find.fill("zzqqxx");
  await expect(status).toHaveText("No matches");
  await find.press("Escape");
  await expect(find).toHaveValue("");
});

test("full screen fills the screen, navigates, and exits on the same page", async ({ page }) => {
  await page.goto("/research/example-report");
  const viewer = page.locator("[data-report-viewer]");
  await expect(viewer).not.toHaveAttribute("data-loading", /.*/, { timeout: 15_000 });
  await page.getByRole("button", { name: "Full screen" }).click();
  await expect(viewer).toHaveAttribute("data-fullscreen", /native|overlay/);
  const box = (await viewer.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(page.viewportSize()!.width - 20);
  await expect(viewer).not.toHaveAttribute("data-loading", /.*/, { timeout: 15_000 });
  await page.getByLabel("Page", { exact: true }).fill("2");
  await page.getByLabel("Page", { exact: true }).press("Enter");
  const second = viewer.locator('.report-sheet[data-page="2"]');
  await expect(second).toBeInViewport({ ratio: 0.3 });
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "Exit full screen" }).click();
  await expect(viewer).not.toHaveAttribute("data-fullscreen", /.*/);
  await expect(second).toBeInViewport();
  await expect(page.getByLabel("Page", { exact: true })).toHaveValue("2");
});

test("sources, limitations and citation are readable page text", async ({ page }) => {
  await page.goto("/research/example-report");
  await expect(page.getByRole("heading", { name: "Sources", exact: true, level: 2 })).toBeVisible();
  await expect(page.locator("#limitations li")).toHaveCount(3);
  await expect(page.locator("#cite .citation-text")).toContainText("TC-EX-000");
  await expect(page.getByRole("link", { name: /More in Trade & Economic Integration/ })).toHaveAttribute("href", "/research?area=trade-economic-integration");
});
