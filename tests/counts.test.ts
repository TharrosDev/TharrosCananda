import { afterEach, describe, expect, it, vi } from "vitest";
import { publicationCounts } from "../src/lib/metrics";

const records = vi.hoisted(() => [{ slug: "counted-report", indexable: true }]);
vi.mock("../src/data/publications", () => ({ publications: records }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  records[0].indexable = true;
});

function database(rows: unknown) {
  vi.stubEnv("SUPABASE_URL", " https://database.example/ ");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "key");
  vi.stubEnv("METRICS_SECRET", "secret");
  const fetchMock = vi.fn(async () => Response.json(rows));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("readership availability", () => {
  it("does not query the database without counting enabled or approved reports", async () => {
    const fetchMock = database([]);
    vi.stubEnv("METRICS_SECRET", "");
    expect(await publicationCounts()).toBeNull();
    vi.stubEnv("METRICS_SECRET", "secret");
    records[0].indexable = false;
    expect(await publicationCounts()).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns valid approved counts, excluding unknown reports", async () => {
    const fetchMock = database([
      { slug: "counted-report", reads: 12, citations: 3 },
      { slug: "unknown-report", reads: 40, citations: 9 },
    ]);
    expect(await publicationCounts()).toEqual({ "counted-report": { reads: 12, citations: 3 } });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://database.example/rest/v1/publication_counts?select=slug,reads,citations",
      expect.any(Object),
    );
  });

  it("hides malformed data instead of displaying fabricated counts", async () => {
    for (const rows of [
      null,
      {},
      [null],
      [{ slug: "counted-report", reads: "12", citations: 3 }],
      [{ slug: "counted-report", reads: -1, citations: 3 }],
    ]) {
      database(rows);
      expect(await publicationCounts()).toBeNull();
    }
  });
});
