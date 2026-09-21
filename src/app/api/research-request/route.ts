import { NextResponse } from "next/server";
import { type ResearchRequestPayload, validateResearchRequest } from "@/lib/research-request";

export async function POST(request: Request) {
  let payload: ResearchRequestPayload;
  try {
    payload = (await request.json()) as ResearchRequestPayload;
  } catch {
    return NextResponse.json({ message: "The request body was not valid JSON." }, { status: 400 });
  }

  const errors = validateResearchRequest(payload);
  if (Object.keys(errors).length) {
    return NextResponse.json({ message: "Review the required fields and try again.", errors }, { status: 422 });
  }

  const webhook = process.env.RESEARCH_INTAKE_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      { message: "Online intake is not configured yet. The form is complete, but a secure destination must be added before launch." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "TharrosCanada/1.0" },
      body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString(), source: "tharros.ca" }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "The request could not be delivered. Try again later." }, { status: 502 });
  }
}
