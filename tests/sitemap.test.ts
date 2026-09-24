import { describe, expect, it, vi } from "vitest";

describe("sitemap", () => {
  it("lists indexable reports and their PDFs, never a non-indexable one", async () => {
    vi.resetModules();
    vi.doMock("@/data/publications", async (importOriginal) => {
      const mod = await importOriginal<typeof import("@/data/publications")>();
      const [base] = mod.publications;
      const real = { ...base, slug: "real-report", reference: "TC-2026-901", indexable: true };
      const hidden = { ...base, slug: "hidden-report", reference: "TC-2026-902", indexable: false };
      return { ...mod, publications: [real, hidden] };
    });
    vi.doMock("@/lib/reports", () => ({
      reportAsset: (slug: string) => ({
        file: slug === "real-report" ? "/research/TC-2026-901.pdf" : "/research/TC-2026-902.pdf",
      }),
    }));
    const { default: sitemap } = await import("../src/app/sitemap");
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://tharros.ca/research/real-report");
    expect(urls).toContain("https://tharros.ca/research/TC-2026-901.pdf");
    expect(urls.some((url) => url.includes("hidden-report") || url.includes("TC-2026-902"))).toBe(
      false,
    );
  });
});
