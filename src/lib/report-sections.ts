import type { Publication } from "@/data/publications";
import type { OutlineEntry } from "@/lib/reports";

export type ContentsEntry = { title: string; page: number; top: number };

const squash = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/** The report's sections for the contents list: the PDF's own bookmarks, without a bookmark for the title itself. */
export function reportContents(publication: Publication, outline: OutlineEntry[]): ContentsEntry[] {
  const title = squash(publication.title);
  return outline
    .filter((entry) => squash(entry.title) !== title)
    .map(({ title, page, top }) => ({ title, page, top }));
}
