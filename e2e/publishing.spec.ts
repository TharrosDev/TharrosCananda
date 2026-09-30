import { expect, test } from "@playwright/test";

test("showcase navigation reaches preparation guidance and closes the mobile sheet", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Showcase your work", exact: true })
    .click();
  await expect(page).toHaveURL(/\/submit$/);
  await expect(
    page.getByRole("heading", { name: "Submissions forthcoming", exact: true }),
  ).toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute("data-menu-open", /.*/);
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
  await expect(page.locator("main input[type=file], main form")).toHaveCount(0);
  await page.getByRole("link", { name: "See how the showcase works" }).click();
  await expect(page).toHaveURL(/\/how-it-works$/);
  await expect(page.locator(".publishing-stages h3")).toHaveText([
    "Prepare",
    "Review",
    "Publish",
    "Showcase",
  ]);
  await expect(page.locator("main")).toContainText("New student submissions are being prepared");
});

test("author links preserve real publications and closed discovery settings", async ({
  page,
  request,
}) => {
  await page.goto("/research/canada-inside-safe");
  await page
    .locator(".report-header-meta")
    .getByRole("link", { name: "Magnus Abdelnour", exact: true })
    .click();
  await expect(page).toHaveURL(/\/authors\/magnus-abdelnour$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Magnus Abdelnour");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("main")).not.toContainText(
    /Carleton|Political Science \/ Global Studies/,
  );
  await expect(page.locator("main a[download]")).toHaveCount(2);
  const unknown = await request.get("/authors/not-an-author");
  expect(unknown.status()).toBe(404);
  const retired = await request.post("/api/research-request", { data: {} });
  expect(retired.status()).toBe(410);
});

test("publishing pages stay usable from phones to ultrawide screens", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Viewport loop uses one browser project");
  for (const route of [
    "/",
    "/submit",
    "/how-it-works",
    "/about",
    "/authors",
    "/authors/magnus-abdelnour",
  ]) {
    await page.goto(route);
    for (const width of [320, 390, 768, 1024, 1440, 3440]) {
      await page.setViewportSize({ width, height: 900 });
      const size = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth,
      }));
      expect(size.scroll, `${route} at ${width}px`).toBeLessThanOrEqual(size.client + 1);
    }
  }
});
