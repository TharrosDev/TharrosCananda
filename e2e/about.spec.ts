import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { researchAreas } from "../src/lib/research-areas";

test("the field guide exposes questions, evidence and an honest archive route", async ({
  page,
}) => {
  await page.goto("/about");
  const fields = page.locator(".about-field");
  await expect(fields).toHaveCount(researchAreas.length);
  await expect(fields.first()).toHaveAttribute("open", "");
  for (const area of researchAreas) {
    const field = page.locator(`#field-${area.slug}`);
    if (!(await field.evaluate((el) => (el as HTMLDetailsElement).open))) {
      await field.locator("summary").click();
    }
    await expect(field.locator(".about-field-questions li")).toHaveText([...area.questions]);
    await expect(field.locator(".about-field-evidence li")).toHaveText([...area.evidence]);
  }
  for (const area of researchAreas) {
    const record = page.locator(`#field-${area.slug} .about-field-publications`);
    if ((await record.textContent())?.includes("No published research")) {
      await expect(record.getByRole("link")).toHaveAttribute("href", "/research");
    } else {
      await expect(record.getByRole("link")).toHaveAttribute("href", `/research?area=${area.slug}`);
    }
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

test("field disclosures and section links work with keyboard and without JavaScript", async ({
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
  await page.goto("/about");
  const field = page.locator("#field-defence-security");
  await field.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(field).toHaveAttribute("open", "");
  await expect(field.locator(".about-field-questions")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(field).not.toHaveAttribute("open");
  await page
    .getByRole("navigation", { name: "About sections" })
    .getByRole("link", { name: "Contact", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole("heading", { name: "An open line to the project." }),
  ).toBeInViewport();
  await expect(page.getByRole("button", { name: "Copy email address" })).toBeHidden();
  await expect(page.getByRole("link", { name: "Email a correction" })).toHaveAttribute(
    "href",
    /mailto:.*\?subject=Research%20correction$/,
  );
  await context.close();
});

test("editorial contact copies the address and provides intent-specific email links", async ({
  page,
}) => {
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
  for (const [name, subject] of [
    ["Email a question", "Research question"],
    ["Email a correction", "Research correction"],
    ["Email about collaboration", "Research collaboration"],
  ]) {
    await expect(page.getByRole("link", { name, exact: true })).toHaveAttribute(
      "href",
      `mailto:${email}?subject=${encodeURIComponent(subject)}`,
    );
  }
});

test("expanded fields and a denied clipboard remain accessible at narrow widths", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("Denied")) },
    });
  });
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/about");
  await page.locator(".about-field").evaluateAll((fields) =>
    fields.forEach((el) => {
      (el as HTMLDetailsElement).open = true;
    }),
  );
  await page.getByRole("button", { name: "Copy email address" }).click();
  const fallback = page.getByRole("textbox", { name: "Email address for manual copying" });
  await expect(fallback).toBeFocused();
  await expect(fallback).toHaveValue((await page.locator(".about-email").textContent())!);
  expect(await fallback.evaluate((el) => (el as HTMLInputElement).selectionStart)).toBe(0);
  for (const width of [320, 390, 640, 768, 980, 981, 1180, 1181, 1440, 1920, 3440, 3840]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      `Expanded guide at ${width}px`,
    ).toBeLessThanOrEqual(width + 1);
  }
  await page.setViewportSize({ width: 320, height: 720 });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
