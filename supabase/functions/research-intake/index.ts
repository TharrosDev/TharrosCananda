// Receives signed commission requests from tharros.ca, stores them, then emails a notification.
// Contract (src/app/api/research-request/route.ts): X-Tharros-Signature = sha256=<hex HMAC of "<timestamp>.<body>">.
// Returns 2xx only once the request is stored; the email is best effort and never fails a stored request.
import { type IntakeRequest, oneLine, parseIntake } from "./payload.ts";

declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void };

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
// Secrets: function env vars if set, otherwise the service-role-only `intake_config` table.
let secret = Deno.env.get("RESEARCH_INTAKE_WEBHOOK_SECRET") ?? "";
let resendKey = Deno.env.get("RESEND_API_KEY") ?? "";
const notifyTo = Deno.env.get("INTAKE_NOTIFY_TO") ?? "TharrosDev@gmail.com";
const notifyFrom = Deno.env.get("INTAKE_NOTIFY_FROM") ?? "Tharros requests <requests@tharros.ca>";
const maxSkewMs = 5 * 60 * 1000;
// The site caps its own body at 32000 bytes; the signed body adds reference, submittedAt and source.
const maxBodyBytes = 34_000;
const restTimeoutMs = 3000;

const encoder = new TextEncoder();
const hex = (bytes: ArrayBuffer) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function validSignature(timestamp: string, body: string, signature: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const expected = `sha256=${hex(await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${body}`)))}`;
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

function emailText(r: IntakeRequest) {
  return [
    `Reference: ${r.reference.slice(0, 8).toUpperCase()} (${r.reference})`,
    `Received: ${r.submittedAt}`,
    "",
    `Organization: ${r.companyName} (${r.country})`,
    r.website ? `Website: ${r.website}` : null,
    `Email: ${r.email}`,
    "",
    `Subject: ${r.product}`,
    r.industry ? `Industry: ${r.industry}` : null,
    r.hsCode ? `HS code: ${r.hsCode}` : null,
    r.description ? `Question: ${r.description}` : null,
    `Objectives: ${r.objectives.join(", ")}`,
    `Service: ${r.researchNeed || "Not specified"}`,
    r.context ? `Context: ${r.context}` : null,
    "",
    "Reply to this email to answer the requester directly.",
  ].filter((line) => line !== null).join("\n");
}

async function notify(r: IntakeRequest) {
  if (!resendKey) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: notifyFrom,
      to: [notifyTo],
      reply_to: r.email,
      subject: `Research request: ${oneLine(r.companyName)} (${r.reference.slice(0, 8).toUpperCase()})`,
      text: emailText(r),
    }),
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) console.error(`[research-intake] ${r.reference}: email failed ${response.status}`);
  return response.ok;
}

const rest = (path: string, method: string, body: unknown, extra: Record<string, string> = {}) =>
  fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json", ...extra },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(restTimeoutMs),
  });

async function loadConfig() {
  if (secret && resendKey) return;
  const response = await fetch(`${supabaseUrl}/rest/v1/intake_config?select=key,value`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    signal: AbortSignal.timeout(restTimeoutMs),
  });
  if (!response.ok) return;
  const rows = (await response.json()) as { key: string; value: string }[];
  const get = (key: string) => rows.find((row) => row.key === key)?.value ?? "";
  secret ||= get("webhook_secret");
  resendKey ||= get("resend_api_key");
}

async function markNotified(reference: string) {
  await rest(`research_requests?reference=eq.${reference}`, "PATCH", { notified_at: new Date().toISOString() });
}

// ponytail: failed emails are only retried when a new request arrives (up to 5 oldest per request);
// a scheduled job is the upgrade if requests are rare and an email must not wait for the next one.
async function retryUnnotified(current: string) {
  try {
    const response = await rest(
      `research_requests?notified_at=is.null&reference=neq.${current}&select=payload&order=received_at.asc&limit=5`,
      "GET",
      undefined,
    );
    if (!response.ok) return;
    for (const { payload } of (await response.json()) as { payload: IntakeRequest }[]) {
      if (await notify(payload)) await markNotified(payload.reference);
    }
  } catch {
    console.error("[research-intake] retry of unsent emails failed");
  }
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response(null, { status: 405 });
  if (serviceKey) await loadConfig();
  if (!secret || !serviceKey) return new Response("not configured", { status: 503 });

  const timestamp = request.headers.get("x-tharros-timestamp") ?? "";
  const signature = request.headers.get("x-tharros-signature") ?? "";
  if (Number(request.headers.get("content-length") ?? 0) > maxBodyBytes) return new Response("too large", { status: 413 });
  const body = await request.text();
  if (encoder.encode(body).length > maxBodyBytes) return new Response("too large", { status: 413 });
  if (!/^\d+$/.test(timestamp) || Math.abs(Date.now() - Number(timestamp)) > maxSkewMs) return new Response("stale", { status: 401 });
  if (!(await validSignature(timestamp, body, signature))) return new Response("bad signature", { status: 401 });

  const r = parseIntake(body);
  if (!r) return new Response("bad body", { status: 400 });

  // A retry of the same reference is accepted without a second row or a second email.
  const stored = await rest(
    "research_requests?on_conflict=reference",
    "POST",
    { reference: r.reference, submitted_at: r.submittedAt, company_name: r.companyName, email: r.email, payload: r },
    { Prefer: "resolution=ignore-duplicates,return=representation" },
  );
  if (!stored.ok) {
    console.error(`[research-intake] ${r.reference}: store failed ${stored.status}`);
    return new Response("store failed", { status: 500 });
  }
  const inserted = ((await stored.json()) as unknown[]).length > 0;

  if (inserted) {
    try {
      if (await notify(r)) {
        await markNotified(r.reference);
        // Runs after the response so older retries never delay the site's 8s delivery timeout.
        EdgeRuntime.waitUntil(retryUnnotified(r.reference));
      }
    } catch {
      console.error(`[research-intake] ${r.reference}: email unreachable`);
    }
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
});
