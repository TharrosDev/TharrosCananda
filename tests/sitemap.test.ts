import { describe, expect, it, vi } from "vitest";

describe("sitemap", () => {
  it("lists indexable reports and their PDFs, never the specimen", async () => {
    vi.resetModules();
    vi.doMock("@/data/publications", async (importOriginal) => {
      const mod = await importOriginal<typeof import("@/data/publications")>();
      const real = { ...mod.researchSpecimenPublication, slug: "real-report", reference: "TC-2026-001", specimen: false, indexable: true };
      return { ...mod, allPublications: [real, mod.researchSpecimenPublication] };
    });
    vi.doMock("@/lib/reports", () => ({
      reportAsset: (slug: string) => ({ file: slug === "real-report" ? "/research/TC-2026-001.pdf" : "/research/TC-EX-000.pdf" }),
    }));
    const { default: sitemap } = await import("../src/app/sitemap");
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://tharros.ca/research/real-report");
    expect(urls).toContain("https://tharros.ca/research/TC-2026-001.pdf");
    expect(urls.some((url) => url.includes("example-report") || url.includes("TC-EX-000"))).toBe(false);
  });
});
