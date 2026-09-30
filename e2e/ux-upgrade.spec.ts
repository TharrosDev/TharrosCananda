import { expect, test } from "@playwright/test";

test("mobile navigation prevents interaction with the page and restores it on close", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await expect(page.locator(".site-footer")).toHaveAttribute("inert", "");
  await page.keyboard.press("Escape");
  await expect(page.locator("main")).not.toHaveAttribute("inert");
  await expect(page.locator(".site-footer")).not.toHaveAttribute("inert");
  await expect(page.getByRole("button", { name: "Menu", exact: true })).toBeFocused();
});

test("mobile primary navigation remains usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 720 },
  });
  const page = await context.newPage();
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Primary", exact: true });
  await expect(navigation.getByRole("link", { name: "Research", exact: true })).toBeVisible();
  await navigation.getByRole("link", { name: "Research", exact: true }).click();
  await expect(page).toHaveURL(/\/research$/);
  await expect(page.locator(".archive-card").first()).toBeVisible();
  await context.close();
});
