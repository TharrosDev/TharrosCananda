import { expect, test } from "@playwright/test";
import { fixturePath } from "./fixture";

// Fixed routes and one permanent report: this matrix does not grow with the archive.
const routes = [
  "/",
  "/research",
  "/methodology",
  "/about",
  "/privacy",
  "/accessibility",
  "/copyright",
  fixturePath,
  "/this-page-does-not-exist",
];
const widths = [
  320, 390, 560, 640, 768, 980, 981, 1020, 1024, 1180, 1181, 1440, 1920, 2560, 3440, 3840,
];

test.describe("responsive layout matrix", () => {
  test.skip(({ isMobile }) => isMobile, "One project covers the explicit viewport matrix");
  for (const route of routes) {
    test(`${route} fits phones through ultrawide and breakpoint seams`, async ({ page }) => {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      for (const width of widths) {
        await page.setViewportSize({ width, height: width >= 1920 ? 1080 : 800 });
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
          .toBeLessThanOrEqual(width + 1);
        const escaped = await page.locator(".nav-shell, main, .footer-shell").evaluateAll((roots) =>
          roots.flatMap((root) =>
            [...root.querySelectorAll<HTMLElement>("button, input, select, summary, .wordmark")]
              .filter((el) => {
                const box = el.getBoundingClientRect();
                return (
                  box.width > 1 &&
                  box.height > 1 &&
                  !el.closest(".sr-only, .report-viewer-sheets") &&
                  (box.left < -1 || box.right > window.innerWidth + 1)
                );
              })
              .map((el) => el.className || el.getAttribute("aria-label")),
          ),
        );
        expect(escaped, `${route} at ${width}px`).toEqual([]);
      }
    });
  }

  test("phone citations and clipboard fallbacks stay within the archive", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: () => Promise.reject(new Error("Clipboard denied")) },
      });
    });
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto("/research");
    await page.getByRole("button", { name: "Expanded", exact: true }).click();
    const card = page.locator(".archive-card").first();
    await card.getByText("Cite", { exact: true }).click();
    await expect(card.locator(".citation-text")).toBeVisible();
    await card.getByRole("button", { name: "Copy link", exact: true }).click();
    await expect(card.getByRole("textbox", { name: "Report link" })).toBeVisible();
    const bounds = await card.locator(".cite-popover-body").boundingBox();
    const parent = await card.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(parent!.x);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(parent!.x + parent!.width + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  });

  test("long archive previews scroll with the page and short panels can stick", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/research?q=ArcGIS");
    await page.getByRole("button", { name: "Preview", exact: true }).click();
    const pane = page.locator(".archive-record-pane");
    await expect(pane).toBeVisible();
    // Stress the actual selected record without adding fabricated publications to the registry.
    await pane.evaluate((el) => {
      (el as HTMLElement).style.minHeight = "1200px";
    });
    await expect(pane).not.toHaveAttribute("data-sticky-fit");
    expect(await pane.evaluate((el) => getComputedStyle(el).position)).toBe("static");
    await pane.evaluate((el) => {
      (el as HTMLElement).style.minHeight = "";
    });
    await page.setViewportSize({ width: 1440, height: 2400 });
    await expect(pane).toHaveAttribute("data-sticky-fit", "");
    expect(await pane.evaluate((el) => getComputedStyle(el).position)).toBe("sticky");
    await page.getByRole("searchbox", { name: "Search the archive" }).fill("zzzxxyynothing");
    await expect(pane).toHaveCount(0);
    await page.getByRole("searchbox", { name: "Search the archive" }).fill("ArcGIS");
    await expect(pane).toHaveAttribute("data-sticky-fit", "");
  });

  for (const route of ["/methodology", "/privacy", "/accessibility", "/copyright"]) {
    test(`${route} keeps contents navigation usable on phones`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);
      const contents = page.locator(".method-rail");
      await expect(contents).toBeVisible();
      const link = contents.locator("a").last();
      const target = await link.getAttribute("href");
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${target}$`));
      await expect
        .poll(async () => (await page.locator(target!).boundingBox())!.y)
        .toBeGreaterThanOrEqual(70);
    });
  }

  test("PDF toolbar has matching reading and keyboard order on narrow phones", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto(fixturePath);
    const toolbar = page.getByRole("toolbar", { name: "PDF controls" });
    await expect(toolbar).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("[data-loading]")).toHaveCount(0, { timeout: 15_000 });
    const groups = await toolbar.evaluate((el) =>
      [...el.children].map((child) => ({
        name: child.className,
        y: child.getBoundingClientRect().y,
      })),
    );
    const positions = groups.map((group) => group.y);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    await page.getByLabel("Page", { exact: true }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Zoom out", exact: true })).toBeFocused();
    await page.setViewportSize({ width: 844, height: 390 });
    expect(await toolbar.evaluate((el) => getComputedStyle(el).position)).toBe("static");
  });
});

test.describe("touch tablet", () => {
  test.use({ viewport: { width: 1024, height: 768 }, hasTouch: true });
  test("PDF and citation controls provide 44px targets", async ({ page }) => {
    await page.goto(fixturePath);
    await expect(page.getByRole("toolbar", { name: "PDF controls" })).toBeVisible({
      timeout: 15_000,
    });
    const controls = page.locator(
      ".report-viewer-toolbar button, .report-viewer-toolbar input, .citation-tab, .citation-copy",
    );
    for (const control of await controls.all()) {
      if (!(await control.isVisible())) continue;
      expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
  });
});
