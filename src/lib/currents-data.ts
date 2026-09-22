import "server-only";
import { unstable_cache } from "next/cache";
import { CurrentsError, fetchCurrentsMonitor } from "@/lib/currents";
import type { LiveMonitorSnapshot } from "@/lib/live-monitor";

const cachedCurrents = unstable_cache(
  () => fetchCurrentsMonitor(),
  ["currents-live-monitor-v1"],
  { revalidate: 900, tags: ["currents-live-monitor"] },
);

export async function getLiveMonitor(): Promise<LiveMonitorSnapshot> {
  try {
    const data = await cachedCurrents();
    return {
      kind: "ok",
      articles: data.articles.slice(0, 160),
      retrievedAt: data.retrievedAt,
      provider: "Currents",
      coverageWindow: "7 days",
      errorCode: null,
    };
  } catch (error) {
    const code = error instanceof CurrentsError ? error.code : "upstream";
    console.error("[currents] " + (error instanceof Error ? error.message : "request failed"));
    return {
      kind: "error",
      articles: [],
      retrievedAt: new Date().toISOString(),
      provider: "Currents",
      coverageWindow: "7 days",
      errorCode: code,
    };
  }
}
