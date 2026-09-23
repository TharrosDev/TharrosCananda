import MiniSearch from "minisearch";
import type { Publication } from "@/data/publications";
import type { ReportAsset } from "@/lib/reports";

/** One archive entry: publication metadata plus its PDF's extracted text, so search reaches inside reports. */
export type ArchiveDoc = {
  slug: string;
  reference: string;
  title: string;
  summary: string;
  tags: string[];
  type: string;
  area: string;
  year: string;
  publishedAt: string;
  text: string;
  pages: number | null;
  cover: string | null;
  file: string | null;
  bytes: number | null;
  specimen: boolean;
  /** Real, published work whose reads and citations are counted. */
  counted: boolean;
  authors: string[];
};

export type ArchiveState = {
  q: string;
  area: string;
  type: string;
  year: string;
  sort: "newest" | "relevance";
};
export type ArchiveResult = ArchiveDoc & { snippet: string | null; terms: string[] };
type Facets = {
  area: Record<string, number>;
  type: Record<string, number>;
  year: Record<string, number>;
};

export const defaultArchiveState: ArchiveState = {
  q: "",
  area: "all",
  type: "all",
  year: "all",
  sort: "newest",
};

export function parseArchiveState(
  params: URLSearchParams,
  allowed: { areas: string[]; types: string[]; years: string[] },
): ArchiveState {
  const pick = (key: string, values: string[]) => {
    const value = params.get(key);
    return value && values.includes(value) ? value : "all";
  };
  return {
    q: (params.get("q") ?? "").slice(0, 120),
    area: pick("area", allowed.areas),
    type: pick("type", allowed.types),
    year: pick("year", allowed.years),
    sort: params.get("sort") === "relevance" ? "relevance" : "newest",
  };
}

export function serializeArchiveState(state: ArchiveState) {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set("q", state.q.trim());
  for (const key of ["area", "type", "year"] as const)
    if (state[key] !== "all") params.set(key, state[key]);
  if (state.sort !== "newest") params.set("sort", state.sort);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function createArchiveIndex(docs: ArchiveDoc[]) {
  const index = new MiniSearch<ArchiveDoc>({
    idField: "slug",
    fields: ["title", "tags", "summary", "text", "reference"],
    extractField: (doc, field) =>
      field === "tags" ? doc.tags.join(" ") : String(doc[field as keyof ArchiveDoc] ?? ""),
    searchOptions: {
      boost: { title: 3, reference: 3, tags: 2, summary: 1.5 },
      fuzzy: 0.3,
      prefix: true,
      combineWith: "AND",
    },
  });
  index.addAll(docs);
  return index;
}

export function runArchiveQuery(
  docs: ArchiveDoc[],
  index: MiniSearch<ArchiveDoc>,
  state: ArchiveState,
): { results: ArchiveResult[]; facets: Facets } {
  // A query with no searchable tokens (e.g. "(((") behaves like no query at all.
  const tokenize = MiniSearch.getDefault("tokenize") as (text: string) => string[];
  const query = tokenize(state.q).some(Boolean) ? state.q.trim() : "";
  const hits = query ? index.search(query) : [];
  const matched = query ? new Map(hits.map((hit) => [hit.id as string, hit])) : null;
  const inQuery = docs.filter((doc) => !matched || matched.has(doc.slug));

  const passes = (doc: ArchiveDoc, skip?: "area" | "type" | "year") =>
    (skip === "area" || state.area === "all" || doc.area === state.area) &&
    (skip === "type" || state.type === "all" || doc.type === state.type) &&
    (skip === "year" || state.year === "all" || doc.year === state.year);

  // Each facet counts against the query and the *other* active filters, so a chip shows what clicking it would give.
  const count = (key: "area" | "type" | "year") => {
    const counts: Record<string, number> = {};
    for (const doc of docs) counts[doc[key]] ??= 0;
    for (const doc of inQuery) if (passes(doc, key)) counts[doc[key]] += 1;
    return counts;
  };

  const results = inQuery
    .filter((doc) => passes(doc))
    .map((doc) => {
      const terms = matched?.get(doc.slug)?.terms ?? [];
      return { ...doc, terms, snippet: terms.length ? snippet(doc.text, terms) : null };
    })
    .sort((a, b) =>
      query && state.sort === "relevance"
        ? matched!.get(b.slug)!.score - matched!.get(a.slug)!.score
        : b.publishedAt.localeCompare(a.publishedAt),
    );

  return { results, facets: { area: count("area"), type: count("type"), year: count("year") } };
}

/** Case-insensitive whole-word pattern for the given terms (regex characters escaped); null when empty. */
export function termPattern(terms: string[], flags = "i") {
  const escaped = terms.filter(Boolean).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return escaped.length ? new RegExp(`\\b(${escaped.join("|")})\\b`, flags) : null;
}

/** Plain-text window around the first matching term, ellipsised; null when no term appears in the text. */
export function snippet(text: string, terms: string[], radius = 80): string | null {
  const lower = text.toLowerCase();
  const found = termPattern(terms)?.exec(text);
  if (!found) return null;
  const at = found.index;
  const start = Math.max(0, lower.lastIndexOf(" ", Math.max(0, at - radius)) + 1);
  const endSpace = lower.indexOf(" ", Math.min(text.length, at + radius));
  const end = endSpace === -1 ? text.length : endSpace;
  return `${start > 0 ? "…" : ""}${text.slice(start, end).replace(/\s+/g, " ").trim()}${end < text.length ? "…" : ""}`;
}

export function readingMinutes(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 230));
}

/** Server-side: joins each publication with its generated PDF asset and extracted text. */
export function buildArchiveDocs(
  publications: Publication[],
  asset: (slug: string) => ReportAsset | undefined,
  text: (slug: string) => string[],
): ArchiveDoc[] {
  return publications.map((p) => {
    const a = asset(p.slug);
    return {
      slug: p.slug,
      reference: p.reference,
      title: p.title,
      summary: p.summary,
      tags: p.tags ?? [],
      type: p.type,
      area: p.area,
      year: p.publishedAt.slice(0, 4),
      publishedAt: p.publishedAt,
      text: text(p.slug).join("\n"),
      pages: a?.pages ?? null,
      cover: a?.cover ?? null,
      file: a?.file ?? null,
      bytes: a?.bytes ?? null,
      specimen: Boolean(p.specimen),
      counted: p.indexable && !p.specimen,
      authors: p.authors,
    };
  });
}
