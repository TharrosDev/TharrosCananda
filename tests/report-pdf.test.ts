import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allPublications } from "../src/data/publications";
import { REPORT_CSS_PATH, reportSourceHash } from "../src/lib/report-source";
import { reportAsset, reportText } from "../src/lib/reports";

const css = readFileSync(join(process.cwd(), REPORT_CSS_PATH), "utf8");

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
    expect(asset?.sha, `record or report.css changed; ${regenerate}`).toBe(reportSourceHash(publication, css));
  });

  it("carries searchable text, an outline and its own identity", () => {
    const pages = reportText(slug);
    expect(pages).toHaveLength(asset!.pages);
    const all = pages.join(" ").replace(/\s+/g, " ");
    expect(all).toContain(publication.reference);
    expect(all).toContain(publication.title);
    expect(asset!.outline).toBe(true);
  });
});

it("print route reads the same stylesheet the stale guard hashes", () => {
  const route = readFileSync(join(process.cwd(), "src/app/research/[slug]/print/page.tsx"), "utf8");
  expect(route).toContain(`"${REPORT_CSS_PATH.split("/").join('", "')}"`);
});
