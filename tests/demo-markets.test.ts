import { describe, expect, it } from "vitest";
import { demoMarkets, findDemoMarket } from "../src/data/demo-markets";

describe("demo market adapter", () => {
  it("matches by product description and HS code", () => {
    expect(findDemoMarket("industrial led lighting")?.slug).toBe("industrial-led-lighting");
    expect(findDemoMarket("940511")?.slug).toBe("industrial-led-lighting");
  });

  it("keeps every synthetic result visibly attributable", () => {
    for (const result of demoMarkets) {
      expect(result.source.notes.toLowerCase()).toContain("synthetic");
      expect(result.source.url).toBeTruthy();
      expect(result.limitations.length).toBeGreaterThan(0);
    }
  });

  it("returns no fabricated fallback for unknown products", () => {
    expect(findDemoMarket("pharmaceutical reactor vessel")).toBeNull();
  });
});
