import { expect, test } from "@playwright/test";
import { tracePhrases } from "../src/data/trace-example";

test("methodology focuses on the worked example and research method", async ({ page }) => {
  await page.goto("/methodology");
  const contents = page.getByRole("navigation", { name: "Methodology sections" });
  await expect(contents.getByRole("link")).toHaveText(["Worked example", "Research method"]);
  await contents.getByRole("link", { name: "Research method" }).click();
  await expect(page).toHaveURL(/#method-title$/);
  await expect(page.getByRole("heading", { name: "How the research is checked." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find a public source." })).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Match the source to the question." }),
  ).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Check out our research" })).toHaveAttribute(
    "href",
    "/research",
  );
});

test("the complete evidence and research method remain readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/methodology");
  await expect(page.locator(".trace-phrase")).toHaveCount(tracePhrases.length);
  await expect(page.locator(".trace-record > div")).toHaveCount(5);
  await expect(page.locator(".method-clauses h3")).toHaveText([
    "Source selection",
    "Human verification",
    "Freshness and versioning",
    "Fitness for use",
    "Limitations",
  ]);
  await page
    .getByRole("navigation", { name: "Methodology sections" })
    .getByRole("link", { name: "Research method" })
    .click();
  await expect(page).toHaveURL(/#method-title$/);
  await expect(page.getByRole("heading", { name: "How the research is checked." })).toBeVisible();
  await context.close();
});
