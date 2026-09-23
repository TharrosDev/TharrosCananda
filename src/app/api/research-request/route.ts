import { createHmac, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { honeypotField, maxBodyBytes, parseResearchRequest } from "@/lib/research-request";
import { intakeSecretFromDatabase } from "@/lib/supabase";

// ponytail: no in-process rate limiting; it gives false security on serverless.
// The limit is a Vercel Firewall rule on POST /api/research-request (docs/PRE_LAUNCH.md).

const deliveryFailure = {
  message: "We couldn’t send your request right now. Your answers are still in the form.",
  code: "delivery_unavailable",
} as const;
const deliveryTimeoutMs = 8000;
const noStore = { "Cache-Control": "no-store" };
const json = (body: unknown, status: number) =>
  NextResponse.json(body, { status, headers: noStore });

function intakeWebhook() {
  const value = process.env.RESEARCH_INTAKE_WEBHOOK_URL;
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}
/** The env var wins; otherwise the secret shared with the Edge Function through Supabase. */
async function intakeSecret() {
  return process.env.RESEARCH_INTAKE_WEBHOOK_SECRET?.trim() || (await intakeSecretFromDatabase());
}

export async function POST(request: Request) {
  // JSON-only blocks "simple" cross-site form/fetch posts that skip the CORS preflight.
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ message: "Send the request as JSON." }, 415);
  }
  if (request.headers.get("sec-fetch-site") === "cross-site")
    return json({ message: "Cross-site requests are not accepted." }, 403);
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maxBodyBytes) return json({ message: "The request is too large." }, 413);
  const text = await request.text();
  if (Buffer.byteLength(text) > maxBodyBytes)
    return json({ message: "The request is too large." }, 413);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ message: "The request could not be read." }, 400);
  }

  // Bots that fill the hidden field get a normal-looking response; nothing is forwarded.
  const trap = (body as Record<string, unknown> | null)?.[honeypotField];
  if (typeof trap === "string" && trap.trim())
    return json({ ok: true, reference: randomUUID() }, 201);

  const parsed = parseResearchRequest(body);
  if (!parsed.ok)
    return json(
      { message: "Review the highlighted fields and try again.", errors: parsed.errors },
      422,
    );

  const webhook = intakeWebhook();
  const secret = await intakeSecret();
  if (!webhook || !secret) {
    console.error(
      "[research-request] Live intake requires a valid https RESEARCH_INTAKE_WEBHOOK_URL and RESEARCH_INTAKE_WEBHOOK_SECRET.",
    );
    return json(deliveryFailure, 503);
  }

  // The site stores nothing: the request is forwarded once. Logs carry the reference and outcome, never content.
  const reference = randomUUID();
  const timestamp = String(Date.now());
  const payload = JSON.stringify({
    ...parsed.value,
    reference,
    submittedAt: new Date().toISOString(),
    source: "tharros.ca",
  });
  const signature = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "TharrosCanada/1.0",
        "X-Tharros-Request-Id": reference,
        "X-Tharros-Timestamp": timestamp,
        "X-Tharros-Signature": `sha256=${signature}`,
      },
      body: payload,
      signal: AbortSignal.timeout(deliveryTimeoutMs),
      redirect: "error",
      cache: "no-store",
    });
    // Only a 2xx from the receiver counts as accepted; anything else is reported to the visitor as not sent.
    if (!response.ok) {
      console.error(`[research-request] ${reference}: receiver returned ${response.status}`);
      return json(deliveryFailure, 502);
    }
    return json({ ok: true, reference }, 201);
  } catch (error) {
    const timedOut =
      error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    console.error(
      `[research-request] ${reference}: ${timedOut ? `no response within ${deliveryTimeoutMs}ms` : "delivery failed"}`,
    );
    return json(deliveryFailure, timedOut ? 504 : 502);
  }
}
