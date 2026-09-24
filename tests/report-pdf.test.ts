import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { publications } from "../src/data/publications";
import { reportAsset, reportText } from "../src/lib/reports";

// Reads files only (no browser), so it stays cheap however many reports the archive holds.
describe.each(publications.map((p) => [p.slug, p] as const))("report %s", (slug, publication) => {
  const asset = reportAsset(slug);

  it("has its PDF and cover", () => {
    expect(asset, `run: npm run report:pdf -- ${slug}`).toBeDefined();
    const file = join(process.cwd(), "public", asset!.file);
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBe(asset!.bytes);
    expect(existsSync(join(process.cwd(), "public", asset!.cover))).toBe(true);
  });

  it("serves the PDF exactly as the author sent it", () => {
    const bytes = readFileSync(join(process.cwd(), "public", asset!.file));
    const sha = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
    expect(sha, "Rule #1: the PDF was changed after intake (docs/REPORT_REQUIREMENTS.md)").toBe(
      asset!.sha,
    );
    expect(asset!.width).toBeGreaterThan(0);
    expect(asset!.height).toBeGreaterThan(0);
  });

  it("carries searchable text with the title", () => {
    const pages = reportText(slug);
    expect(pages).toHaveLength(asset!.pages);
    const all = pages.join(" ").replace(/\s+/g, " ");
    expect(all.toLowerCase()).toContain(publication.title.replace(/\s+/g, " ").toLowerCase());
  });
});
