import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { researchAreas } from "../src/lib/research-areas";

test("About introduces Tharros Canada with a concise purpose and one contact section", async ({
  page,
}) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About Tharros Canada");
  for (const name of ["About", "Mission", "Why", "Contact"]) {
    await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
  }
  await expect(
    page.locator(".about-masthead").getByRole("link", { name: "Contact", exact: true }),
  ).toHaveAttribute("href", "#contact");
  await expect(page.locator(".about-field, .about-ledger, .about-contact-routes")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/the project|archive/i);
  await expect(page.locator(".about-contact-section a[href^='mailto:']")).toHaveCount(1);
});

test("research areas expose questions, evidence and links to available research", async ({
  page,
}) => {
  await page.goto("/research-areas");
  const fields = page.locator(".areas-field");
  await expect(fields).toHaveCount(researchAreas.length);
  await expect(fields.first()).toHaveAttribute("open", "");
  for (const area of researchAreas) {
    const field = page.locator(`#field-${area.slug}`);
    if (!(await field.evaluate((el) => (el as HTMLDetailsElement).open))) {
      await field.locator("summary").click();
    }
    await expect(field.locator(".areas-questions li")).toHaveText([...area.questions]);
    await expect(field.locator(".areas-evidence li")).toHaveText([...area.evidence]);
    const publicationLinks = field.locator(".areas-publications");
    await expect(publicationLinks.getByRole("link")).toHaveAttribute(
      "href",
      (await publicationLinks.textContent())?.includes("No published research")
        ? "/research"
        : `/research?area=${area.slug}`,
    );
  }
  const defence = page.locator("#field-defence-security");
  await defence.getByRole("link", { name: "Read Defence & Security research" }).click();
  await expect(page).toHaveURL(/\/research\?area=defence-security$/);
  const filters = page.locator(".archive-filters > summary");
  if (await filters.isVisible()) await filters.click();
  await expect(
    page
      .getByRole("group", { name: "Research area" })
      .getByRole("button", { name: /Defence & Security/ }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("area disclosures and the contact link work with keyboard and without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/research-areas");
  const field = page.locator("#field-defence-security");
  await field.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(field).toHaveAttribute("open", "");
  await expect(field.locator(".areas-questions")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(field).not.toHaveAttribute("open");
  await page.goto("/about");
  await page.locator(".about-masthead").getByRole("link", { name: "Contact", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole("heading", { level: 2, name: "Contact", exact: true }),
  ).toBeInViewport();
  await expect(page.getByRole("button", { name: "Copy email address" })).toBeHidden();
  await expect(page.locator(".about-email")).toHaveAttribute("href", /^mailto:/);
  await context.close();
});

test("editorial contact copies the email address", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (value: string) => {
          document.documentElement.dataset.copiedEmail = value;
        },
      },
    });
  });
  await page.goto("/about#contact");
  const email = await page.locator(".about-email").textContent();
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.getByRole("status")).toHaveText("Email address copied.");
  await expect(page.locator("html")).toHaveAttribute("data-copied-email", email!);
  await expect(page.locator(".about-email")).toHaveAttribute("href", `mailto:${email}`);
});

test("About and expanded research areas remain accessible at narrow widths", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("Denied")) },
    });
  });
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/about");
  await page.getByRole("button", { name: "Copy email address" }).click();
  const fallback = page.getByRole("textbox", { name: "Email address for manual copying" });
  await expect(fallback).toBeFocused();
  await expect(fallback).toHaveValue((await page.locator(".about-email").textContent())!);
  expect(await fallback.evaluate((el) => (el as HTMLInputElement).selectionStart)).toBe(0);
  for (const route of ["/about", "/research-areas"]) {
    if (route !== "/about") await page.goto(route);
    await page.locator(".areas-field").evaluateAll((fields) =>
      fields.forEach((el) => {
        (el as HTMLDetailsElement).open = true;
      }),
    );
    for (const width of [320, 390, 640, 768, 980, 981, 1180, 1181, 1440, 1920, 3440, 3840]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${route} at ${width}px`,
      ).toBeLessThanOrEqual(width + 1);
    }
    await page.setViewportSize({ width: 320, height: 720 });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});
