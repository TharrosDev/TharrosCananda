import { formatFullMonthYear, formatLongDate } from "@/lib/site";

const PUBLISHER = "Tharros Canada";

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
  accessedAt?: Date;
};

function isOrgAuthor(name: string) {
  return name === PUBLISHER;
}

/** APA: "Jane Smith" -> "Smith, J."; MLA/Chicago/Harvard: "Smith, Jane". Organizations pass through. */
function invert(name: string, mode: "initials" | "full" = "initials") {
  if (isOrgAuthor(name)) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  const last = parts.pop() as string;
  const given = mode === "full" ? parts.join(" ") : parts.map((part) => `${part[0]}.`).join(" ");
  return `${last}, ${given}`;
}

function joinApa(authors: string[]) {
  const inverted = authors.map((name) => invert(name));
  if (inverted.length === 1) return inverted[0];
  if (inverted.length === 2) return `${inverted[0]} & ${inverted[1]}`;
  return `${inverted.slice(0, -1).join(", ")}, & ${inverted[inverted.length - 1]}`;
}

function joinNatural(authors: string[], invertFirst: boolean) {
  if (authors.length >= 3)
    return `${invertFirst ? invert(authors[0], "full") : authors[0]}, et al.`;
  const formatted = authors.map((name, index) =>
    index === 0 && invertFirst ? invert(name, "full") : name,
  );
  return formatted.join(", and ");
}

function authorsAreJustPublisher(authors: string[]) {
  return authors.length === 1 && isOrgAuthor(authors[0]);
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
  // The reader's own calendar day: toISOString() would give the UTC day, "tomorrow" on a Canadian evening.
  const at = input.accessedAt ?? new Date();
  const accessed = formatLongDate(
    `${at.getFullYear()}-${String(at.getMonth() + 1).padStart(2, "0")}-${String(at.getDate()).padStart(2, "0")}`,
  );
  const skipAuthor = authorsAreJustPublisher(authors);

  switch (style) {
    case "apa": {
      const authorPart = skipAuthor ? "" : sentence(joinApa(authors));
      const publisherPart = skipAuthor ? "" : ` ${PUBLISHER}.`;
      return `${authorPart}(${yearMonth(publishedAt)}). ${title}${ref ? ` (Report No. ${ref})` : ""}.${publisherPart} ${url}`.trim();
    }
    case "mla": {
      const authorPart = skipAuthor ? "" : sentence(joinNatural(authors, true));
      return `${authorPart}"${title}." ${ref ? `Tharros Canada Report ${ref}, ` : ""}${PUBLISHER}, ${longDate(publishedAt)}, ${url}.`.trim();
    }
    case "chicago": {
      const authorPart = skipAuthor ? "" : sentence(joinNatural(authors, true));
      return `${authorPart}${year(publishedAt)}. "${title}." ${ref ? `Report ${ref}. ` : ""}${PUBLISHER}. ${url}.`.trim();
    }
    case "harvard": {
      const authorPart = skipAuthor ? PUBLISHER : joinNatural(authors, true);
      return `${authorPart} (${year(publishedAt)}) ${title}. ${ref ? `Report ${ref}. ` : ""}${PUBLISHER}. Available at: ${url} (Accessed: ${accessed}).`;
    }
  }
}
