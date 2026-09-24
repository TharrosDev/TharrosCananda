import { describe, expect, it } from "vitest";
import {
  publications,
  publicationByReference,
  publicationBySlug,
  publicationTypes,
} from "../src/data/publications";
import { researchAreas } from "../src/lib/research-areas";

const isoDate = (value: string | undefined) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value ?? "") &&
  new Date(`${value}T00:00:00Z`).toISOString().startsWith(value!);

// docs/REPORT_REQUIREMENTS.md: what every site tool needs from a record.
describe.each(publications.map((p) => [p.slug, p] as const))("report requirements: %s", (_, p) => {
  it("has the identity the viewer, citations and stable URL read", () => {
    expect(p.reference).toMatch(/^TC-\d{4}-\d{3}$/);
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
    expect(p.sources.length, "record-level sources feed the JSON-LD citation list").toBeGreaterThan(
      0,
    );
    for (const source of p.sources) {
      expect(source.url, `${source.title}: url`).toMatch(/^https?:\/\//);
      // The owner wants no retrieval dates on sources.
      expect(source, `${source.title}: no retrievedAt`).not.toHaveProperty("retrievedAt");
    }
  });
});

describe("publication records", () => {
  it("have unique slugs and well-formed unique references", () => {
    const slugs = publications.map((p) => p.slug);
    const refs = publications.map((p) => p.reference);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(refs).size).toBe(refs.length);
    for (const ref of refs) expect(ref).toMatch(/^TC-[A-Z0-9]+-\d{3}$/);
  });

  it("finds a report by slug and by reference, case-insensitively", () => {
    const [first] = publications;
    expect(publicationBySlug(first.slug)).toBe(first);
    expect(publicationByReference(first.reference.toLowerCase())).toBe(first);
    expect(publicationByReference("NOPE")).toBeUndefined();
  });
});
