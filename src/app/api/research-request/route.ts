// Keep the former endpoint closed for clients that still know its URL.
export function POST() {
  return new Response("Research requests are no longer accepted.", {
    status: 410,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
