import { describe, expect, it } from "vitest";
import {
  type ArchiveDoc,
  createArchiveIndex,
  pageHits,
  parseArchiveState,
  readingMinutes,
  runArchiveQuery,
  serializeArchiveState,
  snippet,
} from "../src/lib/archive";

const doc = (over: Partial<ArchiveDoc>): ArchiveDoc => ({
  slug: "s",
  reference: "TC-2026-001",
  title: "Title",
  summary: "Summary",
  tags: [],
  type: "Research Report",
  area: "trade-economic-integration",
  year: "2026",
  publishedAt: "2026-09-01",
  text: "",
  pageStarts: [0],
  pages: 3,
  cover: null,
  file: null,
  bytes: null,
  counted: false,
  authors: ["Tharros Canada"],
  contents: [],
  sources: [],
  limitations: [],
  ...over,
});

const docs = [
  doc({
    slug: "a",
    title: "Lorem ipsum dolor",
    text: "Body mentions Vestibulum id ligula porta.",
    publishedAt: "2026-09-01",
    year: "2026",
  }),
  doc({
    slug: "b",
    title: "Defence procurement",
    area: "defence-security",
    type: "Market Note",
    publishedAt: "2025-03-01",
    year: "2025",
  }),
  doc({
    slug: "c",
    title: "Critical minerals",
    area: "energy-resources-industry",
    tags: ["Tariff"],
    publishedAt: "2026-01-01",
    year: "2026",
  }),
];
const allowed = {
  areas: ["trade-economic-integration", "defence-security", "energy-resources-industry"],
  types: ["Research Report", "Market Note"],
  years: ["2026", "2025"],
};
const defaults = { q: "", area: "all", type: "all", year: "all", sort: "newest" as const };

describe("archive state", () => {
  it("falls back to defaults on unknown or garbage params", () => {
    expect(
      parseArchiveState(new URLSearchParams("area=nope&year=abc&sort=x&type=zzz"), allowed),
    ).toEqual(defaults);
  });

  it("round-trips through the URL and omits defaults", () => {
    const state = {
      q: "tariff",
      area: "defence-security",
      type: "Market Note",
      year: "2025",
      sort: "relevance" as const,
    };
    expect(parseArchiveState(new URLSearchParams(serializeArchiveState(state)), allowed)).toEqual(
      state,
    );
    expect(serializeArchiveState(defaults)).toBe("");
  });
});

describe("archive search", () => {
  const index = createArchiveIndex(docs);

  it("finds a report by text only found in its PDF, with a snippet", () => {
    const { results } = runArchiveQuery(docs, index, { ...defaults, q: "vestibulum" });
    expect(results.map((r) => r.slug)).toEqual(["a"]);
    expect(results[0].snippet).toContain("Vestibulum");
  });

  it("tolerates typos", () => {
    expect(
      runArchiveQuery(docs, index, { ...defaults, q: "lorme" }).results.map((r) => r.slug),
    ).toContain("a");
  });

  it("never throws on punctuation or regex characters", () => {
    expect(() => runArchiveQuery(docs, index, { ...defaults, q: "c++ (tariff)" })).not.toThrow();
  });

  it("counts each facet against the other active filters", () => {
    const { results, facets } = runArchiveQuery(docs, index, {
      ...defaults,
      area: "trade-economic-integration",
    });
    expect(results.map((r) => r.slug)).toEqual(["a"]);
    expect(facets.area["defence-security"]).toBe(1);
    expect(facets.year["2025"]).toBe(0);
  });

  it("sorts newest first by default, by relevance only when searching", () => {
    expect(runArchiveQuery(docs, index, defaults).results.map((r) => r.slug)).toEqual([
      "a",
      "c",
      "b",
    ]);
    const relevance = runArchiveQuery(docs, index, {
      ...defaults,
      q: "critical minerals",
      sort: "relevance",
    });
    expect(relevance.results[0].slug).toBe("c");
  });
});

describe("helpers", () => {
  it("builds a plain-text snippet around the first match", () => {
    const text = `${"x ".repeat(100)}Vestibulum id ligula ${"y ".repeat(100)}`;
    const s = snippet(text, ["vestibulum"])!;
    expect(s).toContain("Vestibulum");
    expect(s.startsWith("…")).toBe(true);
    expect(snippet("nothing here", ["zzz"])).toBeNull();
  });

  it("names the page of each match, first match per page", () => {
    const pages = ["Cover page.", "Nothing to see.", "Vestibulum here, vestibulum again."];
    const doc = { text: pages.join("\n"), pageStarts: [0, 12, 28] };
    expect(pageHits(doc, ["vestibulum"])).toEqual([
      { page: 3, term: "Vestibulum", snippet: "Vestibulum here, vestibulum again." },
    ]);
    expect(pageHits(doc, ["zzz"])).toEqual([]);
  });

  it("estimates at least one minute of reading", () => {
    expect(readingMinutes("")).toBe(1);
    expect(readingMinutes("word ".repeat(690))).toBe(3);
  });
});

describe("review fixes", () => {
  const index = createArchiveIndex(docs);
  it("treats a punctuation-only query as no query", () => {
    expect(runArchiveQuery(docs, index, { ...defaults, q: "(((" }).results).toHaveLength(3);
  });
  it("snippets match whole words, not fragments inside other words", () => {
    const s = snippet("We support the port authority.", ["port"])!;
    expect(s).toBe("We support the port authority.");
    expect(snippet("We support it.", ["port"])).toBeNull();
  });
});
