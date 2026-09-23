import type { Publication, PublicationSource, ReportBlock } from "@/data/publications";
import type { OutlineEntry } from "@/lib/reports";

export type ContentsEntry = { title: string; number?: number; page: number; top: number };

type Heading = { text: string; number?: number };

function headings(blocks: ReportBlock[]): Heading[] {
  return blocks.flatMap((block) =>
    block.kind === "heading" ? [{ text: block.text, number: block.number }]
      : block.kind === "columns" ? [...headings(block.left), ...headings(block.right)]
        : [],
  );
}

// Chromium builds PDF bookmarks from laid-out text, so line breaks and the number span lose their spaces
// ("dolorsit", "1Lorem"). Compare letters and digits only, then show the record's own wording.
const squash = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/** The report's sections for the contents list: PDF bookmark positions with the record's heading text. The title bookmark is dropped. */
export function reportContents(publication: Publication, outline: OutlineEntry[]): ContentsEntry[] {
  const known = [...headings(publication.body), { text: "Suggested citation" }];
  const title = squash(publication.title);
  return outline
    .filter((entry) => squash(entry.title) !== title)
    .map((entry) => {
      const match = known.find((h) => squash(`${h.number ?? ""}${h.text}`) === squash(entry.title));
      return match ? { title: match.text, number: match.number, page: entry.page, top: entry.top } : { title: entry.title, page: entry.page, top: entry.top };
    });
}

function blocksAfter(blocks: ReportBlock[], pattern: RegExp): ReportBlock[] | null {
  const start = blocks.findIndex((b) => b.kind === "heading" && pattern.test(b.text));
  if (start !== -1) {
    const end = blocks.findIndex((b, i) => i > start && b.kind === "heading");
    return blocks.slice(start + 1, end === -1 ? undefined : end);
  }
  for (const block of blocks) {
    if (block.kind !== "columns") continue;
    const found = blocksAfter(block.left, pattern) ?? blocksAfter(block.right, pattern);
    if (found) return found;
  }
  return null;
}

/** Stated limitations, as plain lines, from the section headed "Limitations". */
export function reportLimitations(publication: Publication): string[] {
  return (blocksAfter(publication.body, /^limitations?$/i) ?? []).flatMap((block) =>
    block.kind === "list" ? block.items : block.kind === "paragraph" ? [block.text] : [],
  );
}

function sourceBlocks(blocks: ReportBlock[]): PublicationSource[] {
  return blocks.flatMap((block) =>
    block.kind === "sources" ? block.items : block.kind === "columns" ? [...sourceBlocks(block.left), ...sourceBlocks(block.right)] : [],
  );
}

/** Every source the report cites (record-level and in the body), once each. */
export function reportSources(publication: Publication): PublicationSource[] {
  const seen = new Set<string>();
  return [...publication.sources, ...sourceBlocks(publication.body)].filter((source) => {
    const key = JSON.stringify([source.publisher, source.title, source.url, source.period, source.retrievedAt]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
