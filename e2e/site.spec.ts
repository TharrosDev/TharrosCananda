import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const paths = ["/", "/research-services", "/request-research", "/research/example-report"];
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
    await expect(nav.getByRole("link")).toHaveCount(5);
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
  test("reads what Tharros does, who it is for, proof, then how to commission", async ({
    page,
  }) => {
    await page.goto("/");
    const headings = await page.locator("main > section h2").allTextContents();
    const order = [
      "Start with a question.",
      "Four connected fields.",
      "Public research.",
      "Have a research question?",
    ].map((heading) => headings.indexOf(heading));
    expect(
      order.every((position) => position >= 0),
      headings.join(" | "),
    ).toBe(true);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  test("the empty research block links to the example report", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Public research." })).toBeVisible();
    await expect(page.getByRole("link", { name: /See how a report is published/ })).toHaveAttribute(
      "href",
      "/research/example-report",
    );
  });
});

test("services list each offer once, led by the flagship, with no prices", async ({ page }) => {
  await page.goto("/research-services");
  const entries = page.locator(".services-index li");
  await expect(entries).toHaveCount(3);
  await expect(entries.first()).toHaveClass(/is-flagship/);
  await expect(page.locator("main")).not.toContainText("C$");
  for (const entry of await entries.all()) {
    await expect(entry.getByRole("link", { name: /^Request/ })).toHaveAttribute(
      "href",
      /\/request-research\?service=/,
    );
  }
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

test("the not-found page offers research, services and commissioning", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  const links = page.getByRole("navigation", { name: "Useful pages" }).getByRole("link");
  await expect(links).toHaveText([/Research/, /Services/, /Commission research/]);
  await expect(links.nth(0)).toHaveAttribute("href", "/research");
  await expect(links.nth(1)).toHaveAttribute("href", "/research-services");
  await expect(links.nth(2)).toHaveAttribute("href", "/request-research");
});

test.describe("every sitemap route", () => {
  const sitemapPaths = async (request: import("@playwright/test").APIRequestContext) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((match) => new URL(match[1]).pathname)
      .filter((path) => !path.endsWith(".pdf"));
    return [...new Set([...paths, "/research/example-report"])];
  };

  test("has no horizontal overflow at 320px and 1024px", async ({ page, request }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "The loop sets its own viewports");
    test.setTimeout(120_000);
    const paths = await sitemapPaths(request);
    expect(paths.length).toBeGreaterThan(8);
    for (const width of [320, 1024]) {
      await page.setViewportSize({ width, height: 800 });
      for (const path of paths) {
        await page.goto(path);
        const size = await page.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          client: document.documentElement.clientWidth,
        }));
        expect(size.scroll, `${path} at ${width}px`).toBeLessThanOrEqual(size.client + 1);
      }
    }
  });

  test("has no serious or critical accessibility violations", async ({
    page,
    request,
  }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "Desktop sweep");
    test.setTimeout(180_000);
    // Audit the settled page, with the map's route already drawn.
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const path of await sitemapPaths(request)) {
      await page.goto(path);
      await expect(page.locator("[data-loading]")).toHaveCount(0, { timeout: 15_000 });
      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations
          .filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))
          .map((violation) => `${violation.id} (${violation.nodes.length})`),
        path,
      ).toEqual([]);
    }
  });
});

test("each page previews as itself when shared", async ({ page }) => {
  for (const path of ["/about", "/research-services", "/methodology"]) {
    await page.goto(path);
    const og = (property: string) =>
      page.locator(`meta[property="${property}"]`).getAttribute("content");
    expect(await og("og:url")).toMatch(new RegExp(`${path}$`));
    expect(await og("og:title")).toBe((await page.title()).replace(/ \| Tharros Canada$/, ""));
  }
});
