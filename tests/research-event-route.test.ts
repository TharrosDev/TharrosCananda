import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../src/app/api/research-event/route";

const post = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new Request("https://tharros.ca/api/research-event", {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": "Mozilla/5.0", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

describe("POST /api/research-event", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("rejects non-JSON, cross-site and malformed requests", async () => {
    expect((await post({}, { "content-type": "text/plain" })).status).toBe(415);
    expect(
      (await post({ slug: "x", kind: "read" }, { "sec-fetch-site": "cross-site" })).status,
    ).toBe(403);
    expect((await post("{")).status).toBe(400);
    expect((await post("null")).status).toBe(400);
    expect((await post({ slug: "example-report", kind: "read" })).status).toBe(400);
    expect((await post({ slug: "example-report", kind: "like" })).status).toBe(400);
  });

  it("rejects an oversized declared content-length before reading the body", async () => {
    expect((await post({ slug: "x", kind: "read" }, { "content-length": "999999" })).status).toBe(
      413,
    );
  });
});
