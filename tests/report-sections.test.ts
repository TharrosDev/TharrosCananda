import { describe, expect, it } from "vitest";
import { researchSpecimenPublication as specimen } from "../src/data/publications";
import { reportContents, reportLimitations, reportSources } from "../src/lib/report-sections";
import { reportAsset } from "../src/lib/reports";

describe("report sections", () => {
  it("maps squashed PDF bookmark titles back to the record's headings and drops the title", () => {
    const contents = reportContents(specimen, [
      { title: "Lorem ipsum dolorsit amet, consecteturadipiscing elit.", level: 0, page: 1, top: 0.1 },
      { title: "Executive summary", level: 1, page: 1, top: 0.4 },
      { title: "2Methodology", level: 1, page: 2, top: 0.5 },
      { title: "Unknown bookmark", level: 1, page: 3, top: 0 },
    ]);
    expect(contents).toEqual([
      { title: "Executive summary", number: undefined, page: 1, top: 0.4 },
      { title: "Methodology", number: 2, page: 2, top: 0.5 },
      { title: "Unknown bookmark", page: 3, top: 0 },
    ]);
  });

  it("resolves every bookmark of the generated specimen PDF", () => {
    const contents = reportContents(specimen, reportAsset(specimen.slug)!.outline);
    expect(contents.map((c) => c.title)).toContain("Limitations");
    expect(contents.every((c) => !/^\d/.test(c.title))).toBe(true);
  });

  it("reads limitations inside columns and de-duplicates sources", () => {
    expect(reportLimitations(specimen)).toHaveLength(3);
    expect(reportSources(specimen)).toHaveLength(1);
    expect(reportLimitations({ ...specimen, body: [] })).toEqual([]);
  });
});
