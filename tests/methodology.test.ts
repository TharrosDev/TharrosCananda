import { describe, expect, it } from "vitest";
import reportText from "../src/data/report-text.json";
import { publicationByReference } from "../src/data/publications";
import { publicSources, seatPlaces } from "../src/data/sources";
import { tracePassages, tracePhrases, traceReference } from "../src/data/trace-example";

describe("methodology worked example", () => {
  const publication = publicationByReference(traceReference)!;
  // The PDF text as extracted: joined lines, footnote markers such as "region.1 A" dropped.
  const text = (reportText as Record<string, string[]>)[publication.slug]
    .join(" ")
    .replace(/\s+/g, " ")
    .replace(/([a-z])\.\d+(?= [A-Z])/g, "$1.");

  it("quotes the published report verbatim", () => {
    for (const passage of tracePassages) expect(text).toContain(passage.text.replace(/\.$/, ""));
  });

  it("places every traced phrase in exactly one passage", () => {
    for (const phrase of tracePhrases)
      expect(tracePassages.filter((passage) => passage.text.includes(phrase.text))).toHaveLength(1);
  });
});

describe("source atlas", () => {
  it("puts every listed publisher's seat on the map, so the counts add up", () => {
    const placed = seatPlaces.flatMap((place) => place.seats as readonly string[]);
    for (const source of publicSources) expect(placed).toContain(source.seat);
    const counted = seatPlaces.reduce(
      (sum, place) =>
        sum +
        publicSources.filter((source) => (place.seats as readonly string[]).includes(source.seat))
          .length,
      0,
    );
    expect(counted).toBe(publicSources.length);
  });
});
