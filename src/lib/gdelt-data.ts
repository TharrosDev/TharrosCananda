import "server-only";
import { unstable_cache } from "next/cache";
import { fetchGdeltMonitor } from "@/lib/gdelt";
import { fetchGoogleNewsTopic } from "@/lib/google-news";
import {
  monitorTopics,
  type LiveMonitorSnapshot,
  type MonitorArticle,
  type MonitorTopicId,
} from "@/lib/live-monitor";

const gdeltCacheOptions = { revalidate: 900, tags: ["live-monitor-gdelt"] };
const rssCacheOptions = { revalidate: 600, tags: ["live-monitor-rss"] };

const cachedGdelt = unstable_cache(
  () => fetchGdeltMonitor(),
  ["gdelt-live-monitor-v3"],
  gdeltCacheOptions,
);

const cachedRssTopic = unstable_cache(
  (topicId: MonitorTopicId) => fetchGoogleNewsTopic(topicId),
  ["news-rss-live-monitor-v1"],
  rssCacheOptions,
);

function mergeArticle(target: Map<string, MonitorArticle>, article: MonitorArticle) {
  const existing = target.get(article.url);
  if (!existing) {
    target.set(article.url, { ...article, topics: [...article.topics] });
    return;
  }
  for (const topic of article.topics) {
    if (!existing.topics.includes(topic)) existing.topics.push(topic);
  }
}

async function getRssFallback(): Promise<LiveMonitorSnapshot> {
  const settled = await Promise.allSettled(monitorTopics.map((topic) => cachedRssTopic(topic.id)));
  const merged = new Map<string, MonitorArticle>();
  const retrievals: string[] = [];

  settled.forEach((result) => {
    if (result.status === "rejected") {
      console.error("[live-monitor] RSS fallback: " + (result.reason instanceof Error ? result.reason.message : "request failed"));
      return;
    }
    retrievals.push(result.value.retrievedAt);
    for (const article of result.value.articles) mergeArticle(merged, article);
  });

  const articles = [...merged.values()].sort((a, b) => b.seenAt.localeCompare(a.seenAt)).slice(0, 160);
  if (!articles.length) {
    return {
      kind: "error",
      articles: [],
      retrievedAt: retrievals.sort().at(-1) ?? new Date().toISOString(),
      provider: "Google News RSS",
      fallbackProvider: true,
      coverageWindow: "7 days",
    };
  }

  return {
    kind: "partial",
    articles,
    retrievedAt: retrievals.sort().at(-1) ?? new Date().toISOString(),
    provider: "Google News RSS",
    fallbackProvider: true,
    coverageWindow: "7 days",
  };
}

export async function getLiveMonitor(): Promise<LiveMonitorSnapshot> {
  try {
    const gdelt = await cachedGdelt();
    if (gdelt.articles.length) {
      return {
        kind: "ok",
        articles: gdelt.articles.sort((a, b) => b.seenAt.localeCompare(a.seenAt)).slice(0, 160),
        retrievedAt: gdelt.retrievedAt,
        provider: "GDELT",
        fallbackProvider: false,
        coverageWindow: "7 days",
      };
    }
    console.warn("[live-monitor] GDELT returned no usable coverage; using RSS fallback.");
  } catch (error) {
    console.error("[live-monitor] GDELT: " + (error instanceof Error ? error.message : "request failed"));
  }

  return getRssFallback();
}
