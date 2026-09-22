import { createHash } from "node:crypto";
import type { Publication } from "@/data/publications";

/** Every file that shapes the printed PDF. The print route reads each by literal path (see its test). */
export const REPORT_SOURCE_PATHS = [
  "src/components/report/report.css",
  "src/components/report/report-document.tsx",
  "src/app/research/[slug]/print/page.tsx",
  "src/lib/citation.ts",
];

/** Fingerprint of the record content plus the PDF-shaping files (line endings normalised). */
export function reportSourceHash(p: Publication, files: string[]) {
  const { slug, reference, title, subtitle, type, area, origin, publishedAt, authors, summary, tags, sources, body } = p;
  const hash = createHash("sha256").update(JSON.stringify({ slug, reference, title, subtitle, type, area, origin, publishedAt, authors, summary, tags, sources, body }));
  for (const file of files) hash.update("\0").update(file.replaceAll("\r\n", "\n"));
  return hash.digest("hex").slice(0, 16);
}
