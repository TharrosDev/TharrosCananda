import {
  monitorTopics,
  type MonitorArticle,
  type MonitorTopicId,
} from "@/lib/live-monitor";

export const GDELT_DOC_BASE_URL = "https://api.gdeltproject.org/api/v2/doc/doc";
const TOPIC_MAX_RECORDS = 50;
const FALLBACK_MAX_RECORDS = 75;
const FETCH_TIMEOUT_MS = 10_000;
const RETRIES = 1;

type GdeltArticle = {
  url?: unknown;
  title?: unknown;
  seendate?: unknown;
  domain?: unknown;
  language?: unknown;
  sourcecountry?: unknown;
};

type GdeltPayload = { articles?: unknown; error?: unknown };

type GdeltFetchOptions = {
  fetcher?: typeof fetch;
  baseUrl?: string;
  now?: () => Date;
  timeoutMs?: number;
  retries?: number;
  sleep?: (ms: number) => Promise<void>;
};

class GdeltRequestError extends Error {
  constructor(message: string, readonly retryable = false) {
    super(message);
    this.name = "GdeltRequestError";
  }
}

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
    for (const key of [...url.searchParams.keys()]) {
      if (/^utm_/i.test(key) || ["fbclid", "gclid", "mc_cid", "mc_eid"].includes(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    }
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

export function buildGdeltQuery(topicId: MonitorTopicId) {
  const topic = monitorTopics.find((item) => item.id === topicId);
  if (!topic) throw new Error("Unknown Live Monitor topic.");
  // Keep one Boolean OR block per request. Canada + Europe are ANDed with the topic block.
  return "Canada Europe " + topic.query;
}

export function buildGdeltFallbackQuery() {
  return 'Canada Europe (trade OR CETA OR defence OR defense OR NATO OR energy OR industry OR technology OR cyber OR "critical minerals" OR manufacturing)';
}

export function inferMonitorTopics(title: string): MonitorTopicId[] {
  const value = title.toLowerCase();
  return monitorTopics
    .filter((topic) => topic.matchKeywords.some((keyword) => value.includes(keyword)))
    .map((topic) => topic.id);
}

export function parseGdeltArticles(payload: unknown, topicId: MonitorTopicId | null): MonitorArticle[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new GdeltRequestError("GDELT returned an unexpected response.", true);
  }

  const object = payload as GdeltPayload;
  if (object.error) throw new GdeltRequestError("GDELT returned an error payload.", true);
  if (object.articles == null) return [];
  if (!Array.isArray(object.articles)) throw new GdeltRequestError("GDELT article data was not an array.", true);

  const seen = new Set<string>();
  const articles: MonitorArticle[] = [];
  for (const raw of object.articles as GdeltArticle[]) {
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
      topics: topicId ? [topicId] : inferMonitorTopics(title),
    });
  }
  return articles;
}

async function requestGdelt(
  query: string,
  topicId: MonitorTopicId | null,
  maxRecords: number,
  options: GdeltFetchOptions = {},
) {
  const fetcher = options.fetcher ?? fetch;
  const baseUrl = options.baseUrl ?? process.env.GDELT_DOC_BASE_URL ?? GDELT_DOC_BASE_URL;
  const now = options.now ?? (() => new Date());
  const timeoutMs = options.timeoutMs ?? FETCH_TIMEOUT_MS;
  const retries = options.retries ?? RETRIES;
  const sleep = options.sleep ?? ((ms: number) => new Promise((resolve) => setTimeout(resolve, ms)));

  const url = new URL(baseUrl);
  url.searchParams.set("query", query);
  url.searchParams.set("mode", "artlist");
  url.searchParams.set("format", "json");
  url.searchParams.set("sort", "datedesc");
  url.searchParams.set("timespan", "7d");
  url.searchParams.set("maxrecords", String(maxRecords));

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetcher(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(timeoutMs),
        cache: "no-store",
      });
      if (!response.ok) {
        const retryable = response.status === 429 || response.status >= 500;
        throw new GdeltRequestError("GDELT returned HTTP " + response.status + ".", retryable);
      }

      const text = (await response.text()).replace(/^\uFEFF/, "").trim();
      if (!text) throw new GdeltRequestError("GDELT returned an empty response.", true);

      let payload: unknown;
      try {
        payload = JSON.parse(text);
      } catch {
        throw new GdeltRequestError("GDELT returned non-JSON content.", true);
      }

      return {
        retrievedAt: now().toISOString(),
        articles: parseGdeltArticles(payload, topicId),
      };
    } catch (error) {
      lastError = error;
      const retryable = error instanceof GdeltRequestError ? error.retryable : true;
      if (!retryable || attempt >= retries) throw error;
      await sleep(300);
    }
  }
  throw lastError instanceof Error ? lastError : new Error("GDELT request failed.");
}

export const fetchGdeltTopic = (topicId: MonitorTopicId, options?: GdeltFetchOptions) =>
  requestGdelt(buildGdeltQuery(topicId), topicId, TOPIC_MAX_RECORDS, options);

export const fetchGdeltFallback = (options?: GdeltFetchOptions) =>
  requestGdelt(buildGdeltFallbackQuery(), null, FALLBACK_MAX_RECORDS, options);
