import { describe, expect, it } from "vitest";
import { buildCitation } from "../src/lib/citation";

const orgReport = {
  title: "Canada–Europe trade corridors: a 2026 review",
  authors: ["Tharros Canada"],
  publishedAt: "2026-03-15",
  url: "https://tharros.ca/research/trade-corridors-2026",
  accessedAt: new Date("2026-09-22"),
};

const namedReport = {
  title: "Defence procurement pathways",
  authors: ["Jane Smith", "Alex Chen"],
  publishedAt: "2026-06-01",
  url: "https://tharros.ca/research/defence-procurement",
  accessedAt: new Date("2026-09-22"),
};

describe("buildCitation", () => {
  it("omits the author line in APA/MLA/Chicago/Harvard when the author is just the publisher", () => {
    expect(buildCitation("apa", orgReport)).toBe(
      "(March 2026). Canada–Europe trade corridors: a 2026 review. https://tharros.ca/research/trade-corridors-2026",
    );
    expect(buildCitation("mla", orgReport)).toContain('"Canada–Europe trade corridors: a 2026 review." Tharros Canada,');
    expect(buildCitation("harvard", orgReport)).toContain("Tharros Canada (2026)");
  });

  it("inverts personal author names and joins multiple authors", () => {
    expect(buildCitation("apa", namedReport)).toBe(
      "Smith, J. & Chen, A. (June 2026). Defence procurement pathways. Tharros Canada. https://tharros.ca/research/defence-procurement",
    );
    expect(buildCitation("mla", namedReport)).toBe(
      'Smith, Jane, and Alex Chen. "Defence procurement pathways." Tharros Canada, June 1, 2026, https://tharros.ca/research/defence-procurement.',
    );
  });

  it("includes an access date in Harvard citations", () => {
    expect(buildCitation("harvard", namedReport)).toContain("Accessed: September 22, 2026");
  });
  it("keeps full first names for MLA and Chicago, initials only for APA", () => {
    expect(buildCitation("mla", namedReport)).toBe(
      'Smith, Jane, and Alex Chen. "Defence procurement pathways." Tharros Canada, June 1, 2026, https://tharros.ca/research/defence-procurement.',
    );
    expect(buildCitation("chicago", namedReport)).toBe(
      'Smith, Jane, and Alex Chen. 2026. "Defence procurement pathways." Tharros Canada. https://tharros.ca/research/defence-procurement.',
    );
    expect(buildCitation("apa", namedReport)).toContain("Smith, J. & Chen, A.");
  });

  it("adds the report number when a reference is given", () => {
    const withRef = { ...namedReport, reference: "TC-2026-001" };
    expect(buildCitation("apa", withRef)).toBe(
      "Smith, J. & Chen, A. (June 2026). Defence procurement pathways (Report No. TC-2026-001). Tharros Canada. https://tharros.ca/research/defence-procurement",
    );
    expect(buildCitation("mla", withRef)).toContain('"Defence procurement pathways." Tharros Canada Report TC-2026-001, Tharros Canada,');
    expect(buildCitation("chicago", withRef)).toContain('"Defence procurement pathways." Report TC-2026-001. Tharros Canada.');
    expect(buildCitation("harvard", withRef)).toContain("Defence procurement pathways. Report TC-2026-001. Tharros Canada.");
  });
});
