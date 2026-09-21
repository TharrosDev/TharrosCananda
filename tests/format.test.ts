import { describe, expect, it } from "vitest";
import { formatDelta, formatSourceDate } from "../src/lib/format";

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
});
