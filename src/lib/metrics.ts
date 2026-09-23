import { createHmac } from "node:crypto";
import { allPublications } from "@/data/publications";
import { supabaseServer as supabase } from "@/lib/supabase";

// Server-only: read and citation counts for published research (docs/OPERATIONS.md, Research readership).

export type MetricKind = "read" | "cite";
export type Counts = { reads: number; citations: number };

/** Only real, published work is counted; the lorem specimen never is. */
export function isCountedSlug(slug: unknown): slug is string {
  return (
    typeof slug === "string" &&
    allPublications.some((p) => p.slug === slug && p.indexable && !p.specimen)
  );
}

const botPattern =
  /bot|crawl|spider|slurp|scrap|headless|lighthouse|pagespeed|preview|facebookexternalhit|embedly|python|curl|wget|httpclient|okhttp|axios|node-fetch|go-http|java\//i;
export const isBot = (userAgent: string) => !userAgent || botPattern.test(userAgent);

/**
 * Pseudonymous reader key: never the IP itself, and different for every publication. Keyed on the IP alone
 * (not the user agent, which is free to forge), so inflating a count needs a new IP per read. People sharing
 * one network count as one reader: deliberately conservative.
 */
export function readerKey(secret: string, ip: string, slug: string) {
  return createHmac("sha256", secret).update(`${ip}|${slug}`).digest("hex").slice(0, 32);
}

export const metricsSecret = () => process.env.METRICS_SECRET?.trim() || null;

/** Records one event; the database decides whether it is new. Failures are swallowed: counting is never worth an error. */
export async function recordEvent(slug: string, kind: MetricKind, reader: string) {
  const db = supabase();
  if (!db) return;
  try {
    const response = await fetch(`${db.url}/rest/v1/rpc/record_publication_event`, {
      method: "POST",
      headers: { ...db.headers, "Content-Type": "application/json" },
      body: JSON.stringify({ p_slug: slug, p_kind: kind, p_reader: reader }),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) console.error(`[research-event] database returned ${response.status}`);
  } catch {
    console.error("[research-event] database unreachable");
  }
}

/** All counts keyed by slug, refreshed every 10 minutes; null when unavailable so pages hide counts instead of guessing. */
export async function publicationCounts(): Promise<Record<string, Counts> | null> {
  const db = supabase();
  if (!db) return null;
  try {
    const response = await fetch(
      `${db.url}/rest/v1/publication_counts?select=slug,reads,citations`,
      {
        headers: db.headers,
        next: { revalidate: 600 },
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!response.ok) return null;
    const rows = (await response.json()) as { slug: string; reads: number; citations: number }[];
    return Object.fromEntries(
      rows.map((row) => [row.slug, { reads: Number(row.reads), citations: Number(row.citations) }]),
    );
  } catch {
    return null;
  }
}
