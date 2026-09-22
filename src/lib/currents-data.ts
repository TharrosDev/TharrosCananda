import "server-only";
import { unstable_cache } from "next/cache";
import { CurrentsError, fetchCurrentsMonitor } from "@/lib/currents";
import type { LiveMonitorSnapshot } from "@/lib/live-monitor";

async function loadLiveMonitor(): Promise<LiveMonitorSnapshot> {
  try {
    const data = await fetchCurrentsMonitor();
    return {
      kind: "ok",
      articles: data.articles,
      retrievedAt: data.retrievedAt,
      provider: "Currents",
      coverageWindow: "7 days",
      errorCode: null,
    };
  } catch (error) {
    const code = error instanceof CurrentsError ? error.code : "upstream";
    const status = error instanceof CurrentsError ? error.status : undefined;
    console.error("[currents] Live Monitor request failed", {
      code,
      status,
      errorType: error instanceof Error ? error.name : typeof error,
    });
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

const cachedLiveMonitor = unstable_cache(loadLiveMonitor, ["currents-live-monitor-v3"], {
  revalidate: 900,
  tags: ["currents-live-monitor"],
});

export async function getLiveMonitor(): Promise<LiveMonitorSnapshot> {
  return cachedLiveMonitor();
}
