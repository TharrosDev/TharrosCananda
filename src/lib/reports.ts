import assets from "@/data/report-pdf.json";
import texts from "@/data/report-text.json";

// Both files are written by scripts/report-pdf.mjs; tests/report-pdf.test.ts keeps them in step with the records.
/** One PDF bookmark: `top` is how far down its page the section starts (0 = top edge, 1 = bottom). */
export type OutlineEntry = { title: string; level: number; page: number; top: number };
export type ReportAsset = {
  file: string;
  cover: string;
  pages: number;
  bytes: number;
  sha: string;
  outline: OutlineEntry[];
  /** Page 1 size in PDF points. */
  width: number;
  height: number;
};

export function reportAsset(slug: string): ReportAsset | undefined {
  return (assets as Record<string, ReportAsset>)[slug];
}

/** Extracted PDF text per page, for on-site search. Empty when the report has not been generated. */
export function reportText(slug: string): string[] {
  return (texts as Record<string, string[]>)[slug] ?? [];
}
