import { type MonitorArticle, type MonitorTopicId, type MonitorWindowId, monitorTopics, monitorWindows } from "@/lib/live-monitor";

export type MonitorView = "editorial" | "compact";
export type MonitorViewState = { q: string; topics: MonitorTopicId[]; sources: string[]; window: MonitorWindowId; view: MonitorView };

const topicIds = monitorTopics.map((t) => t.id) as MonitorTopicId[];
const windowIds = monitorWindows.map((w) => w.id) as MonitorWindowId[];
const list = (value: string | null) => (value ? value.split(",").map((v) => v.trim()).filter(Boolean) : []);

export function parseMonitorState(params: URLSearchParams, knownSources: string[]): MonitorViewState {
  const window = params.get("window") as MonitorWindowId;
  return {
    q: (params.get("q") ?? "").slice(0, 120),
    topics: list(params.get("topics")).filter((t): t is MonitorTopicId => topicIds.includes(t as MonitorTopicId)),
    sources: list(params.get("sources")).filter((s) => knownSources.includes(s)),
    window: windowIds.includes(window) ? window : "7d",
    view: params.get("view") === "compact" ? "compact" : "editorial",
  };
}

export function serializeMonitorState(state: MonitorViewState) {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set("q", state.q.trim());
  if (state.topics.length) params.set("topics", state.topics.join(","));
  if (state.sources.length) params.set("sources", state.sources.join(","));
  if (state.window !== "7d") params.set("window", state.window);
  if (state.view !== "editorial") params.set("view", state.view);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function filterArticles(articles: MonitorArticle[], state: MonitorViewState, referenceTime: number) {
  const hours = monitorWindows.find((w) => w.id === state.window)?.hours ?? 168;
  const cutoff = referenceTime - hours * 3_600_000;
  const needle = state.q.trim().toLowerCase();
  return articles.filter((a) => {
    const published = Date.parse(a.publishedAt);
    if (!Number.isFinite(published) || published < cutoff || published > referenceTime) return false;
    if (state.topics.length && !state.topics.some((t) => a.topics.includes(t))) return false;
    if (state.sources.length && !state.sources.includes(a.domain)) return false;
    return !needle || [a.title, a.description, a.domain].join(" ").toLowerCase().includes(needle);
  });
}

const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Calendar day in a time zone as a comparable day number plus a "Sep 20" label (locale-free). */
function day(time: number, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(time);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const [y, m, d] = [get("year"), get("month"), get("day")];
  return { key: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`, index: Date.UTC(y, m - 1, d) / 86_400_000, label: `${shortMonths[m - 1]} ${d}` };
}

export function groupByDay(articles: MonitorArticle[], timeZone = "America/Toronto", referenceTime: number) {
  const today = day(referenceTime, timeZone).index;
  const groups = new Map<string, { key: string; label: string; items: MonitorArticle[] }>();
  for (const a of articles) {
    const d = day(Date.parse(a.publishedAt), timeZone);
    const label = d.index === today ? "Today" : d.index === today - 1 ? "Yesterday" : d.label;
    if (!groups.has(d.key)) groups.set(d.key, { key: d.key, label, items: [] });
    groups.get(d.key)!.items.push(a);
  }
  return [...groups.values()].sort((x, y) => y.key.localeCompare(x.key));
}

/** Stories published after the previous visit; nothing is "new" on a first visit. */
export function newSince(articles: MonitorArticle[], lastVisit: number | null) {
  if (lastVisit === null || !Number.isFinite(lastVisit)) return new Set<string>();
  return new Set(articles.filter((a) => Date.parse(a.publishedAt) > lastVisit).map((a) => a.id));
}

export function topicVolume(articles: MonitorArticle[], referenceTime: number, days = 7, timeZone = "America/Toronto") {
  const volume = Object.fromEntries(topicIds.map((id) => [id, Array<number>(days).fill(0)])) as Record<MonitorTopicId, number[]>;
  if (!Number.isFinite(referenceTime)) return volume;
  const today = day(referenceTime, timeZone).index;
  for (const a of articles) {
    const offset = today - day(Date.parse(a.publishedAt), timeZone).index;
    if (offset < 0 || offset >= days) continue;
    for (const t of a.topics) volume[t][days - 1 - offset] += 1;
  }
  return volume;
}

export function topSources(articles: MonitorArticle[], n = 5) {
  const counts = new Map<string, number>();
  for (const a of articles) counts.set(a.domain, (counts.get(a.domain) ?? 0) + 1);
  return [...counts].map(([domain, count]) => ({ domain, count })).sort((x, y) => y.count - x.count || x.domain.localeCompare(y.domain)).slice(0, n);
}

/** Splits text around case-insensitive literal matches of q; rendered as React text, never HTML. */
export function highlightSegments(text: string, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return [{ text, match: false }];
  const out: { text: string; match: boolean }[] = [];
  const lower = text.toLowerCase();
  let from = 0;
  for (let at = lower.indexOf(needle); at !== -1; at = lower.indexOf(needle, from)) {
    if (at > from) out.push({ text: text.slice(from, at), match: false });
    out.push({ text: text.slice(at, at + needle.length), match: true });
    from = at + needle.length;
  }
  if (from < text.length) out.push({ text: text.slice(from), match: false });
  return out;
}

// Private browsing and blocked storage throw on access; the monitor must work without persistence.
type StorageArea = "local" | "session";
// Accessing either area can throw (blocked cookies, private modes), so every call is guarded.
const storage = (area: StorageArea) => (area === "session" ? globalThis.sessionStorage : globalThis.localStorage);

export function readStorage(key: string, area: StorageArea = "local") {
  try {
    return storage(area)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string, area: StorageArea = "local") {
  try {
    storage(area)?.setItem(key, value);
  } catch {
    // Persistence is a convenience only.
  }
}

export function removeStorage(key: string, area: StorageArea = "local") {
  try {
    storage(area)?.removeItem(key);
  } catch {
    // Persistence is a convenience only.
  }
}
