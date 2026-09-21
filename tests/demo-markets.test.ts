import { describe, expect, it } from "vitest";
import { demoMarkets, demoProvider, findDemoMarket } from "../src/data/demo-markets";

describe("demo market provider", () => {
  it("matches by product description and HS code", () => {
    expect(findDemoMarket("industrial led lighting")?.slug).toBe("industrial-led-lighting");
    expect(findDemoMarket("940511")?.slug).toBe("industrial-led-lighting");
    expect(findDemoMarket("9405.11")?.slug).toBe("industrial-led-lighting");
  });

  it("does not match on a single stray digit", () => {
    expect(findDemoMarket("9")).toBeNull();
  });

  it("returns a not-found outcome rather than a fabricated fallback", async () => {
    await expect(demoProvider.search("  pharmaceutical reactor vessel ")).resolves.toEqual({
      kind: "not-found",
      query: "pharmaceutical reactor vessel",
    });
    const found = await demoProvider.search("Specialty food packaging");
    expect(found.kind === "found" && found.result.slug).toBe("specialty-food-packaging");
  });

  it("keeps every sample visibly synthetic and traceable", () => {
    expect(demoProvider.status).toBe("demo");
    for (const result of demoMarkets) {
      expect(result.status).toBe("demo");
      expect(result.limitations.length).toBeGreaterThan(0);
      expect(result.sources.length).toBeGreaterThan(0);
      for (const source of result.sources) {
        expect(source.notes.toLowerCase()).toContain("synthetic");
        expect(source.url).toBeTruthy();
        // Samples were never retrieved from a publisher, so no retrieval date may be claimed.
        expect(source.retrievedAt).toBeNull();
      }
      const ids = new Set(result.sources.map((source) => source.id));
      for (const block of [result.trend, result.provinces, result.routes, result.resources]) {
        expect(block.sourceIds.length).toBeGreaterThan(0);
        for (const id of block.sourceIds) expect(ids.has(id)).toBe(true);
      }
    }
  });
});
