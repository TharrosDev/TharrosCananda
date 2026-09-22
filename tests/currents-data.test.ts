import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

// Mirrors unstable_cache semantics that matter here: resolved values are stored, rejections are not.
vi.mock("next/cache", () => ({
  unstable_cache: <T>(fn: () => Promise<T>) => {
    let hit: { value: T } | null = null;
    return async () => {
      if (hit) return hit.value;
      const value = await fn();
      hit = { value };
      return value;
    };
  },
}));

const fetchCurrentsMonitor = vi.fn();
vi.mock("@/lib/currents", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/currents")>()),
  fetchCurrentsMonitor: () => fetchCurrentsMonitor(),
}));

describe("getLiveMonitor", () => {
  it("does not cache a failed request", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { getLiveMonitor } = await import("../src/lib/currents-data");

    fetchCurrentsMonitor.mockRejectedValueOnce(new Error("timeout"));
    expect((await getLiveMonitor()).kind).toBe("error");

    fetchCurrentsMonitor.mockResolvedValueOnce({ articles: [], retrievedAt: "2026-09-22T00:00:00.000Z" });
    const recovered = await getLiveMonitor();
    expect(recovered.kind).toBe("ok");
    expect(fetchCurrentsMonitor).toHaveBeenCalledTimes(2);
  });
});
