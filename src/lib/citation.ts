import { formatFullMonthYear, formatLongDate } from "@/lib/site";

const LEGACY_PUBLISHER = "Tharros Canada";

export type CitationStyle = "apa" | "mla" | "chicago" | "harvard";

export const citationStyles: { id: CitationStyle; label: string }[] = [
  { id: "apa", label: "APA" },
  { id: "mla", label: "MLA" },
  { id: "chicago", label: "Chicago" },
  { id: "harvard", label: "Harvard" },
];

export type CitationInput = {
  title: string;
  authors: string[];
  publishedAt: string;
  url: string;
  /** Report number, e.g. "TC-2026-001". */
  reference?: string;
  /** Publisher of the cited edition; older records default to Tharros Canada. */
  publisher?: string;
  accessedAt?: Date;
};

function isOrgAuthor(name: string, publisher: string) {
  return name === publisher || name === LEGACY_PUBLISHER;
}

/** APA: "Jane Smith" -> "Smith, J."; MLA/Chicago/Harvard: "Smith, Jane". Organizations pass through. */
function invert(name: string, mode: "initials" | "full", publisher: string) {
  if (isOrgAuthor(name, publisher)) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  const last = parts.pop() as string;
  const given = mode === "full" ? parts.join(" ") : parts.map((part) => `${part[0]}.`).join(" ");
  return `${last}, ${given}`;
}

function joinApa(authors: string[], publisher: string) {
  const inverted = authors.map((name) => invert(name, "initials", publisher));
  if (inverted.length === 1) return inverted[0];
  if (inverted.length === 2) return `${inverted[0]} & ${inverted[1]}`;
  return `${inverted.slice(0, -1).join(", ")}, & ${inverted[inverted.length - 1]}`;
}

function joinNatural(authors: string[], invertFirst: boolean, publisher: string) {
  if (authors.length >= 3)
    return `${invertFirst ? invert(authors[0], "full", publisher) : authors[0]}, et al.`;
  const formatted = authors.map((name, index) =>
    index === 0 && invertFirst ? invert(name, "full", publisher) : name,
  );
  return formatted.join(", and ");
}

function authorsAreJustPublisher(authors: string[], publisher: string) {
  return authors.length === 1 && authors[0] === publisher;
}

/** Adds a trailing period unless the text already ends in one (initials already do). */
function sentence(text: string) {
  return text.endsWith(".") ? `${text} ` : `${text}. `;
}

const longDate = formatLongDate;
const yearMonth = formatFullMonthYear;
const year = (iso: string) => iso.slice(0, 4);

export function buildCitation(style: CitationStyle, input: CitationInput): string {
  const { title, authors, publishedAt, url, reference: ref } = input;
  const publisher = input.publisher?.trim() || LEGACY_PUBLISHER;
  // The reader's own calendar day: toISOString() would give the UTC day, "tomorrow" on a Canadian evening.
  const at = input.accessedAt ?? new Date();
  const accessed = formatLongDate(
    `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, "0")}-${String(at.getDate()).padStart(2, "0")}`,
  );
  const skipAuthor = authorsAreJustPublisher(authors, publisher);

  switch (style) {
    case "apa": {
      const authorPart = skipAuthor ? "" : sentence(joinApa(authors, publisher));
      const publisherPart = skipAuthor ? "" : ` ${publisher}.`;
      return `${authorPart}(${yearMonth(publishedAt)}). ${title}${ref ? ` (Report No. ${ref})` : ""}.${publisherPart} ${url}`.trim();
    }
    case "mla": {
      const authorPart = skipAuthor ? "" : sentence(joinNatural(authors, true, publisher));
      return `${authorPart}"${title}." ${ref ? `${publisher} Report ${ref}, ` : ""}${publisher}, ${longDate(publishedAt)}, ${url}.`.trim();
    }
    case "chicago": {
      const authorPart = skipAuthor ? "" : sentence(joinNatural(authors, true, publisher));
      return `${authorPart}${year(publishedAt)}. "${title}." ${ref ? `Report ${ref}. ` : ""}${publisher}. ${url}.`.trim();
    }
    case "harvard": {
      const authorPart = skipAuthor ? publisher : joinNatural(authors, true, publisher);
      return `${authorPart} (${year(publishedAt)}) ${title}. ${ref ? `Report ${ref}. ` : ""}${publisher}. Available at: ${url} (Accessed: ${accessed}).`;
    }
  }
}
