import {
  monitorTopics,
  type MonitorArticle,
  type MonitorTopicId,
} from "@/lib/live-monitor";

export const GOOGLE_NEWS_RSS_BASE_URL = "https://news.google.com/rss/search";
const FETCH_TIMEOUT_MS = 8_000;

type GoogleNewsFetchOptions = {
  fetcher?: typeof fetch;
  baseUrl?: string;
  now?: () => Date;
  timeoutMs?: number;
};

function cleanXml(value: string) {
  return value
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, value: string) => String.fromCodePoint(Number.parseInt(value, 16)))
    .replace(/&#([0-9]+);/g, (_, value: string) => String.fromCodePoint(Number.parseInt(value, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(item: string, name: string) {
  const match = item.match(new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + name + ">", "i"));
  return match ? cleanXml(match[1]) : "";
}

function sourceUrl(item: string) {
  const match = item.match(/<source\s+[^>]*url=["']([^"']+)["'][^>]*>/i);
  return match?.[1] ? cleanXml(match[1]) : "";
}

function stableId(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0).toString(36);
}

function stripPublisherSuffix(title: string, publisher: string) {
  if (!publisher) return title;
  const suffix = " - " + publisher;
  return title.endsWith(suffix) ? title.slice(0, -suffix.length).trim() : title;
}

export function parseGoogleNewsRss(xml: string, topicId: MonitorTopicId): MonitorArticle[] {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  const seen = new Set<string>();
  const articles: MonitorArticle[] = [];

  for (const item of items) {
    const link = tag(item, "link");
    const publisher = tag(item, "source");
    const rawTitle = tag(item, "title");
    const published = tag(item, "pubDate");
    const parsedDate = Date.parse(published);

    if (!link || !rawTitle || Number.isNaN(parsedDate) || seen.has(link)) continue;
    try {
      const url = new URL(link);
      if (url.protocol !== "https:" && url.protocol !== "http:") continue;
    } catch {
      continue;
    }

    seen.add(link);
    const publisherUrl = sourceUrl(item);
    let domain = publisher;
    try {
      domain = publisherUrl ? new URL(publisherUrl).hostname.replace(/^www\./, "") : publisher;
    } catch {
      domain = publisher;
    }

    articles.push({
      id: stableId(link),
      title: stripPublisherSuffix(rawTitle, publisher),
      url: link,
      domain: domain || publisher || "Google News",
      sourceCountry: "Not supplied",
      language: "English",
      seenAt: new Date(parsedDate).toISOString(),
      timestampKind: "published",
      urlKind: "aggregator",
      topics: [topicId],
    });
  }

  return articles;
}

export function buildGoogleNewsUrl(topicId: MonitorTopicId, baseUrl = GOOGLE_NEWS_RSS_BASE_URL) {
  const topic = monitorTopics.find((item) => item.id === topicId);
  if (!topic) throw new Error("Unknown Live Monitor topic.");

  const url = new URL(baseUrl);
  url.searchParams.set("q", topic.fallbackQuery + " when:7d");
  url.searchParams.set("hl", "en-CA");
  url.searchParams.set("gl", "CA");
  url.searchParams.set("ceid", "CA:en");
  return url;
}

export async function fetchGoogleNewsTopic(topicId: MonitorTopicId, options: GoogleNewsFetchOptions = {}) {
  const fetcher = options.fetcher ?? fetch;
  const baseUrl = options.baseUrl ?? process.env.NEWS_RSS_BASE_URL ?? GOOGLE_NEWS_RSS_BASE_URL;
  const now = options.now ?? (() => new Date());
  const timeoutMs = options.timeoutMs ?? FETCH_TIMEOUT_MS;
  const url = buildGoogleNewsUrl(topicId, baseUrl);

  const response = await fetcher(url, {
    headers: {
      Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8",
      "User-Agent": "TharrosCanada/1.0",
    },
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });

  if (!response.ok) throw new Error("News RSS returned HTTP " + response.status + ".");
  const xml = (await response.text()).trim();
  if (!xml || !/<rss\b|<feed\b/i.test(xml)) throw new Error("News RSS returned an invalid feed.");

  return {
    retrievedAt: now().toISOString(),
    articles: parseGoogleNewsRss(xml, topicId),
  };
}
