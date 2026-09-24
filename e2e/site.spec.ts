import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { coreRoutes } from "../src/lib/site";
import { allPublications, publications } from "../src/data/publications";
import { tracePhrases } from "../src/data/trace-example";

// The homepage research block depends on whether real work is published; derived so new reports need no edit.
const researchHeading = publications.length ? "Latest release" : "Public research.";

const paths = [
  "/",
  "/research",
  "/research-services",
  "/request-research",
  "/research/example-report",
  "/this-page-does-not-exist",
];

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
  await expect(page.getByText("Service to be suggested by Tharros")).toBeVisible();
  // Arriving on review must not count as a submit attempt.
  await expect(page.locator("#consent-error")).toHaveCount(0);
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

for (const path of ["/", "/research-services", "/request-research", "/copyright"]) {
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
    await expect(nav.getByRole("link")).toHaveCount(4);
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
    "/research-services",
    "/request-research",
    "/research/example-report",
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
  test("reads research first: the latest release, then areas, then commissioning", async ({
    page,
  }) => {
    await page.goto("/");
    const headings = await page.locator("main > section h2").allTextContents();
    const order = [researchHeading, "Five connected fields.", "Commissioned research."].map(
      (heading) => headings.indexOf(heading),
    );
    expect(
      order.every((position) => position >= 0),
      headings.join(" | "),
    ).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  test("the research block lists published work, never the specimen", async ({ page }) => {
    await page.goto("/");
    const block = page.locator(".home-release");
    await expect(block.getByRole("heading", { name: researchHeading })).toBeVisible();
    const slugs = publications.map((p) => `/research/${p.slug}`);
    for (const link of await block.locator('a[href^="/research/"]:not([download])').all()) {
      const href = await link.getAttribute("href");
      if (publications.length) expect(slugs).toContain(href);
      else expect(href).toBe("/research/example-report");
    }
    await expect(block.getByRole("link", { name: /Lorem ipsum/ })).toHaveCount(0);
  });
});

test("the commission page states privacy and lists each option once, with no prices", async ({
  page,
}) => {
  await page.goto("/research-services");
  await expect(page.getByRole("heading", { name: "Private by default." })).toBeVisible();
  await expect(page.locator(".commission-privacy")).toContainText(
    "published only if that client asks",
  );
  const entries = page.locator(".services-index > li");
  await expect(entries).toHaveCount(3);
  await expect(page.locator("main")).not.toContainText("C$");
  for (const entry of await entries.all()) {
    await expect(entry.getByRole("link", { name: /^Request/ })).toHaveAttribute(
      "href",
      /\/request-research\?service=/,
    );
  }
});

test("each service opens a labelled lorem sample in a dialog", async ({ page }) => {
  await page.goto("/research-services");
  const open = page.getByRole("button", { name: /^View sample/ });
  await expect(open).toHaveCount(3);
  await open.first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("placeholder text");
  await expect(dialog.locator("a[download], a[href$='.pdf']")).toHaveCount(0);
  // The open reader is part of the page too: audit it while it is showing.
  const results = await new AxeBuilder({ page }).include(".sample-dialog[open]").analyze();
  expect(
    results.violations
      .filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))
      .map((violation) => violation.id),
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("the request page states privacy and purchase terms before the brief is opened", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/request-research");
  await expect(page.getByText("published only if that client asks")).toBeVisible();
  await expect(
    page.getByText("Submitting does not create a purchase.", { exact: false }),
  ).toBeVisible();
});

test("About counts only what exists and has no commissioned-work row", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator(".about-ledger dt")).toHaveText([
    "Published research",
    "Research areas",
    "Sources in the register",
    "Research services",
  ]);
  await expect(page.locator("main")).not.toContainText("Commissioned work published");
});

