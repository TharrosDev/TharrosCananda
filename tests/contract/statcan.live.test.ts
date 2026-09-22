// Live contract test against the real Statistics Canada WDS: `npm run test:contract` (CI runs it weekly).
import { describe, expect, it } from "vitest";
import { fetchCetaGroupSummary, fetchCetaTradeSeries, officialWdsBaseUrl } from "../../src/lib/statcan";

describe.runIf(process.env.STATCAN_CONTRACT === "1")("Statistics Canada WDS contract (live)", () => {
  it.each(["imports", "exports"])("returns a valid CETA %s series", async (flow) => {
    const data = await fetchCetaTradeSeries({ flow }, { baseUrl: officialWdsBaseUrl });
    expect(data.points.length).toBeGreaterThanOrEqual(13);
    expect(data.query.agreement).toMatch(/CETA/);
  }, 30_000);

  it("returns every offered commodity group in one request", async () => {
    const summary = await fetchCetaGroupSummary("imports", { baseUrl: officialWdsBaseUrl });
    expect(summary.groups.length).toBeGreaterThan(5);
  }, 30_000);
});
