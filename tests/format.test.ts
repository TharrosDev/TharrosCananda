import { describe, expect, it } from "vitest";
import { demoMarkets } from "../src/data/demo-markets";
import { collectLimitations, formatDelta, formatSourceDate } from "../src/lib/format";

describe("formatting helpers", () => {
  it("signs trend deltas correctly", () => {
    expect(formatDelta(46, "index pts")).toBe("+46 index pts");
    expect(formatDelta(-7, "index pts")).toBe("−7 index pts");
    expect(formatDelta(0, "index pts")).toBe("No change (0 index pts)");
  });

  it("formats source dates by status", () => {
    expect(formatSourceDate(null, "demo")).toMatch(/sample/i);
    expect(formatSourceDate(null, "live")).toBe("Not recorded");
    expect(formatSourceDate("2026-03-14", "live")).toContain("2026");
  });

  it("collects evidence and result limitations without duplicates", () => {
    const all = collectLimitations(demoMarkets[0]);
    expect(all).toContain("Values are synthetic and do not represent current Canadian imports.");
    expect(all).toEqual([...new Set(all)]);
    for (const item of demoMarkets[0].limitations) expect(all).toContain(item);
  });
});
