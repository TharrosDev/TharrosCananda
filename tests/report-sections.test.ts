import { describe, expect, it } from "vitest";
import { publications } from "../src/data/publications";
import { reportContents } from "../src/lib/report-sections";

describe("report contents", () => {
  it("keeps the PDF's bookmarks and drops one for the title itself", () => {
    const [report] = publications;
    const contents = reportContents(report, [
      { title: `${report.title.toUpperCase()}  `, level: 0, page: 1, top: 0.1 },
      { title: "Overview", level: 1, page: 1, top: 0.4 },
      { title: "Bibliography", level: 1, page: 3, top: 0 },
    ]);
    expect(contents).toEqual([
      { title: "Overview", page: 1, top: 0.4 },
      { title: "Bibliography", page: 3, top: 0 },
    ]);
  });
});
