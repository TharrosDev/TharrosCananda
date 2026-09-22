import "server-only";
import { unstable_cache } from "next/cache";
import { fetchGdeltFallback, fetchGdeltTopic } from "@/lib/gdelt";
import {
  monitorTopics,
  type LiveMonitorSnapshot,
  type MonitorArticle,
  type MonitorTopicId,
} from "@/lib/live-monitor";

const cacheOptions = { revalidate: 900, tags: ["gdelt-live-monitor"] };
const cachedTopic = unstable_cache(
  (topicId: MonitorTopicId) => fetchGdeltTopic(topicId),
  ["gdelt-live-monitor-topic-v2"],
  cacheOptions,
);
const cachedFallback = unstable_cache(
  () => fetchGdeltFallback(),
  ["gdelt-live-monitor-fallback-v1"],
  cacheOptions,
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
    for (const article of result.value.articles) mergeArticle(merged, article);
  });

  let broadFallback = false;
  if (failedTopics.length === monitorTopics.length) {
    try {
      const fallback = await cachedFallback();
      broadFallback = true;
      retrievals.push(fallback.retrievedAt);
      for (const article of fallback.articles) mergeArticle(merged, article);
    } catch (error) {
      console.error("[gdelt] fallback: " + (error instanceof Error ? error.message : "request failed"));
    }
  }

  const articles = [...merged.values()].sort((a, b) => b.seenAt.localeCompare(a.seenAt)).slice(0, 160);
  const retrievedAt = retrievals.sort().at(-1) ?? new Date().toISOString();
  const allTopicFeedsFailed = failedTopics.length === monitorTopics.length;

  return {
    kind: broadFallback ? "partial" : allTopicFeedsFailed ? "error" : failedTopics.length ? "partial" : "ok",
    articles,
    retrievedAt,
    failedTopics,
    broadFallback,
    provider: "GDELT",
    coverageWindow: "7 days",
  };
}
