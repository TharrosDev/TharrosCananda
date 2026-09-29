import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let handler: (request: Request) => Promise<Response>;
const config: Record<string, string> = {
  SUPABASE_URL: "https://database.example",
  SUPABASE_SERVICE_ROLE_KEY: "key",
  RESEARCH_INTAKE_WEBHOOK_SECRET: "secret",
  RESEND_API_KEY: "email-key",
};

beforeEach(async () => {
  vi.resetModules();
  vi.stubGlobal("Deno", {
    env: { get: (name: string) => config[name] },
    serve: (receiver: typeof handler) => (handler = receiver),
  });
  // The Deno module is excluded from the Next TypeScript project; Vitest executes it with Web APIs.
  const receiverPath = "../supabase/functions/research-intake/index.ts";
  await import(receiverPath);
});
afterEach(() => vi.unstubAllGlobals());

const body = JSON.stringify({
  reference: "0b6f1c2e-3d4a-4b5c-8d9e-0f1a2b3c4d5e",
  submittedAt: "2026-09-23T12:00:00Z",
  companyName: "Example",
  country: "Canada",
  website: "",
  email: "reader@example.com",
  product: "Question",
  industry: "",
  description: "",
  hsCode: "",
  objectives: [],
  researchNeed: "",
  context: "",
});
function post(text = body) {
  const timestamp = String(Date.now());
  const signature = createHmac("sha256", "secret").update(`${timestamp}.${text}`).digest("hex");
  return new Request("https://database.example/functions/v1/research-intake", {
    method: "POST",
    body: text,
    headers: { "x-tharros-timestamp": timestamp, "x-tharros-signature": `sha256=${signature}` },
  });
}

describe("retained intake receiver", () => {
  it("returns a retryable response on storage failure without an unhandled rejection", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect((await handler(post())).status).toBe(503);
  });
  it("rejects chunked-size input before signature verification or database access", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect((await handler(post("é".repeat(20_000)))).status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("accepts an already-stored signed request and never sends another email", async () => {
    const fetchMock = vi.fn(async () => Response.json([]));
    vi.stubGlobal("fetch", fetchMock);
    expect((await handler(post())).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
  });
  it("rejects a malformed database representation as unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ error: "bad representation" })),
    );
    expect((await handler(post())).status).toBe(503);
  });
});
