import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { coreRoutes } from "../src/lib/site";
import { publications } from "../src/data/publications";
import { tracePhrases } from "../src/data/trace-example";
import { fixturePath } from "./fixture";

// The homepage research block depends on whether real work is published; derived so new reports need no edit.
const researchHeading = publications.length ? "Latest release" : "Public research.";

const paths = ["/", "/research", fixturePath, "/this-page-does-not-exist"];

/** Narrow screens fold the archive filters behind a "Filters" disclosure; wide screens always show them.
 *  Opened from the keyboard, so focus moved afterwards still shows its ring. */
async function openFilters(page: import("@playwright/test").Page) {
  const summary = page.locator(".archive-filters > summary");
  if (!(await summary.isVisible())) return;
  await summary.focus();
  await page.keyboard.press("Enter");
}
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

for (const [label, path] of [
  ["Market Data", "/market-explorer"],
  ["Live Monitor", "/live-monitor"],
]) {
  test(`retired ${label} surface is absent from navigation and routing`, async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: label, exact: true })).toHaveCount(0);
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
  });
}

test("nested research route keeps Research navigation state", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop navigation; mobile nav is behind the menu button");
  await page.goto("/research/not-a-real-publication");
  const primary = page.getByRole("navigation", { name: "Primary" });
  await expect(primary.getByRole("link", { name: "Research", exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

for (const path of ["/", "/about", "/research", "/copyright"]) {
  test(`${path} has no serious or critical automated accessibility violations`, async ({
    page,
  }) => {
    // Audit the settled page, with the map's route already drawn.
    await page.emulateMedia({ reducedMotion: "reduce" });
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

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("every section heading on the home page is fully visible", async ({ page }) => {
    await page.goto("/");
    const headings = page.locator("main section h2");
    const count = await headings.count();
    expect(count).toBeGreaterThan(2);
    for (let i = 0; i < count; i += 1) {
      await headings.nth(i).scrollIntoViewIfNeeded();
      expect(await headings.nth(i).evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    }
  });
});

test.describe("mobile navigation", () => {
  test.skip(({ isMobile }) => !isMobile, "The menu sheet is the mobile navigation");

  test("the menu opens as a full-height sheet and locks page scroll", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /menu/i }).click();
    await expect(page.locator("html")).toHaveAttribute("data-menu-open", "");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link")).toHaveCount(3);
    for (const link of await nav.getByRole("link").all()) await expect(link).toBeVisible();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe(
      "hidden",
    );
    const box = await nav.boundingBox();
    const height = page.viewportSize()!.height;
    expect(Math.round(box!.y + box!.height)).toBeGreaterThanOrEqual(height - 1);
  });

  test("Escape closes the menu and returns focus to the toggle", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /menu/i });
    await toggle.click();
    await page.keyboard.press("Escape");
    await expect(page.locator("html")).not.toHaveAttribute("data-menu-open");
    await expect(page.getByRole("button", { name: /menu/i })).toBeFocused();
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link").first(),
    ).toBeHidden();
  });

  test("the open menu has no serious or critical accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /menu/i }).click();
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations
        .filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))
        .map((violation) => violation.id),
    ).toEqual([]);
  });
});

test.describe("tap targets", () => {
  test.skip(({ isMobile }) => !isMobile, "Measured at a phone width");
  for (const path of [
    "/",
    "/research",
    fixturePath,
    "/about",
    "/methodology",
    "/copyright",
    "/this-page-does-not-exist",
  ]) {
    test(`${path} has 44px tap targets at 390px`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path);
      await expect(page.locator("[data-loading]")).toHaveCount(0, { timeout: 15_000 });
      const small = await page.locator("main").evaluate((main) =>
        [
          ...main.querySelectorAll<HTMLElement>(
            "a[href], button, summary, select, input:not([type=checkbox]):not([type=radio])",
          ),
        ]
          .filter((el) => {
            const style = getComputedStyle(el);
            if (
              style.visibility === "hidden" ||
              el.closest("[aria-hidden='true'], .sr-only, .form-trap")
            )
              return false;
            // Inline text links inside running copy are exempt (WCAG 2.5.8 inline exception).
            if (style.display === "inline" && el.closest("p, li, dd")) return false;
            const box = el.getBoundingClientRect();
            return box.width > 0 && box.height > 0 && box.height < 43.5;
          })
          .map(
            (el) =>
              `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40)}" ${Math.round(el.getBoundingClientRect().height)}px`,
          ),
      );
      expect(small).toEqual([]);
    });
  }
});

test("focus rings are consistent across links, buttons, chips and inputs", async ({ page }) => {
  await page.goto("/research");
  await openFilters(page);
  const targets = [
    page.getByLabel("Search the archive"),
    page
      .locator(".archive-chips button:not(:disabled), .archive-areas button:not(:disabled)")
      .first(),
    page.locator("main a[href]").first(),
  ];
  for (const target of targets) {
    await target.focus();
    const ring = await target.evaluate((el) => {
      const style = getComputedStyle(el);
      return `${el.tagName} ${style.outlineStyle} ${style.outlineWidth} ${style.outlineOffset}`;
    });
    expect(ring).toMatch(/ solid 2px 3px$/);
  }
});

