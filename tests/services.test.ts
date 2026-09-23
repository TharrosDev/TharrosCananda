import { describe, expect, it } from "vitest";
import { researchNeeds, serviceBySlug, services } from "../src/lib/services";

describe("service definitions", () => {
  it("maps every slug to a research need offered by the form", () => {
    for (const service of services) {
      expect(serviceBySlug(service.slug)?.name).toBe(service.name);
      expect(researchNeeds).toContain(service.name);
    }
    expect(researchNeeds.at(-1)).toBe("Not sure yet");
    expect(researchNeeds).toHaveLength(services.length + 1);
  });
  it("leads with Custom & Partner Research as the single flagship, and lists no prices", () => {
    expect(services.filter((service) => service.flagship).map((service) => service.slug)).toEqual([
      "custom-research",
    ]);
    expect(services[0].flagship).toBe(true);
    expect(JSON.stringify(services)).not.toMatch(/C\$|\bprice/i);
  });
  it("ignores unknown or non-string slugs", () => {
    expect(serviceBySlug("unknown")).toBeUndefined();
    expect(serviceBySlug(["market-assessment"])).toBeUndefined();
    expect(serviceBySlug(undefined)).toBeUndefined();
  });
});
