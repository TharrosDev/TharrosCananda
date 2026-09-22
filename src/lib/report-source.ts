import { createHash } from "node:crypto";
import type { Publication } from "@/data/publications";

export const REPORT_CSS_PATH = "src/components/report/report.css";

/** Fingerprint of everything that shapes the printed PDF: record content plus the report stylesheet. */
export function reportSourceHash(p: Publication, css: string) {
  const { slug, reference, title, subtitle, type, area, origin, publishedAt, authors, summary, tags, sources, body } = p;
  const content = JSON.stringify({ slug, reference, title, subtitle, type, area, origin, publishedAt, authors, summary, tags, sources, body });
  return createHash("sha256").update(content).update("\0").update(css.replaceAll("\r\n", "\n")).digest("hex").slice(0, 16);
}
