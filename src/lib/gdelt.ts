import "server-only";
import { unstable_cache } from "next/cache";
import {
  monitorTopics,
  type LiveMonitorSnapshot,
  type MonitorArticle,
  type MonitorTopicId,
} from "@/lib/live-monitor";

const DEFAULT_BASE_URL = "https://api.gdeltproject.org/api/v2/doc/doc";
const MAX_RECORDS = 75;
const FETCH_TIMEOUT_MS = 6500;

type GdeltArticle = {
  url?: unknown;
  title?: unknown;
  seendate?: unknown;
  domain?: unknown;
  language?: unknown;
  sourcecountry?: unknown;
};

type GdeltPayload = { articles?: unknown };

function asCleanText(value: unknown) {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function parseSeenDate(value: unknown) {
  const text = asCleanText(value);
  const compact = text.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (compact) {
    const [, year, month, day, hour, minute, second] = compact;
    return new Date(year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + "Z").toISOString();
  }
  const parsed = Date.parse(text);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

function normaliseUrl(value: unknown) {
  const text = asCleanText(value);
  try {
    const url = new URL(text);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function articleId(url: string) {
  let hash = 2166136261;
  for (let index = 0; index < url.length; index += 1) {
    hash ^= url.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0).toString(36);
}

function buildQuery(topicId: MonitorTopicId) {
  const topic = monitorTopics.find((item) => item.id === topicId);
  if (!topic) throw new Error("Unknown Live Monitor topic.");
  return '(Canada OR Canadian) (Europe OR European OR "European Union") ' + topic.query;
}

export function parseGdeltArticles(payload: unknown, topicId: MonitorTopicId): MonitorArticle[] {
  if (!payload || typeof payload !== "object" || !Array.isArray((payload as GdeltPayload).articles)) {
    throw new Error("GDELT returned an unexpected response.");
  }

  const seen = new Set<string>();
  const articles: MonitorArticle[] = [];
  for (const raw of (payload as { articles: GdeltArticle[] }).articles) {
    if (!raw || typeof raw !== "object") continue;
    const url = normaliseUrl(raw.url);
    const title = asCleanText(raw.title);
    const seenAt = parseSeenDate(raw.seendate);
    if (!url || !title || !seenAt || seen.has(url)) continue;
    seen.add(url);
    articles.push({
      id: articleId(url),
      title,
      url,
      domain: asCleanText(raw.domain) || new URL(url).hostname.replace(/^www\./, ""),
      sourceCountry: asCleanText(raw.sourcecountry) || "Not supplied",
      language: asCleanText(raw.language) || "Not supplied",
      seenAt,
      topics: [topicId],
    });
  }
  return articles;
}

async function fetchTopic(topicId: MonitorTopicId) {
  const baseUrl = process.env.GDELT_DOC_BASE_URL ?? DEFAULT_BASE_URL;
  const url = new URL(baseUrl);
  url.searchParams.set("query", buildQuery(topicId));
  url.searchParams.set("mode", "artlist");
  url.searchParams.set("format", "json");
  url.searchParams.set("sort", "datedesc");
  url.searchParams.set("timespan", "7d");
  url.searchParams.set("maxrecords", String(MAX_RECORDS));

  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "TharrosCanada/1.0" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("GDELT returned HTTP " + response.status + ".");
  const payload = (await response.json()) as unknown;
  return { retrievedAt: new Date().toISOString(), articles: parseGdeltArticles(payload, topicId) };
}

const cachedTopic = unstable_cache(
  (topicId: MonitorTopicId) => fetchTopic(topicId),
  ["gdelt-live-monitor-v1"],
  { revalidate: 900, tags: ["gdelt-live-monitor"] },
);

export async function getLiveMonitor(): Promise<LiveMonitorSnapshot> {
  const settled = await Promise.allSettled(monitorTopics.map((topic) => cachedTopic(topic.id)));
  const failedTopics: MonitorTopicId[] = [];
  const merged = new Map<string, MonitorArticle>();
  const retrievals: string[] = [];

  settled.forEach((result, index) => {
    const topicId = monitorTopics[index].id;
    if (result.status === "rejected") {
      failedTopics.push(topicId);
      console.error("[gdelt] " + topicId + ": " + (result.reason instanceof Error ? result.reason.message : "request failed"));
      return;
    }
    retrievals.push(result.value.retrievedAt);
    for (const article of result.value.articles) {
      const existing = merged.get(article.url);
      if (existing) {
        if (!existing.topics.includes(topicId)) existing.topics.push(topicId);
      } else {
        merged.set(article.url, { ...article, topics: [...article.topics] });
      }
    }
  });

  const articles = [...merged.values()].sort((a, b) => b.seenAt.localeCompare(a.seenAt)).slice(0, 160);
  const retrievedAt = retrievals.sort().at(-1) ?? new Date().toISOString();

  return {
    kind: failedTopics.length === monitorTopics.length ? "error" : failedTopics.length ? "partial" : "ok",
    articles,
    retrievedAt,
    failedTopics,
    provider: "GDELT",
    coverageWindow: "7 days",
  };
}
