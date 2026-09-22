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
  accessedAt?: Date;
};

function isOrgAuthor(name: string) {
  return name === PUBLISHER;
}

/** "Jane Smith" -> "Smith, J."; organizational names pass through unchanged. */
function invert(name: string) {
  if (isOrgAuthor(name)) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  const last = parts.pop() as string;
  const initials = parts.map((part) => `${part[0]}.`).join(" ");
  return `${last}, ${initials}`;
}

function joinApa(authors: string[]) {
  const inverted = authors.map(invert);
  if (inverted.length === 1) return inverted[0];
  if (inverted.length === 2) return `${inverted[0]} & ${inverted[1]}`;
  return `${inverted.slice(0, -1).join(", ")}, & ${inverted[inverted.length - 1]}`;
}

function joinNatural(authors: string[], invertFirst: boolean) {
  if (authors.length >= 3) return `${invertFirst ? invert(authors[0]) : authors[0]}, et al.`;
  const formatted = authors.map((name, index) => (index === 0 && invertFirst ? invert(name) : name));
  return formatted.join(", and ");
}

function authorsAreJustPublisher(authors: string[]) {
  return authors.length === 1 && isOrgAuthor(authors[0]);
}

/** Adds a trailing period unless the text already ends in one (initials already do). */
function sentence(text: string) {
  return text.endsWith(".") ? `${text} ` : `${text}. `;
}

function longDate(iso: string, locale = "en-CA") {
  return new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function yearMonth(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", timeZone: "UTC" });
}

function year(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", timeZone: "UTC" });
}

export function buildCitation(style: CitationStyle, input: CitationInput): string {
  const { title, authors, publishedAt, url } = input;
  const accessedAt = input.accessedAt ?? new Date();
  const accessed = accessedAt.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  const skipAuthor = authorsAreJustPublisher(authors);

  switch (style) {
    case "apa": {
      const authorPart = skipAuthor ? "" : sentence(joinApa(authors));
      const publisherPart = skipAuthor ? "" : ` ${PUBLISHER}.`;
      return `${authorPart}(${yearMonth(publishedAt)}). ${title}.${publisherPart} ${url}`.trim();
    }
    case "mla": {
      const authorPart = skipAuthor ? "" : sentence(joinNatural(authors, true));
      return `${authorPart}"${title}." ${PUBLISHER}, ${longDate(publishedAt)}, ${url}.`.trim();
    }
    case "chicago": {
      const authorPart = skipAuthor ? "" : sentence(joinNatural(authors, true));
      return `${authorPart}${year(publishedAt)}. "${title}." ${PUBLISHER}. ${url}.`.trim();
    }
    case "harvard": {
      const authorPart = skipAuthor ? PUBLISHER : joinNatural(authors, true);
      return `${authorPart} (${year(publishedAt)}) ${title}. ${PUBLISHER}. Available at: ${url} (Accessed: ${accessed}).`;
    }
  }
}
