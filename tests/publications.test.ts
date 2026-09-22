import { describe, expect, it } from "vitest";
import { allPublications, publicationByReference, publicationBySlug, researchSpecimenPublication } from "../src/data/publications";
import { REPORT_SOURCE_PATHS, reportSourceHash } from "../src/lib/report-source";

describe("publication records", () => {
  it("have unique slugs and well-formed unique references", () => {
    const slugs = allPublications.map((p) => p.slug);
    const refs = allPublications.map((p) => p.reference);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(refs).size).toBe(refs.length);
    for (const ref of refs) expect(ref).toMatch(/^TC-[A-Z0-9]+-\d{3}$/);
  });

  it("never lets a specimen be indexable", () => {
    for (const p of allPublications) if (p.specimen) expect(p.indexable).toBe(false);
  });

  it("finds the specimen by slug and by reference, case-insensitively", () => {
    expect(publicationBySlug("example-report")).toBe(researchSpecimenPublication);
    expect(publicationByReference("tc-ex-000")).toBe(researchSpecimenPublication);
    expect(publicationByReference("NOPE")).toBeUndefined();
  });

  it("hashes content and CSS so either change marks the PDF stale", () => {
    const a = reportSourceHash(researchSpecimenPublication, [".x{}", "markup"]);
    expect(a).toMatch(/^[0-9a-f]{16}$/);
    expect(reportSourceHash(researchSpecimenPublication, [".y{}", "markup"])).not.toBe(a);
    expect(reportSourceHash(researchSpecimenPublication, [".x{}", "other markup"])).not.toBe(a);
    expect(reportSourceHash({ ...researchSpecimenPublication, title: "Changed" }, [".x{}", "markup"])).not.toBe(a);
  });

  it("ignores line-ending differences between Windows and Linux checkouts", () => {
    const windows = reportSourceHash(researchSpecimenPublication, [".x{}\r\n.y{}\r\n"]);
    expect(windows).toBe(reportSourceHash(researchSpecimenPublication, [".x{}\n.y{}\n"]));
  });

  it("fingerprints every file that shapes the PDF, not just the stylesheet", () => {
    expect(REPORT_SOURCE_PATHS).toEqual(
      expect.arrayContaining([
        "src/components/report/report.css",
        "src/components/report/report-document.tsx",
        "src/app/research/[slug]/print/page.tsx",
        "src/lib/citation.ts",
      ]),
    );
  });
});