test.describe("home flow", () => {
  test("leads with research, then subjects and method", async ({ page }) => {
    await page.goto("/");
    const headings = await page.locator("main > section h2").allTextContents();
    const order = [researchHeading, "Five connected fields.", "The method stays visible."].map(
      (heading) => headings.indexOf(heading),
    );
    expect(
      order.every((position) => position >= 0),
      headings.join(" | "),
    ).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  test("the research block lists published work", async ({ page }) => {
    await page.goto("/");
    const block = page.locator(".home-release");
    await expect(block.getByRole("heading", { name: researchHeading })).toBeVisible();
    const slugs = publications.map((p) => `/research/${p.slug}`);
    for (const link of await block.locator('a[href^="/research/"]:not([download])').all())
      expect(slugs).toContain(await link.getAttribute("href"));
  });
});

test("About identifies the student project and counts only published work", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: /student research project/i })).toBeVisible();
  await expect(page.locator(".about-ledger dt")).toHaveText([
    "Published research",
    "Research areas",
    "Sources in the register",
  ]);
  await expect(page.locator("main")).not.toContainText("Research services");
});

test("retired commissioning pages redirect and submissions are rejected", async ({
  request,
  page,
}) => {
  for (const [path, destination] of [
    ["/research-services", "/research"],
    ["/request-research", "/research"],
    ["/how-it-works", "/methodology"],
  ]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(destination);
  }
  const response = await request.post("/api/research-request", { data: { consent: true } });
  expect(response.status()).toBe(410);
  await page.goto("/");
  await expect(page.getByRole("link", { name: /commission/i })).toHaveCount(0);
});

test("the methodology trace ties each phrase to the record fields it rests on", async ({
  page,
}) => {
  await page.goto("/methodology");
  const phrases = page.locator(".trace-phrase");
  await expect(phrases).toHaveCount(tracePhrases.length);
  const period = page.getByRole("button", { name: "between 2017-2024 (excluding 2023)" });
  await period.click();
  await expect(period).toHaveAttribute("aria-pressed", "true");
  const active = page.locator(".trace-record > div[data-active]");
  await expect(active).toHaveCount(1);
  await expect(active).toContainText("Period");
  await period.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.locator(".trace-record > div[data-active] dt")).toContainText("Dataset");
});

test("the not-found page leads to research and About", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  const links = page.getByRole("navigation", { name: "Useful pages" }).getByRole("link");
  await expect(links).toHaveText([/Research archive/, /Methodology/, /About Tharros/]);
  await expect(links.nth(0)).toHaveAttribute("href", "/research");
  await expect(links.nth(1)).toHaveAttribute("href", "/methodology");
  await expect(links.nth(2)).toHaveAttribute("href", "/about");
});

// One test per core route plus the fixture report, so the sweep spreads across workers and stays the same size
// however many reports are published. The live sitemap.xml is checked against every route, cheaply, as text.
const coreSitemapRoutes = coreRoutes.map((route) => route || "/");
const sweptRoutes = [...coreSitemapRoutes, fixturePath];

test.describe("every sitemap route", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop sweep; the loop sets its own widths");

  test("the served sitemap lists the same routes", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const served = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((match) => new URL(match[1]).pathname)
      .filter((path) => !path.endsWith(".pdf"));
    expect(served.length).toBeGreaterThan(5);
    expect(new Set(served)).toEqual(
      new Set([
        ...coreSitemapRoutes,
        ...publications.filter((p) => p.indexable).map((p) => `/research/${p.slug}`),
      ]),
    );
  });

  for (const path of sweptRoutes) {
    test(`${path} has no overflow and no serious accessibility violations`, async ({ page }) => {
      for (const width of [320, 1024]) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(path);
        const size = await page.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          client: document.documentElement.clientWidth,
        }));
        expect(size.scroll, `${path} at ${width}px`).toBeLessThanOrEqual(size.client + 1);
      }
      // Audit the settled page at desktop width, with the map's route already drawn.
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      await expect(page.locator("[data-loading]")).toHaveCount(0, { timeout: 15_000 });
      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations
          .filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))
          .map((violation) => `${violation.id} (${violation.nodes.length})`),
      ).toEqual([]);
    });
  }
});

test("each page previews as itself when shared", async ({ page }) => {
  for (const path of ["/about", "/research", "/methodology"]) {
    await page.goto(path);
    const og = (property: string) =>
      page.locator(`meta[property="${property}"]`).getAttribute("content");
    expect(await og("og:url")).toMatch(new RegExp(`${path}$`));
    expect(await og("og:title")).toBe((await page.title()).replace(/ \| Tharros Canada$/, ""));
  }
});
