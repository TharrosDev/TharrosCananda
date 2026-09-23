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
  /** "news": a third-party article (e.g. from the Live Monitor); `publisher` is the outlet, not Tharros. */
  kind?: "report" | "news";
  publisher?: string;
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
  if (authors.length >= 3) return `${invertFirst ? invert(authors[0], "full") : authors[0]}, et al.`;
  const formatted = authors.map((name, index) => (index === 0 && invertFirst ? invert(name, "full") : name));
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

const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const mlaMonths = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

/** Citation of a third-party news article: the outlet is the publisher; Tharros appears nowhere. */
function newsCitation(style: CitationStyle, input: CitationInput) {
  const { title, url } = input;
  const outlet = input.publisher ?? new URL(url).hostname;
  // The Toronto calendar date, matching what the Live Monitor shows next to the story.
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Toronto", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(new Date(input.publishedAt));
  const [y, m, d] = (["year", "month", "day"] as const).map((type) => Number(parts.find((p) => p.type === type)?.value));
  const accessed = formatLongDate((input.accessedAt ?? new Date()).toISOString());
  switch (style) {
    case "apa":
      return `${outlet}. (${y}, ${fullMonthNames[m - 1]} ${d}). ${title}. ${url}`;
    case "mla":
      return `"${title}." ${outlet}, ${d} ${mlaMonths[m - 1]} ${y}, ${url}.`;
    case "chicago":
      return `${outlet}. "${title}." ${fullMonthNames[m - 1]} ${d}, ${y}. ${url}.`;
    case "harvard":
      return `${outlet} (${y}) ${title}. Available at: ${url} (Accessed: ${accessed}).`;
  }
}

export function buildCitation(style: CitationStyle, input: CitationInput): string {
  if (input.kind === "news") return newsCitation(style, input);
  const { title, authors, publishedAt, url, reference: ref } = input;
  const accessed = formatLongDate((input.accessedAt ?? new Date()).toISOString());
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
