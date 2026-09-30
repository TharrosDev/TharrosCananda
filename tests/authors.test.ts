import { describe, expect, it } from "vitest";
import { authorByName, authorBySlug, publicationsForAuthor } from "../src/data/authors";
import { publications } from "../src/data/publications";

describe("author profiles", () => {
  it("resolves the supplied byline and its profile route to the same author", () => {
    const author = authorBySlug("magnus-abdelnour");
    expect(author?.name).toBe("Magnus Abdelnour");
    expect(authorByName("Magnus Abdelnour")).toBe(author);
  });

  it("does not resolve unknown authors or inherited object keys", () => {
    for (const unknown of ["missing-author", "constructor", "toString", "__proto__"]) {
      expect(authorBySlug(unknown)).toBeUndefined();
      expect(authorByName(unknown)).toBeUndefined();
      expect(publicationsForAuthor(unknown)).toEqual([]);
    }
  });

  it("lists the author's actual publications newest first without changing their indexing", () => {
    const works = publicationsForAuthor("magnus-abdelnour");
    expect(works.map((publication) => publication.reference)).toEqual(
      expect.arrayContaining(["TC-2026-002", "TC-2026-001"]),
    );
    const dates = works.map((publication) => publication.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(works.every((publication) => publication.authors.includes("Magnus Abdelnour"))).toBe(
      true,
    );
    for (const publication of works)
      expect(publication).toBe(publications.find((source) => source.slug === publication.slug));
    expect(authorBySlug("magnus-abdelnour")?.indexable).toBe(false);
  });
});
