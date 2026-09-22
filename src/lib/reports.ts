import assets from "@/data/report-pdf.json";
import texts from "@/data/report-text.json";

// Both files are written by scripts/report-pdf.mjs; tests/report-pdf.test.ts keeps them in step with the records.
export type ReportAsset = { file: string; cover: string; pages: number; bytes: number; sha: string; outline: boolean };

export function reportAsset(slug: string): ReportAsset | undefined {
  return (assets as Record<string, ReportAsset>)[slug];
}

/** Extracted PDF text per page, for on-site search. Empty when the report has not been generated. */
export function reportText(slug: string): string[] {
  return (texts as Record<string, string[]>)[slug] ?? [];
}
