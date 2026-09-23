import { isBot, isCountedSlug, metricsSecret, readerKey, recordEvent } from "@/lib/metrics";

// Always 204: the answer never reveals whether an event counted. No firewall rate limit on the Hobby plan;
// the IP-keyed dedupe in readerKey is what stops inflation.
const done = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return new Response(null, { status: 415 });
  }
  if (request.headers.get("sec-fetch-site") === "cross-site")
    return new Response(null, { status: 403 });
  const text = await request.text();
  if (text.length > 512) return new Response(null, { status: 413 });
  let body: { slug?: unknown; kind?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  if ((body.kind !== "read" && body.kind !== "cite") || !isCountedSlug(body.slug))
    return new Response(null, { status: 400 });

  const userAgent = request.headers.get("user-agent") ?? "";
  const secret = metricsSecret();
  if (!secret || isBot(userAgent)) return done();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  await recordEvent(body.slug, body.kind, readerKey(secret, ip, body.slug));
  return done();
}
