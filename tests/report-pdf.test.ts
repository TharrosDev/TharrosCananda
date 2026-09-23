import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allPublications } from "../src/data/publications";
import { REPORT_SOURCE_PATHS, reportSourceHash } from "../src/lib/report-source";
import { reportAsset, reportText } from "../src/lib/reports";

const sourceFiles = REPORT_SOURCE_PATHS.map((path) => readFileSync(join(process.cwd(), path), "utf8"));

describe.each(allPublications.map((p) => [p.slug, p] as const))("report %s", (slug, publication) => {
  const asset = reportAsset(slug);
  const regenerate = `run: npm run build && npm run report:pdf -- ${slug}`;

  it("has a generated PDF", () => {
    expect(asset, regenerate).toBeDefined();
    const file = join(process.cwd(), "public", asset!.file);
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBe(asset!.bytes);
    expect(existsSync(join(process.cwd(), "public", asset!.cover))).toBe(true);
  });

  it("is not stale", () => {
    if (publication.supplied) return;
    expect(asset?.sha, `record or a PDF-shaping file changed; ${regenerate}`).toBe(reportSourceHash(publication, sourceFiles));
  });

  it("serves a supplied PDF exactly as the author sent it", () => {
    if (!publication.supplied) return;
    const bytes = readFileSync(join(process.cwd(), "public", asset!.file));
    const sha = createHash("sha256").update(bytes).digest("hex").slice(0, 16);
    expect(sha, "Rule #1: the supplied PDF was changed after intake (docs/REPORT_REQUIREMENTS.md)").toBe(asset!.sha);
    expect(asset!.width).toBeGreaterThan(0);
    expect(asset!.height).toBeGreaterThan(0);
  });

  it("carries searchable text, an outline and its own identity", () => {
    const pages = reportText(slug);
    expect(pages).toHaveLength(asset!.pages);
    const all = pages.join(" ").replace(/\s+/g, " ");
    expect(all.toLowerCase()).toContain(publication.title.replace(/\s+/g, " ").toLowerCase());
    // A supplied PDF need not print the site's reference or carry bookmarks; the site cannot add either without editing it.
    if (publication.supplied) return;
    expect(all).toContain(publication.reference);
    expect(asset!.outline.length).toBeGreaterThan(0);
    for (const entry of asset!.outline) {
      expect(entry.page).toBeGreaterThanOrEqual(1);
      expect(entry.page).toBeLessThanOrEqual(asset!.pages);
      expect(entry.top).toBeGreaterThanOrEqual(0);
      expect(entry.top).toBeLessThanOrEqual(1);
    }
  });
});

it("print route fingerprints the same files as the stale guard", () => {
  const route = readFileSync(join(process.cwd(), "src/app/research/[slug]/print/page.tsx"), "utf8");
  for (const path of REPORT_SOURCE_PATHS) expect(route).toContain(`"${path.split("/").join('", "')}"`);
});
