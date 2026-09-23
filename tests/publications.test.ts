import { describe, expect, it } from "vitest";
import {
  allPublications,
  publicationByReference,
  publicationBySlug,
  publicationTypes,
  researchSpecimenPublication,
} from "../src/data/publications";
import { REPORT_SOURCE_PATHS, reportSourceHash } from "../src/lib/report-source";
import { researchAreas } from "../src/lib/research-areas";

const isoDate = (value: string | undefined) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value!);

// docs/REPORT_REQUIREMENTS.md: what every site tool needs from a record. The specimen is held to the same rules.
describe.each(allPublications.map((p) => [p.slug, p] as const))("report requirements: %s", (_, p) => {
  it("has the identity the viewer, citations and stable URL read", () => {
    expect(p.reference).toMatch(/^TC-(\d{4}|EX)-\d{3}$/);
    expect(isoDate(p.publishedAt), `publishedAt ${p.publishedAt}`).toBe(true);
    expect(p.title.trim()).not.toBe("");
    expect(p.authors.length).toBeGreaterThan(0);
    for (const author of p.authors) expect(author.trim()).not.toBe("");
  });

  it("files into a real area and type for the archive facets and OG image", () => {
    expect(researchAreas.map((a) => a.slug)).toContain(p.area);
    expect(publicationTypes.map((t) => t.name)).toContain(p.type);
  });

  it("carries the metadata search, JSON-LD and the PDF keywords read", () => {
    expect(p.summary.trim()).not.toBe("");
    expect(p.tags?.length, "tags").toBeGreaterThan(0);
    expect(p.sources.length, "record-level sources feed the JSON-LD citation list").toBeGreaterThan(0);
    for (const source of p.sources) {
      expect(source.url, `${source.title}: url`).toMatch(/^https?:\/\//);
      expect(isoDate(source.retrievedAt), `${source.title}: retrievedAt ${source.retrievedAt}`).toBe(true);
    }
  });

  it("keeps a supplied PDF free of typeset body blocks", () => {
    if (p.supplied) expect(p.body).toEqual([]);
  });
});

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
