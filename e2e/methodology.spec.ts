import { expect, test } from "@playwright/test";
import { publicSources } from "../src/data/sources";
import { tracePhrases } from "../src/data/trace-example";

test("the source register searches real records and recovers from empty results", async ({
  page,
}) => {
  await page.goto("/methodology");
  const search = page.getByRole("searchbox", { name: "Search the source register" });
  const sources = page.locator(".atlas-region > a");
  await expect(sources).toHaveCount(publicSources.length);
  await search.fill("collisions");
  await expect(sources).toHaveCount(1);
  await expect(sources.first()).toContainText("City of Ottawa Open Data");
  await expect(page.getByRole("status")).toContainText(
    `1 of ${publicSources.length} publishers match your filters`,
  );
  await page.getByLabel("Region", { exact: true }).selectOption("Europe");
  await expect(sources).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "No registered source matches your search." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all publishers" }).click();
  await expect(search).toHaveValue("");
  await expect(page.getByLabel("Region", { exact: true })).toHaveValue("All regions");
  await expect(sources).toHaveCount(publicSources.length);
});

test("the complete evidence and source register remain readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/methodology");
  await expect(page.locator(".trace-phrase")).toHaveCount(tracePhrases.length);
  await expect(page.locator(".trace-record > div")).toHaveCount(5);
  await expect(page.locator(".atlas-region > a")).toHaveCount(publicSources.length);
  await expect(page.locator(".source-record-main strong")).toHaveText(
    publicSources.map((source) => source.publisher),
  );
  await expect(page.getByRole("searchbox", { name: "Search the source register" })).toBeDisabled();
  await page
    .getByRole("navigation", { name: "Source register regions" })
    .getByRole("link", { name: /Europe/ })
    .click();
  await expect(page).toHaveURL(/#source-region-2$/);
  await expect(page.locator("#source-region-title-2")).toBeVisible();
  await context.close();
});
