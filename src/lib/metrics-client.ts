import { privacySignal } from "@/lib/analytics";
import { readStorage, writeStorage } from "@/lib/storage";

type Kind = "read" | "cite";
const DAY = 86_400_000;
// How long this browser remembers an event it already sent (the server enforces the same windows).
const windowMs: Record<Kind, number> = { read: 30 * DAY, cite: 365 * DAY };

/** True when this browser already sent this event inside its window. */
export function alreadyCounted(storedAt: string | null, kind: Kind, now = Date.now()) {
  const at = Number(storedAt);
  return Number.isFinite(at) && at > 0 && now - at < windowMs[kind];
}

/** Sends a read or citation once per window; silent on any failure. */
export function sendMetric(slug: string, kind: Kind) {
  if (privacySignal()) return;
  const key = `tharros.metric.${kind}.${slug}`;
  if (alreadyCounted(readStorage(key), kind)) return;
  writeStorage(key, String(Date.now()));
  void fetch("/api/research-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slug, kind }),
    keepalive: true,
  }).catch(() => {});
}

// Grouping by hand, not toLocaleString: identical on server and every browser (no hydration drift).
const group = (n: number) => String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const plural = (n: number, one: string, many: string) => `${group(n)} ${n === 1 ? one : many}`;

/** "1,240 reads · 38 citations"; zero parts are left out, and null means show nothing. */
export function formatCounts(counts: { reads: number; citations: number } | undefined) {
  if (!counts) return null;
  const parts = [
    counts.reads > 0 && plural(counts.reads, "read", "reads"),
    counts.citations > 0 && plural(counts.citations, "citation", "citations"),
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}
