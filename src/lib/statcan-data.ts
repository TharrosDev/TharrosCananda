import "server-only";
import { unstable_cache } from "next/cache";
import { fetchCetaGroupSummary, fetchCetaTradeSeries } from "@/lib/statcan";

// Failures throw inside the cache so they are never stored. If a background refresh fails, Next keeps
// serving the last good entry, which the page labels stale from its own retrievedAt timestamp.
const cacheOptions = { revalidate: 21600, tags: ["statcan"] };
const cachedSeries = unstable_cache((flow: string, commodity: string | null) => fetchCetaTradeSeries({ flow, commodity }), ["statcan-12100174-series-v2"], cacheOptions);
const cachedGroups = unstable_cache((flow: string) => fetchCetaGroupSummary(flow), ["statcan-12100174-groups-v1"], cacheOptions);

type Outcome<T> = { kind: "ok"; data: T } | { kind: "error" };

async function outcome<T>(label: string, load: () => Promise<T>): Promise<Outcome<T>> {
  try {
    return { kind: "ok", data: await load() };
  } catch (error) {
    console.error(`[statcan] ${label}: ${error instanceof Error ? error.message : "unknown error"}`);
    return { kind: "error" };
  }
}

export const getCetaTrade = (flow: string, commodity: string | null) => outcome(`${flow}/${commodity ?? "total"}`, () => cachedSeries(flow, commodity));
export const getCetaGroups = (flow: string) => outcome(`${flow}/groups`, () => cachedGroups(flow));
