import { expect, test } from "@playwright/test";

const heroIntro =
  "Independent research on the policies, industries and ideas connecting Canada and Europe.";

test("the home hero keeps its title and actions inside the layout from phones to ultrawide", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "This test sets every viewport explicitly");
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const width of [320, 390, 768, 1024, 1440, 3440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("#home-title")).toHaveText("TharrosCanada");

    const layout = await page.locator(".home-masthead").evaluate((hero) => {
      const stage = hero.querySelector(".home-hero-stage")!.getBoundingClientRect();
      const band = hero.querySelector(".home-hero-band")!.getBoundingClientRect();
      const contained = (element: Element, parent: DOMRect) => {
        const box = element.getBoundingClientRect();
        return {
          label: element.textContent?.trim(),
          visible: box.width > 0 && box.height > 0,
          inside:
            box.left >= parent.left - 1 &&
            box.right <= parent.right + 1 &&
            box.top >= parent.top - 1 &&
            box.bottom <= parent.bottom + 1,
        };
      };
      return {
        title: [...hero.querySelectorAll(".home-title-line, .home-title-word")].map((element) =>
          contained(element, stage),
        ),
        band: [...hero.querySelectorAll(".home-hero-band p, .home-masthead-actions a")].map(
          (element) => contained(element, band),
        ),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });

    expect(layout.title.length, `title content at ${width}px`).toBeGreaterThanOrEqual(2);
    expect(layout.band.length, `intro and routes at ${width}px`).toBeGreaterThanOrEqual(3);
    for (const item of [...layout.title, ...layout.band]) {
      expect(item.visible, `${item.label} has space at ${width}px`).toBe(true);
      expect(item.inside, `${item.label} stays inside its region at ${width}px`).toBe(true);
    }
    expect(layout.scrollWidth, `page overflow at ${width}px`).toBeLessThanOrEqual(
      layout.clientWidth + 1,
    );
  }
});

test.describe("home hero with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("shows the complete introduction and both routes without running entrance motion", async ({
    page,
  }) => {
    await page.goto("/");
    const hero = page.locator(".home-masthead");
    await expect(hero.getByRole("heading", { level: 1 })).toHaveText("TharrosCanada");
    await expect(hero.locator(".home-hero-band")).toContainText(heroIntro);
    for (const name of ["Check out our research", "About Tharros"]) {
      await expect(hero.getByRole("link", { name })).toBeVisible();
    }
    expect(
      await hero.evaluate(
        (element) =>
          element
            .getAnimations({ subtree: true })
            .filter((animation) => animation.playState === "running" || animation.pending).length,
      ),
    ).toBe(0);
  });
});

test.describe("home hero without JavaScript", () => {
  test.use({ javaScriptEnabled: false, reducedMotion: "reduce" });

  test("renders its introduction and opens the research archive", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator(".home-masthead");
    await expect(hero.getByRole("heading", { level: 1 })).toHaveText("TharrosCanada");
    await expect(hero.locator(".home-hero-band")).toContainText(heroIntro);
    await expect(hero.getByRole("link", { name: "About Tharros" })).toHaveAttribute(
      "href",
      "/about",
    );
    await hero.getByRole("link", { name: "Check out our research" }).click();
    await expect(page).toHaveURL(/\/research$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Published research.");
  });
});

test("the home hero entrance finishes and never repeats", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const events = { starts: 0, iterations: 0 };
    Object.defineProperty(window, "__homeHeroMotion", { value: events });
    document.addEventListener("animationstart", (event) => {
      if (event.target instanceof Element && event.target.closest(".home-masthead")) {
        events.starts += 1;
      }
    });
    document.addEventListener("animationiteration", (event) => {
      if (event.target instanceof Element && event.target.closest(".home-masthead")) {
        events.iterations += 1;
      }
    });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const hero = page.locator(".home-masthead");
  const events = () =>
    page.evaluate(
      () =>
        (window as typeof window & { __homeHeroMotion: { starts: number; iterations: number } })
          .__homeHeroMotion,
    );
  await expect.poll(async () => (await events()).starts).toBeGreaterThan(0);
  expect(
    await hero.evaluate((element) =>
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.effect?.getTiming().iterations ?? 1)
        .every((iterations) => Number.isFinite(iterations) && iterations === 1),
    ),
  ).toBe(true);
  await expect
    .poll(
      () =>
        hero.evaluate(
          (element) =>
            element
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === "running" || animation.pending).length,
        ),
      { timeout: 3000, message: "Hero entrance should settle within a few seconds" },
    )
    .toBe(0);
  expect((await events()).iterations).toBe(0);
  await expect(hero.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(hero.getByRole("link", { name: "Check out our research" })).toBeVisible();
  await expect(hero.getByRole("link", { name: "About Tharros" })).toBeVisible();
});