test("the request brief writes itself from the form", async ({ page }) => {
  await page.goto("/request-research");
  const brief = page.locator(".request-brief");
  await expect(brief).toContainText("Draft · not sent");
  await page.getByLabel("Organization").fill("Example GmbH");
  await page.getByLabel("Country").fill("Germany");
  await expect(brief).toContainText("Example GmbH · Germany");
  await page.getByLabel("Business email").fill("research@example.com");
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByLabel("Enter the Canadian market").check();
  // Indicative sources follow the purpose chosen.
  await expect(brief).toContainText("Statistics Canada");
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

test.describe("request form", () => {
  const fillOrganization = async (page: import("@playwright/test").Page) => {
    await page.getByLabel("Organization").fill("Example GmbH");
    await page.getByLabel("Country").fill("Germany");
    await page.getByLabel("Business email").fill("research@example.com");
  };

  test("validates a touched field on blur without pulling focus back", async ({ page }) => {
    await page.goto("/request-research");
    const email = page.getByLabel("Business email");
    await email.fill("x");
    await email.press("Tab");
    await expect(page.getByText("Enter a valid business email address.")).toBeVisible();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).not.toBeFocused();
    await expect(page.getByLabel("Organization")).toHaveAttribute("aria-invalid", "false");
  });

  test("the stepper labels three steps and marks the current one", async ({ page }) => {
    await page.goto("/request-research");
    const steps = page.getByRole("list", { name: "Request steps" }).getByRole("listitem");
    await expect(steps).toHaveText([/Organization/, /Question/, /Review/]);
    await expect(page.locator('[aria-current="step"]')).toHaveText(/Organization/);
    await fillOrganization(page);
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.locator('[aria-current="step"]')).toHaveText(/Question/);
  });

  test("a draft survives a reload, and URL prefill still wins", async ({ page }) => {
    await page.goto("/request-research");
    await fillOrganization(page);
    await page.getByRole("button", { name: /continue/i }).click();
    await page.getByLabel("Subject, product or sector").fill("Draft subject");
    await page.reload();
    await expect(page.getByLabel("Organization")).toHaveValue("Example GmbH");
    await expect(page.getByLabel("Business email")).toHaveValue("research@example.com");
    await page.goto("/request-research?product=Maple%20syrup");
    await expect(page.getByLabel("Organization")).toHaveValue("Example GmbH");
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByLabel("Subject, product or sector")).toHaveValue("Maple syrup");
  });

  test("a submitted request is not restored after a reload", async ({ page }) => {
    await page.route("**/api/research-request", (route) =>
      route.fulfill({ status: 201, json: { ok: true, reference: "abcdef1234567890" } }),
    );
    await page.goto("/request-research");
    await fillOrganization(page);
    await page.getByRole("button", { name: /continue/i }).click();
    await page.getByLabel("Subject, product or sector").fill("Industrial components");
    await page.getByLabel("Enter the Canadian market").check();
    await page.getByRole("button", { name: /continue/i }).click();
    await page.getByLabel(/I consent/).check();
    await page.getByRole("button", { name: /submit research request/i }).click();
    await expect(
      page.getByRole("heading", { name: "Your research request has been received." }),
    ).toBeVisible();
    expect(await page.evaluate(() => sessionStorage.getItem("tharros.request.draft"))).toBeNull();
    await page.reload();
    // Prove the form hydrated and ran its restore before asserting nothing came back.
    await page.getByLabel("Business email").fill("new@example.com");
    await expect
      .poll(() => page.evaluate(() => sessionStorage.getItem("tharros.request.draft") ?? ""))
      .toContain("new@example.com");
    await expect(page.getByLabel("Organization")).toHaveValue("");
    await expect(page.getByLabel("Country")).toHaveValue("");
  });

  test("reloading a prefilled link keeps the visitor's edits", async ({ page }) => {
    await page.goto("/request-research?product=Alpha");
    await fillOrganization(page);
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByLabel("Subject, product or sector")).toHaveValue("Alpha");
    await page.getByLabel("Subject, product or sector").fill("Beta");
    await page.reload();
    await expect(page.getByLabel("Organization")).toHaveValue("Example GmbH");
    await page.getByRole("button", { name: /continue/i }).click();
    await expect(page.getByLabel("Subject, product or sector")).toHaveValue("Beta");
  });
});

test("the not-found page leads with research, then commissioning", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  const links = page.getByRole("navigation", { name: "Useful pages" }).getByRole("link");
  await expect(links).toHaveText([/Research archive/, /Methodology/, /Commission research/]);
  await expect(links.nth(0)).toHaveAttribute("href", "/research");
  await expect(links.nth(1)).toHaveAttribute("href", "/methodology");
  await expect(links.nth(2)).toHaveAttribute("href", "/research-services");
});

// One test per sitemap route (from the same sources as the sitemap, at collection) so the sweep spreads across
// workers instead of running page by page in one long test. The live sitemap.xml is checked against it.
const sitemapRoutes = [
  ...coreRoutes.map((route) => route || "/"),
  ...allPublications.filter((p) => p.indexable || p.specimen).map((p) => `/research/${p.slug}`),
];

test.describe("every sitemap route", () => {
  test.skip(({ isMobile }) => isMobile, "Desktop sweep; the loop sets its own widths");

  test("the served sitemap lists the same routes", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const served = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((match) => new URL(match[1]).pathname)
      .filter((path) => !path.endsWith(".pdf"));
    expect(served.length).toBeGreaterThan(8);
    // The specimen is swept but never listed in the sitemap.
    expect(new Set(served)).toEqual(
      new Set(sitemapRoutes.filter((path) => path !== "/research/example-report")),
    );
  });

  for (const path of sitemapRoutes) {
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
  for (const path of ["/about", "/research-services", "/request-research", "/methodology"]) {
    await page.goto(path);
    const og = (property: string) =>
      page.locator(`meta[property="${property}"]`).getAttribute("content");
    expect(await og("og:url")).toMatch(new RegExp(`${path}$`));
    expect(await og("og:title")).toBe((await page.title()).replace(/ \| Tharros Canada$/, ""));
  }
});
