import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../src/app/api/research-request/route";

const valid = {
  companyName: "Example GmbH",
  country: "Germany",
  email: "market@example.com",
  product: "Industrial LED lighting",
  objectives: ["Find a distributor or partner"],
  consent: true,
};

const post = (body: unknown) =>
  POST(new Request("http://localhost/api/research-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: typeof body === "string" ? body : JSON.stringify(body) }));

let fetchMock: ReturnType<typeof vi.fn>;
const sent = () => fetchMock.mock.calls[0][1] as RequestInit & { headers: Record<string, string>; body: string };

beforeEach(() => {
  vi.stubEnv("RESEARCH_INTAKE_WEBHOOK_URL", "https://intake.example.com/hook");
  vi.stubEnv("RESEARCH_INTAKE_WEBHOOK_SECRET", "s3cret");
  fetchMock = vi.fn(async () => new Response("ok", { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/research-request", () => {
  it("reports success only after the receiver accepts, with a reference", async () => {
    const response = await post(valid);
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toEqual({ ok: true, reference: expect.stringMatching(/^[0-9a-f-]{36}$/) });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0][0])).toBe("https://intake.example.com/hook");
    expect(sent().redirect).toBe("error");
    expect(JSON.parse(sent().body)).toMatchObject({ companyName: "Example GmbH", reference: data.reference, source: "tharros.ca" });
    expect(sent().headers["X-Tharros-Request-Id"]).toBe(data.reference);
  });

  it("signs timestamp and body with the shared secret", async () => {
    await post(valid);
    const { headers, body } = sent();
    const expected = createHmac("sha256", "s3cret").update(`${headers["X-Tharros-Timestamp"]}.${body}`).digest("hex");
    expect(headers["X-Tharros-Signature"]).toBe(`sha256=${expected}`);
  });

  it("returns 422 with field errors and forwards nothing", async () => {
    const response = await post({ ...valid, email: "not-an-email", consent: false });
    expect(response.status).toBe(422);
    expect((await response.json()).errors).toMatchObject({ email: expect.any(String), consent: expect.any(String) });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects unreadable and oversized bodies", async () => {
    expect((await post("{not json")).status).toBe(400);
    expect((await post({ ...valid, context: "x".repeat(20_000) })).status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("drops honeypot submissions silently", async () => {
    const response = await post({ ...valid, fax: "+1 555 0100" });
    expect(response.status).toBe(201);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 503, never success, when intake is not configured", async () => {
    for (const [url, secret] of [["", "s3cret"], ["http://intake.example.com/hook", "s3cret"], ["not a url", "s3cret"], ["https://intake.example.com/hook", ""]]) {
      vi.stubEnv("RESEARCH_INTAKE_WEBHOOK_URL", url);
      vi.stubEnv("RESEARCH_INTAKE_WEBHOOK_SECRET", secret);
      const response = await post(valid);
      expect(response.status).toBe(503);
      expect(await response.json()).not.toHaveProperty("ok");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 502 when the receiver fails or redirects", async () => {
    fetchMock.mockResolvedValueOnce(new Response("boom", { status: 500 }));
    expect((await post(valid)).status).toBe(502);
    fetchMock.mockResolvedValueOnce(new Response("nope", { status: 401 }));
    expect((await post(valid)).status).toBe(502);
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed: redirect mode is set to error"));
    expect((await post(valid)).status).toBe(502);
  });

  it("returns 504 when the receiver times out", async () => {
    fetchMock.mockRejectedValueOnce(Object.assign(new Error("The operation timed out."), { name: "TimeoutError" }));
    const response = await post(valid);
    expect(response.status).toBe(504);
    expect(await response.json()).toMatchObject({ code: "delivery_unavailable" });
  });

  it("never logs form content", async () => {
    fetchMock.mockResolvedValueOnce(new Response("boom", { status: 500 }));
    await post(valid);
    const logged = (console.error as unknown as ReturnType<typeof vi.fn>).mock.calls.flat().join(" ");
    expect(logged).not.toContain("market@example.com");
    expect(logged).not.toContain("Example GmbH");
  });

  it("marks every response uncacheable", async () => {
    expect((await post(valid)).headers.get("Cache-Control")).toBe("no-store");
  });
});
