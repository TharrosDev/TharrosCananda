import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

// The e2e server reads recorded Statistics Canada responses (e2e/mock-sources.mjs) and has no intake webhook.

test.describe("market data", () => {
  test("renders the CETA series with provenance and the group comparison", async ({ page }) => {
    await page.goto("/market-explorer");
    await expect(page.getByRole("heading", { name: "Imports under CETA: Total of all merchandise" })).toBeVisible();
    await expect(page.getByText("Vector v1566933744")).toBeVisible();
    await expect(page.getByRole("heading", { name: "All commodity groups, last 12 months" })).toBeVisible();
    await expect(page.locator(".market-groups tbody tr")).toHaveCount(12);
  });

  test("selections update a shareable URL and announce the new series", async ({ page }) => {
    // Each step waits for the previous series to land (status line empties); a cold server can take a few seconds.
    const settled = () => expect(page.locator(".market-control-status")).toBeEmpty({ timeout: 15_000 });
    await page.goto("/market-explorer");
    await page.getByText("Exports", { exact: true }).click();
    await expect(page).toHaveURL(/flow=exports/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Exports under CETA: Total of all merchandise" })).toBeVisible({ timeout: 15_000 });
    await settled();
    await page.getByLabel("Commodity group").selectOption({ label: "Energy products" });
    await expect(page).toHaveURL(/flow=exports&commodity=14/, { timeout: 15_000 });
    await settled();
    await expect(page.locator("[aria-live=polite]").filter({ hasText: "Showing exports under CETA, Energy products" })).toHaveCount(1);
    await page.getByText("1 year", { exact: true }).click();
    await expect(page).toHaveURL(/range=12/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Exports, last 12 months" })).toBeVisible();
  });

  test("a group row charts that group", async ({ page }) => {
    await page.goto("/market-explorer");
    await page.getByRole("link", { name: "Motor vehicles and parts" }).click();
    await expect(page).toHaveURL(/commodity=105/);
    await expect(page.getByRole("heading", { name: "Imports under CETA: Motor vehicles and parts" })).toBeVisible();
    await expect(page.locator(".market-groups tr[aria-current=true]")).toContainText("Motor vehicles and parts");
  });

  test("a shared URL opens the same view", async ({ page }) => {
    await page.goto("/market-explorer?flow=exports&commodity=14&range=36");
    await expect(page.getByRole("heading", { name: "Exports under CETA: Energy products" })).toBeVisible();
    await expect(page.getByLabel("Commodity group")).toHaveValue("14");
    await expect(page.getByRole("radio", { name: "3 years" })).toBeChecked();
  });

  test("fails closed for a group Statistics Canada does not offer", async ({ page }) => {
    await page.goto("/market-explorer?commodity=4");
    await expect(page.getByRole("heading", { name: "Statistics Canada did not return a valid series." })).toBeVisible();
    await expect(page.locator(".official-explorer-kpis")).toHaveCount(0);
  });

  test("federal dataset discovery is secondary and loads only when opened", async ({ page }) => {
    const searches: string[] = [];
    page.on("request", (request) => { if (request.url().includes("/api/open-data/search")) searches.push(request.url()); });
    await page.goto("/market-explorer");
    expect(searches).toHaveLength(0);
    await page.getByText("Find related federal datasets").click();
    await expect(page.locator(".official-dataset-register-list a").first()).toBeVisible();
    expect(searches).toHaveLength(1);
  });

  test("the homepage trade preview streams official figures", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".trade-preview-value strong")).toHaveText(/^\$[\d.]+B$/);
  });
});

async function completeRequest(page: Page) {
  await page.goto("/request-research");
  await page.getByLabel("Organization").fill("Example GmbH");
  await page.getByLabel("Country").fill("Germany");
  await page.getByLabel("Business email").fill("research@example.com");
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByLabel("Subject, product or sector").fill("Industrial components");
  await page.getByLabel("Enter the Canadian market").check();
  await page.getByRole("button", { name: /continue/i }).click();
  await page.getByText(/I consent to Tharros Canada/).click();
  await page.getByRole("button", { name: "Submit research request" }).click();
}

test.describe("research request delivery states", () => {
  test("success and a reference appear only when the API confirms acceptance", async ({ page }) => {
    await page.route("**/api/research-request", (route) => route.fulfill({ status: 201, json: { ok: true, reference: "3f2a9c1e-0000-4000-8000-000000000000" } }));
    await completeRequest(page);
    await expect(page.getByRole("heading", { name: "Your research request has been received." })).toBeVisible();
    await expect(page.getByText("3F2A9C1E")).toBeVisible();
  });

  test("a 2xx without explicit acceptance is not treated as success", async ({ page }) => {
    await page.route("**/api/research-request", (route) => route.fulfill({ status: 200, json: {} }));
    await completeRequest(page);
    await expect(page.locator(".form-error")).toContainText("The request was not sent.");
  });

  test("unconfigured intake shows the failure state and keeps answers", async ({ page }) => {
    await completeRequest(page);
    await expect(page.locator(".form-error")).toContainText("The request was not sent.");
    await expect(page.getByLabel("Additional context")).toBeVisible();
    await page.getByRole("button", { name: "Edit" }).first().click();
    await expect(page.getByLabel("Organization")).toHaveValue("Example GmbH");
  });

  test("a receiver timeout is reported as not sent", async ({ page }) => {
    await page.route("**/api/research-request", (route) => route.fulfill({ status: 504, json: { message: "We couldn’t send your request right now. Your answers are still in the form." } }));
    await completeRequest(page);
    await expect(page.locator(".form-error")).toContainText("Your answers are still in the form.");
  });

  test("server-side validation errors return the visitor to the field", async ({ page }) => {
    await page.route("**/api/research-request", (route) => route.fulfill({ status: 422, json: { message: "Review the highlighted fields and try again.", errors: { email: "Enter a valid business email address." } } }));
    await completeRequest(page);
    await expect(page.getByText("Enter a valid business email address.")).toBeVisible();
  });
});

test("the retired cross-border route permanently redirects", async ({ request }) => {
  const response = await request.get("/ecommerce-readiness", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers().location).toBe("/research-services#market-scan");
});

for (const path of ["/about", "/privacy", "/accessibility", "/methodology", "/research", "/how-it-works", "/market-explorer?commodity=4"]) {
  test(`${path} has no serious or critical automated accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await page.locator("[data-loading]").first().waitFor({ state: "detached" }).catch(() => {});
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""));
    expect(blocking.map((violation) => ({ id: violation.id, impact: violation.impact, nodes: violation.nodes.length }))).toEqual([]);
  });
}
