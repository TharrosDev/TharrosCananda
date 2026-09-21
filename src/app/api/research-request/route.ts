import { NextResponse } from "next/server";
import { honeypotField, maxBodyBytes, parseResearchRequest } from "@/lib/research-request";

// ponytail: no in-process rate limiting; it gives false security on serverless.
// Rate limiting belongs at the platform (e.g. Vercel Firewall) or the webhook receiver. See docs/PRE_LAUNCH.md.

const deliveryFailure = {
  message: "We couldn’t send your request right now. Your answers are still in the form.",
  code: "delivery_unavailable",
} as const;

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

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maxBodyBytes) {
    return NextResponse.json({ message: "The request is too large." }, { status: 413 });
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBodyBytes) {
    return NextResponse.json({ message: "The request is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ message: "The request could not be read." }, { status: 400 });
  }

  // Bots that fill the hidden field get a normal-looking response; nothing is forwarded.
  const trap = (body as Record<string, unknown> | null)?.[honeypotField];
  if (typeof trap === "string" && trap.trim()) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const parsed = parseResearchRequest(body);
  if (!parsed.ok) {
    return NextResponse.json({ message: "Review the highlighted fields and try again.", errors: parsed.errors }, { status: 422 });
  }

  const webhook = intakeWebhook();
  if (!webhook) {
    console.error("[research-request] RESEARCH_INTAKE_WEBHOOK_URL is missing or not an https URL.");
    return NextResponse.json(deliveryFailure, { status: 503 });
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "TharrosCanada/1.0" },
      body: JSON.stringify({ ...parsed.value, submittedAt: new Date().toISOString(), source: "tharros.ca" }),
      signal: AbortSignal.timeout(8000),
      redirect: "error",
    });
    if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[research-request] Delivery failed:", error instanceof Error ? error.message : error);
    return NextResponse.json(deliveryFailure, { status: 502 });
  }
}
