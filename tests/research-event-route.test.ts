import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../src/app/api/research-event/route";

const record = vi.hoisted(() => vi.fn());
vi.mock("../src/lib/metrics", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../src/lib/metrics")>()),
  isCountedSlug: (slug: unknown) => slug === "test-report",
  recordEvent: record,
}));

const post = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new Request("https://tharros.ca/api/research-event", {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

describe("POST /api/research-event", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    record.mockReset();
  });

  it("rejects non-JSON, cross-site and malformed requests", async () => {
    expect((await post({}, { "content-type": "text/plain" })).status).toBe(415);
    expect((await post({}, { "content-type": "application/json-invalid" })).status).toBe(415);
    expect(
      (await post({ slug: "x", kind: "read" }, { "sec-fetch-site": "cross-site" })).status,
    ).toBe(403);
    expect((await post("{")).status).toBe(400);
    expect((await post("null")).status).toBe(400);
    expect((await post({ slug: "example-report", kind: "read" })).status).toBe(400);
    expect((await post({ slug: "example-report", kind: "like" })).status).toBe(400);
  });

  it("honors GPC before reading or recording a request", async () => {
    vi.stubEnv("METRICS_SECRET", "test-secret");
    expect((await post({ slug: "test-report", kind: "read" }, { "sec-gpc": "1" })).status).toBe(
      204,
    );
    expect(record).not.toHaveBeenCalled();
  });

  it("rejects cross-origin requests even without Fetch Metadata", async () => {
    expect((await post({}, { origin: "https://other.example" })).status).toBe(403);
    expect(
      (await post({}, { origin: "https://sub.tharros.ca", "sec-fetch-site": "same-site" })).status,
    ).toBe(403);
  });

  it("records a valid same-origin browser event once and answers without cache", async () => {
    vi.stubEnv("METRICS_SECRET", "test-secret");
    const response = await post(
      { slug: "test-report", kind: "read" },
      { origin: "https://tharros.ca", "x-forwarded-for": "203.0.113.1, 203.0.113.2" },
    );
    expect(response.status).toBe(204);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(record).toHaveBeenCalledWith(
      "test-report",
      "read",
      expect.stringMatching(/^[0-9a-f]{32}$/),
    );
  });

  it("rejects oversized UTF-8 bodies measured in bytes, with no declared length", async () => {
    expect((await post(`"${"é".repeat(300)}"`)).status).toBe(413);
  });

  it("rejects an oversized declared content-length before reading the body", async () => {
    expect((await post({ slug: "x", kind: "read" }, { "content-length": "999999" })).status).toBe(
      413,
    );
  });
});
