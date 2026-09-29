import { isBot, isCountedSlug, metricsSecret, readerKey, recordEvent } from "@/lib/metrics";
import { readRequestBody, RequestBodyError } from "@/lib/request-body";

// Valid events always get 204: the answer never reveals whether an event counted. No firewall rate limit on the Hobby plan;
// the IP-keyed dedupe in readerKey is what stops inflation.
const done = () => new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
const reject = (status: number) =>
  new Response(null, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  if (request.headers.get("sec-gpc") === "1") return done();
  if (
    request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return reject(415);
  }
  if (request.headers.get("sec-fetch-site") === "cross-site") return reject(403);
  // Sec-Fetch-Site is not sent by every client; Origin also blocks sibling-domain requests.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return reject(403);
  let body: { slug?: unknown; kind?: unknown };
  try {
    body = JSON.parse(await readRequestBody(request, 512));
  } catch (error) {
    return reject(error instanceof RequestBodyError ? error.status : 400);
  }
  if ((body?.kind !== "read" && body?.kind !== "cite") || !isCountedSlug(body.slug))
    return reject(400);

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
